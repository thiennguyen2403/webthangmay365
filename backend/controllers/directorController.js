import bcrypt from "bcryptjs";
import db from "../config/db.js";
import { addProjectLabels, roleLabels, recalcProjectProgress, notifyUsers, getProjectNotifyUsers } from "./helpers.js";

const activeStatuses = ['new','survey','design','manufacturing','installing','repairing','maintenance','inspection','handover','paused','late'];

export const getDashboard = async (req, res) => {
  try {
    const [[projectStats]] = await db.query(`
      SELECT COUNT(*) total_projects,
        SUM(status NOT IN ('completed')) active_projects,
        SUM(status='completed') completed_projects,
        SUM(project_type='installation') installation_projects,
        SUM(project_type='maintenance') maintenance_projects,
        SUM(project_type='repair') repair_projects
      FROM projects
    `);
    const [[userStats]] = await db.query(`SELECT COUNT(*) total_users, SUM(role LIKE 'employee_%') employees, SUM(role LIKE 'customer_%') customers, SUM(role='manager') managers FROM users`);
    const [[approvalStats]] = await db.query(`SELECT (SELECT COUNT(*) FROM reports WHERE status='pending') pending_reports, (SELECT COUNT(*) FROM issues WHERE status='pending') pending_issues`);
    const [[finance]] = await db.query(`SELECT COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END),0) income, COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END),0) expense, COALESCE(SUM(CASE WHEN type='extra_expense' THEN amount ELSE 0 END),0) extra_expense FROM finance_transactions`);
    const [activeProjects] = await db.query(`
      SELECT p.*, c.full_name customer_name, m.full_name manager_name
      FROM projects p JOIN users c ON c.id=p.customer_id LEFT JOIN users m ON m.id=p.manager_id
      WHERE p.status!='completed'
      ORDER BY p.created_at DESC LIMIT 5
    `);
    const [completedProjects] = await db.query(`
      SELECT p.*, c.full_name customer_name, m.full_name manager_name
      FROM projects p JOIN users c ON c.id=p.customer_id LEFT JOIN users m ON m.id=p.manager_id
      WHERE p.status='completed'
      ORDER BY p.created_at DESC LIMIT 5
    `);
    const [upcomingMaintenance] = await db.query(`
      SELECT ms.*, p.name project_name, c.full_name customer_name, m.full_name manager_name
      FROM maintenance_schedules ms
      JOIN projects p ON p.id=ms.project_id
      JOIN users c ON c.id=p.customer_id
      LEFT JOIN users m ON m.id=p.manager_id
      WHERE ms.status='pending'
      ORDER BY ms.scheduled_date ASC LIMIT 6
    `);
    res.json({
      stats: { ...projectStats, ...userStats, ...approvalStats },
      finance: { ...finance, balance: Number(finance.income)-Number(finance.expense)-Number(finance.extra_expense) },
      activeProjects: addProjectLabels(activeProjects),
      completedProjects: addProjectLabels(completedProjects),
      upcomingMaintenance,
    });
  } catch (error) {
    console.log(error); res.status(500).json({ message: "Lỗi tải dashboard" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT id,full_name,email,phone,address,experience_years,role,status,created_at FROM users ORDER BY id DESC`);
    res.json(rows.map(u=>({ ...u, role_label: roleLabels[u.role] || u.role })));
  } catch { res.status(500).json({ message: "Lỗi lấy tài khoản" }); }
};

export const createUser = async (req, res) => {
  try {
    const { full_name, email, password, phone, address, experience_years=0, role } = req.body;
    if (!full_name || !email || !password || !role) return res.status(400).json({ message: "Nhập đủ tên, email, mật khẩu, chức vụ" });
    const valid = ['manager','employee_technical','employee_installation','employee_maintenance','customer_installation','customer_maintenance'];
    if (!valid.includes(role)) return res.status(400).json({ message: "Chức vụ không hợp lệ" });
    const [exists] = await db.query(`SELECT id FROM users WHERE email=?`, [email]);
    if (exists.length) return res.status(400).json({ message: "Email đã tồn tại" });
    const hash = await bcrypt.hash(password, 10);
    await db.query(`INSERT INTO users (full_name,email,password,phone,address,experience_years,role,status) VALUES (?,?,?,?,?,?,?,'active')`, [full_name,email,hash,phone||null,address||null,experience_years||0,role]);
    res.json({ message: "Tạo tài khoản thành công" });
  } catch (error) { console.log(error); res.status(500).json({ message: "Lỗi tạo tài khoản" }); }
};

export const updateUserStatus = async (req, res) => {
  try { const { status } = req.body; if (!['active','blocked'].includes(status)) return res.status(400).json({ message: "Trạng thái không hợp lệ" }); await db.query(`UPDATE users SET status=? WHERE id=? AND role!='director'`, [status, req.params.id]); res.json({ message: "Đã cập nhật tài khoản" }); }
  catch { res.status(500).json({ message: "Lỗi cập nhật tài khoản" }); }
};
export const deleteUser = async (req,res)=>{ try{ await db.query(`DELETE FROM users WHERE id=? AND role!='director'`,[req.params.id]); res.json({message:'Đã xóa tài khoản'});}catch{res.status(500).json({message:'Không thể xóa tài khoản đang có liên kết'});} };

export const getSelectableUsers = async (req,res)=>{ try{ const [rows]=await db.query(`SELECT id,full_name,email,phone,role,experience_years FROM users WHERE status='active' ORDER BY role,full_name`); res.json(rows.map(u=>({...u,role_label:roleLabels[u.role]||u.role}))); }catch{res.status(500).json({message:'Lỗi lấy danh sách chọn'});} };

export const getProjects = async (req,res)=>{
  try{
    const { type, statusGroup='all', page='1', limit='10', keyword='' } = req.query;
    const p = Math.max(1, Number(page)); const l = Math.max(1, Number(limit)); const offset=(p-1)*l;
    const where=[]; const params=[];
    if(type){ where.push('p.project_type=?'); params.push(type); }
    if(statusGroup==='active') where.push("p.status!='completed'");
    if(statusGroup==='completed') where.push("p.status='completed'");
    if(keyword){ where.push('(p.name LIKE ? OR c.full_name LIKE ? OR p.address LIKE ?)'); params.push(`%${keyword}%`,`%${keyword}%`,`%${keyword}%`); }
    const sqlWhere=where.length?`WHERE ${where.join(' AND ')}`:'';
    const [[count]] = await db.query(`SELECT COUNT(*) total FROM projects p JOIN users c ON c.id=p.customer_id ${sqlWhere}`, params);
    const [rows]=await db.query(`SELECT p.*, c.full_name customer_name, c.phone customer_phone, m.full_name manager_name, m.phone manager_phone FROM projects p JOIN users c ON c.id=p.customer_id LEFT JOIN users m ON m.id=p.manager_id ${sqlWhere} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`, [...params,l,offset]);
    res.json({ data:addProjectLabels(rows), total:count.total, page:p, limit:l, totalPages:Math.ceil(count.total/l) });
  }catch(e){ console.log(e); res.status(500).json({message:'Lỗi lấy dự án'}); }
};

export const getProjectDetail = async (req,res)=>{
  try{
    const [rows]=await db.query(`SELECT p.*, c.full_name customer_name,c.email customer_email,c.phone customer_phone,c.address customer_address,m.full_name manager_name,m.email manager_email,m.phone manager_phone FROM projects p JOIN users c ON c.id=p.customer_id LEFT JOIN users m ON m.id=p.manager_id WHERE p.id=?`,[req.params.id]);
    if(!rows.length) return res.status(404).json({message:'Không tìm thấy dự án'});
    const [members]=await db.query(`SELECT pm.*, u.full_name,u.email,u.phone,u.role,u.experience_years FROM project_members pm JOIN users u ON u.id=pm.user_id WHERE pm.project_id=?`,[req.params.id]);
    const [stages]=await db.query(`SELECT ps.*, u.full_name completed_by_name FROM project_stages ps LEFT JOIN users u ON u.id=ps.completed_by WHERE ps.project_id=? ORDER BY ps.stage_order`,[req.params.id]);
    const [tasks]=await db.query(`SELECT t.*, u.full_name assigned_to_name FROM tasks t JOIN users u ON u.id=t.assigned_to WHERE t.project_id=? ORDER BY t.id DESC`,[req.params.id]);
    const [reports]=await db.query(`SELECT r.*, u.full_name sender_name FROM reports r JOIN users u ON u.id=r.sender_id WHERE r.project_id=? ORDER BY r.id DESC`,[req.params.id]);
    const [issues]=await db.query(`SELECT i.*, u.full_name sender_name FROM issues i JOIN users u ON u.id=i.sender_id WHERE i.project_id=? ORDER BY i.id DESC`,[req.params.id]);
    const [finance]=await db.query(`SELECT f.*, u.full_name created_by_name FROM finance_transactions f JOIN users u ON u.id=f.created_by WHERE f.project_id=? ORDER BY payment_date DESC`,[req.params.id]);
    const [[financeSummary]]=await db.query(`SELECT COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END),0) income, COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END),0) expense, COALESCE(SUM(CASE WHEN type='extra_expense' THEN amount ELSE 0 END),0) extra_expense FROM finance_transactions WHERE project_id=?`,[req.params.id]);
    const [maintenance]=await db.query(`SELECT ms.*, u.full_name employee_name,u.phone employee_phone FROM maintenance_schedules ms LEFT JOIN users u ON u.id=ms.assigned_employee_id WHERE ms.project_id=? ORDER BY ms.maintenance_no`,[req.params.id]);
    const project={...rows[0], status_label:addProjectLabels([rows[0]])[0].status_label, project_type_label:addProjectLabels([rows[0]])[0].project_type_label};
    res.json({ project, members, stages, tasks, reports, issues, finance, financeSummary:{...financeSummary,balance:Number(project.contract_value)-Number(financeSummary.expense)-Number(financeSummary.extra_expense)}, maintenance });
  }catch(e){ console.log(e); res.status(500).json({message:'Lỗi lấy chi tiết dự án'}); }
};

async function createDefaultStages(conn, projectId, type){
  const lists={
    installation:[['survey','Khảo sát'],['design','Thiết kế'],['manufacturing','Sản xuất thiết bị'],['installing','Lắp đặt'],['inspection','Kiểm định'],['handover','Bàn giao']],
    repair:[['repairing','Sửa chữa'],['inspection','Kiểm tra sau sửa chữa'],['handover','Bàn giao']],
    maintenance:[['maintenance','Bảo trì định kỳ']]
  };
  const list=lists[type]||lists.installation;
  for(let i=0;i<list.length;i++) await conn.query(`INSERT INTO project_stages (project_id,stage_key,stage_name,stage_order,status) VALUES (?,?,?,?,?)`, [projectId,list[i][0],list[i][1],i+1,i===0?'doing':'pending']);
}

export const createProject = async (req,res)=>{
  const conn=await db.getConnection();
  try{
    const b=req.body;
    const employeeIds = Array.isArray(b.employee_ids) ? b.employee_ids : (b.employee_ids ? String(b.employee_ids).split(',').filter(Boolean) : []);
    if(!b.name||!b.project_type||!b.customer_id||!b.manager_id||!b.address||!b.contract_date||!b.start_date||!b.expected_end_date||!b.contract_value) return res.status(400).json({message:'Vui lòng nhập đầy đủ thông tin dự án'});
    if(!['installation','maintenance','repair'].includes(b.project_type)) return res.status(400).json({message:'Loại dự án không hợp lệ'});
    const contractFile = req.file ? `/uploads/contracts/${req.file.filename}` : null;
    await conn.beginTransaction();
    const [result]=await conn.query(`INSERT INTO projects (name,project_type,customer_id,manager_id,address,elevator_type,contract_code,contract_date,start_date,expected_end_date,contract_file,maintenance_total_times,maintenance_cycle_months,status,progress,contract_value,note,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'new',0,?,?,?)`, [b.name,b.project_type,b.customer_id,b.manager_id,b.address,b.elevator_type||null,b.contract_code||null,b.contract_date,b.start_date,b.expected_end_date,contractFile,Number(b.maintenance_total_times)||0,Number(b.maintenance_cycle_months)||1,b.contract_value,b.note||null,req.user.id]);
    const projectId=result.insertId;
    await conn.query(`INSERT INTO project_members (project_id,user_id,role_in_project) VALUES (?,?,?)`,[projectId,b.customer_id,'customer']);
    await conn.query(`INSERT INTO project_members (project_id,user_id,role_in_project) VALUES (?,?,?)`,[projectId,b.manager_id,'manager']);
    for(const empId of employeeIds){ const [[emp]]=await conn.query(`SELECT role FROM users WHERE id=? AND role LIKE 'employee_%'`,[empId]); if(emp) await conn.query(`INSERT INTO project_members (project_id,user_id,role_in_project) VALUES (?,?,?)`,[projectId,empId,emp.role]); }
    await createDefaultStages(conn, projectId, b.project_type);
    if(b.project_type==='maintenance'){
      const total=Number(b.maintenance_total_times)||0; const cycle=Number(b.maintenance_cycle_months)||1; const maintEmp=employeeIds[0]||null;
      for(let i=1;i<=total;i++){
        await conn.query(`INSERT INTO maintenance_schedules (project_id,maintenance_no,scheduled_date,assigned_employee_id,status,note) VALUES (?,?,DATE_ADD(?, INTERVAL ? MONTH),?,'pending',?)`,[projectId,i,b.start_date,(i-1)*cycle,maintEmp,`Bảo trì lần ${i}`]);
      }
    }
    await notifyUsers([b.manager_id,b.customer_id,...employeeIds,req.user.id], 'Dự án mới', `Dự án ${b.name} đã được tạo.`, projectId, conn);
    await conn.commit(); res.json({message:'Tạo dự án thành công', project_id:projectId});
  }catch(e){ await conn.rollback(); console.log(e); res.status(500).json({message:'Lỗi tạo dự án'}); } finally{ conn.release(); }
};

export const updateProjectStage = async (req,res)=>{
  const conn=await db.getConnection();
  try{
    const { status } = req.body;
    if(!['pending','doing','done'].includes(status)) return res.status(400).json({message:'Trạng thái giai đoạn không hợp lệ'});
    await conn.beginTransaction();
    const [[stage]]=await conn.query(`SELECT * FROM project_stages WHERE id=?`,[req.params.stageId]);
    if(!stage){ await conn.rollback(); return res.status(404).json({message:'Không tìm thấy giai đoạn'}); }
    await conn.query(`UPDATE project_stages SET status=?, completed_by=?, completed_at=? WHERE id=?`,[status,status==='done'?req.user.id:null,status==='done'?new Date():null,req.params.stageId]);
    if(status==='done') await conn.query(`UPDATE project_stages SET status='doing' WHERE project_id=? AND status='pending' ORDER BY stage_order LIMIT 1`,[stage.project_id]);
    const progress=await recalcProjectProgress(stage.project_id, conn);
    const userIds=await getProjectNotifyUsers(stage.project_id, conn);
    await notifyUsers(userIds,'Cập nhật tiến độ',`Tiến độ dự án đã cập nhật: ${progress}%`,stage.project_id,conn);
    await conn.commit(); res.json({message:'Đã cập nhật giai đoạn', progress});
  }catch(e){ await conn.rollback(); console.log(e); res.status(500).json({message:'Lỗi cập nhật giai đoạn'}); } finally{ conn.release(); }
};

export const getFinanceSummary = async (req,res)=>{
  try{
    const [[summary]]=await db.query(`SELECT COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END),0) income, COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END),0) expense, COALESCE(SUM(CASE WHEN type='extra_expense' THEN amount ELSE 0 END),0) extra_expense FROM finance_transactions`);
    const [transactions]=await db.query(`SELECT f.*,p.name project_name,u.full_name created_by_name FROM finance_transactions f LEFT JOIN projects p ON p.id=f.project_id JOIN users u ON u.id=f.created_by ORDER BY f.payment_date DESC,f.id DESC`);
    const [byProject]=await db.query(`SELECT p.id,p.name,p.contract_value,COALESCE(SUM(CASE WHEN f.type='income' THEN f.amount ELSE 0 END),0) income,COALESCE(SUM(CASE WHEN f.type='expense' THEN f.amount ELSE 0 END),0) expense,COALESCE(SUM(CASE WHEN f.type='extra_expense' THEN f.amount ELSE 0 END),0) extra_expense FROM projects p LEFT JOIN finance_transactions f ON f.project_id=p.id GROUP BY p.id ORDER BY p.id DESC`);
    res.json({summary:{...summary,balance:Number(summary.income)-Number(summary.expense)-Number(summary.extra_expense)},transactions,byProject:byProject.map(p=>({...p,balance:Number(p.contract_value)-Number(p.expense)-Number(p.extra_expense)}))});
  }catch{res.status(500).json({message:'Lỗi tài chính'});}
};
export const createFinanceTransaction=async(req,res)=>{try{const {project_id,type,title,amount,payment_date,note}=req.body;if(!type||!title||!amount||!payment_date)return res.status(400).json({message:'Nhập đủ thông tin thu chi'});await db.query(`INSERT INTO finance_transactions (project_id,type,title,amount,payment_date,note,created_by) VALUES (?,?,?,?,?,?,?)`,[project_id||null,type,title,amount,payment_date,note||null,req.user.id]);res.json({message:'Đã ghi nhận thu chi'});}catch{res.status(500).json({message:'Lỗi tạo thu chi'});}};
export const createTask=async(req,res)=>{try{const {title,description,project_id,stage_id,assigned_to,task_scope='project',priority='medium',start_date,deadline}=req.body;if(!title||!assigned_to||!deadline)return res.status(400).json({message:'Nhập tiêu đề, người nhận, deadline'});await db.query(`INSERT INTO tasks (title,description,project_id,stage_id,assigned_by,assigned_to,task_scope,priority,start_date,deadline) VALUES (?,?,?,?,?,?,?,?,?,?)`,[title,description||null,project_id||null,stage_id||null,req.user.id,assigned_to,task_scope,priority,start_date||null,deadline]);res.json({message:'Giao việc thành công'});}catch(e){console.log(e);res.status(500).json({message:'Lỗi giao việc'});}};
export const getPendingApprovals=async(req,res)=>{try{const [reports]=await db.query(`SELECT r.*,p.name project_name,u.full_name sender_name,u.role sender_role FROM reports r LEFT JOIN projects p ON p.id=r.project_id JOIN users u ON u.id=r.sender_id WHERE r.status='pending' ORDER BY r.created_at DESC`);const [issues]=await db.query(`SELECT i.*,p.name project_name,u.full_name sender_name,u.role sender_role FROM issues i LEFT JOIN projects p ON p.id=i.project_id JOIN users u ON u.id=i.sender_id WHERE i.status='pending' ORDER BY i.created_at DESC`);res.json({reports,issues});}catch{res.status(500).json({message:'Lỗi lấy duyệt'});}};
export const reviewReport=async(req,res)=>{try{const {status,comment}=req.body;if(!['approved','rejected'].includes(status)||!comment)return res.status(400).json({message:'Phải chọn duyệt/từ chối và nhập nhận xét'});await db.query(`UPDATE reports SET status=?,director_comment=?,reviewed_by=?,reviewed_at=NOW() WHERE id=?`,[status,comment,req.user.id,req.params.id]);res.json({message:'Đã xử lý báo cáo'});}catch{res.status(500).json({message:'Lỗi duyệt báo cáo'});}};
export const reviewIssue=async(req,res)=>{try{const {status,comment}=req.body;if(!['approved','rejected'].includes(status)||!comment)return res.status(400).json({message:'Phải chọn duyệt/từ chối và nhập nhận xét'});await db.query(`UPDATE issues SET status=?,director_comment=?,reviewed_by=?,reviewed_at=NOW() WHERE id=?`,[status,comment,req.user.id,req.params.id]);res.json({message:'Đã xử lý phát sinh'});}catch{res.status(500).json({message:'Lỗi duyệt phát sinh'});}};

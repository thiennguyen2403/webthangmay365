import db from "../config/db.js";

export const roleLabels = {
  director: "Giám đốc",
  manager: "Quản lý",
  employee_technical: "Nhân viên kỹ thuật",
  employee_installation: "Nhân viên lắp đặt",
  employee_maintenance: "Nhân viên bảo trì",
  customer_installation: "Khách hàng lắp đặt",
  customer_maintenance: "Khách hàng bảo trì",
};

export const statusLabels = {
  new: "Mới tạo",
  survey: "Khảo sát",
  design: "Thiết kế",
  manufacturing: "Sản xuất",
  installing: "Lắp đặt",
  repairing: "Sửa chữa",
  maintenance: "Bảo trì",
  inspection: "Kiểm định",
  handover: "Bàn giao",
  completed: "Hoàn thành",
  paused: "Tạm dừng",
  late: "Chậm tiến độ",
};

export const projectTypeLabels = {
  installation: "Lắp đặt",
  maintenance: "Bảo trì",
  repair: "Sửa chữa",
};

export function addProjectLabels(rows) {
  return rows.map((p) => ({
    ...p,
    status_label: statusLabels[p.status] || p.status,
    project_type_label: projectTypeLabels[p.project_type] || p.project_type,
  }));
}

export async function recalcProjectProgress(projectId, conn = db) {
  const [[total]] = await conn.query(`SELECT COUNT(*) total, SUM(status='done') done FROM project_stages WHERE project_id=?`, [projectId]);
  const progress = total.total ? Math.round((Number(total.done || 0) / Number(total.total)) * 100) : 0;
  const [[nextStage]] = await conn.query(`SELECT stage_key FROM project_stages WHERE project_id=? AND status!='done' ORDER BY stage_order LIMIT 1`, [projectId]);
  let status = nextStage?.stage_key || 'completed';
  await conn.query(`UPDATE projects SET progress=?, status=? WHERE id=?`, [progress, status, projectId]);
  return progress;
}

export async function notifyUsers(userIds, title, content, projectId = null, conn = db) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  for (const id of uniqueIds) {
    await conn.query(`INSERT INTO notifications (user_id,title,content,related_project_id) VALUES (?,?,?,?)`, [id, title, content, projectId]);
  }
}

export async function getProjectNotifyUsers(projectId, conn = db) {
  const [members] = await conn.query(`SELECT user_id FROM project_members WHERE project_id=?`, [projectId]);
  const [directors] = await conn.query(`SELECT id user_id FROM users WHERE role='director' AND status='active'`);
  return [...members.map(m => m.user_id), ...directors.map(d => d.user_id)];
}

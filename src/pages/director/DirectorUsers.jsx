import { useEffect, useState } from "react";
import api from "../../services/api";
import { roleLabels } from "../../utils/roles";

const roles = [
  ["manager", "Quản lý"],
  ["employee_technical", "Nhân viên kỹ thuật"],
  ["employee_installation", "Nhân viên lắp đặt"],
  ["employee_maintenance", "Nhân viên bảo trì"],
  ["customer_installation", "Khách hàng lắp đặt"],
  ["customer_maintenance", "Khách hàng bảo trì"],
];

function DirectorUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ full_name:"", email:"", password:"123456", role:"manager", phone:"", address:"", experience_years:0 });
  const [loading, setLoading] = useState(false);
  const fetchUsers = async () => setUsers((await api.get("/director/users")).data);
  useEffect(()=>{ fetchUsers(); },[]);

  const create = async (e) => {
    e.preventDefault();
    try { setLoading(true); await api.post("/director/users", form); setForm({ full_name:"", email:"", password:"123456", role:"manager", phone:"", address:"", experience_years:0 }); await fetchUsers(); alert("Tạo tài khoản thành công"); }
    catch(err){ alert(err.response?.data?.message || "Lỗi tạo tài khoản"); }
    finally{ setLoading(false); }
  };
  const status = async (id, s) => { await api.patch(`/director/users/${id}/status`, { status:s }); fetchUsers(); };
  const remove = async (id) => { if(confirm("Xóa tài khoản này?")){ await api.delete(`/director/users/${id}`); fetchUsers(); } };

  return <div className="p-8 space-y-6">
    <div><h1 className="text-4xl font-black">Quản lý tài khoản</h1><p className="text-slate-500 mt-2">Tạo tài khoản, phân quyền chức vụ, chặn/mở và xóa tài khoản.</p></div>
    <form onSubmit={create} className="card p-6">
      <h2 className="text-2xl font-black mb-5">Tạo tài khoản mới</h2>
      <div className="grid grid-cols-3 gap-4">
        <input className="input" placeholder="Họ tên / tên công ty" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/>
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input className="input" placeholder="Mật khẩu" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        <select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>{roles.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
        <input className="input" placeholder="Số điện thoại" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
        <input className="input" type="number" placeholder="Số năm kinh nghiệm" value={form.experience_years} onChange={e=>setForm({...form,experience_years:e.target.value})}/>
        <input className="input col-span-3" placeholder="Địa chỉ" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
      </div>
      <button className="btn-primary mt-5" disabled={loading}>{loading?"Đang tạo...":"Tạo tài khoản"}</button>
    </form>
    <section className="card p-6 overflow-x-auto">
      <h2 className="text-2xl font-black mb-5">Danh sách tài khoản</h2>
      <table className="w-full min-w-[900px]"><thead><tr className="border-b"><Th>Họ tên</Th><Th>Email</Th><Th>Chức vụ</Th><Th>Kinh nghiệm</Th><Th>Trạng thái</Th><Th>Hành động</Th></tr></thead><tbody>{users.map(u=><tr key={u.id} className="border-b border-slate-100"><Td bold>{u.full_name}</Td><Td>{u.email}</Td><Td>{roleLabels[u.role]||u.role}</Td><Td>{u.experience_years || 0} năm</Td><Td><span className={`px-3 py-1 rounded-full text-xs font-bold ${u.status==='active'?'bg-green-50 text-green-600':'bg-red-50 text-red-600'}`}>{u.status==='active'?'Hoạt động':'Đã chặn'}</span></Td><Td><div className="flex gap-2">{u.role!=='director' && (u.status==='active'?<button className="btn-danger py-2 px-4" onClick={()=>status(u.id,'blocked')}>Chặn</button>:<button className="btn-primary py-2 px-4" onClick={()=>status(u.id,'active')}>Mở</button>)}{u.role!=='director' && <button className="btn-muted py-2 px-4" onClick={()=>remove(u.id)}>Xóa</button>}</div></Td></tr>)}</tbody></table>
    </section>
  </div>;
}
function Th({children}){return <th className="text-left py-3 font-black text-slate-500">{children}</th>}
function Td({children,bold}){return <td className={`py-4 pr-4 ${bold?'font-black':''}`}>{children}</td>}
export default DirectorUsers;

import { useEffect, useState } from "react";
import api from "../../services/api";
import { PageTitle, ProjectCard } from "../../components/ui/DashboardUi";
function ManagerProjects(){const [rows,setRows]=useState([]);const [type,setType]=useState('');const load=async()=>{const r=await api.get('/manager/projects',{params:{type}});setRows(r.data)};useEffect(()=>{load()},[type]);return <div className="p-8"><PageTitle eyebrow="Quản lý" title="Công trình được giao" desc="Danh sách lắp đặt, sửa chữa, bảo trì do bạn quản lý."/><div className="card p-5 mb-5 w-[260px]"><select className="input" value={type} onChange={e=>setType(e.target.value)}><option value="">Tất cả</option><option value="installation">Lắp đặt</option><option value="repair">Sửa chữa</option><option value="maintenance">Bảo trì</option></select></div><div className="space-y-4">{rows.map(p=><ProjectCard key={p.id} project={p} to={`/manager/projects/${p.id}`}/>)}</div></div>}
export default ManagerProjects;

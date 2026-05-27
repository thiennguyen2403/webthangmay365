import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { PageTitle, ProjectCard } from "../../components/ui/DashboardUi";
function DirectorProjects(){
 const [params,setParams]=useSearchParams();
 const [data,setData]=useState({data:[],page:1,totalPages:1,total:0});
 const [keyword,setKeyword]=useState(params.get('keyword')||'');
 const statusGroup=params.get('statusGroup')||'active'; const type=params.get('type')||''; const page=Number(params.get('page')||1);
 const load=async()=>{const r=await api.get('/director/projects',{params:{statusGroup,type,keyword,page,limit:10}});setData(r.data)};
 useEffect(()=>{load()},[statusGroup,type,page]);
 const apply=()=>setParams({statusGroup,type,keyword,page:1});
 return <div className="p-8"><PageTitle eyebrow="Giám đốc" title="Danh sách dự án" desc="Mặc định hiện dự án đang làm. Xem thêm dùng phân trang 10 dự án/trang." action={<a className="btn-primary" href="/director/projects/create">+ Tạo dự án</a>}/>
 <div className="card p-5 mb-5 grid grid-cols-[1fr_180px_180px_120px] gap-3"><input className="input" value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="Tìm tên dự án, khách hàng, địa chỉ"/><select className="input" value={statusGroup} onChange={e=>setParams({statusGroup:e.target.value,type,keyword,page:1})}><option value="active">Đang làm</option><option value="completed">Đã hoàn thành</option><option value="all">Tất cả</option></select><select className="input" value={type} onChange={e=>setParams({statusGroup,type:e.target.value,keyword,page:1})}><option value="">Mọi loại</option><option value="installation">Lắp đặt</option><option value="maintenance">Bảo trì</option><option value="repair">Sửa chữa</option></select><button className="btn-primary" onClick={apply}>Tìm</button></div>
 <div className="space-y-4">{data.data.map(p=><ProjectCard key={p.id} project={p} to={`/director/projects/${p.id}`}/>)}</div>
 <div className="flex items-center justify-between mt-6"><p className="font-bold text-slate-500">Tổng: {data.total} dự án</p><div className="flex gap-2"><button disabled={page<=1} className="btn-muted disabled:opacity-50" onClick={()=>setParams({statusGroup,type,keyword,page:page-1})}>Trước</button><span className="px-4 py-3 font-black">{page}/{data.totalPages||1}</span><button disabled={page>=data.totalPages} className="btn-muted disabled:opacity-50" onClick={()=>setParams({statusGroup,type,keyword,page:page+1})}>Sau</button></div></div>
 </div>
}
export default DirectorProjects;

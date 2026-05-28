import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { PageTitle, Mini, ListItem } from "../../components/ui/DashboardUi";
function CustomerProjectDetail(){
 const {id}=useParams(); const [data,setData]=useState(null);
 useEffect(()=>{api.get(`/customer/projects/${id}`).then(r=>setData(r.data));},[id]);
 if(!data) return <div className="p-8 font-bold">Đang tải...</div>;
 const p=data.project; const employees=data.members.filter(m=>m.role?.startsWith('employee_'));
 return <div className="p-8 space-y-5"><PageTitle eyebrow="Chi tiết công trình" title={p.name} desc={`${p.address} • Quản lý: ${p.manager_name || '-'} • SĐT: ${p.manager_phone || '-'}`} />
 <div className="card p-6 grid grid-cols-[1fr_300px] gap-6"><div className="grid grid-cols-3 gap-3"><Mini label="Loại dự án" value={p.project_type_label}/><Mini label="Trạng thái" value={p.status_label}/><Mini label="Ngày ký HĐ" value={p.contract_date}/><Mini label="Ngày bắt đầu" value={p.start_date}/><Mini label="Ngày kết thúc" value={p.expected_end_date}/><Mini label="SĐT quản lý" value={p.manager_phone||'-'}/><Mini label="Email quản lý" value={p.manager_email||'-'}/><Mini label="Địa chỉ" value={p.address}/></div><div className="bg-blue-50 rounded-3xl p-5"><p className="font-bold">Tiến độ</p><h2 className="text-4xl font-black text-blue-600 mt-2">{p.progress}%</h2><div className="h-3 bg-white rounded-full mt-4"><div className="h-3 bg-blue-600 rounded-full" style={{width:`${p.progress}%`}} /></div>{p.project_type==='maintenance'&&<p className="font-bold mt-4">Đã bảo trì: {p.maintenance_done_times}/{p.maintenance_total_times} lần</p>}</div></div>
 <div className="card p-5"><h2 className="text-xl font-black mb-4">Nhân sự phụ trách</h2><div className="grid grid-cols-3 gap-3">{employees.map(e=><Mini key={e.id} label={e.role} value={`${e.full_name} • ${e.phone || '-'}`}/>)}</div></div>
 <div className="card p-5"><h2 className="text-xl font-black mb-4">Giai đoạn thi công</h2><div className="grid grid-cols-3 gap-3">{data.stages.map(s=><div key={s.id} className={`rounded-2xl border p-4 ${s.status==='doing'?'bg-blue-50 border-blue-400':s.status==='done'?'opacity-50 bg-slate-50':'bg-white'}`}><p className="font-black">{s.stage_name}</p><p className="text-sm text-slate-500">{s.status==='done'?'Đã xong':s.status==='doing'?'Đang làm':'Chưa làm'}</p></div>)}</div></div>
 <div className="grid grid-cols-2 gap-5">
<div className="card p-5">
  <h2 className="text-xl font-black mb-4">
    Báo cáo công trình
  </h2>

  <div className="space-y-4">
    {data.reports.map((r) => (
      <div
        key={r.id}
        className="border border-slate-200 rounded-2xl p-4"
      >
        <ListItem
          title={r.title}
          sub={`${r.sender_name} • ${r.sender_role} • ${r.created_at}`}
        />

        {r.content && (
          <p className="mt-3 text-slate-600 leading-relaxed">
            {r.content}
          </p>
        )}

        {r.image_url && (
          <a
            href={`https://webthangmay365.onrender.com${r.image_url}`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={`https://webthangmay365.onrender.com${r.image_url}`}
              alt="Ảnh báo cáo"
              className="mt-3 w-full h-[240px] object-cover rounded-2xl border border-slate-200 hover:opacity-90 transition"
            />
          </a>
        )}
      </div>
    ))}

    {data.reports.length === 0 && (
      <p className="text-slate-500 font-bold">
        Chưa có báo cáo nào.
      </p>
    )}
  </div>
</div>    </div>
 </div>
}
export default CustomerProjectDetail;

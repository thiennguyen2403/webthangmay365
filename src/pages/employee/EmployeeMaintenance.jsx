import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Wrench } from "lucide-react";
import api from "../../services/api";
import { PageTitle, ProjectCard, ListItem } from "../../components/ui/DashboardUi";

function EmployeeMaintenance() {
  const [d, setD] = useState(null);
  const [keyword, setKeyword] = useState("");

  const load = async () => {
    const r = await api.get("/employee/dashboard");
    setD(r.data);
  };

  useEffect(() => {
    load();
  }, []);

  const done = async (id) => {
    await api.patch(`/employee/maintenance/${id}/done`, {});
    load();
  };

  const projects = useMemo(() => {
    if (!d) return [];
    const q = keyword.toLowerCase();
    return (d.projects || []).filter((p) => p.project_type === "maintenance" && `${p.name} ${p.customer_name || ""} ${p.address || ""}`.toLowerCase().includes(q));
  }, [d, keyword]);

  if (!d) return <div className="p-8 font-bold">Đang tải...</div>;
  if (d.role !== "employee_maintenance") return <div className="p-8"><PageTitle eyebrow="Nhân viên" title="Không có quyền" desc="Chỉ nhân viên bảo trì mới xem lịch bảo trì." /></div>;

  return (
    <div className="p-8 space-y-5">
      <PageTitle eyebrow="Nhân viên bảo trì" title="Dự án bảo trì" desc="Bấm vào dự án để xem danh sách ngày dự kiến bảo trì, thông tin khách hàng và địa chỉ." />

      <div className="card p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-black flex items-center gap-2"><Wrench size={20}/> Danh sách dự án bảo trì</h2>
          <div className="relative w-[360px]">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18}/>
            <input className="input pl-11" placeholder="Tìm dự án bảo trì..." value={keyword} onChange={(e)=>setKeyword(e.target.value)} />
          </div>
        </div>
        <div className="space-y-4">
          {projects.map((p) => <ProjectCard key={p.id} project={p} to={`/employee/projects/${p.id}`} showFinancial={false} />)}
        </div>
      </div>

      <div className="card p-5 space-y-3">
        <h2 className="text-xl font-black mb-4">Lịch bảo trì được giao gần đây</h2>
        {(d.maintenance || []).map((m) => (
          <ListItem
            key={m.id}
            title={`${m.project_name} - lần ${m.maintenance_no}`}
            sub={`Dự kiến: ${m.scheduled_date} • ${m.customer_name}`}
            right={m.status === "done" ? <span className="badge-green">Pass</span> : <button className="btn-primary py-2" onClick={() => done(m.id)}>Hoàn thành</button>}
          />
        ))}
      </div>
    </div>
  );
}

export default EmployeeMaintenance;

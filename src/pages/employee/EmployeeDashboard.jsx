import { useEffect, useMemo, useState } from "react";
import { Building2, ClipboardList, FileText, AlertTriangle, Wrench, Search } from "lucide-react";
import api from "../../services/api";
import { PageTitle, StatCard, ProjectCard, ListItem } from "../../components/ui/DashboardUi";

function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [keyword, setKeyword] = useState("");

  const load = async () => {
    const r = await api.get("/employee/dashboard");
    setData(r.data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateTask = async (id, status) => {
    await api.patch(`/employee/tasks/${id}/status`, { status });
    load();
  };

  const doneMaint = async (id) => {
    await api.patch(`/employee/maintenance/${id}/done`, {});
    load();
  };

  const filteredProjects = useMemo(() => {
    if (!data) return [];
    const q = keyword.toLowerCase();
    return (data.projects || []).filter((p) =>
      `${p.name} ${p.customer_name || ""} ${p.address || ""} ${p.status_label || ""}`.toLowerCase().includes(q)
    );
  }, [data, keyword]);

  if (!data) return <div className="relative z-10 p-8 font-bold">Đang tải...</div>;

  const isMaintenance = data.role === "employee_maintenance";

  return (
    <div className="relative z-10 p-8">
      <PageTitle
        eyebrow="Nhân viên"
        title={isMaintenance ? "Dự án bảo trì của tôi" : "Công việc của tôi"}
        desc="Chỉ hiển thị đúng dự án và công việc được giao cho tài khoản hiện tại."
      />

      <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-4">
        <StatCard title="Dự án" value={data.projects.length} icon={Building2} />
        <StatCard title="Công việc" value={data.tasks.length} icon={ClipboardList} tone="orange" />
        <StatCard title="Báo cáo" value={data.reports.length} icon={FileText} tone="green" />
        <StatCard title="Phát sinh" value={data.issues.length} icon={AlertTriangle} tone="red" />
      </div>

      {isMaintenance && (
        <div className="card p-5 mb-5">
          <h2 className="text-xl font-black mb-4 flex items-center gap-2"><Wrench size={20}/> Lịch bảo trì sắp tới</h2>
          <div className="space-y-3">
            {(data.maintenance || []).slice(0, 5).map((m) => (
              <ListItem
                key={m.id}
                title={`${m.project_name} - lần ${m.maintenance_no}`}
                sub={`${m.scheduled_date} • ${m.customer_name}`}
                right={m.status === "done" ? <span className="badge-green">Pass</span> : <button className="btn-primary py-2" onClick={() => doneMaint(m.id)}>Hoàn thành</button>}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Dự án của tôi</h2>
            <div className="relative w-[360px]">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18}/>
              <input className="input pl-11" placeholder="Tìm dự án..." value={keyword} onChange={(e)=>setKeyword(e.target.value)} />
            </div>
          </div>
          {filteredProjects.map((p) => <ProjectCard key={p.id} project={p} to={`/employee/projects/${p.id}`} showFinancial={false} />)}
          {filteredProjects.length === 0 && <div className="card p-8 text-center text-slate-500 font-bold">Không tìm thấy dự án phù hợp.</div>}
        </div>

        <div className="card p-5">
          <h2 className="text-xl font-black mb-4">Công việc cần làm</h2>
          <div className="space-y-3">
            {(data.tasks || []).map((t) => (
              <ListItem
                key={t.id}
                title={t.title}
                sub={`${t.project_name || "-"} • Deadline: ${t.deadline}`}
                right={
                  <select className="input w-[130px]" value={t.status} onChange={(e) => updateTask(t.id, e.target.value)}>
                    <option value="pending">Chờ làm</option>
                    <option value="doing">Đang làm</option>
                    <option value="done">Hoàn thành</option>
                    <option value="late">Trễ</option>
                  </select>
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;

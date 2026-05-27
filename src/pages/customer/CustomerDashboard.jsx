import { useEffect, useState } from "react";
import { Building2, Clock, FileText, Wrench } from "lucide-react";
import api from "../../services/api";
import { PageTitle, StatCard, ProjectCard, ListItem } from "../../components/ui/DashboardUi";

function CustomerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/customer/dashboard").then((r) => setData(r.data));
  }, []);

  if (!data) return <div className="relative z-10 p-8 font-bold">Đang tải...</div>;

  const projects = Array.isArray(data.projects) ? data.projects : [];
  const maintenance = Array.isArray(data.maintenance) ? data.maintenance : [];
  const reports = Array.isArray(data.reports) ? data.reports : [];
  const maintenanceDone = maintenance.filter((m) => m.status === "done").length;

  return (
    <div className="relative z-10 p-8">
      <PageTitle
        eyebrow="Khách hàng"
        title="Công trình của tôi"
        desc="Theo dõi dự án, tiến độ, báo cáo được chia sẻ và lịch bảo trì thuộc tài khoản của bạn."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        <StatCard title="Công trình" value={projects.length} icon={Building2} />
        <StatCard title="Lịch bảo trì" value={maintenance.length} icon={Wrench} tone="orange" />
        <StatCard title="Đã bảo trì" value={maintenanceDone} icon={Clock} tone="green" />
        <StatCard title="Báo cáo" value={reports.length} icon={FileText} tone="violet" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.95fr]">
        <section>
          <h2 className="mb-4 text-2xl font-black">Dự án / hợp đồng</h2>
          <div className="space-y-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} to={`/customer/projects/${p.id}`} showFinancial={false} />
            ))}
            {projects.length === 0 && <div className="card p-5 text-slate-500">Chưa có công trình.</div>}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 text-xl font-black">Lịch bảo trì</h2>
          <div className="space-y-3">
            {maintenance.map((m) => (
              <ListItem
                key={m.id}
                title={`${m.project_name} - lần ${m.maintenance_no}`}
                sub={`${m.scheduled_date} • ${m.employee_name || "Chưa phân công"}`}
                right={<span className={m.status === "done" ? "badge-green" : "badge-orange"}>{m.status === "done" ? "Pass" : "Chưa bảo trì"}</span>}
              />
            ))}
            {maintenance.length === 0 && <p className="text-slate-500">Chưa có lịch bảo trì.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default CustomerDashboard;

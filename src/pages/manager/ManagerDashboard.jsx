import { useEffect, useState } from "react";
import { Building2, FileCheck2, Wrench, ClipboardList } from "lucide-react";
import api from "../../services/api";
import { PageTitle, StatCard, ProjectCard, ListItem } from "../../components/ui/DashboardUi";

function ManagerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/manager/dashboard").then((r) => setData(r.data));
  }, []);

  if (!data) return <div className="relative z-10 p-8 font-bold">Đang tải...</div>;

  const projects = Array.isArray(data.projects) ? data.projects.slice(0, 6) : [];
  const maintenance = Array.isArray(data.maintenance) ? data.maintenance.slice(0, 6) : [];
  const reports = Array.isArray(data.reports) ? data.reports : [];

  return (
    <div className="relative z-10 p-8">
      <PageTitle
        eyebrow="Quản lý"
        title="Tổng quan quản lý"
        desc="Giám sát dự án được giao, phân công công việc, duyệt báo cáo nhân viên và theo dõi lịch bảo trì."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        <StatCard title="Dự án" value={data.stats?.total_projects} icon={Building2} />
        <StatCard title="Đang làm" value={data.stats?.active_projects} icon={ClipboardList} tone="orange" />
        <StatCard title="Bảo trì" value={data.stats?.maintenance_projects} icon={Wrench} tone="green" />
        <StatCard title="Báo cáo" value={reports.length} icon={FileCheck2} tone="red" to="/manager/reports" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-[1.25fr_0.95fr]">
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Dự án quản lý</h2>
              <p className="text-sm text-slate-500">Danh sách dự án đang do bạn phụ trách.</p>
            </div>
            <a href="/manager/projects" className="font-extrabold text-amber-700">Xem tất cả</a>
          </div>

          <div className="space-y-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} to={`/manager/projects/${p.id}`} />
            ))}
            {projects.length === 0 && <p className="text-slate-500">Chưa có dự án được giao.</p>}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 text-xl font-black">Lịch bảo trì</h2>
          <div className="space-y-3">
            {maintenance.map((m) => (
              <ListItem
                key={m.id}
                title={`${m.project_name} - lần ${m.maintenance_no}`}
                sub={`${m.scheduled_date} • ${m.customer_name}`}
                right={
                  <span className={m.status === "done" ? "badge-green" : "badge-orange"}>
                    {m.status === "done" ? "Pass" : "Chưa bảo trì"}
                  </span>
                }
              />
            ))}
            {maintenance.length === 0 && <p className="text-slate-500">Chưa có lịch bảo trì.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ManagerDashboard;

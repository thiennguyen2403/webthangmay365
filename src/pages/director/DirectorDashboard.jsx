import { useEffect, useState } from "react";
import { Building2, Users, FileCheck2, Wrench } from "lucide-react";
import api from "../../services/api";
import { PageTitle, StatCard, ProjectCard, ListItem } from "../../components/ui/DashboardUi";
import { money } from "../../utils/roles";

function DirectorDashboard() {
  const [data, setData] = useState(null);

  const load = async () => {
    const r = await api.get("/director/dashboard");
    setData(r.data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!data) {
    return <div className="relative z-10 p-8 font-bold">Đang tải...</div>;
  }

  const activeProjects = Array.isArray(data.activeProjects) ? data.activeProjects.slice(0, 5) : [];
  const completedProjects = Array.isArray(data.completedProjects) ? data.completedProjects.slice(0, 5) : [];
  const upcomingMaintenance = Array.isArray(data.upcomingMaintenance) ? data.upcomingMaintenance.slice(0, 5) : [];

  return (
    <div className="relative z-10 p-8">
      <PageTitle
        eyebrow="Giám đốc"
        title="Tổng quan công ty"
        desc="Theo dõi dự án đang làm, dự án hoàn thành, tài chính, bảo trì và các duyệt cần xử lý."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        <StatCard title="Tổng dự án" value={data.stats?.total_projects} icon={Building2} to="/director/projects" />
        <StatCard title="Đang làm" value={data.stats?.active_projects} icon={Wrench} tone="orange" to="/director/projects?statusGroup=active" />
        <StatCard title="Tài khoản" value={data.stats?.total_users} icon={Users} tone="green" to="/director/users" />
        <StatCard
          title="Chờ duyệt"
          value={(data.stats?.pending_reports || 0) + (data.stats?.pending_issues || 0)}
          icon={FileCheck2}
          tone="red"
          to="/director/approvals"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-4">
        <FinanceMini title="Tiền vào" value={data.finance?.income} tone="text-emerald-700" />
        <FinanceMini title="Chi tiêu" value={data.finance?.expense} tone="text-rose-600" />
        <FinanceMini title="Phát sinh" value={data.finance?.extra_expense} tone="text-amber-700" />
        <div className="rounded-[28px] bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white shadow-[0_22px_65px_rgba(15,23,42,.20)]">
          <p className="font-bold text-slate-300">Còn lại</p>
          <h3 className="mt-2 text-2xl font-black">{money(data.finance?.balance)}</h3>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.95fr]">
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Dự án đang làm</h2>
              <p className="text-sm text-slate-500">Hiển thị 5 dự án mới nhất, bấm xem thêm để phân trang.</p>
            </div>
            <a className="font-extrabold text-amber-700" href="/director/projects?statusGroup=active">Xem thêm</a>
          </div>

          <div className="space-y-4">
            {activeProjects.map((p) => (
              <ProjectCard key={p.id} project={p} to={`/director/projects/${p.id}`} />
            ))}
            {activeProjects.length === 0 && <p className="text-slate-500">Chưa có dự án đang làm.</p>}
          </div>
        </section>

        <div className="space-y-5">
          <section className="card p-5">
            <h2 className="mb-4 text-xl font-black">Đã hoàn thành</h2>
            <div className="space-y-3">
              {completedProjects.map((p) => (
                <ListItem
                  key={p.id}
                  title={p.name}
                  sub={`${p.customer_name || "-"} • ${p.project_type_label || "-"}`}
                  right={<span className="badge-green">100%</span>}
                />
              ))}
              {completedProjects.length === 0 && <p className="text-slate-500">Chưa có dự án hoàn thành.</p>}
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-4 text-xl font-black">Lịch bảo trì sắp tới</h2>
            <div className="space-y-3">
              {upcomingMaintenance.map((m) => (
                <ListItem
                  key={m.id}
                  title={`${m.project_name} - lần ${m.maintenance_no}`}
                  sub={`${m.scheduled_date} • ${m.customer_name}`}
                  right={<span className="badge-orange">Chưa bảo trì</span>}
                />
              ))}
              {upcomingMaintenance.length === 0 && <p className="text-slate-500">Chưa có lịch bảo trì sắp tới.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function FinanceMini({ title, value, tone }) {
  return (
    <div className="soft-card p-5">
      <p className="font-bold text-slate-500">{title}</p>
      <h3 className={`mt-2 text-2xl font-black ${tone}`}>{money(value)}</h3>
    </div>
  );
}

export default DirectorDashboard;

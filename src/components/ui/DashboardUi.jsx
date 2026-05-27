import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { money } from "../../utils/roles";

export function PageTitle({ eyebrow, title, desc, action }) {
  return (
    <div className="relative z-10 mb-7 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-700">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 xl:text-5xl">
          {title}
        </h1>
        {desc && <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ title, value, icon: Icon, to, tone = "blue", desc }) {
  const tones = {
    blue: "from-blue-50 to-white text-blue-700 border-blue-100",
    green: "from-emerald-50 to-white text-emerald-700 border-emerald-100",
    orange: "from-amber-50 to-white text-amber-700 border-amber-100",
    red: "from-rose-50 to-white text-rose-700 border-rose-100",
    violet: "from-violet-50 to-white text-violet-700 border-violet-100",
  };

  const body = (
    <div className="group rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-slate-600">{title}</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{value ?? 0}</h2>
        </div>

        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border bg-gradient-to-br ${tones[tone]}`}>
          <Icon size={25} />
        </div>
      </div>

      {(to || desc) && (
        <p className="mt-5 flex items-center gap-1 text-sm font-extrabold text-amber-700">
          {desc || "Xem chi tiết"} <ChevronRight size={16} />
        </p>
      )}
    </div>
  );

  return to ? <Link to={to}>{body}</Link> : body;
}

export function ProjectCard({ project, to, showFinancial = true }) {
  const content = (
    <div className="group rounded-[28px] border border-white/75 bg-white/75 p-5 shadow-[0_14px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
      <div className="flex justify-between gap-5">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black text-slate-950">{project.name}</h3>
            <span className="badge-blue">{project.status_label || project.status || "Đang xử lý"}</span>
            <span className="badge-muted">
              {project.project_type === "maintenance"
                ? "Bảo trì"
                : project.project_type === "repair"
                ? "Sửa chữa"
                : "Lắp đặt"}
            </span>
          </div>

          <p className="text-sm leading-6 text-slate-600">
            {project.customer_name || project.customer || "-"} • {project.address || "-"}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Mini label="Quản lý" value={project.manager_name || project.manager || "-"} />
            {showFinancial && <Mini label="Hợp đồng" value={money(project.contract_value)} />}
            <Mini label="Bắt đầu" value={project.start_date || "-"} />
            <Mini label="Kết thúc" value={project.expected_end_date || project.deadline || "-"} />
          </div>
        </div>

        <div className="min-w-[135px] text-right">
          <p className="text-3xl font-black text-amber-700">{project.progress || 0}%</p>
          <p className="text-xs font-bold text-slate-500">Tiến độ</p>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

export function Mini({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-[#fbf6ec]/80 px-4 py-3">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-slate-900">{value ?? "-"}</p>
    </div>
  );
}

export function ListItem({ title, sub, right }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur transition hover:border-amber-200 hover:bg-white/85">
      <div className="min-w-0">
        <h4 className="truncate font-black text-slate-950">{title}</h4>
        {sub && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

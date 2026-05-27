import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  PlusSquare,
  ClipboardList,
  FileCheck2,
  Wallet,
  UserCircle,
  LogOut,
  Bell,
  Search,
  Wrench,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { roleLabels } from "../utils/roles";
import logo365 from "../assets/logo-365.png";

const roleTheme = {
  director: {
    name: "Giám đốc",
    eyebrow: "Điều hành tổng quan",
    gradient: "from-[#0f2443] via-[#10213d] to-[#08172b]",
    accent: "from-amber-400 to-yellow-200",
    active: "from-amber-400 to-yellow-200 text-slate-950 shadow-amber-500/20",
  },
  manager: {
    name: "Quản lý",
    eyebrow: "Quản lý vận hành",
    gradient: "from-[#0b2f4f] via-[#123a5b] to-[#071d33]",
    accent: "from-sky-400 to-cyan-200",
    active: "from-sky-400 to-cyan-200 text-slate-950 shadow-sky-500/20",
  },
  employee: {
    name: "Nhân viên",
    eyebrow: "Công việc được giao",
    gradient: "from-[#12301f] via-[#16422d] to-[#071d14]",
    accent: "from-emerald-400 to-lime-200",
    active: "from-emerald-400 to-lime-200 text-slate-950 shadow-emerald-500/20",
  },
  customer: {
    name: "Khách hàng",
    eyebrow: "Theo dõi công trình",
    gradient: "from-[#2f214b] via-[#37265b] to-[#170d2c]",
    accent: "from-violet-300 to-fuchsia-200",
    active: "from-violet-300 to-fuchsia-200 text-slate-950 shadow-violet-500/20",
  },
};

const menuMap = {
  director: [
    { name: "Dashboard", path: "/director", icon: LayoutDashboard },
    { name: "Tài khoản", path: "/director/users", icon: Users },
    { name: "Dự án", path: "/director/projects", icon: Building2 },
    { name: "Tạo dự án", path: "/director/projects/create", icon: PlusSquare },
    { name: "Giao việc", path: "/director/tasks", icon: ClipboardList },
    { name: "Duyệt báo cáo", path: "/director/approvals", icon: FileCheck2 },
    { name: "Tài chính", path: "/director/finance", icon: Wallet },
    { name: "Cá nhân", path: "/director/profile", icon: UserCircle },
  ],
  manager: [
    { name: "Dashboard", path: "/manager", icon: LayoutDashboard },
    { name: "Công trình", path: "/manager/projects", icon: Building2 },
    { name: "Giao việc", path: "/manager/tasks", icon: ClipboardList },
    { name: "Báo cáo", path: "/manager/reports", icon: FileCheck2 },
    { name: "Cá nhân", path: "/manager/profile", icon: UserCircle },
  ],
  employee: [
    { name: "Dashboard", path: "/employee", icon: LayoutDashboard },
    { name: "Báo cáo", path: "/employee/reports", icon: FileCheck2 },
    { name: "Phát sinh", path: "/employee/issues", icon: AlertTriangle },
    { name: "Lịch bảo trì", path: "/employee/maintenance", icon: Wrench },
    { name: "Cá nhân", path: "/employee/profile", icon: UserCircle },
  ],
  customer: [
    { name: "Dashboard", path: "/customer", icon: LayoutDashboard },
    { name: "Cá nhân", path: "/customer/profile", icon: UserCircle },
  ],
};

function RoleLayout({ type = "director" }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const theme = roleTheme[type] || roleTheme.director;

  let menus = menuMap[type] || menuMap.director;

  if (type === "employee" && user?.role !== "employee_maintenance") {
    menus = menus.filter((m) => m.path !== "/employee/maintenance");
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4efe4]">
      <aside
        className={`fixed left-0 top-0 bottom-0 z-30 w-[300px] bg-gradient-to-b ${theme.gradient} p-5 text-white shadow-2xl`}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_0%,white,transparent_28%),radial-gradient(circle_at_80%_80%,#fbbf24,transparent_26%)]" />

        <div className="relative flex h-full flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/15 shadow-xl">
              <img src={logo365} alt="Thang Máy 365" className="h-11 w-11 object-contain" />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">Thang Máy 365</h1>
              <p className="text-xs font-medium text-white/65">Hệ thống quản lý công ty</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {menus.map((menu) => {
              const Icon = menu.icon;

              return (
                <NavLink
                  key={menu.path}
                  to={menu.path}
                  end={menu.path === `/${type}`}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${theme.active} shadow-lg`
                        : "text-white/72 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/15">
                    <Icon size={18} />
                  </span>
                  {menu.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="rounded-[28px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.accent} font-black text-slate-950`}>
                {(user?.full_name || "T").slice(0, 1)}
              </div>

              <div className="min-w-0">
                <p className="truncate font-black">{user?.full_name || "Người dùng"}</p>
                <p className="truncate text-xs text-white/65">{roleLabels[user?.role] || theme.name}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 text-sm font-bold transition hover:bg-white/12"
            >
              <LogOut size={17} />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-[300px] min-h-screen">
        <header className="sticky top-0 z-20 h-[96px] border-b border-white/70 bg-[#fbf7ef]/82 px-8 backdrop-blur-2xl">
          <div className="flex h-full items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-amber-700">
                <ShieldCheck size={15} />
                {theme.eyebrow}
              </div>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                Thang Máy 365 - {roleLabels[user?.role] || theme.name}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden xl:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  className="h-12 w-[320px] rounded-2xl border border-white/80 bg-white/70 pl-11 pr-4 text-sm font-medium shadow-sm outline-none transition focus:ring-4 focus:ring-amber-100"
                  placeholder="Tìm kiếm nhanh..."
                />
              </div>

              <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/70 shadow-sm transition hover:-translate-y-0.5">
                <Bell size={19} />
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
            </div>
          </div>
        </header>

        <div className="relative min-h-[calc(100vh-96px)] overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(251,191,36,.18),transparent_28%),radial-gradient(circle_at_15%_85%,rgba(37,99,235,.12),transparent_30%)]" />
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default RoleLayout;

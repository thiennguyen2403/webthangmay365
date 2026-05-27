import {
  LayoutDashboard,
  Users,
  Building2,
  PlusSquare,
  ClipboardList,
  FileText,
  AlertTriangle,
  Wallet,
  UserCircle,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menus = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Tài khoản",
    path: "/director/accounts",
    icon: Users,
  },
  {
    name: "Công trình",
    path: "/director/projects",
    icon: Building2,
  },
  {
    name: "Tạo dự án",
    path: "/director/projects/create",
    icon: PlusSquare,
  },
  {
    name: "Giao việc",
    path: "/director/assign-task",
    icon: ClipboardList,
  },
  {
    name: "Báo cáo quản lý",
    path: "/director/reports",
    icon: FileText,
  },
  {
    name: "Phát sinh nhân viên",
    path: "/director/employee-issues",
    icon: AlertTriangle,
  },
  {
    name: "Tài chính",
    path: "/director/finance",
    icon: Wallet,
  },
  {
    name: "Cá nhân",
    path: "/director/profile",
    icon: UserCircle,
  },
];

function Sidebar() {
  return (
    <div className="w-[280px] bg-white border-r border-slate-200 min-h-screen p-5">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-blue-600">
          THANG MÁY 365
        </h1>

        <p className="text-slate-500 mt-2">
          Hệ thống quản lý công ty
        </p>
      </div>

      <div className="space-y-2">
        {menus.map((menu, index) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={index}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-100 text-slate-700"
                }`
              }
            >
              <Icon size={20} />
              {menu.name}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
import { Bell, Search } from "lucide-react";

function Header() {
  return (
    <div className="h-[90px] bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-600 font-bold">
          GIÁM ĐỐC
        </p>

        <h1 className="text-3xl font-black mt-1">
          Hệ thống quản lý công ty thang máy
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-3 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-[280px] border border-slate-200 rounded-2xl pl-11 pr-4 py-3 outline-none"
          />
        </div>

        <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">
            T
          </div>

          <div>
            <p className="font-black">Nguyễn Văn Thiên</p>
            <p className="text-sm text-slate-500">
              Giám đốc
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
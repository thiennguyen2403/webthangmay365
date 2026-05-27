import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, HelpCircle } from "lucide-react";
import api from "../../services/api";
import { roleHome } from "../../utils/roles";
import logo365 from "../../assets/logo-365.png";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "sep@365.vn",
    password: "123456",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate(roleHome[res.data.user.role] || "/login");
    } catch (error) {
      alert(error.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(2,6,23,.72), rgba(15,23,42,.18)), url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=90')",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,.22),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(245,158,11,.22),transparent_30%)]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-5 py-10">
        <form
          onSubmit={submit}
          className="w-full max-w-[470px] rounded-[34px] border border-white/60 bg-white/70 p-8 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-3xl bg-white/70 shadow-xl flex items-center justify-center border border-white/80">
              <img
                src={logo365}
                alt="Thang máy 365"
                className="h-20 w-20 object-contain"
              />
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">
              THANG MÁY <span className="text-amber-500">365</span>
            </h1>

            <p className="mt-1 text-lg font-extrabold text-slate-800">
              CHÀO MỪNG TRỞ LẠI
            </p>
          </div>

          <div className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Tài khoản / Email
              </label>

              <div className="group relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700"
                  size={20}
                />

                <input
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white/85 pl-12 pr-4 font-semibold text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  type="email"
                  placeholder="Tên đăng nhập hoặc Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-700">
                  Mật khẩu
                </label>

                <button
                  type="button"
                  className="text-sm font-bold text-blue-700 hover:text-amber-500"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <div className="group relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700"
                  size={20}
                />

                <input
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white/85 pl-12 pr-4 font-semibold text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="group mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 font-black uppercase tracking-wide text-white shadow-lg shadow-blue-300 transition hover:-translate-y-0.5 hover:from-amber-500 hover:to-orange-500 hover:shadow-amber-200 active:translate-y-0 disabled:opacity-70"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}

            {!loading && (
              <ArrowRight
                size={20}
                className="transition group-hover:translate-x-1"
              />
            )}
          </button>

          <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
            <label className="flex items-center gap-2 font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
              />
              Ghi nhớ tôi
            </label>

            <button
              type="button"
              className="flex items-center gap-1 font-bold hover:text-blue-700"
            >
              <HelpCircle size={16} />
              Hỗ trợ
            </button>
          </div>

          <div className="mt-7 rounded-3xl border border-white/70 bg-white/55 p-4 text-sm text-slate-700">
            <p className="font-black text-slate-950">Tài khoản mẫu</p>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
              <p>Giám đốc: sep@365.vn</p>
              <p>Quản lý: quanly@365.vn</p>
              <p>Kỹ thuật: kythuat@365.vn</p>
              <p>Lắp đặt: lapdat@365.vn</p>
              <p>Bảo trì: baotri@365.vn</p>
              <p>MK: 123456</p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs font-medium text-slate-500">
            © 2026 Thang Máy 365 • Chính sách bảo mật • Điều khoản sử dụng
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
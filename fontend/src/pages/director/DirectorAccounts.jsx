import { useState } from "react";
import { accounts as defaultAccounts } from "../../data/directorData";

function DirectorAccounts() {
  const [accounts, setAccounts] = useState(defaultAccounts);
  const [form, setForm] = useState({ name: "", email: "", role: "Nhân viên" });

  const createAccount = () => {
    if (!form.name || !form.email || !form.role) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setAccounts([
      ...accounts,
      { id: Date.now(), ...form, status: "Hoạt động" },
    ]);

    setForm({ name: "", email: "", role: "Nhân viên" });
  };

  const toggleLock = (id) => {
    setAccounts(accounts.map((a) =>
      a.id === id
        ? { ...a, status: a.status === "Hoạt động" ? "Đã khóa" : "Hoạt động" }
        : a
    ));
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-black">Quản lý tài khoản</h1>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-black mb-4">Tạo tài khoản mới</h2>

        <div className="grid grid-cols-4 gap-4">
          <input className="border rounded-2xl px-4 py-3" placeholder="Tên tài khoản" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded-2xl px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <select className="border rounded-2xl px-4 py-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option>Quản lý</option>
            <option>Nhân viên</option>
            <option>Khách hàng</option>
          </select>

          <button onClick={createAccount} className="bg-blue-600 text-white rounded-2xl font-bold">
            Tạo tài khoản
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-black mb-4">Danh sách tài khoản</h2>

        {accounts.map((a) => (
          <div key={a.id} className="border rounded-2xl p-4 mb-3 flex justify-between">
            <div>
              <h3 className="font-black text-lg">{a.name}</h3>
              <p className="text-slate-500">{a.email} • {a.role}</p>
              <p className={a.status === "Hoạt động" ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                {a.status}
              </p>
            </div>

            {a.role !== "Giám đốc" && (
              <button onClick={() => toggleLock(a.id)} className="bg-slate-100 px-5 py-2 rounded-xl font-bold">
                {a.status === "Hoạt động" ? "Khóa" : "Mở khóa"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DirectorAccounts;
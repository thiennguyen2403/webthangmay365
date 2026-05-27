import { useState } from "react";

function DirectorAssignTask() {
  const [form, setForm] = useState({
    project: "",
    manager: "",
    title: "",
    type: "Việc dự án",
    deadline: "",
    note: "",
  });

  const submit = () => {
    if (Object.values(form).some((v) => !v)) {
      alert("Vui lòng nhập đầy đủ thông tin giao việc");
      return;
    }

    alert("Giao việc cho quản lý thành công");
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black mb-6">Giao việc cho quản lý</h1>

      <div className="bg-white rounded-3xl p-6 shadow-sm grid grid-cols-2 gap-4">
        <Input label="Dự án liên quan" value={form.project} onChange={(v) => setForm({ ...form, project: v })} />
        <Input label="Quản lý nhận việc" value={form.manager} onChange={(v) => setForm({ ...form, manager: v })} />
        <Input label="Tên công việc" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />

        <div>
          <p className="font-bold mb-2">Loại công việc</p>
          <select className="w-full border rounded-2xl px-4 py-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>Việc dự án</option>
            <option>Việc công ty</option>
            <option>Việc phát sinh</option>
          </select>
        </div>

        <Input label="Deadline" type="date" value={form.deadline} onChange={(v) => setForm({ ...form, deadline: v })} />

        <div>
          <p className="font-bold mb-2">Ghi chú</p>
          <textarea className="w-full border rounded-2xl px-4 py-3" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </div>

        <button onClick={submit} className="col-span-2 bg-blue-600 text-white rounded-2xl py-4 font-bold">
          Giao việc
        </button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <p className="font-bold mb-2">{label}</p>
      <input type={type} className="w-full border rounded-2xl px-4 py-3" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default DirectorAssignTask;
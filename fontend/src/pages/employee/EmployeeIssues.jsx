import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import api from "../../services/api";
import { PageTitle, ListItem } from "../../components/ui/DashboardUi";

function EmployeeIssues() {
  const [d, setD] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [form, setForm] = useState({ severity: "medium" });
  const [file, setFile] = useState(null);

  const load = async () => {
    const r = await api.get("/employee/dashboard");
    setD(r.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (file) fd.append("image", file);
    await api.post("/employee/issues", fd, { headers: { "Content-Type": "multipart/form-data" } });
    alert("Đã gửi phát sinh");
    setForm({ severity: "medium" });
    setFile(null);
    load();
  };

  const issues = useMemo(() => {
    if (!d) return [];
    const q = keyword.toLowerCase();
    return (d.issues || []).filter((i) => `${i.title} ${i.project_name || ""} ${i.manager_status} ${i.status}`.toLowerCase().includes(q));
  }, [d, keyword]);

  if (!d) return <div className="p-8 font-bold">Đang tải...</div>;

  return (
    <div className="p-8">
      <PageTitle eyebrow="Nhân viên" title="Báo phát sinh" desc="Báo phát sinh kèm ảnh cho quản lý xử lý." />

      <form onSubmit={submit} className="card p-5 grid grid-cols-2 gap-3 mb-5">
        <input className="input" placeholder="Tiêu đề" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <select className="input" value={form.project_id || ""} onChange={(e) => setForm({ ...form, project_id: e.target.value })}>
          <option value="">Chọn dự án</option>
          {(d.projects || []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="input" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
          <option value="low">Thấp</option>
          <option value="medium">Trung bình</option>
          <option value="high">Cao</option>
          <option value="critical">Khẩn cấp</option>
        </select>
        <input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <textarea className="input col-span-2" placeholder="Mô tả" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn-primary col-span-2">Gửi phát sinh</button>
      </form>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-black">Phát sinh đã gửi</h2>
          <div className="relative w-[360px]">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18}/>
            <input className="input pl-11" placeholder="Tìm phát sinh..." value={keyword} onChange={(e)=>setKeyword(e.target.value)} />
          </div>
        </div>
        <div className="space-y-3">
          {issues.map((i) => <ListItem key={i.id} title={i.title} sub={`${i.project_name} • Quản lý: ${i.manager_status} • Giám đốc: ${i.status}`} />)}
        </div>
      </div>
    </div>
  );
}

export default EmployeeIssues;

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import api from "../../services/api";
import { PageTitle, ListItem } from "../../components/ui/DashboardUi";

function EmployeeReports() {
  const [d, setD] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [form, setForm] = useState({ report_type: "progress", report_visibility: "internal" });
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
    await api.post("/employee/reports", fd, { headers: { "Content-Type": "multipart/form-data" } });
    alert(form.report_visibility === "customer" ? "Đã gửi báo cáo cho quản lý duyệt trước khi khách hàng xem" : "Đã gửi báo cáo nội bộ");
    setForm({ report_type: "progress", report_visibility: "internal" });
    setFile(null);
    load();
  };

  const reports = useMemo(() => {
    if (!d) return [];
    const q = keyword.toLowerCase();
    return (d.reports || []).filter((r) => `${r.title} ${r.project_name || ""} ${r.manager_status} ${r.status}`.toLowerCase().includes(q));
  }, [d, keyword]);

  if (!d) return <div className="p-8 font-bold">Đang tải...</div>;

  return (
    <div className="p-8">
      <PageTitle eyebrow="Nhân viên" title="Báo cáo tiến độ" desc="Báo cáo có thể gửi nội bộ cho quản lý/sếp hoặc gửi cho chủ nhà sau khi quản lý duyệt." />

      <form onSubmit={submit} className="card p-5 grid grid-cols-2 gap-3 mb-5">
        <input className="input" placeholder="Tiêu đề" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <select className="input" value={form.project_id || ""} onChange={(e) => setForm({ ...form, project_id: e.target.value })}>
          <option value="">Chọn dự án</option>
          {(d.projects || []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="input" value={form.report_visibility} onChange={(e)=>setForm({...form, report_visibility:e.target.value})}>
          <option value="internal">Báo nội bộ cho quản lý / sếp</option>
          <option value="customer">Báo cho chủ nhà / khách hàng</option>
        </select>
        <input className="input" type="number" placeholder="% tiến độ" value={form.progress_percent || ""} onChange={(e) => setForm({ ...form, progress_percent: e.target.value })} />
        <input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <select className="input" value={form.report_type} onChange={(e)=>setForm({...form, report_type:e.target.value})}>
          <option value="progress">Tiến độ</option>
          <option value="weekly">Báo cáo tuần</option>
          <option value="installation">Lắp đặt</option>
          <option value="maintenance">Bảo trì</option>
          <option value="repair">Sửa chữa</option>
          <option value="other">Khác</option>
        </select>
        <textarea className="input col-span-2" placeholder="Nội dung" value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <button className="btn-primary col-span-2">Gửi báo cáo</button>
      </form>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-black">Báo cáo đã gửi</h2>
          <div className="relative w-[360px]">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18}/>
            <input className="input pl-11" placeholder="Tìm báo cáo..." value={keyword} onChange={(e)=>setKeyword(e.target.value)} />
          </div>
        </div>
        <div className="space-y-3">
          {reports.map((r) => (
            <ListItem
              key={r.id}
              title={r.title}
              sub={`${r.project_name} • ${r.report_visibility === "customer" ? "Gửi khách hàng" : "Nội bộ"} • Quản lý: ${r.manager_status} • Giám đốc: ${r.status}`}
              right={r.image_url ? <a className="text-blue-600 font-bold" href={`http://localhost:5000${r.image_url}`} target="_blank">Ảnh</a> : null}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmployeeReports;

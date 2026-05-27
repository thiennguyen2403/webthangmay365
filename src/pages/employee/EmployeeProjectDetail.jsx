import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, UserRound, ClipboardList, Wrench, Search } from "lucide-react";
import api from "../../services/api";
import { PageTitle, Mini, ListItem } from "../../components/ui/DashboardUi";
import { roleLabels } from "../../utils/roles";

function statusText(status) {
  return status === "done" ? "Đã xong" : status === "doing" ? "Đang làm" : "Chưa làm";
}

function EmployeeProjectDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/employee/projects/${id}`);
      setData(res.data);
    };
    load();
  }, [id]);

  const search = keyword.toLowerCase();
  const filteredMaintenance = useMemo(() => {
    if (!data) return [];
    return (data.maintenance || []).filter((m) =>
      `${m.maintenance_no} ${m.scheduled_date} ${m.employee_name || ""} ${m.status}`.toLowerCase().includes(search)
    );
  }, [data, search]);

  if (!data) return <div className="p-8 font-bold">Đang tải chi tiết...</div>;

  const p = data.project;
  const isMaintenance = p.project_type === "maintenance";

  return (
    <div className="p-8 space-y-6">
      <Link to="/employee" className="inline-flex items-center gap-2 text-blue-600 font-black">
        <ArrowLeft size={18} /> Quay lại
      </Link>

      <PageTitle
        eyebrow="Nhân viên"
        title={p.name}
        desc="Chi tiết công trình được giao. Phần tài chính/hợp đồng tiền không hiển thị cho nhân viên."
      />

      <div className="card p-6 grid grid-cols-[1fr_320px] gap-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span className="badge-blue">{p.project_type_label}</span>
            <span className="badge-orange">{p.status_label}</span>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            <Mini label="Khách hàng" value={p.customer_name} />
            <Mini label="SĐT khách" value={p.customer_phone || "-"} />
            <Mini label="Email khách" value={p.customer_email || "-"} />
            <Mini label="Địa chỉ công trình" value={p.address} />
            <Mini label="Loại thang" value={p.elevator_type || "-"} />
            <Mini label="Ngày bắt đầu" value={p.start_date || "-"} />
            <Mini label="Dự kiến kết thúc" value={p.expected_end_date || "-"} />
            <Mini label="Quản lý" value={p.manager_name || "-"} />
            <Mini label="SĐT quản lý" value={p.manager_phone || "-"} />
          </div>
        </div>

        <div className="bg-blue-50 rounded-3xl p-5">
          <p className="font-black text-slate-600">Tiến độ</p>
          <h2 className="text-5xl font-black text-blue-600 mt-2">{p.progress || 0}%</h2>
          <div className="h-3 bg-white rounded-full mt-5 overflow-hidden">
            <div className="h-3 bg-blue-600 rounded-full" style={{ width: `${p.progress || 0}%` }} />
          </div>
          {isMaintenance && (
            <div className="mt-5 bg-white rounded-2xl p-4">
              <p className="font-black">Bảo trì</p>
              <p className="text-slate-500 mt-1">Đã làm {p.maintenance_done_times}/{p.maintenance_total_times} lần</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <section className="card p-5">
          <h2 className="text-xl font-black mb-4 flex items-center gap-2"><UserRound size={20}/> Nhân sự</h2>
          <div className="space-y-3">
            {(data.members || []).map((m) => (
              <ListItem
                key={`${m.id}-${m.role}`}
                title={m.full_name}
                sub={`${roleLabels[m.role] || m.role} • ${m.phone || "Chưa có SĐT"}`}
                right={<span className="badge-muted">{m.experience_years || 0} năm</span>}
              />
            ))}
          </div>
        </section>

        <section className="card p-5 col-span-2">
          <h2 className="text-xl font-black mb-4 flex items-center gap-2"><ClipboardList size={20}/> Giai đoạn tiến độ</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {(data.stages || []).map((s) => (
              <div
                key={s.id}
                className={`rounded-2xl border p-4 transition ${
                  s.status === "doing"
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                    : s.status === "done"
                      ? "bg-slate-50 text-slate-400 border-slate-200"
                      : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <p className="font-black">{s.stage_name}</p>
                <p className={`text-sm mt-1 ${s.status === "doing" ? "text-blue-100" : "text-slate-500"}`}>{statusText(s.status)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isMaintenance && (
        <section className="card p-5">
          <div className="flex justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-black flex items-center gap-2"><Wrench size={20}/> Danh sách lịch bảo trì</h2>
            <div className="relative w-[360px]">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18}/>
              <input className="input pl-11" placeholder="Tìm lịch bảo trì..." value={keyword} onChange={(e)=>setKeyword(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {filteredMaintenance.map((m) => (
              <ListItem
                key={m.id}
                title={`Bảo trì lần ${m.maintenance_no}`}
                sub={`Dự kiến: ${m.scheduled_date} • Nhân viên: ${m.employee_name || "Chưa phân công"}`}
                right={<span className={m.status === "done" ? "badge-green" : "badge-orange"}>{m.status === "done" ? "Pass" : "Chưa bảo trì"}</span>}
              />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-5">
        <section className="card p-5">
          <h2 className="text-xl font-black mb-4">Công việc của tôi trong dự án</h2>
          <div className="space-y-3">
            {(data.tasks || []).map((t) => <ListItem key={t.id} title={t.title} sub={`${t.status} • Deadline: ${t.deadline || "-"}`} />)}
            {(data.tasks || []).length === 0 && <p className="text-slate-500 font-bold">Chưa có công việc riêng.</p>}
          </div>
        </section>
        <section className="card p-5">
          <h2 className="text-xl font-black mb-4">Báo cáo/phát sinh của tôi</h2>
          <div className="space-y-3">
            {(data.reports || []).map((r) => <ListItem key={`r-${r.id}`} title={r.title} sub={`Báo cáo • ${r.manager_status} • ${r.report_visibility === "customer" ? "Khách hàng xem sau duyệt" : "Nội bộ"}`} />)}
            {(data.issues || []).map((i) => <ListItem key={`i-${i.id}`} title={i.title} sub={`Phát sinh • ${i.manager_status} • ${i.status}`} />)}
          </div>
        </section>
      </div>
    </div>
  );
}

export default EmployeeProjectDetail;

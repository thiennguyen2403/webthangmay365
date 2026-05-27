import { useState } from "react";
import { managerReports } from "../../data/directorData";

function DirectorReports() {
  const [reports, setReports] = useState(managerReports);

  const handleAction = (id, status) => {
    const comment = prompt("Nhập nhận xét bắt buộc:");

    if (!comment) {
      alert("Bắt buộc phải nhập nhận xét");
      return;
    }

    setReports(reports.map((r) =>
      r.id === id ? { ...r, status, comment } : r
    ));
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black mb-6">Duyệt báo cáo quản lý</h1>

      {reports.map((r) => (
        <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm mb-4">
          <h2 className="text-xl font-black">{r.title}</h2>
          <p className="text-slate-500 mt-1">{r.sender} • {r.project}</p>
          <p className="font-bold mt-3">Trạng thái: {r.status}</p>

          {r.comment && <p className="text-blue-600 font-bold mt-2">Nhận xét: {r.comment}</p>}

          {r.status === "Chờ duyệt" && (
            <div className="flex gap-3 mt-4">
              <button onClick={() => handleAction(r.id, "Đã duyệt")} className="bg-green-600 text-white px-5 py-2 rounded-xl font-bold">
                Duyệt
              </button>
              <button onClick={() => handleAction(r.id, "Từ chối")} className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold">
                Từ chối
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DirectorReports;
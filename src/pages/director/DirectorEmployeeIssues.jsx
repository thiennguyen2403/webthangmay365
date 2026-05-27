import { useState } from "react";
import { employeeIssues } from "../../data/directorData";

function DirectorEmployeeIssues() {
  const [issues, setIssues] = useState(employeeIssues);

  const handleAction = (id, status) => {
    const comment = prompt("Nhập nhận xét bắt buộc:");

    if (!comment) {
      alert("Bắt buộc phải nhập nhận xét");
      return;
    }

    setIssues(issues.map((i) =>
      i.id === id ? { ...i, status, comment } : i
    ));
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black mb-6">Duyệt phát sinh nhân viên</h1>

      {issues.map((i) => (
        <div key={i.id} className="bg-white rounded-3xl p-6 shadow-sm mb-4">
          <h2 className="text-xl font-black">{i.title}</h2>
          <p className="text-slate-500 mt-1">{i.sender} • {i.project}</p>
          <p className="font-bold mt-3">Trạng thái: {i.status}</p>

          {i.comment && <p className="text-blue-600 font-bold mt-2">Nhận xét: {i.comment}</p>}

          {i.status === "Chờ duyệt" && (
            <div className="flex gap-3 mt-4">
              <button onClick={() => handleAction(i.id, "Đã duyệt")} className="bg-green-600 text-white px-5 py-2 rounded-xl font-bold">
                Duyệt
              </button>
              <button onClick={() => handleAction(i.id, "Từ chối")} className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold">
                Từ chối
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DirectorEmployeeIssues;
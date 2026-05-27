import { useEffect, useState } from "react";
import api from "../../services/api";
import { PageTitle } from "../../components/ui/DashboardUi";

function ManagerTasks() {
  const [dashboard, setDashboard] = useState({
    projects: [],
    tasks: [],
  });

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    title: "",
    project_id: "",
    assigned_to: "",
    deadline: "",
    priority: "medium",
    description: "",
  });

  const load = async () => {
    const d = await api.get("/manager/dashboard");
    const e = await api.get("/manager/employees");

    setDashboard({
      projects: Array.isArray(d.data?.projects) ? d.data.projects : [],
      tasks: Array.isArray(d.data?.tasks) ? d.data.tasks : [],
    });

    setEmployees(Array.isArray(e.data) ? e.data : []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    await api.post("/manager/tasks", form);

    alert("Đã giao việc");

    setForm({
      title: "",
      project_id: "",
      assigned_to: "",
      deadline: "",
      priority: "medium",
      description: "",
    });

    load();
  };

  return (
    <div className="p-8">
      <PageTitle
        eyebrow="Quản lý"
        title="Giao việc nhân viên"
        desc="Quản lý phân công công việc cho nhân viên thuộc dự án mình phụ trách."
      />

      <form
        onSubmit={submit}
        className="card p-6 grid grid-cols-2 gap-4 mb-6"
      >
        <input
          className="input"
          placeholder="Tên công việc"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <select
          className="input"
          value={form.project_id}
          onChange={(e) =>
            setForm({
              ...form,
              project_id: e.target.value,
            })
          }
        >
          <option value="">Chọn dự án</option>

          {dashboard.projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={form.assigned_to}
          onChange={(e) =>
            setForm({
              ...form,
              assigned_to: e.target.value,
            })
          }
        >
          <option value="">Chọn nhân viên</option>

          {employees.map((u) => (
            <option key={u.id} value={u.id}>
              {u.full_name} - {u.role_label || u.role}
            </option>
          ))}
        </select>

        <input
          className="input"
          type="date"
          value={form.deadline}
          onChange={(e) =>
            setForm({
              ...form,
              deadline: e.target.value,
            })
          }
        />

        <textarea
          className="input col-span-2"
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <button className="btn-primary col-span-2">
          Giao việc
        </button>
      </form>

      <div className="card p-5">
        <h2 className="text-xl font-black mb-4">
          Danh sách việc
        </h2>

        {dashboard.tasks.length === 0 && (
          <p className="text-slate-500">
            Chưa có công việc nào.
          </p>
        )}

        {dashboard.tasks.map((t) => (
          <div className="border-b py-3" key={t.id}>
            <b>{t.title}</b>
            <p className="text-slate-500">
              {t.project_name || "-"} • {t.assigned_to_name || "-"} • {t.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagerTasks;
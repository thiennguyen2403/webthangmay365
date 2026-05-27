import { useEffect, useState } from "react";
import api from "../../services/api";
import { roleLabels } from "../../utils/roles";

function DirectorTasks() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    project_id: "",
    assigned_to: "",
    task_scope: "project",
    priority: "medium",
    start_date: "",
    deadline: "",
  });

  const load = async () => {
    const usersRes = await api.get("/director/select-users");
    const projectsRes = await api.get("/director/projects");

    const usersData = usersRes.data;
    const projectsData = projectsRes.data;

    setUsers(Array.isArray(usersData) ? usersData : []);

    if (Array.isArray(projectsData)) {
      setProjects(projectsData);
    } else if (Array.isArray(projectsData.projects)) {
      setProjects(projectsData.projects);
    } else if (Array.isArray(projectsData.data)) {
      setProjects(projectsData.data);
    } else {
      setProjects([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const receivers = users.filter((u) => u.role === "manager");

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/director/tasks", form);

      alert("Giao việc thành công");

      setForm({
        title: "",
        description: "",
        project_id: "",
        assigned_to: "",
        task_scope: "project",
        priority: "medium",
        start_date: "",
        deadline: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi giao việc");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black mb-2">
        Giao việc cho quản lý
      </h1>

      <p className="text-slate-500 mb-6">
        Giao việc công ty hoặc việc theo dự án cho quản lý.
      </p>

      <form onSubmit={submit} className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            value={form.assigned_to}
            onChange={(e) =>
              setForm({
                ...form,
                assigned_to: e.target.value,
              })
            }
          >
            <option value="">Chọn quản lý</option>

            {receivers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name} - {roleLabels[u.role] || u.role}
              </option>
            ))}
          </select>

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
            <option value="">Việc công ty / không gắn dự án</option>

            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={form.priority}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value,
              })
            }
          >
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>

          <input
            className="input"
            type="date"
            value={form.start_date}
            onChange={(e) =>
              setForm({
                ...form,
                start_date: e.target.value,
              })
            }
          />

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
        </div>

        <textarea
          className="input min-h-[140px]"
          placeholder="Mô tả công việc"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <button className="btn-primary">
          Giao việc
        </button>
      </form>
    </div>
  );
}

export default DirectorTasks;
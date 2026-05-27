import { useEffect, useState } from "react";
import api from "../../services/api";
import { money } from "../../utils/roles";

function DirectorFinance() {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    project_id: "",
    type: "income",
    title: "",
    amount: "",
    payment_date: "",
    note: "",
  });

  const fetchData = async () => {
    const financeRes = await api.get("/director/finance");
    const projectRes = await api.get("/director/projects");

    setData({
      summary: financeRes.data?.summary || {
        income: 0,
        expense: 0,
        extra_expense: 0,
        balance: 0,
      },
      transactions: Array.isArray(financeRes.data?.transactions)
        ? financeRes.data.transactions
        : [],
      byProject: Array.isArray(financeRes.data?.byProject)
        ? financeRes.data.byProject
        : [],
    });

    const projectData = projectRes.data;

    if (Array.isArray(projectData)) {
      setProjects(projectData);
    } else if (Array.isArray(projectData.projects)) {
      setProjects(projectData.projects);
    } else if (Array.isArray(projectData.data)) {
      setProjects(projectData.data);
    } else {
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/director/finance", form);

      setForm({
        project_id: "",
        type: "income",
        title: "",
        amount: "",
        payment_date: "",
        note: "",
      });

      fetchData();

      alert("Đã nhập thu chi");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi nhập thu chi");
    }
  };

  if (!data) {
    return <div className="p-8 font-bold">Đang tải tài chính...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-4xl font-black">Tài chính công ty</h1>
        <p className="text-slate-500 mt-2">
          Theo dõi tiền vào, tiền chi, chi phí phát sinh, số dư và tài chính từng dự án.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Tiền vào" value={data.summary.income} tone="green" />
        <Card title="Công ty đã chi" value={data.summary.expense} tone="red" />
        <Card title="Phát sinh" value={data.summary.extra_expense} tone="orange" />
        <Card title="Hiện còn" value={data.summary.balance} tone="blue" />
      </div>

      <form onSubmit={submit} className="card p-6">
        <h2 className="text-2xl font-black mb-5">Nhập thu chi</h2>

        <div className="grid grid-cols-3 gap-4">
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
            <option value="">Khoản chung công ty</option>

            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
          >
            <option value="income">Tiền vào</option>
            <option value="expense">Công ty chi</option>
            <option value="extra_expense">Chi phí phát sinh</option>
          </select>

          <input
            className="input"
            placeholder="Tiêu đề"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <input
            className="input"
            type="number"
            placeholder="Số tiền"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value,
              })
            }
          />

          <input
            className="input"
            type="date"
            value={form.payment_date}
            onChange={(e) =>
              setForm({
                ...form,
                payment_date: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Ghi chú"
            value={form.note}
            onChange={(e) =>
              setForm({
                ...form,
                note: e.target.value,
              })
            }
          />
        </div>

        <button className="btn-primary mt-5">Lưu thu chi</button>
      </form>

      <div className="grid grid-cols-[1.2fr_1fr] gap-5">
        <section className="card p-6">
          <h2 className="text-2xl font-black mb-5">Chi tiết giao dịch</h2>

          {data.transactions.map((t) => (
            <div
              key={t.id}
              className="border border-slate-200 rounded-2xl p-4 mb-3"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-black">{t.title}</p>
                  <p className="text-sm text-slate-500">
                    {t.project_name || "Công ty"} • {t.payment_date?.slice(0, 10)} • {t.type}
                  </p>
                </div>

                <p
                  className={`font-black ${
                    t.type === "income" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {money(t.amount)}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section className="card p-6">
          <h2 className="text-2xl font-black mb-5">Theo từng dự án</h2>

          {data.byProject.map((p) => (
            <div
              key={p.id}
              className="border border-slate-200 rounded-2xl p-4 mb-3"
            >
              <p className="font-black">{p.name}</p>

              <p className="text-sm text-slate-500 mt-1">
                Vào: {money(p.income)} • Chi: {money(p.expense)} • Phát sinh:{" "}
                {money(p.extra_expense)}
              </p>

              <p className="font-black mt-1">
                Còn:{" "}
                {money(
                  Number(p.income || 0) -
                    Number(p.expense || 0) -
                    Number(p.extra_expense || 0)
                )}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function Card({ title, value, tone }) {
  const cls = {
    green: "text-green-600",
    red: "text-red-500",
    orange: "text-orange-500",
    blue: "text-blue-600",
  }[tone];

  return (
    <div className="card p-6">
      <p className="text-slate-500 font-bold">{title}</p>
      <h2 className={`text-2xl font-black mt-3 ${cls}`}>
        {money(value || 0)}
      </h2>
    </div>
  );
}

export default DirectorFinance;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { taskApi } from "../api/taskApi";
import { useToast } from "../context/ToastContext";

function todayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
}

function AddTaskPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: todayIso(),
    priority: "Medium",
    category: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const minDate = todayIso();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Başlık boş olamaz.");
      return;
    }

    if (form.dueDate < minDate) {
      setError("Geçmiş bir tarihe görev oluşturamazsınız.");
      return;
    }

    setSubmitting(true);
    try {
      await taskApi.create({ ...form, category: form.category.trim() || null });
      toast.success("Görev oluşturuldu.");
      navigate("/tasks");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <h2 className="page-title">Yeni Görev</h2>

      <form className="task-form" onSubmit={handleSubmit}>
        <label>
          Başlık
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Görev başlığı"
            required
          />
        </label>

        <label>
          Açıklama
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="İsteğe bağlı açıklama"
            rows={3}
          />
        </label>

        <div className="form-row">
          <label>
            Son tarih
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              min={minDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Öncelik
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="Low">Düşük</option>
              <option value="Medium">Orta</option>
              <option value="High">Yüksek</option>
            </select>
          </label>
        </div>

        <label>
          Kategori <span className="optional-hint">(isteğe bağlı)</span>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Örn: İş, Okul, Kişisel"
          />
        </label>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? "Kaydediliyor..." : "Görevi Kaydet"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddTaskPage;

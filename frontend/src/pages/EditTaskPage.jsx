import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { taskApi } from "../api/taskApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";

function toDateInputValue(dateStr) {
  return new Date(dateStr).toISOString().split("T")[0];
}

function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTask() {
      setLoading(true);
      setError("");
      try {
        const task = await taskApi.getById(id);
        if (active) {
          setForm({
            title: task.title,
            description: task.description || "",
            dueDate: toDateInputValue(task.dueDate),
            isCompleted: task.isCompleted,
            priority: task.priority || "Medium",
            category: task.category || "",
          });
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTask();
    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await taskApi.update(id, { ...form, category: form.category.trim() || null });
      toast.success("Görev güncellendi.");
      navigate("/tasks");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Görev yükleniyor..." />;
  if (error && !form) return <p className="error-message">Hata: {error}</p>;

  return (
    <section className="form-page">
      <h2 className="page-title">Görevi Düzenle</h2>

      <form className="task-form" onSubmit={handleSubmit}>
        <label>
          Başlık
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Açıklama
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </label>

        <div className="form-row">
          <label>
            Son tarih
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required />
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
          <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Örn: İş, Okul, Kişisel" />
        </label>

        <label className="checkbox-label">
          <input type="checkbox" name="isCompleted" checked={form.isCompleted} onChange={handleChange} />
          Tamamlandı
        </label>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditTaskPage;

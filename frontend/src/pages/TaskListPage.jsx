import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { taskApi } from "../api/taskApi";
import TaskItem from "../components/TaskItem";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";

function TaskListPage() {
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    category: "",
    isCompleted: "",
    sortBy: "dueDate",
    descending: false,
  });

  const loadTasks = useCallback(async (activeFilters) => {
    setLoading(true);
    setError("");
    try {
      const data = await taskApi.getAll(activeFilters);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtre değiştiğinde tekrar istek atılır (arama alanında küçük bir debounce ile).
  useEffect(() => {
    const timeout = setTimeout(() => loadTasks(filters), 300);
    return () => clearTimeout(timeout);
  }, [filters, loadTasks]);

  useEffect(() => {
    taskApi.getCategories().then(setCategories).catch(() => {});
  }, [tasks.length]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = useCallback(async (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
    try {
      await taskApi.toggleCompleted(id);
    } catch (err) {
      toast.error(err.message);
      loadTasks(filters);
    }
  }, [loadTasks, filters, toast]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await taskApi.delete(id);
      toast.success("Görev silindi.");
    } catch (err) {
      toast.error(err.message);
      setTasks(previous);
    }
  }, [tasks, toast]);

  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">Görevler</h2>
        <Link to="/tasks/new" className="btn btn--primary">
          + Yeni Görev
        </Link>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Görevlerde ara..."
          className="filter-search"
        />

        <select name="priority" value={filters.priority} onChange={handleFilterChange}>
          <option value="">Tüm öncelikler</option>
          <option value="Low">Düşük</option>
          <option value="Medium">Orta</option>
          <option value="High">Yüksek</option>
        </select>

        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">Tüm kategoriler</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select name="isCompleted" value={filters.isCompleted} onChange={handleFilterChange}>
          <option value="">Tümü</option>
          <option value="false">Bekleyen</option>
          <option value="true">Tamamlanan</option>
        </select>

        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="dueDate">Son tarihe göre</option>
          <option value="priority">Önceliğe göre</option>
          <option value="title">Başlığa göre</option>
          <option value="createdDate">Oluşturulma tarihine göre</option>
        </select>
      </div>

      {error && <p className="error-message">Hata: {error}</p>}

      {loading ? (
        <LoadingSpinner label="Görevler yükleniyor..." />
      ) : tasks.length === 0 ? (
        <p className="empty-state">Kriterlere uyan görev bulunamadı.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default TaskListPage;

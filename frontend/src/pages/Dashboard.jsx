import { useEffect, useState } from "react";
import { taskApi } from "../api/taskApi";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStats() {
      setLoading(true);
      setError("");
      try {
        const data = await taskApi.getStats();
        if (active) setStats(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStats();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <LoadingSpinner label="İstatistikler yükleniyor..." />;
  if (error) return <p className="error-message">Hata: {error}</p>;

  return (
    <section>
      <h2 className="page-title">Panel</h2>
      <div className="stat-grid">
        <StatCard label="Toplam Görev" value={stats.total} accent="blue" />
        <StatCard label="Tamamlanan" value={stats.completed} accent="green" />
        <StatCard label="Bekleyen" value={stats.pending} accent="orange" />
        <StatCard label="Tamamlanma %" value={`${stats.percentageCompleted}%`} accent="purple" />
      </div>
    </section>
  );
}

export default Dashboard;

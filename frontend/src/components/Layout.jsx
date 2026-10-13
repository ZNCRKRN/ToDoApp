import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { username, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("Çıkış yapıldı.");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">ToDoApp</h1>
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Panel
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Görevler
          </NavLink>
          <NavLink to="/tasks/new" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Yeni Görev
          </NavLink>
        </nav>

        <div className="header-actions">
          {username && <span className="current-user">👤 {username}</span>}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Tema değiştir"
            title="Açık / Koyu tema"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button className="btn btn--ghost" onClick={handleLogout}>
            Çıkış
          </button>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

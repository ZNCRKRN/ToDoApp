import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      toast.success("Hoş geldin, " + form.username + "!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-page auth-page">
      <h2 className="page-title">Giriş Yap</h2>

      <form className="task-form" onSubmit={handleSubmit}>
        <label>
          Kullanıcı adı
          <input type="text" name="username" value={form.username} onChange={handleChange} required autoFocus />
        </label>

        <label>
          Şifre
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </div>
      </form>

      <p className="auth-switch">
        Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
      </p>
    </section>
  );
}

export default LoginPage;

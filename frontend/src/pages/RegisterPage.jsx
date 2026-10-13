import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.username.trim().length < 3) {
      setError("Kullanıcı adı en az 3 karakter olmalı.");
      return;
    }
    if (form.password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setSubmitting(true);
    try {
      await register(form.username, form.password);
      toast.success("Kayıt başarılı, hoş geldin!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-page auth-page">
      <h2 className="page-title">Kayıt Ol</h2>

      <form className="task-form" onSubmit={handleSubmit}>
        <label>
          Kullanıcı adı
          <input type="text" name="username" value={form.username} onChange={handleChange} required autoFocus />
        </label>

        <label>
          Şifre
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        <label>
          Şifre (tekrar)
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
        </label>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </div>
      </form>

      <p className="auth-switch">
        Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
      </p>
    </section>
  );
}

export default RegisterPage;

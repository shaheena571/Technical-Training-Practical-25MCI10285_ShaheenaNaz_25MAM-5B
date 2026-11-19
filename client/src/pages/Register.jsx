import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); // stop page from reloading
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", { name, email, password });

      // save token and user so we stay logged in
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      // show the message from backend if there is one
      setError(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Create account</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Register"}
        </button>

        <p className="small-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;

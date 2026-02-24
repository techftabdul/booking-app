import { useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (error) {
      setError(error.message || "Login failed");
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Admin Login</h2>
      <div className="form-container">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          placeholder="johndoe@example.com"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-container">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button className="form-btn" type="submit" disabled={loading}>
        {loading ? "Logging In..." : "Log In"}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
}

import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Perform login
      await login(username, password);

      // Get user info from localStorage (or you could get from context)
      const user = JSON.parse(localStorage.getItem("user"));

      // Role-based routing
      const roleRoutes = {
        user: "/user",
        admin: "/admin",
        "super-admin": "/admin", // super-admin shares admin layout
      };

      const path = roleRoutes[user.role] || "/"; // fallback to home
      navigate(path, { replace: true }); // redirect
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg p-4">
          <div className="card-body">
            <h3 className="text-center mb-4 fw-bold">Login</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
            <p className="text-center mt-3">
              Don’t have an account? <a href="/signup">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

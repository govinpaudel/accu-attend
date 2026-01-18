import React, { useState } from "react";
import api from "../../api/api";

function Signup() {
  const [userType, setUserType] = useState("");
  const [orgName, setOrgName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/accuattend/signup", {
        user_type: userType,
        org_name: orgName,
        location_name: locationName,
        username,
        password,
      });

      setSuccess(res.data.message || "Signup successful! Please login.");
      // Optional: redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.error || "Signup failed");
      } else {
        setError("Something went wrong");
      }
    }

    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-lg p-4">
          <div className="card-body">
            <h3 className="text-center mb-4 fw-bold">Sign Up</h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              {/* User Type */}
              <div className="mb-3">
                <label className="form-label">Signup As</label>
                <select
                  className="form-select"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="organization">Organization</option>
                  <option value="location">Location / Store</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Organization Name */}
              {userType === "organization" && (
                <div className="mb-3">
                  <label className="form-label">Organization Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Location Name */}
              {userType === "location" && (
                <div className="mb-3">
                  <label className="form-label">Location / Store Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Username */}
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

              {/* Password */}
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
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </div>
            </form>

            <p className="text-center mt-3">
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

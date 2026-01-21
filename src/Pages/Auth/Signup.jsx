import React, { useState } from "react";
import api from "../../api/api";

function Signup() {
  const defaultData = {
    role_id: 0,
    org_id: 0,
    loc_id: 0,
    username: "",
    password: ""
  }
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData=()=>{

  }
  
  
  const handleChange = (e) => {
    console.log(e.target.name, ' : ', e.target.value)
    setData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    console.log(data);

  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/signup", data);

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
                  name="role_id"
                  value={data.role_id}
                  onChange={handleChange}
                  required
                >
                  <option value={0}>Select Type</option>
                  <option value={2}>org-admin</option>
                  <option value={3}>loc-admin</option>
                  <option value={4}>loc-user</option>
                </select>
              </div>

              {/* Organization Name */}
              {data.role_id === 2 && (
                <div className="mb-3">
                  <label className="form-label">Organization Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.org_id}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {/* Location Name */}
              {data.role_id === "3" && (
                <div className="mb-3">
                  <label className="form-label">Location Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="loc_id"
                    value={data.loc_id}
                    onChange={handleChange}
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
                  name="username"
                  value={username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={handleChange}
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

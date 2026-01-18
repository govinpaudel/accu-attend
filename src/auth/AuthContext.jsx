import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // --------- User State ---------
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.warn("Failed to parse user from localStorage:", err);
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // --------- LOGIN ---------
  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.post("/login", { username, password });
      console.log(res.data);
      const {id, role, org_id } = res.data.data;

      // Store tokens in localStorage
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      // Save user info
      const userInfo = { id, role, org_id };
      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);

      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // --------- LOGOUT ---------
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // --------- REFRESH ACCESS TOKEN ---------
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return false;

    try {
      const res = await api.post("/refreshtoken", { refresh_token: refreshToken });
      const { access_token } = res.data.data;

      localStorage.setItem("access_token", access_token);
      return true;
    } catch (err) {
      logout();
      return false;
    }
  };

  // --------- AXIOS INTERCEPTOR ---------
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Try refreshing token
          const success = await refreshAccessToken();
          if (success) {
            // Retry original request
            const config = error.config;
            return api(config);
          } else {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --------- Hook to use Auth Context ---------
export const useAuth = () => useContext(AuthContext);

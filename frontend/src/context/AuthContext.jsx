import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: decoded.id,
          name: decoded.name,
          role: decoded.role,
        });
      } catch (err) {
        console.error("Failed to decode token", err);
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);

    localStorage.setItem("token", res.token);

    const decoded = JSON.parse(atob(res.token.split(".")[1]));

    setUser({
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    });

    return decoded;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

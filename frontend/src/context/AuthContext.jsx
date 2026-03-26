import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ Auto login check
  useEffect(() => {

    const checkUser = async () => {
      try {

        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:5001/api/auth/profile",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        setUser(res.data.user);

      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

  }, []);

  // login function
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
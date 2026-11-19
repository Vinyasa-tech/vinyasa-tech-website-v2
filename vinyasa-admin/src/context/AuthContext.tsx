import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";
import { setAuthToken } from "../services/authToken";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
  updateAdmin: (admin: Partial<Admin>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);

  // Login
  const login = useCallback(
    (newToken: string, newAdmin: Admin) => {
      setAuthToken(newToken);
      setToken(newToken);
      setAdmin(newAdmin);
    },
    []
  );

  // Logout
  const logout = useCallback(() => {
    setAuthToken(null);
    setToken(null);
    setAdmin(null);
  }, []);

  // Update admin details without recreating this function
  const updateAdmin = useCallback(
    (updatedData: Partial<Admin>) => {
      setAdmin((previous) =>
        previous ? { ...previous, ...updatedData } : null
      );
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: Boolean(token),
        login,
        logout,
        updateAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom authentication hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
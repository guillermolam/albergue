import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "guest" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for saved user session
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Mock authentication - in production, this would call your backend
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple mock validation
        if (email && password.length >= 6) {
          const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split("@")[0],
            avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=00AB39&color=fff`,
            role: email.includes("admin") ? "admin" : "guest",
          };
          setUser(mockUser);
          resolve();
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

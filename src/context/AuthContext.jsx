import { createContext, useContext, useMemo, useState } from "react";
import { mockUsers } from "../data/mockUsers";

const AuthContext = createContext(null);
const USERS_KEY = "cr-users";
const USERS_SEED_VERSION_KEY = "cr-users-seed-version";
const USERS_SEED_VERSION = "2";
const VALID_ROLES = new Set(["student", "faculty", "warden", "admin"]);

function getInitialUsers() {
  const storedVersion = localStorage.getItem(USERS_SEED_VERSION_KEY);
  if (storedVersion !== USERS_SEED_VERSION) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    localStorage.setItem(USERS_SEED_VERSION_KEY, USERS_SEED_VERSION);
    return mockUsers;
  }

  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    const valid = Array.isArray(parsed) && parsed.every(
      (u) => u?.id && u?.name && u?.email && u?.role && VALID_ROLES.has(u.role) && u?.password
    );
    if (valid) return parsed;
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  localStorage.setItem(USERS_SEED_VERSION_KEY, USERS_SEED_VERSION);
  return mockUsers;
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem("cr-role") || "");
  const [userName, setUserName] = useState(() => localStorage.getItem("cr-user-name") || "");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("cr-user-email") || "");
  const [users, setUsers] = useState(getInitialUsers);

  const login = (nextRole, user = null) => {
    localStorage.setItem("cr-role", nextRole);
    setRole(nextRole);

    const resolvedName = user?.name || "";
    const resolvedEmail = user?.email || "";
    localStorage.setItem("cr-user-name", resolvedName);
    localStorage.setItem("cr-user-email", resolvedEmail);
    setUserName(resolvedName);
    setUserEmail(resolvedEmail);
  };

  const logout = () => {
    localStorage.removeItem("cr-role");
    localStorage.removeItem("cr-user-name");
    localStorage.removeItem("cr-user-email");
    setRole("");
    setUserName("");
    setUserEmail("");
  };

  const registerUser = ({ name, email, role: nextRole, department = "", hostel = "", password }) => {
    const currentUsers = users;
    const nextId = currentUsers.length > 0 ? Math.max(...currentUsers.map((u) => Number(u.id))) + 1 : 1;
    const newUser = {
      id: nextId,
      name,
      email,
      role: nextRole.toLowerCase(),
      password,
      ...(department ? { department } : {}),
      ...(hostel ? { hostel } : {})
    };

    const updated = [...currentUsers, newUser];
    setUsers(updated);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    return newUser;
  };

  const value = useMemo(
    () => ({ role, userName, userEmail, users, login, logout, registerUser }),
    [role, userName, userEmail, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

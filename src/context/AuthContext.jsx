import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user || null;
  const role = user?.user_metadata?.role || "";
  const userName = user?.user_metadata?.name || "";
  const userEmail = user?.email || "";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const registerUser = async ({ name, email, role: nextRole, department = "", hostel = "", password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: nextRole.toLowerCase(),
          department,
          hostel,
        },
      },
    });
    if (error) throw error;
    return data.user;
  };

  const createManagedUser = async ({ name, email, role: nextRole, department = "", hostel = "", password }) => {
    const provisionUrl = import.meta.env.VITE_ADMIN_PROVISION_URL;

    if (!provisionUrl) {
      throw new Error("Admin provisioning endpoint is not configured. Set VITE_ADMIN_PROVISION_URL first.");
    }

    if (!session?.access_token) {
      throw new Error("You must be signed in as an admin to create managed accounts.");
    }

    const response = await fetch(provisionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: nextRole.toLowerCase(),
        department: department.trim(),
        hostel: hostel.trim(),
        password,
      }),
    });

    let payload = {};
    try {
      payload = await response.json();
    } catch {
      payload = {};
    }

    if (!response.ok) {
      throw new Error(payload.error || payload.message || "Failed to create managed user.");
    }

    return payload.user || payload;
  };

  const value = {
    session,
    user,
    role,
    userName,
    userEmail,
    loading,
    login,
    logout,
    registerUser,
    createManagedUser,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

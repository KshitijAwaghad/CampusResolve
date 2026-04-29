import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ManagedRole = "faculty" | "warden" | "admin";

function jsonResponse(body: Record<string, unknown>, status = 200, origin?: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Access-Control-Allow-Origin": origin || "*",
      "Content-Type": "application/json",
    },
  });
}

function isAllowedRole(role: string): role is ManagedRole {
  return ["faculty", "warden", "admin"].includes(role);
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN");

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Origin": allowedOrigin || origin || "*",
      },
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, allowedOrigin || origin);
  }

  if (allowedOrigin && origin && origin !== allowedOrigin) {
    return jsonResponse({ error: "Origin not allowed." }, 403, allowedOrigin);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return jsonResponse(
      { error: "Missing Supabase function secrets. Check SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY." },
      500,
      allowedOrigin || origin
    );
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Missing authorization header." }, 401, allowedOrigin || origin);
  }

  const callerClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const {
    data: { user: caller },
    error: callerError,
  } = await callerClient.auth.getUser();

  if (callerError || !caller) {
    return jsonResponse({ error: "Invalid or expired admin session." }, 401, allowedOrigin || origin);
  }

  const callerRole = String(caller.app_metadata?.role || caller.user_metadata?.role || "").toLowerCase();
  if (callerRole !== "admin") {
    return jsonResponse({ error: "Only admins can create managed accounts." }, 403, allowedOrigin || origin);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400, allowedOrigin || origin);
  }

  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const role = String(payload.role || "").trim().toLowerCase();
  const department = String(payload.department || "").trim();
  const hostel = String(payload.hostel || "").trim();
  const password = String(payload.password || "");

  if (!name) {
    return jsonResponse({ error: "Name is required." }, 400, allowedOrigin || origin);
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ error: "A valid email address is required." }, 400, allowedOrigin || origin);
  }

  if (!isAllowedRole(role)) {
    return jsonResponse({ error: "Role must be faculty, warden, or admin." }, 400, allowedOrigin || origin);
  }

  if (password.length < 6) {
    return jsonResponse({ error: "Password must be at least 6 characters." }, 400, allowedOrigin || origin);
  }

  if (role === "warden" && !hostel) {
    return jsonResponse({ error: "Hostel assignment is required for warden accounts." }, 400, allowedOrigin || origin);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      role,
      department: role === "faculty" ? department : "",
      hostel: role === "warden" ? hostel : "",
      created_by_admin: caller.email || caller.id,
    },
    app_metadata: {
      role,
      managed_account: true,
    },
  });

  if (error) {
    return jsonResponse({ error: error.message }, 400, allowedOrigin || origin);
  }

  return jsonResponse(
    {
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role,
      },
    },
    200,
    allowedOrigin || origin
  );
});

# Admin User Provisioning Setup

This project now includes an admin-only user creation screen at `/admin/users`.

That screen calls a Supabase Edge Function:

- Function name: `create-managed-user`
- Source: `supabase/functions/create-managed-user/index.ts`

## What this solves

Public registration is now student-only.

Faculty, warden, and admin accounts should be created only by an existing admin through a trusted backend flow. The Edge Function handles that securely with the Supabase service role key.

## Frontend env var

Add this to `.env.local`:

```env
VITE_ADMIN_PROVISION_URL=https://YOUR_PROJECT_REF.functions.supabase.co/create-managed-user
```

Example:

```env
VITE_ADMIN_PROVISION_URL=https://nrhrsznclxuxwnmzcrdq.functions.supabase.co/create-managed-user
```

## Edge Function secrets

Set these secrets for the function:

```bash
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
supabase secrets set SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
supabase secrets set ALLOWED_ORIGIN=http://localhost:5173
```

For production, set `ALLOWED_ORIGIN` to your real frontend URL instead.

## Deploy steps

1. Install and log in to the Supabase CLI.
2. Link the repo to your Supabase project.
3. Set the function secrets.
4. Deploy the function.

Commands:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
supabase secrets set SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
supabase secrets set ALLOWED_ORIGIN=http://localhost:5173
supabase functions deploy create-managed-user
```

The function itself still verifies the caller and rejects non-admin users.

## Required Supabase Auth setup

You need at least one existing admin account before this screen can be used.

Create that first admin manually from the Supabase dashboard or a one-time script, and make sure the user has:

- `user_metadata.role = "admin"`
- preferably `app_metadata.role = "admin"` too

The function checks the caller role in this order:

1. `app_metadata.role`
2. `user_metadata.role`

## How the function authorizes requests

The frontend sends the current admin's access token in the `Authorization` header.

The function:

1. validates that token with a normal Supabase client
2. confirms the caller role is `admin`
3. uses the service role key to create the new managed user

## Payload expected by the function

POST body:

```json
{
  "name": "Asha Mehta",
  "email": "asha@example.edu",
  "role": "faculty",
  "department": "Computer Science",
  "hostel": "",
  "password": "TempPass123"
}
```

Rules:

- `role` must be `faculty`, `warden`, or `admin`
- `department` is required for `faculty`
- `hostel` is required for `warden`
- `password` must be at least 6 characters

## What the function stores

The new user is created with:

- `user_metadata.name`
- `user_metadata.role`
- `user_metadata.department`
- `user_metadata.hostel`
- `app_metadata.role`
- `app_metadata.managed_account = true`

## Important security note

This only secures account creation. You should still add database RLS policies so each role can only read and modify the data it is supposed to access.

# Campus Resolve

A full-stack, AI-powered university grievance management system built with React, Supabase, and Google Gemini.

## How to Run Locally

Because your database (Supabase), AI engine (Gemini), and Admin backend (Edge Functions) are entirely hosted in the cloud, running this project on your machine is incredibly simple. You do not need to boot up any databases or docker containers.

Whenever you restart your PC and want to work on this project again, simply follow these two steps:

1. **Open the Terminal**
   Open this project folder in VS Code, and open a new terminal window (`Ctrl + ~`).

2. **Start the Development Server**
   Run the following command:
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Once the terminal says it's ready, `Ctrl + Click` the local link (usually `http://localhost:5173`) to open the app in your browser.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Database & Auth:** Supabase (Postgres)
- **AI Integration:** Google Gemini API
- **Backend:** Supabase Edge Functions (Deno)

## Troubleshooting
If the app ever fails to connect to the database or AI, ensure your `.env.local` file is still in the root of your project directory and contains all your API keys.

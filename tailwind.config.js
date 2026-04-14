/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eaf9ff",
          100: "#cdf2ff",
          200: "#9de5ff",
          300: "#63d2ff",
          400: "#2db6ff",
          500: "#0d95ff",
          600: "#006fe0",
          700: "#0458b3",
          800: "#0a4a91",
          900: "#103f78"
        },
        accent: {
          400: "#b5ff56",
          500: "#97f22d",
          600: "#79c71f"
        }
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15, 23, 42, 0.15)",
        glow: "0 0 0 1px rgba(13,149,255,0.35), 0 12px 30px rgba(13,149,255,0.25)"
      },
      fontFamily: {
        sans: ["Space Grotesk", "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"]
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      animation: {
        float: "float 4.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

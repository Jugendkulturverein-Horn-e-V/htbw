/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md,html,js}", "./_site/**/*.html"],
  theme: {
    extend: {
      colors: {
        htbw: {
          cream: "#f5edda",
          green: "#215733",
          "green-dark": "#1a4528",
          pink: "#f1698c",
          "pink-dark": "#e04d73",
          brown: "#5c4a3d",
          "brown-light": "#8b7355",
          black: "#2b2b2b",
        },
      },
      fontFamily: {
        heading: ["Frente H1", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 10s ease-in-out infinite",
        wiggle: "wiggle 0.5s ease-in-out",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        sticker: "4px 4px 0 rgba(33, 87, 51, 0.3)",
        "sticker-hover": "6px 6px 0 rgba(33, 87, 51, 0.4)",
      },
    },
  },
  plugins: [],
};

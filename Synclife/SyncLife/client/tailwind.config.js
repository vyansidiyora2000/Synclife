/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mainTag: ["Chelsea Market", "sans-serif"],
        subTag: ["Truculenta", "sans-serif"],
        danceTag: ["Caveat", "cursive"],
        allTag: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      activityP: "880px",
      userP: "820px",
      habitP:"520px",
      galaxyF: "281px",
      moodP: "497px",
      moodE:"400px",
      signup:"380px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },

  plugins: [],
};

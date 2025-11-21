module.exports = {
  content: ["./**/*.{html,js}", "!./node_modules/**/*"],
  theme: {
    extend: {
      fontFamily: {
        walker: ["Walker_Knight", "serif"],
        lato: ["Lato", "sans-serif"],
        crimson: ["CrimsonText", "serif"],
      },
      colors: {
        black: "#1C1C1C",
        white: "#FEFEFE",
        background: "#FAFAFA",
        accent: "#92122E",
        grey: {
          light: "#EAEAEA",
          medium: "#B8B8B8",
          dark: "#656565",
        },
      },
    },
  },
  plugins: [],
};

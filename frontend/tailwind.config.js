/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/dist/esm/**/*.mjs",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00008B",
        primarytwo: "#001F3F",
        softBorder: "#E6E8FA", // lavender blush
        buttonBackground: "#87CEEB",
        softPurple: "#9370DB", // medium purple
        midnightTeal: "#006D77", // deep teal
        lightBlack: "#0000005f",
        darkRed: "#a70819",
        Black: "#000000",
        DimGray: "#696969",
        Gray: "#808080",
        DarkGray: "#A9A9A9",
        Silver: "#C0C0C0",
        LightGray: "#D3D3D3",
        Gainsboro: "#DCDCDC",
        SlateGray: "#708090",
        DarkSlateGray: "#2F4F4F",
        DimSlateGray: "#2F4F4F",
        MidnightBlue: "#191970",
        DarkBlue: "#00008B",

        DarkGreen: "#006400",
        Forestreen: "#228B22",
        DarkOliveGreen: "#556B2F",
        DarkeaGreen: "#8FBC8F",
        DarCyan: "#008B8B",
        Teal: "#008080",
        Darkagenta: "#8B008B",
      },
      fontFamily: {
        montesorat: ["Montserrat"],
        rubik: ["Rubik"],
        nunito: ["Nunito"],
        ubuntu: ["Ubuntu"],
      },
      screens: {
        "1000px": "1050px",
        "1100px": "1110px",
        "800px": "800px",
        "900px": "900px",
        "1300px": "1300px",
        "400px": "400px",
        "600px": "600px",
        "700px": "700px",
      },
      fontSize: {
        "heading-sm": ["18px", "1.2"], // Small screen heading
        "heading-md": ["22px", "1.2"], // Medium screen heading
        "heading-lg": ["25px", "1.2"], // Large screen heading
        "heading-xl": ["28px", "1.2"], // Extra-large screen heading
        "heading-2xl": ["32px", "1.2"], // Double extra-large screen heading
        "para-sm": ["16px", "1.5"], // Small screen paragraph
        "para-md": ["17px", "1.5"], // Medium screen paragraph
        "para-lg": ["17px", "1.5"], // Large screen paragraph
        "para-xl": ["19px", "1.5"], // Extra-large screen paragraph
        "para-2xl": ["19px", "1.5"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};

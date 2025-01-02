/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Para asegurarse de que Tailwind escanee todos los archivos de tu proyecto
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          800: "#2F0C05",
        },
        whiteTextPlatyfa: "#FFFCEB",
        orangePlatyfa: "#EE7736",
        brownCardInformation: "#250900",
        principalCardColor: "#ECBC63",
      },
    }, // Aquí puedes extender los estilos si es necesario más adelante
  },
  plugins: [],
};

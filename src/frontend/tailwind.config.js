/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b35',      // Naranja principal
        secondary: '#ff8c42',    // Naranja secundario
        success: '#10b981',      // Verde para éxito
        danger: '#ef4444',       // Rojo para peligro
        background: '#fff8f3',   // Fondo naranja muy claro
      },
    },
  },
  plugins: [],
}

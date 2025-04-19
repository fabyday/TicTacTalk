/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,jsx,tsx}", 
      "./public/index.html"
    ],
    theme: {
   
    },
    plugins: [
        require('tailwind-scrollbar'),
    ],
}
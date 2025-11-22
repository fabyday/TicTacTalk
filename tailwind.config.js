/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,jsx,tsx}", 
      "./public/index.html"
    ],
    theme: {


      // extend:{
      //   animation : {
      //     wave : "wave 15s ease-in-out infinite"
      //   },
      //   keyframes:{
      //     wave : {
      //       '0%, 100%': { transform: 'translate(0px,0px) scale(1.2)' },
      //       '25%': { transform: 'translate(5px,-5px) scale(1.2)' },
      //       '50%': { transform: 'translate(-5px,5px) scale(1.2)' },
      //       '75%': { transform: 'translate(5px,5px) scale(1.2)' },
      //     }
      //   }
      // }
   
    },
    plugins: [
        require('tailwind-scrollbar'),
    ],
}
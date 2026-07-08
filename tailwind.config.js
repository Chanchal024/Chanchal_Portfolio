// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                chan1: ['YourFontName', 'sans-serif'],
            },
        },
    },
    plugins: [
         require('tailwind-scrollbar-hide')
    ],
}

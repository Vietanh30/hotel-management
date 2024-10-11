/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["EB Garamond", "sans-serif"], // Đặt Poppins làm font mặc định
        garamond: ["EB Garamond"],
        inter: ["Inter"],
        taprom: ["Taprom"],
      },
    },
  },
  plugins: [],
};

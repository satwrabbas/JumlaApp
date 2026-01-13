/** @type {import('tailwindcss').Config} */
module.exports = {
  // حدد المسارات التي تحتوي على ملفات المشروع
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./App.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
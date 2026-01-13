module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // تأكد أن reanimated دائماً في آخر القائمة
      "react-native-reanimated/plugin",
    ],
  };
};
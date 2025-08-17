// eslint.config.js
export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    rules: {
      // Add your rules here, for example:
      semi: "error",
      quotes: ["error", "double"],
      // ...add more as needed
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
  },
];

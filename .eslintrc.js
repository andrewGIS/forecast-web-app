module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/recommended"],
  plugins: ["vue"],
  rules: {
    "vue/script-setup-uses-vars": 0,
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: {
          max: 4,
        },
        multiline: {
          max: 1,
        },
      },
    ],
  },
};

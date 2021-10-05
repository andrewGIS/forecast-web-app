module.exports = {
    "env": {
        "node": true,
    },

    "extends": [
      "eslint:recommended",
      "plugin:vue/recommended"
    ],
    // "parserOptions": {
    //     "ecmaVersion": 12,
    //     "sourceType": "module"
    // },
    "plugins": [
        "vue"
    ],
    "rules": {
      'vue/script-setup-uses-vars': 0
    }
};

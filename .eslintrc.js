module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "semi": ["error", "always"],
        "indent": ["error", 4],
        "comma-spacing": ["error", { "before": false, "after": true }]
    },
    "globals": {
        "describe": "readonly",
        "test": "readonly"
    }
};
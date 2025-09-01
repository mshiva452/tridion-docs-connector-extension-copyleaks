import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";

import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";

export default [{
    ignores: ["**/node_modules", "**/*.js", "**/*.jsx", "**/*.json", "**/*.d.ts"],
}, {
    files: ['**/*.{tsx,ts}'],
    plugins: {
        react,
        prettier,
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: ["tsconfig.json"],
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "import/no-default-export": "off",
        "class-methods-use-this": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-floating-promises": "off",
    },
}];
import react from "eslint-plugin-react";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import _import from "eslint-plugin-import";
import jest from "eslint-plugin-jest";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "labo/lib/geojson-vt-dev.js",
      "labo/lib/fastcorner.js",
      "src/store/initialState/",
      "build/**/*",
    ],
  },
  ...compat.extends("prettier", "eslint:recommended"),
  {
    plugins: {
      react,
      "jsx-a11y": jsxA11Y,
      import: fixupPluginRules(_import),
      jest,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
      parser: babelParser,
      ecmaVersion: 8,
      sourceType: "module",
      parserOptions: {
        requireConfigFile: false,
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
          classes: true,
          jsx: true,
        },
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
];

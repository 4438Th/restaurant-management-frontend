import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    files: ["next.config.js", "postcss.config.js", "tailwind.config.ts"],
    languageOptions: {
      sourceType: "commonjs",
    },
    rules: {
      "no-undef": "off",
    },
  },
];

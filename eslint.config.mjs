import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // This silences the "unused vars" warnings
      "@typescript-eslint/no-unused-vars": "off",
      // This silences the "any type" warnings
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
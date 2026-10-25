import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Third-party component kept verbatim from 21st.dev; it relies on patterns
  // the React Compiler lint rules flag but that are safe at runtime.
  {
    files: ["components/ui/doodle-crew-footer.tsx"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
    },
    linterOptions: { reportUnusedDisableDirectives: "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

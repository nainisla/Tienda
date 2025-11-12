import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("../backend/cert.key"),
      cert: fs.readFileSync("../backend/cert.crt"),
    },
    port: 5173,
  },
  test: {
    globals: true, // Permite usar 'describe', 'it', 'expect' globalmente (como Jest)
    environment: "jsdom", // 👈 AHORA EN LA UBICACIÓN CORRECTA
    setupFiles: "./tests/setupTests.js", // Carga los matchers de @testing-library/jest-dom
    // Opcional: Para el reporte de cobertura
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});

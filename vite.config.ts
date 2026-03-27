/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
base: "/Tinder-for-Animal-Adoption-Soi-Dog-/",
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 8000
  },
  preview: {
    host: "127.0.0.1",
    port: 8000
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"]
  }
});

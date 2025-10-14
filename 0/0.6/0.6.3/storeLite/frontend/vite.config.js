import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "tu-organizacion",
      project: "storelite-frontend",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});

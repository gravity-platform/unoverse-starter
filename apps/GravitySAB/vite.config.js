import { defineConfig, loadEnv } from "vite";
import preact from "@preact/preset-vite";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env from root .env file (monorepo) - for local development
  const fileEnv = loadEnv(mode, path.resolve(__dirname, "../.."), "VITE_");

  // In Docker builds, env vars come from process.env (set via Dockerfile ARG/ENV)
  // Merge both sources, preferring process.env (Docker) over file env (local)
  const env = {
    VITE_AUTH_ISSUER: process.env.VITE_AUTH_ISSUER || fileEnv.VITE_AUTH_ISSUER,
    VITE_AUTH_CLIENT_ID: process.env.VITE_AUTH_CLIENT_ID || fileEnv.VITE_AUTH_CLIENT_ID,
    VITE_AUTH_AUDIENCE: process.env.VITE_AUTH_AUDIENCE || fileEnv.VITE_AUTH_AUDIENCE,
    VITE_API_URL: process.env.VITE_API_URL || fileEnv.VITE_API_URL,
    VITE_WEBSOCKET_URL: process.env.VITE_WEBSOCKET_URL || fileEnv.VITE_WEBSOCKET_URL,
  };

  return {
    plugins: [preact()],
    define: {
      // Make VITE_ env vars available at build time
      "import.meta.env.VITE_AUTH_ISSUER": JSON.stringify(env.VITE_AUTH_ISSUER),
      "import.meta.env.VITE_AUTH_CLIENT_ID": JSON.stringify(env.VITE_AUTH_CLIENT_ID),
      "import.meta.env.VITE_AUTH_AUDIENCE": JSON.stringify(env.VITE_AUTH_AUDIENCE),
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
      "import.meta.env.VITE_WEBSOCKET_URL": JSON.stringify(env.VITE_WEBSOCKET_URL),
    },
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment",
    },
    resolve: {
      alias: {
        react: "preact/compat",
        "react-dom": "preact/compat",
        "react/jsx-runtime": "preact/jsx-runtime",
      },
      dedupe: ["react", "react-dom", "zustand", "preact"],
    },
    optimizeDeps: {
      include: ["zustand"],
      exclude: ["@gravity-platform/gravity-client"], // Don't pre-bundle - load fresh on rebuild
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
      },
    },
    server: {
      port: 3007,
      host: "0.0.0.0",
    },
  };
});

import path from "node:path";
import react from "@vitejs/plugin-react";
import {
  createLogger,
  defineConfig,
} from "vite";

const logger = createLogger();

const loggerError = logger.error;

logger.error = (msg, options) => {
  if (
    options?.error
      ?.toString()
      .includes(
        "CssSyntaxError: [postcss]"
      )
  ) {
    return;
  }

  loggerError(msg, options);
};

export default defineConfig({
  customLogger: logger,

  plugins: [
    react(),
  ],

  server: {
    host: "::",
    port: 3000,
    cors: true,

    headers: {
      "Cross-Origin-Embedder-Policy":
        "credentialless",
    },

    fs: {
      strict: true,

      allow: [
        path.resolve(__dirname),

        path.join(
          path.resolve(
            __dirname,
            "../.."
          ),
          "node_modules"
        ),
      ],
    },
  },

  resolve: {
    extensions: [
      ".jsx",
      ".js",
      ".tsx",
      ".ts",
      ".json",
    ],

    alias: {
      "@": path.resolve(
        __dirname,
        "./src"
      ),
    },

    dedupe: [
      "react",
      "react-dom",
    ],
  },

  build: {
    rollupOptions: {
      external: [
        "@babel/parser",
        "@babel/traverse",
        "@babel/generator",
        "@babel/types",
      ],
    },
  },
});
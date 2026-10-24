import { defineConfig, mergeConfig } from "vitest/config";
import base from "./vitest.config.js";

const config = mergeConfig(base, defineConfig({ test: {
  fileParallelism: false,
  maxWorkers: 1,
  maxConcurrency: 1,
  env: { HTMLNEXT_BROWSER_TEST: "1" },
  hookTimeout: 60_000,
  testTimeout: 60_000,
} }));
config.test!.include = ["tests/browser.test.ts", "tests/client-navigation.test.ts"];
export default config;

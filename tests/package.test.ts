import { execFileSync, spawn } from "node:child_process";
import { lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("..", import.meta.url));
const repositoryLicense = readFileSync(join(root, "LICENSE"), "utf8");
const workspace = mkdtempSync(join(tmpdir(), "htmlkit-package-consumer-"));
const useCommandShell = process.platform === "win32";
const componentsPackage = "@nextwebwg/html-next";
afterAll(() => rmSync(workspace, { recursive: true, force: true }), 60_000);
function pack(): string {
  const output = execFileSync("corepack", ["pnpm", "pack", "--pack-destination", workspace],
    { cwd: root, encoding: "utf8", shell: useCommandShell }).trim().split("\n").at(-1)!;
  return isAbsolute(output) ? output : join(workspace, output);
}
function runBin(consumer: string, name: string, args: readonly string[] = []): string {
  const bin = join(consumer, "node_modules/.bin", useCommandShell ? `${name}.cmd` : name);
  if (!useCommandShell) expect(lstatSync(bin).isSymbolicLink()).toBe(true);
  return execFileSync(bin, args, { cwd: consumer, encoding: "utf8", shell: useCommandShell });
}

describe("standalone package contract", () => {
  it("builds an application and serves it through the installed HTMLKit CLI", async () => {
    const consumer = join(workspace, "htmlkit-consumer");
    mkdirSync(join(consumer, "app/pages"), { recursive: true });
    mkdirSync(join(consumer, "app/layouts"), { recursive: true });
    writeFileSync(join(consumer, "package.json"), JSON.stringify({ name: "htmlkit-consumer", private: true, type: "module" }));
    execFileSync("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund", pack()], { cwd: consumer, shell: useCommandShell });
    writeFileSync(join(consumer, "htmlkit.config.ts"), 'import { defineConfig } from "@threadlabs/htmlkit"; export default defineConfig({ base: "/packed/" });');
    writeFileSync(join(consumer, "app/layouts/default.html"), '<link rel="component" href="@threadlabs/htmlkit/components/nav.html"><template component="packed-shell"><defs><prop name="navigation" type="list(object({ href: string, label: string, current: string, depth: number, pageName: string }))" required>Links</prop><title>Layout default</title></defs><main><hk-nav from:items="$navigation"></hk-nav><slot name="page"></slot></main></template>');
    writeFileSync(join(consumer, "app/layouts/default.server.ts"), 'export const load = async ({ navigation }) => ({ props: { navigation: await navigation() } });');
    writeFileSync(join(consumer, "app/pages/01.index.html"), '<meta name="hk:page" content="packed-page"><template component="packed-label"><strong>Packaged helper</strong></template><template component="packed-page"><defs><prop name="label" type="string" required>Label</prop><title>{$label}</title></defs><section><h1 $value="$label"></h1><packed-label></packed-label></section></template>');
    writeFileSync(join(consumer, "app/pages/01.index.server.ts"), 'export const load = () => ({ props: { label: "Installed platform" } });');
    const installed = join(consumer, "node_modules/@threadlabs/htmlkit");
    const output = runBin(consumer, "htmlkit", ["build"]);
    expect(output).toContain("Generated 1 pages");
    const html = readFileSync(join(consumer, "dist/index.html"), "utf8");
    expect(html).toContain("Installed platform");
    expect(html).toContain(">Installed platform</title>");
    expect(html).toContain('data-component="packed-shell"');
    expect(html).toContain("Packaged helper");
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('href="/packed/"');
    expect(html).toContain('src="/packed/_htmlkit/');
    expect(JSON.parse(readFileSync(join(installed, "package.json"), "utf8")).dependencies[componentsPackage]).not.toContain("workspace:");
    expect(readFileSync(join(installed, "LICENSE"), "utf8")).toBe(repositoryLicense);
    const entry = join(consumer, "platform-types.ts");
    writeFileSync(entry, 'import { defineConfig, type Application, type ComponentBindingModule, type EndpointHandler, type LoadContext, type LoaderResult, type Middleware, type RouteInput, type ServerReader, type ServerReaders, type ServerReadContext } from "@threadlabs/htmlkit"; import type { ServerApplication } from "@threadlabs/htmlkit/server"; export const config = defineConfig({ routes: [] satisfies RouteInput[] }); export const reader = { load: (id, context) => context.phase === "build" ? id : context.cookies.get("user") ?? id } satisfies ServerReader<string, string>; export type PublicTypes = [Application, ComponentBindingModule, LoadContext, LoaderResult, EndpointHandler, Middleware, ServerApplication, ServerReaders, ServerReadContext];');
    execFileSync("corepack", ["pnpm", "exec", "tsc", "--ignoreConfig", "--noEmit", "--strict", "--skipLibCheck", "--target", "ES2023", "--module", "NodeNext", "--moduleResolution", "NodeNext", entry], { cwd: root, shell: useCommandShell });

    // The built server runs on Node from the installed packages; a resolve hook fails if anything loads Vite.
    writeFileSync(join(consumer, "app/pages/account.html"), '<template component="packed-account"><defs><prop name="user" type="string" required>User</prop><meta name="hk:render" content="server"></defs><p>Hello {$user}</p></template>');
    writeFileSync(join(consumer, "app/pages/account.server.ts"), 'export const load = ({ cookies }) => ({ props: { user: cookies.get("user") ?? "guest" } });');
    mkdirSync(join(consumer, "app/api"));
    writeFileSync(join(consumer, "app/api/time.server.ts"), 'export const GET = () => Response.json({ ok: true });');
    writeFileSync(join(consumer, "no-vite.mjs"), 'import { registerHooks } from "node:module"; registerHooks({ resolve(specifier, context, next) { if (/^vite(?:\\/|$)/.test(specifier)) throw new Error(`start loaded ${specifier}`); return next(specifier, context); } });');
    expect(runBin(consumer, "htmlkit", ["build"])).toContain("Generated 1 pages");
    const start = spawn(process.execPath, ["--import", "./no-vite.mjs", join(installed, "dist/cli.js"), "start", "--port", "0"], { cwd: consumer });
    try {
      const url = await new Promise<string>((done, reject) => {
        let output = "";
        start.stdout.on("data", (chunk: Buffer) => { output += chunk; const match = /HTMLKit start: (\S+)/.exec(output); if (match) done(match[1]!); });
        start.stderr.on("data", (chunk: Buffer) => { output += chunk; });
        start.once("exit", code => reject(new Error(`htmlkit start exited (${code}): ${output}`)));
      });
      expect(url).toMatch(/\/packed\/$/);
      expect(await (await fetch(`${url}account/`, { headers: { cookie: "user=ada" } })).text()).toContain("Hello ada");
      expect(await (await fetch(`${url}api/time`)).json()).toEqual({ ok: true });
      expect(await (await fetch(url)).text()).toContain("Installed platform");
    } finally { start.kill(); }
  }, 180_000);
});

import { describe, expect, it, vi } from "vitest";

// Access injectMark and generateMark indirectly by testing the observable behavior
// of the uniqueMark plugin via injectMarkInAsset using the plugin's generateBundle hook.

// Since injectMark is not exported, we test it via string patterns that the plugin
// is expected to replace. We use a spy on the plugin's generateBundle hook.

// We need to test the internal functions via module-level test of the regex patterns.
// Instead, we test the exported uniqueMark plugin's behavior end-to-end.

vi.mock("node:child_process", async importOriginal => {
  const actual = await importOriginal<typeof import("node:child_process")>();
  return { ...actual, execSync: vi.fn().mockReturnValue(Buffer.from("abc1234")) };
});

vi.mock("node:fs", async importOriginal => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return { ...actual, readFileSync: vi.fn().mockReturnValue(JSON.stringify({ version: "2.0.0" })) };
});

describe("uniqueMark plugin", async () => {
  const { uniqueMark } = await import("./unique-mark");

  it("creates a Vite plugin with correct name", () => {
    const plugin = uniqueMark();
    expect(plugin.name).toBe("vite-plugin-unique-mark");
  });

  it("applies only during build", () => {
    const plugin = uniqueMark();
    expect(plugin.apply).toBe("build");
  });

  it("enforces post-processing order", () => {
    const plugin = uniqueMark();
    expect(plugin.enforce).toBe("post");
  });

  it("uses custom placeholder when provided", () => {
    const plugin = uniqueMark({ placeholder: "my-version" });
    expect(plugin.name).toBe("vite-plugin-unique-mark");
    // The placeholder is internal state; we verify it's accepted without error
  });

  it("injects mark into HTML assets via generateBundle", () => {
    const plugin = uniqueMark();
    if (typeof plugin.configResolved === "function") {
      // @ts-expect-error minimal config mock
      plugin.configResolved({ root: "/project" });
    }

    const bundle: Record<string, Record<string, string>> = {
      "index.html": { source: '<html><head><meta name="unique-mark" content="OLD"></head></html>' },
    };

    if (typeof plugin.generateBundle === "function") {
      // @ts-expect-error minimal options mock
      plugin.generateBundle({}, bundle);
    }

    const source = bundle["index.html"]?.source ?? "";
    // After injection the old content "OLD" should be replaced
    expect(source).not.toContain('content="OLD"');
  });

  it("injects mark into JS assets and adds comment header", () => {
    const plugin = uniqueMark();
    if (typeof plugin.configResolved === "function") {
      // @ts-expect-error minimal config mock
      plugin.configResolved({ root: "/project" });
    }

    const bundle: Record<string, Record<string, string>> = {
      "main.js": { code: "const v = '__unique-mark__';" },
    };

    if (typeof plugin.generateBundle === "function") {
      // @ts-expect-error minimal options mock
      plugin.generateBundle({}, bundle);
    }

    const code = bundle["main.js"]?.code ?? "";
    expect(code).toContain("/* unique-mark");
    expect(code).not.toContain("__unique-mark__");
  });

  it("injects mark into CSS assets and adds comment header", () => {
    const plugin = uniqueMark();
    if (typeof plugin.configResolved === "function") {
      // @ts-expect-error minimal config mock
      plugin.configResolved({ root: "/project" });
    }

    const bundle: Record<string, Record<string, string>> = {
      "styles.css": { source: "body { /* __unique-mark__ */ }" },
    };

    if (typeof plugin.generateBundle === "function") {
      // @ts-expect-error minimal options mock
      plugin.generateBundle({}, bundle);
    }

    const source = bundle["styles.css"]?.source ?? "";
    expect(source).toContain("/* unique-mark");
    expect(source).not.toContain("__unique-mark__");
  });

  it("skips non-HTML/JS/CSS assets", () => {
    const plugin = uniqueMark();
    if (typeof plugin.configResolved === "function") {
      // @ts-expect-error minimal config mock
      plugin.configResolved({ root: "/project" });
    }

    const bundle: Record<string, Record<string, string>> = {
      "image.png": { source: "binary-data" },
    };

    const originalSource = bundle["image.png"]?.source;

    if (typeof plugin.generateBundle === "function") {
      // @ts-expect-error minimal options mock
      plugin.generateBundle({}, bundle);
    }

    // PNG asset should remain untouched
    expect(bundle["image.png"]?.source).toBe(originalSource);
  });
});

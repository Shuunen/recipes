// cSpell:disable
import { describe, expect, it } from "vitest";
import {
  ensureCspellFrontmatter,
  getSectionBody,
  getSectionIndexes,
  hasOneH1,
  hasRequiredSectionOrder,
  hasSection,
  ingredientsHasUnorderedList,
  recetteHasOrderedList,
  sectionHasText,
  toHumanTitle,
} from "./lint.utils";

const fullRecipe = `---
cSpell:locale fr
---

# Tarte Flambée

## Ingrédients

- 200g de fromage blanc
- 1 oignon

## Recette

1. Étaler la pâte
2. Répartir le fromage blanc

## Retour d'expérience

Très bonne recette.

## Source

Recette de grand-mère.
`;

describe("getSectionIndexes", () => {
  it("returns undefined for missing section", () => {
    const lines = ["# Title", "## Ingrédients", "- item"];
    expect(getSectionIndexes(lines, "Recette")).toBeUndefined();
  });

  it("returns correct heading index", () => {
    const lines = ["# Title", "## Ingrédients", "- item", "## Recette", "1. step"];
    const result = getSectionIndexes(lines, "Recette");
    expect(result?.heading).toBe(3);
  });

  it("sets nextHeading to next ## section", () => {
    const lines = ["## Ingrédients", "- item", "## Recette", "1. step"];
    const result = getSectionIndexes(lines, "Ingrédients");
    expect(result?.nextHeading).toBe(2);
  });

  it("sets nextHeading to lines.length when no next section", () => {
    const lines = ["## Source", "text"];
    const result = getSectionIndexes(lines, "Source");
    expect(result?.nextHeading).toBe(2);
  });
});

describe("getSectionBody", () => {
  it("returns undefined for missing section", () => {
    expect(getSectionBody("# Title\n", "Ingrédients")).toBeUndefined();
  });

  it("returns trimmed body text", () => {
    const content = "## Ingrédients\n\n- item\n\n## Recette\n";
    expect(getSectionBody(content, "Ingrédients")).toBe("- item");
  });

  it("returns empty string for section with only whitespace", () => {
    const content = "## Ingrédients\n\n\n## Recette\n";
    expect(getSectionBody(content, "Ingrédients")).toBe("");
  });
});

describe("hasOneH1", () => {
  it("returns true for exactly one H1", () => {
    expect(hasOneH1("# Title\n\nsome text")).toBe(true);
  });

  it("returns false for no H1", () => {
    expect(hasOneH1("## Section\nsome text")).toBe(false);
  });

  it("returns false for multiple H1s", () => {
    expect(hasOneH1("# Title\n# Another Title\n")).toBe(false);
  });
});

describe("hasSection", () => {
  it("returns true when section exists", () => {
    expect(hasSection(fullRecipe, "Ingrédients")).toBe(true);
  });

  it("returns false when section is missing", () => {
    expect(hasSection("# Title\n", "Ingrédients")).toBe(false);
  });
});

describe("sectionHasText", () => {
  it("returns true when section has non-empty text", () => {
    expect(sectionHasText(fullRecipe, "Ingrédients")).toBe(true);
  });

  it("returns false when section body is empty", () => {
    const content = "## Ingrédients\n\n## Recette\n";
    expect(sectionHasText(content, "Ingrédients")).toBe(false);
  });

  it("returns false when section is missing", () => {
    expect(sectionHasText("# Title\n", "Ingrédients")).toBe(false);
  });
});

describe("ingredientsHasUnorderedList", () => {
  it("returns true for unordered list in Ingrédients", () => {
    expect(ingredientsHasUnorderedList(fullRecipe)).toBe(true);
  });

  it("returns false when Ingrédients has no unordered list", () => {
    const content = "## Ingrédients\n\nJuste du texte.\n";
    expect(ingredientsHasUnorderedList(content)).toBe(false);
  });

  it("returns false when Ingrédients section is missing", () => {
    expect(ingredientsHasUnorderedList("# Title\n")).toBe(false);
  });
});

describe("recetteHasOrderedList", () => {
  it("returns true for ordered list in Recette", () => {
    expect(recetteHasOrderedList(fullRecipe)).toBe(true);
  });

  it("returns false when Recette has no ordered list", () => {
    const content = "## Recette\n\nJuste du texte.\n";
    expect(recetteHasOrderedList(content)).toBe(false);
  });

  it("returns false when Recette section is missing", () => {
    expect(recetteHasOrderedList("# Title\n")).toBe(false);
  });
});

describe("hasRequiredSectionOrder", () => {
  it("returns true for correct section order", () => {
    expect(hasRequiredSectionOrder(fullRecipe)).toBe(true);
  });

  it("returns false when a required section is missing", () => {
    const content = "## Ingrédients\n- item\n## Recette\n1. step\n";
    expect(hasRequiredSectionOrder(content)).toBe(false);
  });

  it("returns false when sections are out of order", () => {
    const content = "## Recette\n1. step\n## Ingrédients\n- item\n## Retour d'expérience\ntxt\n## Source\ntxt\n";
    expect(hasRequiredSectionOrder(content)).toBe(false);
  });
});

describe("toHumanTitle", () => {
  it("converts kebab-case filename to title case", () => {
    expect(toHumanTitle("tarte-flambee.md")).toBe("Tarte Flambee");
  });

  it("handles single-word filename", () => {
    expect(toHumanTitle("pizza.md")).toBe("Pizza");
  });

  it("handles full path", () => {
    expect(toHumanTitle("/src/recipes/plat/saute-chouchou.md")).toBe("Saute Chouchou");
  });
});

describe("ensureCspellFrontmatter", () => {
  it("leaves content unchanged if cSpell locale already present", () => {
    const content = "---\ncSpell:locale fr\n---\n\n# Title\n";
    expect(ensureCspellFrontmatter(content)).toBe("---\ncSpell:locale fr\n---\n\n# Title\n");
  });

  it("injects locale into existing frontmatter", () => {
    const content = "---\ntitle: test\n---\n\n# Title\n";
    const result = ensureCspellFrontmatter(content);
    expect(result).toContain("cSpell:locale fr");
    expect(result).toContain("---\ntitle: test\ncSpell:locale fr\n---");
  });

  it("creates frontmatter from scratch when none exists", () => {
    const content = "# Title\n\nsome text\n";
    const result = ensureCspellFrontmatter(content);
    expect(result).toMatch(/^---\ncSpell:locale fr\n---/);
    expect(result).toContain("# Title");
  });

  it("normalizes CRLF to LF", () => {
    const content = "---\r\ncSpell:locale fr\r\n---\r\n# Title\r\n";
    const result = ensureCspellFrontmatter(content);
    expect(result).not.toContain("\r");
  });

  it("trims trailing newlines and adds exactly one", () => {
    const content = "---\ncSpell:locale fr\n---\n\n# Title\n\n\n";
    const result = ensureCspellFrontmatter(content);
    expect(result.endsWith("\n")).toBe(true);
    expect(result.endsWith("\n\n")).toBe(false);
  });
});

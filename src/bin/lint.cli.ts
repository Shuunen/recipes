// oxlint-disable max-lines
// cSpell:disable

import fs from "node:fs";
import path from "node:path";
import glob from "tiny-glob";

const logger = {
  error: (message: string) => {
    console.error(message);
  },
  success: (message: string) => {
    console.log(message);
  },
};

const nbThird = 2;

type Guideline = {
  check: (content: string) => boolean;
  error: string;
  fixer?: (content: string, filePath: string) => string;
  name: string;
};

type RequiredSectionBounds = {
  nextHeading: number;
  heading: number;
  sectionTitle: string;
};

const regexCspell = /cSpell:locale\s+[^\s]+/;
const regexH1 = /^#\s+.+$/gm;
const regexUnorderedList = /^-\s+.+$/m;
const regexOrderedList = /^\d+\.\s+.+$/m;
const requiredSections = ["Ingrédients", "Recette", "Retour d'expérience", "Source"];

function getSectionIndexes(lines: string[], sectionTitle: string): { heading: number; nextHeading: number } | undefined {
  let heading = -1;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === undefined) continue;
    if (line.trim() === `## ${sectionTitle}`) {
      heading = index;
      break;
    }
  }
  if (heading === -1) return undefined;
  let nextHeading = lines.length;
  for (let index = heading + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === undefined) continue;
    if (line.startsWith("## ")) {
      nextHeading = index;
      break;
    }
  }
  return { heading, nextHeading };
}

function getSectionBody(content: string, sectionTitle: string): string | undefined {
  const lines = content.split("\n");
  const section = getSectionIndexes(lines, sectionTitle);
  if (section === undefined) return undefined;
  return lines
    .slice(section.heading + 1, section.nextHeading)
    .join("\n")
    .trim();
}

function hasOneH1(content: string): boolean {
  const matches = content.match(regexH1);
  return Array.isArray(matches) && matches.length === 1;
}

function hasSection(content: string, sectionTitle: string): boolean {
  return getSectionBody(content, sectionTitle) !== undefined;
}

function sectionHasText(content: string, sectionTitle: string): boolean {
  const body = getSectionBody(content, sectionTitle);
  if (body === undefined) return false;
  return body.length > 0;
}

function ingredientsHasUnorderedList(content: string): boolean {
  const body = getSectionBody(content, "Ingrédients");
  if (body === undefined) return false;
  return regexUnorderedList.test(body);
}

function recetteHasOrderedList(content: string): boolean {
  const body = getSectionBody(content, "Recette");
  if (body === undefined) return false;
  return regexOrderedList.test(body);
}

function hasRequiredSectionOrder(content: string): boolean {
  const lines = content.split("\n");
  let previousHeading = -1;
  for (const sectionTitle of requiredSections) {
    const section = getSectionIndexes(lines, sectionTitle);
    if (section === undefined) return false;
    if (section.heading <= previousHeading) return false;
    previousHeading = section.heading;
  }
  return true;
}

function toHumanTitle(filePath: string): string {
  const baseName = path.basename(filePath, ".md");
  const words = baseName.split("-");
  const titleParts: string[] = [];
  for (const word of words) if (word.length > 0) titleParts.push(word.charAt(0).toUpperCase() + word.slice(1));
  return titleParts.join(" ");
}

function ensureCspellFrontmatter(content: string): string {
  if (regexCspell.test(content)) return `${content.replaceAll("\r\n", "\n").replaceAll(/\n+$/g, "")}\n`;
  const lines = content.replaceAll("\r\n", "\n").split("\n");
  if (lines[0] === "---") {
    let closingIndex = -1;
    for (let index = 1; index < lines.length; index += 1)
      if (lines[index] === "---") {
        closingIndex = index;
        break;
      }
    if (closingIndex !== -1) {
      lines.splice(closingIndex, 0, "cSpell:locale fr");
      return `${lines.join("\n").replaceAll(/\n+$/g, "")}\n`;
    }
  }
  const fixedContent = ["---", "cSpell:locale fr", "---", "", ...lines].join("\n");
  return `${fixedContent.replaceAll(/\n+$/g, "")}\n`;
}

function ensureSingleH1(lines: string[], filePath: string): boolean {
  for (const line of lines) if (/^#\s+.+$/.test(line)) return false;
  let insertIndex = 0;
  if (lines[0] === "---")
    for (let index = 1; index < lines.length; index += 1)
      if (lines[index] === "---") {
        insertIndex = index + 1;
        break;
      }
  const title = toHumanTitle(filePath);
  const headingLine = title.length > 0 ? `# ${title}` : "# Recette";
  lines.splice(insertIndex, 0, "", headingLine, "");
  return true;
}

function ensureSectionExists(lines: string[], sectionTitle: string, defaultBody: string): boolean {
  const section = getSectionIndexes(lines, sectionTitle);
  if (section !== undefined) return false;
  if (lines.length > 0 && lines.at(-1) !== "") lines.push("");
  lines.push(`## ${sectionTitle}`, "", defaultBody, "");
  return true;
}

function ensureSectionHasText(lines: string[], sectionTitle: string, fallbackLine: string): boolean {
  const section = getSectionIndexes(lines, sectionTitle);
  if (section === undefined) return false;
  const bodyLines = lines.slice(section.heading + 1, section.nextHeading);
  for (const line of bodyLines) if (line.trim().length > 0) return false;
  lines.splice(section.heading + 1, 0, "", fallbackLine, "");
  return true;
}

function getRequiredSectionBounds(lines: string[]): RequiredSectionBounds[] | undefined {
  const sectionBounds: RequiredSectionBounds[] = [];
  for (const sectionTitle of requiredSections) {
    const section = getSectionIndexes(lines, sectionTitle);
    if (section === undefined) return undefined;
    sectionBounds.push({ heading: section.heading, nextHeading: section.nextHeading, sectionTitle });
  }
  return sectionBounds;
}

function trimBlankEdges(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start]?.trim() === "") start += 1;
  while (end > start && lines[end - 1]?.trim() === "") end -= 1;
  return lines.slice(start, end);
}

function buildSectionBodies(lines: string[], sectionBounds: RequiredSectionBounds[]): Record<string, string[]> {
  const bodiesBySection: Record<string, string[]> = {};
  for (const section of sectionBounds) {
    const bodyLines = lines.slice(section.heading + 1, section.nextHeading);
    bodiesBySection[section.sectionTitle] = trimBlankEdges(bodyLines);
  }
  return bodiesBySection;
}

function getInsertIndex(sectionBounds: RequiredSectionBounds[]): number | undefined {
  const [insertIndex] = sectionBounds.map(section => section.heading).toSorted((leftHeading, rightHeading) => leftHeading - rightHeading);
  return insertIndex;
}

function removeRequiredBlocks(lines: string[], sectionBounds: RequiredSectionBounds[]): void {
  const descendingBounds = sectionBounds.toSorted((leftSection, rightSection) => rightSection.heading - leftSection.heading);
  for (const section of descendingBounds) lines.splice(section.heading, section.nextHeading - section.heading);
}

function buildReorderedSectionLines(bodiesBySection: Record<string, string[]>): string[] {
  const reorderedLines: string[] = [];
  for (const sectionTitle of requiredSections) {
    reorderedLines.push(`## ${sectionTitle}`, "");
    const bodyLines = bodiesBySection[sectionTitle] ?? [];
    if (bodyLines.length > 0) reorderedLines.push(...bodyLines);
    reorderedLines.push("");
  }
  return reorderedLines;
}

function reorderRequiredSections(lines: string[]): boolean {
  const sectionBounds = getRequiredSectionBounds(lines);
  if (sectionBounds === undefined) return false;
  const currentOrder = sectionBounds.toSorted((leftSection, rightSection) => leftSection.heading - rightSection.heading).map(section => section.sectionTitle);
  if (currentOrder.join("|") === requiredSections.join("|")) return false;
  const bodiesBySection = buildSectionBodies(lines, sectionBounds);
  const insertIndex = getInsertIndex(sectionBounds);
  if (insertIndex === undefined) return false;
  removeRequiredBlocks(lines, sectionBounds);
  const reorderedLines = buildReorderedSectionLines(bodiesBySection);
  lines.splice(insertIndex, 0, ...reorderedLines);
  return true;
}

function applyLineFix(content: string, updateLines: (lines: string[]) => void): string {
  const normalizedContent = content.replaceAll("\r\n", "\n");
  const lines = normalizedContent.split("\n");
  updateLines(lines);
  return `${lines.join("\n").replaceAll(/\n+$/g, "")}\n`;
}

const guidelines: Guideline[] = [
  {
    check: (content: string) => regexCspell.test(content),
    error: "missing cSpell:locale declaration",
    fixer: (content: string) => ensureCspellFrontmatter(content),
    name: "cSpell locale",
  },
  {
    check: (content: string) => hasOneH1(content),
    error: "must contain exactly one first-level title (#)",
    fixer: (content: string, filePath: string) =>
      applyLineFix(content, lines => {
        ensureSingleH1(lines, filePath);
      }),
    name: "single H1",
  },
  {
    check: (content: string) => hasSection(content, "Ingrédients"),
    error: "missing required section title: ## Ingrédients",
    fixer: (content: string) =>
      applyLineFix(content, lines => {
        ensureSectionExists(lines, "Ingrédients", "À compléter.");
      }),
    name: "ingredients title",
  },
  {
    check: (content: string) => ingredientsHasUnorderedList(content),
    error: "Ingrédients section must contain at least one unordered list item (- ...)",
    name: "ingredients list",
  },
  {
    check: (content: string) => hasSection(content, "Recette"),
    error: "missing required section title: ## Recette",
    fixer: (content: string) =>
      applyLineFix(content, lines => {
        ensureSectionExists(lines, "Recette", "À compléter.");
      }),
    name: "recette title",
  },
  {
    check: (content: string) => recetteHasOrderedList(content),
    error: "Recette section must contain at least one ordered list item (1. ...)",
    name: "recette list",
  },
  {
    check: (content: string) => hasSection(content, "Retour d'expérience"),
    error: "missing required section title: ## Retour d'expérience",
    fixer: (content: string) =>
      applyLineFix(content, lines => {
        ensureSectionExists(lines, "Retour d'expérience", "À compléter.");
      }),
    name: "retour title",
  },
  {
    check: (content: string) => hasSection(content, "Source"),
    error: "missing required section title: ## Source",
    fixer: (content: string) =>
      applyLineFix(content, lines => {
        ensureSectionExists(lines, "Source", "À compléter.");
      }),
    name: "source title",
  },
  {
    check: (content: string) => hasRequiredSectionOrder(content),
    error: "required sections must be in order: Ingrédients, Recette, Retour d'expérience, Source",
    fixer: (content: string) =>
      applyLineFix(content, lines => {
        reorderRequiredSections(lines);
      }),
    name: "section order",
  },
  {
    check: (content: string) => requiredSections.every(sectionTitle => sectionHasText(content, sectionTitle)),
    error: "each required section must contain at least one non-empty line",
    fixer: (content: string) =>
      applyLineFix(content, lines => {
        ensureSectionHasText(lines, "Ingrédients", "À compléter.");
        ensureSectionHasText(lines, "Recette", "À compléter.");
        ensureSectionHasText(lines, "Retour d'expérience", "À compléter.");
        ensureSectionHasText(lines, "Source", "À compléter.");
      }),
    name: "section text",
  },
];

function lintFile(filePath: string): string[] {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;
  const issues: string[] = [];
  for (const rule of guidelines) {
    if (rule.fixer !== undefined) {
      const fixedContent = rule.fixer(content, filePath);
      if (fixedContent !== content) {
        content = fixedContent;
        changed = true;
      }
    }
    if (!rule.check(content)) issues.push(`(${rule.name}) ${rule.error}`);
  }
  if (changed) fs.writeFileSync(filePath, content, "utf8");
  return issues;
}

async function getTargetFiles(argv: string[]): Promise<string[]> {
  const args: Record<string, string> = {};
  for (const arg of argv.slice(nbThird)) {
    const [key = "", value = ""] = arg.replace("--", "").split("=");
    if (key.length > 0) args[key] = value;
  }
  const { target = "" } = args;
  if (target.length === 0) throw new Error("missing target argument");
  const matches = await glob(target, { filesOnly: true });
  return matches.map(match => path.resolve(process.cwd(), match)).filter(match => match.endsWith(".md"));
}

async function main(argv: string[]) {
  const files = await getTargetFiles(argv);
  let foundIssues = false;
  for (const filePath of files) {
    const issues = lintFile(filePath);
    for (const issue of issues) {
      logger.error(`File: ${filePath} - Issue: ${issue}`);
      foundIssues = true;
    }
  }
  if (foundIssues) throw new Error("Lint issues found.");
  logger.success("All recipes passed markdown guideline linting.");
}

await main(process.argv);

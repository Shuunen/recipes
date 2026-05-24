// cSpell:disable
import path from "node:path";

const regexH1 = /^#\s+.+$/gm;
const regexUnorderedList = /^-\s+.+$/m;
const regexOrderedList = /^\d+\.\s+.+$/m;
export const requiredSections = ["Ingrédients", "Recette", "Retour d'expérience", "Source"];
export const regexCspell = /cSpell:locale\s+[^\s]+/;

export function getSectionIndexes(lines: string[], sectionTitle: string): { heading: number; nextHeading: number } | undefined {
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

export function getSectionBody(content: string, sectionTitle: string): string | undefined {
  const lines = content.split("\n");
  const section = getSectionIndexes(lines, sectionTitle);
  if (section === undefined) return undefined;
  return lines
    .slice(section.heading + 1, section.nextHeading)
    .join("\n")
    .trim();
}

export function hasOneH1(content: string): boolean {
  const matches = content.match(regexH1);
  return Array.isArray(matches) && matches.length === 1;
}

export function hasSection(content: string, sectionTitle: string): boolean {
  return getSectionBody(content, sectionTitle) !== undefined;
}

export function sectionHasText(content: string, sectionTitle: string): boolean {
  const body = getSectionBody(content, sectionTitle);
  if (body === undefined) return false;
  return body.length > 0;
}

export function ingredientsHasUnorderedList(content: string): boolean {
  const body = getSectionBody(content, "Ingrédients");
  if (body === undefined) return false;
  return regexUnorderedList.test(body);
}

export function recetteHasOrderedList(content: string): boolean {
  const body = getSectionBody(content, "Recette");
  if (body === undefined) return false;
  return regexOrderedList.test(body);
}

export function hasRequiredSectionOrder(content: string): boolean {
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

export function toHumanTitle(filePath: string): string {
  const baseName = path.basename(filePath, ".md");
  const words = baseName.split("-");
  const titleParts: string[] = [];
  for (const word of words) if (word.length > 0) titleParts.push(word.charAt(0).toUpperCase() + word.slice(1));
  return titleParts.join(" ");
}

export function ensureCspellFrontmatter(content: string): string {
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

export function applyLineFix(content: string, updateLines: (lines: string[]) => void): string {
  const normalizedContent = content.replaceAll("\r\n", "\n");
  const lines = normalizedContent.split("\n");
  updateLines(lines);
  return `${lines.join("\n").replaceAll(/\n+$/g, "")}\n`;
}

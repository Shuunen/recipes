declare module "*.md" {
  const attributes: Record<string, unknown>;
  const toc: { level: string; content: string }[];
  const html: string;
  const raw: string;

  import React from "react";
  const ReactComponent: React.VFC;

  export { attributes, toc, html, ReactComponent };
}

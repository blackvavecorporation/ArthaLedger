import Link from "next/link";
import type { ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\((?:https?:\/\/|\/)[^)]+\))/g;
  const parts = text.split(pattern).filter((part) => part !== "");
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    const link = part.match(/^\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href.startsWith("/")) {
        return (
          <Link key={key} href={href}>
            {label}
          </Link>
        );
      }
      return (
        <a key={key} href={href} target="_blank" rel="noreferrer noopener">
          {label}
        </a>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

/** Minimal, safe Markdown renderer for CMS-authored long-form content. */
export function SimpleMarkdown({ content }: { content: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="legal-prose">
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        const first = lines[0]?.trim() ?? "";
        if (first.startsWith("### ")) {
          return <h3 key={index}>{inline(first.slice(4), `h3-${index}`)}</h3>;
        }
        if (first.startsWith("## ")) {
          return <h2 key={index}>{inline(first.slice(3), `h2-${index}`)}</h2>;
        }
        if (first.startsWith("# ")) {
          return <h1 key={index}>{inline(first.slice(2), `h1-${index}`)}</h1>;
        }
        if (first.startsWith("> ")) {
          return (
            <blockquote key={index}>
              {lines.map((line, lineIndex) => (
                <p key={lineIndex} className={lineIndex === lines.length - 1 ? "mb-0" : ""}>
                  {inline(line.replace(/^>\s?/, ""), `quote-${index}-${lineIndex}`)}
                </p>
              ))}
            </blockquote>
          );
        }
        if (lines.every((line) => /^[-*]\s+/.test(line.trim()) || line.trim() === "")) {
          return (
            <ul key={index}>
              {lines
                .filter((line) => line.trim())
                .map((line, lineIndex) => (
                  <li key={lineIndex}>
                    {inline(line.trim().replace(/^[-*]\s+/, ""), `ul-${index}-${lineIndex}`)}
                  </li>
                ))}
            </ul>
          );
        }
        if (lines.every((line) => /^\d+[.)]\s+/.test(line.trim()) || line.trim() === "")) {
          return (
            <ol key={index}>
              {lines
                .filter((line) => line.trim())
                .map((line, lineIndex) => (
                  <li key={lineIndex}>
                    {inline(line.trim().replace(/^\d+[.)]\s+/, ""), `ol-${index}-${lineIndex}`)}
                  </li>
                ))}
            </ol>
          );
        }
        return (
          <p key={index}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {inline(line, `p-${index}-${lineIndex}`)}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { sanitizeRichText } from "@/lib/sanitizeRichText";

type Props = {
  content: string;
  className: string;
};

/**
 * Rich submission text is shown only after mount so SSR + first client paint stay identical
 * (empty shell), then we inject sanitized HTML. Avoids hydration mismatches from:
 * - DOMPurify / DOM differences between Node and the browser
 * - Browser extensions mutating the tree before hydration completes
 */
export function SubmissionInitialPagesHtml({ content, className }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div
        className={`${className} min-h-[12rem] rounded-lg bg-zinc-50/80`}
        aria-busy
        aria-label="Loading formatted text"
      />
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(content) }}
    />
  );
}

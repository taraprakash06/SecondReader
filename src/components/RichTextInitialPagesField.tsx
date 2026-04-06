"use client";

import { useRef, useSyncExternalStore } from "react";
import { sanitizeRichText } from "@/lib/sanitizeRichText";

const SHELL_CLASS =
  "min-h-[280px] rounded-2xl border border-zinc-200 bg-white p-3 text-sm leading-6 text-[color:var(--ink)] outline-none focus-within:border-[color:var(--brand-magenta)]/50 focus-within:ring-2 focus-within:ring-[color:var(--brand-magenta)]/20 [&_b]:font-semibold [&_em]:italic [&_i]:italic [&_strong]:font-semibold [&_u]:underline";

/**
 * Rich-text area for pasted prose. Browser paste preserves bold/italic/underline
 * from Word and Google Docs; we mirror HTML into a hidden field on submit.
 *
 * The editor mounts only after hydration: empty `contentEditable` nodes often get
 * a `<br>` from the browser, which does not match SSR and triggers hydration errors.
 */
export function RichTextInitialPagesField() {
  const editorRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <>
      <input type="hidden" name="fullManuscript" defaultValue="" />
      {!mounted ? (
        <div
          className={SHELL_CLASS}
          aria-hidden
          tabIndex={-1}
        />
      ) : (
        <div
          ref={editorRef}
          data-editor="full-manuscript"
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline
          aria-label="Paste your full manuscript"
          className={`${SHELL_CLASS} focus:border-[color:var(--brand-magenta)]/50 focus:ring-2 focus:ring-[color:var(--brand-magenta)]/20`}
          onPaste={() => {
            window.setTimeout(() => {
              const form = editorRef.current?.closest("form");
              const hidden = form?.querySelector<HTMLInputElement>("input[name='fullManuscript']");
              if (editorRef.current && hidden) {
                hidden.value = sanitizeRichText(editorRef.current.innerHTML);
              }
            }, 0);
          }}
          onInput={() => {
            const form = editorRef.current?.closest("form");
            const hidden = form?.querySelector<HTMLInputElement>("input[name='fullManuscript']");
            if (editorRef.current && hidden) {
              hidden.value = sanitizeRichText(editorRef.current.innerHTML);
            }
          }}
        />
      )}
    </>
  );
}

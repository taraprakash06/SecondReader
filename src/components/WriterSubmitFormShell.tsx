"use client";

import type { ReactNode } from "react";
import { sanitizeRichText } from "@/lib/sanitizeRichText";

export function WriterSubmitFormShell({
  action,
  className,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <form
      noValidate
      action={action}
      className={className}
      onSubmit={(e) => {
        const form = e.currentTarget;
        const editor = form.querySelector<HTMLDivElement>("[data-editor='initial-pages']");
        const hidden = form.querySelector<HTMLInputElement>("input[name='initialPages']");
        if (editor && hidden) {
          hidden.value = sanitizeRichText(editor.innerHTML);
        }
      }}
    >
      {children}
    </form>
  );
}

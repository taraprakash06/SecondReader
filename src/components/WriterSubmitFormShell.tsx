"use client";

import type { FormHTMLAttributes, ReactNode } from "react";
import { sanitizeManuscriptRichText } from "@/lib/sanitizeRichText";

export function WriterSubmitFormShell({
  action,
  onBeforeSubmit,
  className,
  children,
}: {
  action: FormHTMLAttributes<HTMLFormElement>["action"];
  onBeforeSubmit?: (form: HTMLFormElement) => boolean;
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
        const editor = form.querySelector<HTMLDivElement>("[data-editor='full-manuscript']");
        const hidden = form.querySelector<HTMLInputElement>("input[name='fullManuscript']");
        if (editor && hidden) {
          hidden.value = sanitizeManuscriptRichText(editor.innerHTML);
        }
        if (onBeforeSubmit && !onBeforeSubmit(form)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </form>
  );
}

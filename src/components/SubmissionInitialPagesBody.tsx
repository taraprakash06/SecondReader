import { submissionInitialPagesLooksLikeHtml } from "@/lib/sanitizeRichText";
import { SubmissionInitialPagesHtml } from "@/components/SubmissionInitialPagesHtml";

type Props = {
  content: string;
  className?: string;
};

const DEFAULT_HTML_CLASS =
  "mt-3 text-sm leading-7 text-zinc-800 [&_b]:font-semibold [&_em]:italic [&_i]:italic [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_u]:underline";

/**
 * Renders stored submission text: HTML (sanitized) for rich pastes, or pre-wrap for legacy plain text.
 */
export function SubmissionInitialPagesBody({ content, className }: Props) {
  if (submissionInitialPagesLooksLikeHtml(content)) {
    return (
      <SubmissionInitialPagesHtml
        content={content}
        className={className ?? DEFAULT_HTML_CLASS}
      />
    );
  }

  return (
    <pre
      className={
        className ??
        "mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-800 font-sans"
      }
    >
      {content}
    </pre>
  );
}

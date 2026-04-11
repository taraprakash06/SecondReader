/**
 * Shared layout for InlineMarginComments + MarginCommentsStatic.
 * `wide` gives the manuscript column more room (critique / feedback sample on large screens).
 */
export type MarginCommentsLayoutVariant = "default" | "wide";

export function marginCommentsLayout(variant: MarginCommentsLayoutVariant) {
  const wide = variant === "wide";
  return {
    rowGrid: wide
      ? "grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(260px,30%)]"
      : "grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(260px,32%)]",
    textCell: wide
      ? "min-w-0 border-zinc-200 bg-white px-4 py-5 sm:px-8 sm:py-6 lg:border-r lg:px-10 lg:pr-14"
      : "min-w-0 border-zinc-200 bg-white px-4 py-5 sm:px-6 md:border-r md:pr-8",
    textInner: wide
      ? "max-w-none break-words font-serif text-[16px] leading-[1.85] tracking-[0.01em] text-zinc-900 [overflow-wrap:anywhere]"
      : "max-w-[52rem] break-words font-serif text-[15px] leading-[1.8] tracking-[0.01em] text-zinc-900 [overflow-wrap:anywhere]",
    sidebar: wide
      ? "flex min-w-0 flex-col gap-3 border-zinc-200 bg-[#eceff2] px-3 py-4 lg:border-0"
      : "flex min-w-0 flex-col gap-3 border-zinc-200 bg-[#eceff2] px-3 py-4 md:border-0",
    /** Show connector line between text and cards */
    showConnector: wide ? "lg:block" : "md:block",
    /** Spacer when paragraph has no annotations */
    showEmptyGutter: wide ? "lg:block" : "md:block",
  } as const;
}

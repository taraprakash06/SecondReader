"use client";

import dynamic from "next/dynamic";

const WriterSubmitFormClient = dynamic(
  () => import("./WriterSubmitFormClient").then((m) => m.WriterSubmitFormClient),
  {
    ssr: false,
    loading: () => (
      <div
        className="mt-8 min-h-[36rem] animate-pulse rounded-3xl border border-zinc-200/80 bg-zinc-100/60"
        aria-hidden
      />
    ),
  },
);

export function WriterSubmitFormLoader() {
  return <WriterSubmitFormClient />;
}

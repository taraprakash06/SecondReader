"use client";

import { useMemo, useState } from "react";
import {
  WRITER_FOCUS_AREA_OPTIONS,
  type WriterFocusAreaId,
} from "@/lib/writerFocusAreas";

const MAX = 5;

function focusInputId(id: WriterFocusAreaId) {
  return `writer-focus-${id}`;
}

export function WriterFocusAreasField() {
  const [selected, setSelected] = useState<WriterFocusAreaId[]>([]);

  const jsonValue = useMemo(() => JSON.stringify(selected), [selected]);

  function toggle(id: WriterFocusAreaId) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX) return prev;
      return [...prev, id];
    });
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name="writerFocusAreasJson" value={jsonValue} readOnly />
      <div className="grid gap-2 sm:grid-cols-2">
        {WRITER_FOCUS_AREA_OPTIONS.map((o) => {
          const inputId = focusInputId(o.id);
          const checked = selected.includes(o.id);
          const atCap = selected.length >= MAX && !checked;
          return (
            <div
              key={o.id}
              className={`flex min-h-[2.75rem] items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm leading-snug transition hover:border-[color:var(--brand-magenta)]/35 ${
                atCap ? "opacity-45" : ""
              }`}
            >
              <input
                id={inputId}
                type="checkbox"
                checked={checked}
                disabled={atCap}
                onChange={() => toggle(o.id)}
                className="size-5 shrink-0 rounded border-zinc-300 text-[color:var(--brand-magenta)] focus:ring-[color:var(--brand-magenta)]/30"
              />
              <label
                htmlFor={inputId}
                className={`flex-1 cursor-pointer text-[color:var(--ink)] ${atCap ? "cursor-not-allowed" : ""}`}
              >
                {o.label}
              </label>
            </div>
          );
        })}
      </div>
      {selected.includes("OTHER") ? (
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="writer-focus-other-detail" className="font-medium text-[color:var(--ink)]">
            Tell us more about “Other”
          </label>
          <textarea
            id="writer-focus-other-detail"
            name="focusOther"
            required
            rows={3}
            className="min-h-[5rem] rounded-xl border border-zinc-200 bg-white p-3 text-base leading-relaxed text-[color:var(--ink)] focus:border-[color:var(--brand-magenta)]/50 focus:outline-none md:text-sm md:leading-6"
            placeholder="What should the reader focus on that isn’t listed above?"
          />
        </div>
      ) : null}
      <p className="text-xs text-[color:var(--ink-muted)]">
        {selected.length} of {MAX} selected
      </p>
    </div>
  );
}

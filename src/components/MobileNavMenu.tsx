"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";

const PRIMARY_LINKS = [
  { href: "/pieces", label: "Browse Pieces" },
  { href: "/readers", label: "Browse Readers" },
  { href: "/writer", label: "Submit Your Work" },
  { href: "/reader", label: "Become a Reader" },
] as const;

export function MobileNavMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-2.5 text-zinc-800 shadow-sm hover:bg-[color:var(--paper-2)]"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-zinc-900/40 backdrop-blur-[1px]"
            aria-label="Close menu"
            onClick={close}
          />
          <nav
            id={panelId}
            className="fixed right-3 top-[calc(4rem+env(safe-area-inset-top,0px))] z-[70] w-[min(100vw-1.5rem,20rem)] overflow-hidden rounded-2xl border border-zinc-200 bg-white py-2 shadow-xl"
            role="navigation"
            aria-label="Main"
          >
            <ul className="flex flex-col py-1">
              {PRIMARY_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block min-h-11 px-4 py-3 text-base font-semibold text-[color:var(--ink)] hover:bg-[color:var(--paper-2)]"
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  );
}

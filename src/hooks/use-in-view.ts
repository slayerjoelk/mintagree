"use client";

import { useRef } from "react";

export function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  // Always visible — no scroll observer, no hydration race conditions
  return { ref, inView: true };
}

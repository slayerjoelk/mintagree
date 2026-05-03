"use client";

import { useEffect, useState, useCallback } from "react";

export function useInView(options?: IntersectionObserverInit) {
  const [inView, setInView] = useState(false);
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const ref = useCallback((el: HTMLDivElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1, ...options }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, options]);

  return { ref, inView };
}

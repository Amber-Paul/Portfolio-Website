"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface UseScrollAnimationOptions {
  once?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const isInView = useInView(ref, {
    once: options.once ?? true,
    margin: "-100px 0px",
  });

  return { ref, isInView, prefersReduced };
}

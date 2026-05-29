"use client";

import { motion, type Transition } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState, useRef } from "react";
import type { Stat } from "@/types";

function useCountUp(target: number, isInView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isInView || startedRef.current) return;
    startedRef.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return count;
}

const STATS: Stat[] = [
  { value: 5, suffix: "+", label: "Years of Experience" },
  { value: 30, suffix: "+", label: "Projects Delivered" },
  { value: 15, suffix: "k+", label: "Lines of Code" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

function StatCard({ stat, isInView }: { stat: Stat; isInView: boolean }) {
  const count = useCountUp(stat.value, isInView);
  return (
    <div className="text-center">
      <p className="text-3xl font-black text-zinc-100">
        {count}
        <span className="text-violet-400">{stat.suffix}</span>
      </p>
      <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
    </div>
  );
}

const textContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const lineVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const imageVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

export default function AboutSection() {
  const { ref, isInView, prefersReduced } = useScrollAnimation();
  const t: Transition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

  return (
    <section id="about" ref={ref} className="py-28 px-6" aria-label="About me">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text column */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.p variants={lineVariants} transition={t} className="text-sm font-mono text-violet-400 tracking-widest uppercase mb-3">
              About Me
            </motion.p>
            <motion.h2 variants={lineVariants} transition={t} className="font-syne text-4xl font-black text-zinc-100 mb-6 leading-tight">
              Crafting digital experiences that matter
            </motion.h2>
            <motion.p variants={lineVariants} transition={t} className="text-zinc-400 leading-relaxed mb-4">
              I&apos;m a full-stack developer with a deep passion for building products that are both technically excellent and a joy to use. I specialise in React ecosystems, Node.js backends, and thoughtful UI engineering.
            </motion.p>
            <motion.p variants={lineVariants} transition={t} className="text-zinc-400 leading-relaxed mb-4">
              I believe good software starts with understanding people — their needs, workflows, and frustrations — before writing a single line of code.
            </motion.p>
            <motion.p variants={lineVariants} transition={t} className="text-zinc-400 leading-relaxed mb-10">
              When I&apos;m not coding, you&apos;ll find me exploring open-source projects, writing technical articles, or hiking trails I&apos;ve never tried before.
            </motion.p>

            <motion.div variants={lineVariants} transition={t} className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-zinc-800">
              {STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} isInView={isInView} />
              ))}
            </motion.div>
          </motion.div>

          {/* Image column */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-square max-w-sm mx-auto">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-zinc-800" />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-fuchsia-600/10 rounded-full blur-2xl" />
              <div className="absolute inset-4 rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center">
                <div className="text-center text-zinc-600">
                  <svg className="w-20 h-20 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                  <p className="text-sm font-mono">[YOUR PHOTO]</p>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 grid grid-cols-4 gap-1.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

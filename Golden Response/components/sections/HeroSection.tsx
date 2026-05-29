"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";

interface HeroSectionProps {
  onContactClick: () => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export default function HeroSection({ onContactClick }: HeroSectionProps) {
  const prefersReduced = useReducedMotion();

  const makeTransition = (duration: number, delay: number = 0): Transition =>
    prefersReduced
      ? { duration: 0 }
      : { duration, delay, ease: [0.22, 1, 0.36, 1] };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
      aria-label="Hero section"
    >
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="hero-gradient absolute inset-0" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="grid-bg absolute inset-0 opacity-[0.03]" />
      </div>

      <motion.div
        className="max-w-3xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={itemVariants}
          transition={makeTransition(0.6)}
          className="text-sm font-mono text-violet-400 mb-4 tracking-widest uppercase"
        >
          Available for work
        </motion.p>

        <motion.h1
          variants={itemVariants}
          transition={makeTransition(0.8)}
          className="font-syne text-5xl sm:text-6xl lg:text-7xl font-black text-zinc-100 leading-[1.05] tracking-tight mb-4"
        >
          Hi, I&apos;m{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            [YOUR NAME]
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          transition={makeTransition(0.7, 0.2)}
          className="text-xl sm:text-2xl text-zinc-400 font-medium mb-3"
        >
          Full-Stack Developer & UI Engineer
        </motion.p>

        <motion.p
          variants={itemVariants}
          transition={makeTransition(0.7, 0.2)}
          className="text-base text-zinc-500 max-w-xl mx-auto mb-10"
        >
          I build fast, accessible, and beautiful web experiences — from pixel-perfect UIs to robust APIs.
        </motion.p>

        <motion.div
          variants={buttonVariants}
          transition={makeTransition(0.5, 0.4)}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#projects"
            aria-label="View my work"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition"
          >
            View My Work
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <button
            onClick={onContactClick}
            aria-label="Open contact form"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 font-semibold text-sm transition"
          >
            Get in Touch
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-xs text-zinc-600 tracking-widest uppercase font-mono">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent"
          animate={{ scaleY: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

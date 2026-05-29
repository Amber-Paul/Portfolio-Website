"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
}

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedText({
  text,
  className,
  stagger = 0.1,
  delay = 0,
}: AnimatedTextProps) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <motion.div
      className={`flex flex-wrap gap-x-2 ${className ?? ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: prefersReduced ? 0 : stagger,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          transition={prefersReduced ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

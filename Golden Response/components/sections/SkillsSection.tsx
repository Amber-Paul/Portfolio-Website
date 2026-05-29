"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { Skill } from "@/types";

const SKILLS: Skill[] = [
  { name: "React", category: "Frontend", proficiency: 95 },
  { name: "Next.js", category: "Frontend", proficiency: 90 },
  { name: "TypeScript", category: "Frontend", proficiency: 88 },
  { name: "Tailwind CSS", category: "Frontend", proficiency: 92 },
  { name: "Framer Motion", category: "Frontend", proficiency: 80 },
  { name: "Node.js", category: "Backend", proficiency: 85 },
  { name: "PostgreSQL", category: "Backend", proficiency: 78 },
  { name: "Docker", category: "DevOps", proficiency: 72 },
];

const categoryColors: Record<Skill["category"], string> = {
  Frontend: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Backend: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  DevOps: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function SkillCard({ skill, isInView, prefersReduced }: { skill: Skill; isInView: boolean; prefersReduced: boolean | null }) {
  return (
    <motion.div
      variants={cardVariants}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
      whileHover={prefersReduced ? {} : { y: -4 }}
      className="group rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-5 cursor-default transition-shadow hover:shadow-lg hover:shadow-black/30"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-zinc-100 font-semibold">{skill.name}</h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryColors[skill.category]}`}>
          {skill.category}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Proficiency</span>
          <span>{skill.proficiency}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
            initial={{ width: 0 }}
            animate={isInView ? { width: `${skill.proficiency}%` } : { width: 0 }}
            transition={prefersReduced ? { duration: 0 } : { duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const { ref, isInView, prefersReduced } = useScrollAnimation();

  return (
    <section id="skills" ref={ref} className="py-28 px-6 bg-zinc-950/50" aria-label="Skills">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-violet-400 tracking-widest uppercase mb-3">Expertise</p>
          <h2 className="text-4xl font-black text-zinc-100">What I Work With</h2>
          <p className="text-zinc-500 mt-3 max-w-lg mx-auto">
            A curated set of tools I use to build production-grade applications.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {SKILLS.map((skill) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              isInView={isInView}
              prefersReduced={prefersReduced}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

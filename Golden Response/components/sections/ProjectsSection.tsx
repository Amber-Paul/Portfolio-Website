"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { Project } from "@/types";

const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "SaaS Analytics Dashboard",
    description:
      "A real-time analytics platform built for B2B SaaS companies. Features live charts, cohort analysis, and a custom query builder. Processes over 2M events per day.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Recharts"],
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "project-2",
    title: "Open-Source Design System",
    description:
      "A fully accessible component library with 60+ components, dark-mode support, and a Storybook documentation site. Used by 3 production apps and 200+ GitHub stars.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Storybook", "Vitest"],
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "project-3",
    title: "AI Content Workflow Tool",
    description:
      "An internal tool that automates content review pipelines using LLM APIs. Cut editorial review time by 60% for a media startup's 20-person team.",
    tech: ["Next.js", "Node.js", "OpenAI API", "Docker", "MongoDB"],
    gradient: "from-rose-600 via-pink-600 to-fuchsia-700",
    liveUrl: "#",
    githubUrl: "#",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const tagContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

function ProjectCard({ project, prefersReduced }: { project: Project; prefersReduced: boolean | null }) {
  const dur = prefersReduced ? 0 : 0.45;

  return (
    <motion.article
      key={project.id}
      layoutId={project.id}
      variants={cardVariants}
      transition={{ duration: dur, ease: "easeOut" }}
      className="group rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 overflow-hidden transition-shadow hover:shadow-2xl hover:shadow-black/40"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
        {/* Overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <a
            href={project.liveUrl}
            aria-label={`View live demo of ${project.title}`}
            className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/20 transition border border-white/20"
          >
            Live Demo ↗
          </a>
          <a
            href={project.githubUrl}
            aria-label={`View GitHub repository for ${project.title}`}
            className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/20 transition border border-white/20"
          >
            GitHub ↗
          </a>
        </motion.div>
        {/* Thumbnail scale */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`}
          whileHover={prefersReduced ? {} : { scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
        />
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-zinc-100 mb-2">{project.title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">{project.description}</p>

        {/* Tech tags */}
        <motion.div
          className="flex flex-wrap gap-2"
          variants={tagContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {project.tech.map((tag) => (
            <motion.span
              key={tag}
              variants={tagVariants}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.2 }}
              className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        <div className="flex gap-3 mt-5">
          <a
            href={project.liveUrl}
            aria-label={`Live demo: ${project.title}`}
            className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition"
          >
            Live Demo
          </a>
          <a
            href={project.githubUrl}
            aria-label={`GitHub: ${project.title}`}
            className="flex-1 text-center text-xs font-semibold py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const { ref, isInView, prefersReduced } = useScrollAnimation();

  return (
    <section id="projects" ref={ref} className="py-28 px-6" aria-label="Projects">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-violet-400 tracking-widest uppercase mb-3">Work</p>
          <h2 className="text-4xl font-black text-zinc-100">Selected Work</h2>
          <p className="text-zinc-500 mt-3 max-w-lg mx-auto">
            A few highlights from recent client and personal projects.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} prefersReduced={prefersReduced} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

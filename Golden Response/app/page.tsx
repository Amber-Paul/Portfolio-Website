"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactCTASection from "@/components/sections/ContactCTASection";

// Lazy-load heavy sections
const ProjectsSection = dynamic(() => import("@/components/sections/ProjectsSection"), {
  ssr: false,
  loading: () => (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="h-96 rounded-2xl bg-zinc-900/50 animate-pulse" />
      </div>
    </section>
  ),
});

const ContactModal = dynamic(() => import("@/components/ui/ContactModal"), {
  ssr: false,
});

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <Navbar onContactClick={openModal} />

      <main>
        <HeroSection onContactClick={openModal} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactCTASection onContactClick={openModal} />
      </main>

      <footer className="border-t border-zinc-800/50 py-8 px-6 text-center">
        <p className="text-sm text-zinc-600">
          © {new Date().getFullYear()} <span className="text-zinc-400">[YOUR NAME]</span>. Built with Next.js & Framer Motion.
        </p>
      </footer>

      <ContactModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}

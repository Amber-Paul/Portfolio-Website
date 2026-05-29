"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

interface NavbarProps {
  onContactClick: () => void;
}

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
];

export default function Navbar({ onContactClick }: NavbarProps) {
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.85]);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-30"
      style={{
        borderBottomColor: `rgba(63,63,70,${borderOpacity.get()})`,
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
      }}
    >
      <motion.div
        className="absolute inset-0 backdrop-blur-md bg-zinc-950"
        style={{ opacity: bgOpacity }}
      />
      <nav className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-bold text-zinc-100 text-lg tracking-tight" aria-label="Go to top">
          <span className="text-violet-400">[</span>YN<span className="text-violet-400">]</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-zinc-400 hover:text-zinc-100 transition"
                aria-label={`Navigate to ${link.label} section`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={onContactClick}
              aria-label="Open contact form"
              className="text-sm font-semibold px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white transition"
            >
              Contact
            </button>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-zinc-400 hover:text-zinc-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden relative bg-zinc-950 border-t border-zinc-800 px-6 py-4 space-y-3"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-zinc-300 hover:text-zinc-100 transition"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setMenuOpen(false); onContactClick(); }}
            className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition"
          >
            Contact
          </button>
        </motion.div>
      )}
    </motion.header>
  );
}

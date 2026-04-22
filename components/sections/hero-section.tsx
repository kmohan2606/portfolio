"use client";

import { motion } from "framer-motion";

const specializations = [
  "Python", "Go", "C/C++", "ML Systems", "Distributed Systems",
  "Edge AI", "React", "Docker / K8s",
];

export function HeroSection() {
  return (
    <section className="relative z-20 pt-28 pb-6 flex flex-col items-center text-center px-6 overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-wide text-white mb-4"
        style={{ fontFamily: "var(--font-sentient)", fontWeight: 200 }}
      >
        Kedarnath Mohan
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-lg md:text-xl text-silver mb-6"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Software Engineer &amp; ML Researcher
      </motion.p>

      {/* Specialization tags */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {specializations.map((tag) => (
          <span key={tag} className="skill-tag">
            {tag}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

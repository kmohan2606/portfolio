"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Mail, FileDown } from "lucide-react";

const contactLinks = [
  { icon: Github, href: "https://github.com/kmohan2606", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/kedarnath-mohan",
    label: "LinkedIn",
  },
  { icon: Mail, href: "mailto:kedarnath.mohan@uga.edu", label: "Email" },
];

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-16 px-6 relative z-10">
      <div className="max-w-2xl mx-auto text-center" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-light text-white mb-4"
          style={{ fontFamily: "var(--font-sentient)", fontWeight: 200 }}
        >
          {"My Links:"}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center gap-6"
        >
          {contactLinks.map(({ icon: Icon, href, label }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl text-white lift-hover block"
                style={{ border: "1px solid rgba(192,192,192,0.3)" }}
                aria-label={label}
              >
                <Icon size={28} />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Resume download */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-10 flex justify-center"
      >
        <a
          href="/resume.pdf"
          download="Kedarnath_Mohan_Resume.pdf"
          className="relative flex items-center gap-2 px-5 py-2.5 rounded-2xl lift-hover overflow-hidden"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "rgba(216,180,254,0.85)",
            border: "1px solid rgba(168,85,247,0.18)",
            background: "rgba(168,85,247,0.08)",
            letterSpacing: "0.05em",
          }}
        >
          <span className="tracer-border" />
          <FileDown size={14} />
          download resume
        </a>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="text-silver/40 text-sm">built on next.js</p>
      </motion.footer>
    </section>
  );
}

"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const experiences = [
  {
    company: "Amazon Stores",
    role: "Software Engineering Intern",
    period: "May 2026 — Aug 2026",
    points: ["Incoming SWE Intern on the Devices team in Seattle"],
  },
  {
    company: "Zhao Nano Lab",
    role: "Signal Processing Intern · Python, NumPy, SciPy",
    period: "Jan 2026 — Present",
    points: [
      "Maintain open-source Raman spectroscopy software for 1,500+ global users",
      "Improved SNR by smoothing spectral data via wavelet denoising",
      "Engineered an automated normalization pipeline for heterogeneous datasets",
      "Codified optimal default parameters through systematic benchmarking",
    ],
  },
  {
    company: "HammerHead Construction",
    role: "Software Engineering Intern · Python, Go, React, YOLOv9",
    period: "Mar 2025 — Jan 2026",
    points: [
      "Built an AI-powered system converting hand-drawn floorplans into 3D CAD models, reducing drafting time by 5–7 days",
      "Developed scalable Go/Python microservices for geometry parsing and CAD exports, improving data throughput by 40%",
      "Integrated OpenCV and YOLOv9 pipelines with real-time verification, raising accuracy by 20%",
      "Automated CI/CD deployments using Docker and GitHub Actions, shortening iteration cycles by 35%",
    ],
  },
  {
    company: "AI @ UGA Research",
    role: "Undergraduate Research Lead · TF Lite, XGBoost, R",
    period: "Mar 2025 — Dec 2025",
    points: [
      "Built an IoT system on RPi4 + Supabase with 15-minute refresh cycles",
      "Achieved 87% R² with an XGBoost regression model + 5-fold cross-validation",
      "Reduced inference latency to 50ms on edge hardware via quantized TF Lite models",
    ],
  },
  {
    company: "Mabbu",
    role: "Machine Learning Intern · Python, JavaScript, REST",
    period: "May 2024 — Aug 2024",
    points: [
      "Consolidated 7,500+ Salesforce and internal records into unified datasets, enabling the company's first ML-driven growth pipeline",
      "Fine-tuned transformer models for prospect scoring, improving lead-match accuracy by 12%",
      "Built REST APIs and React dashboards automating outreach to 500+ clients, cutting manual workload by 40%",
    ],
  },
];

type Exp = (typeof experiences)[0];

function TimelineDot({
  index,
  isOpen,
}: {
  index: number;
  isOpen: boolean;
}) {
  return (
    <div
      className="w-3 h-3 rounded-full flex-shrink-0"
      style={{
        background: index <= 1 ? "rgba(168,85,247,0.9)" : "black",
        border:
          index <= 1
            ? "1px solid rgba(216,180,254,0.6)"
            : "1px solid rgba(255,255,255,0.5)",
        boxShadow:
          index <= 1
            ? "0 0 10px 3px rgba(168,85,247,0.55), 0 0 20px 6px rgba(168,85,247,0.25)"
            : isOpen
              ? "0 0 12px rgba(255,255,255,0.45)"
              : "0 0 6px rgba(255,255,255,0.2)",
        transition: "box-shadow 0.3s ease",
      }}
    />
  );
}

function ExperienceCard({
  exp,
  isOpen,
  onToggle,
}: {
  exp: Exp;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full text-left rounded-xl lift-hover"
      style={{
        background: isOpen
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.03)",
        border: isOpen
          ? "1px solid rgba(255,255,255,0.18)"
          : "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "12px 14px",
      }}
    >
      <h3
        className="leading-tight mb-1"
        style={{
          fontFamily: "var(--font-sentient)",
          fontWeight: 200,
          fontSize: "1.05rem",
          color: "#ffffff",
        }}
      >
        {exp.company}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {exp.role}
      </p>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p
              className="mt-3 mb-3"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              {exp.period}
            </p>
            <ul className="space-y-2">
              {exp.points.map((point, i) => (
                <li
                  key={i}
                  className="flex gap-2 leading-relaxed"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255,255,255,0.2)",
                      flexShrink: 0,
                    }}
                  >
                    —
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="experience"
      className="pt-2 pb-8 relative z-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          // where i've been
        </motion.p>

        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-3xl md:text-4xl text-center mb-0"
          style={{
            fontFamily: "var(--font-sentient)",
            fontWeight: 200,
            color: "#ffffff",
            lineHeight: 1.1,
          }}
        >
          Work Experience
        </motion.h2>
      </div>

      {/* Mobile / tablet: vertical timeline */}
      <div className="mt-6 w-full relative lg:hidden px-6">
        <div className="relative max-w-xl mx-auto">
          <div
            className="absolute left-[5px] top-3 bottom-3 w-px pointer-events-none"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
          <div className="space-y-6">
            {experiences.map((exp, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.08 + 0.15 }}
                  className="relative flex gap-4 items-start"
                >
                  <div className="relative z-10 flex flex-col items-center w-3 flex-shrink-0 pt-1">
                    <TimelineDot index={index} isOpen={isOpen} />
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <span
                      className="block mb-2"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      {exp.period.split("—")[0].trim()}
                    </span>
                    <ExperienceCard
                      exp={exp}
                      isOpen={isOpen}
                      onToggle={() =>
                        setOpenIndex(isOpen ? null : index)
                      }
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop: horizontal timeline */}
      <div className="mt-6 w-full relative overflow-hidden hidden lg:block">
        <div
          className="flex items-center relative"
          style={{
            width: "100%",
            paddingLeft: "80px",
            paddingRight: "48px",
            paddingTop: "44px",
            paddingBottom: "44px",
          }}
        >
          <div
            className="absolute left-0 right-0"
            style={{
              top: "50%",
              height: "1px",
              background: "rgba(255,255,255,0.12)",
              transform: "translateY(-0.5px)",
              pointerEvents: "none",
            }}
          />

          {experiences.map((exp, index) => {
            const isAbove = index % 2 === 0;
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: isAbove ? -30 : 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: index * 0.12 + 0.2 }}
                className="relative flex-1 min-w-0 flex flex-col items-center"
              >
                <div
                  style={{
                    order: isAbove ? 1 : 3,
                    marginBottom: isAbove ? "20px" : 0,
                    marginTop: isAbove ? 0 : "20px",
                    width: "100%",
                    paddingLeft: "6px",
                    paddingRight: "6px",
                  }}
                >
                  <ExperienceCard
                    exp={exp}
                    isOpen={isOpen}
                    onToggle={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                  />
                </div>

                <div style={{ order: 2, position: "relative", zIndex: 2 }}>
                  <span
                    className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.3)",
                      top: isAbove ? "20px" : "auto",
                      bottom: isAbove ? "auto" : "20px",
                    }}
                  >
                    {exp.period.split("—")[0].trim()}
                  </span>

                  <TimelineDot index={index} isOpen={isOpen} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

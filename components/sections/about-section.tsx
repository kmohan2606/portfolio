"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Mail } from "lucide-react";

const skills = [
  {
    category: "Languages",
    items: [
      "Python",
      "Go",
      "Java",
      "C",
      "C++",
      "TypeScript",
      "SQL",
      "Erlang/OTP",
    ],
  },
  {
    category: "Frameworks & Libraries",
    items: [
      "React",
      "FastAPI",
      "Spring Boot",
      "Flask",
      "Next.js",
      "gRPC",
      "OpenCV",
      "TensorFlow Lite",
      "NumPy",
      "SciPy",
    ],
  },
  {
    category: "Infrastructure & Tools",
    items: [
      "Docker",
      "Kubernetes",
      "Kafka",
      "Redis",
      "PostgreSQL",
      "Git",
      "CI/CD",
      "Selenium",
    ],
  },
  {
    category: "Cloud & Monitoring",
    items: [
      "AWS (ECS, Lambda, RDS, S3)",
      "GCP",
      "Terraform",
      "Prometheus",
      "Grafana",
      "OpenTelemetry",
      "CloudWatch",
    ],
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-16 px-6 relative z-10">
      <div className="max-w-3xl mx-auto" ref={ref}>
        {/* Bio card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative rounded-2xl p-8 md:p-10 mb-6 text-center"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <div className="tracer-border" />
          <h2
            className="text-3xl md:text-4xl text-white mb-6"
            style={{ fontFamily: "var(--font-sentient)", fontWeight: 200 }}
          >
            About Me
          </h2>

          <div className="space-y-4 text-silver/80 leading-relaxed text-left">
            <p>
              {
                "hey, i'm kedar — a computer engineering student at uga who builds things that (hopefully) work at 3am."
              }
            </p>
            <p>
              {
                "i'm joining amazon stores as a swe intern this summer, and right now i'm at zhao nano lab helping ship new features into a raman spectroscopy workflow used by 1500+ researchers worldwide — which is a sentence i still can't believe i get to say."
              }
            </p>
            <p>
              {
                "i spend most of my time at the intersection of systems, ml, and applied engineering. i've built everything from ai tools that turn hand-drawn floorplans into 3d cad models, to a smartwatch that predicts heart attacks — the kind of projects where you learn the most by breaking things spectacularly first. if it's hard and ships, i'm interested."
              }
            </p>
            <p>
              {
                "when i'm not coding i'm either deep in a game, finding my next favorite indie track, or reading philosophy and pretending i have answers to questions nobody asked."
              }
            </p>
            <p>
              {
                "i like building things that are fast, a little ambitious, and actually useful. if that sounds like your kind of person — hey, nice to meet you."
              }
            </p>
          </div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center gap-4 mt-8"
          >
            {[
              {
                icon: Github,
                href: "https://github.com/kedarnath-mohan",
                label: "GitHub",
              },
              {
                icon: Linkedin,
                href: "https://linkedin.com/in/kedarnath-mohan",
                label: "LinkedIn",
              },
              { icon: Mail, href: "mailto:km67812@uga.edu", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-silver/30 text-silver hover:text-white lift-hover"
                aria-label={label}
              >
                <Icon size={20} />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="rounded-2xl p-8 md:p-10"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <h3
            className="text-xl text-white mb-8 text-center"
            style={{ fontFamily: "var(--font-sentient)", fontWeight: 200 }}
          >
            Technical Skills
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            {skills.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
              >
                <p
                  className="mb-3 tracking-widest uppercase"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-md"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

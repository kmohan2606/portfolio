"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ExternalLink } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "Real-Time Arbitrage Engine",
    description: "Concurrent market-feed processor with sub-20ms ingestion latency. Implements a Redis Sorted Set order book with O(log N) price-time priority and surfaces risk-free arbitrage signals via a React dashboard.",
    tech: ["C++", "Erlang/OTP", "FastAPI", "Redis", "PostgreSQL", "React"],
    github: "",
    demo: "",
    closedSource: true,
    gradient: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2e 40%, #0a1628 70%, #00111a 100%)",
    accent: "rgba(100,120,255,0.06)",
  },
  {
    id: 2,
    name: "LumenRoute",
    description: "AI traffic safety platform that detects and scores hazards across 3,000+ live feeds using a tiered YOLO-to-Gemini CV pipeline. Real-time routing algorithm reduced transit risk by 45%.",
    tech: ["Python", "TypeScript", "React", "Gemini API", "YOLOv9", "Docker"],
    github: "https://github.com/kmohan2606/lumenroute",
    demo: "",
    closedSource: false,
    gradient: "linear-gradient(135deg, #1a0d00 0%, #2a1400 40%, #1a0e14 70%, #0d0a00 100%)",
    accent: "rgba(255,160,50,0.06)",
  },
  {
    id: 3,
    name: "Embedded Health Monitor",
    description: "Real-time health analysis firmware for BangleJS2 smartwatch. Achieved 95% classification accuracy at 150ms inference by quantizing models to 8-bit precision — a 92% reduction in model size.",
    tech: ["C", "JavaScript", "TensorFlow Lite", "BLE GATT"],
    github: "https://github.com/kmohan2606/embedded-health-monitor",
    demo: "",
    closedSource: false,
    gradient: "linear-gradient(135deg, #001a0d 0%, #001e14 40%, #001418 70%, #000d1a 100%)",
    accent: "rgba(50,220,130,0.06)",
  },
  {
    id: 4,
    name: "EchoFind",
    description: "Context-aware media search platform ranking songs, videos, and articles by query relevance and user behavior. Kafka ingestion pipeline + Redis caching cut average query latency by 55%.",
    tech: ["Java", "Go", "Python", "FastAPI", "Kafka", "Elasticsearch", "Redis", "React", "AWS Lambda"],
    github: "",
    demo: "",
    closedSource: true,
    gradient: "linear-gradient(135deg, #0d001a 0%, #1a0028 40%, #100018 70%, #080010 100%)",
    accent: "rgba(160,80,255,0.06)",
  },
  {
    id: 5,
    name: "MerchantSync",
    description: "Distributed inventory-sync microservice processing 25K+ gRPC requests/day with 100% data consistency. Query batching and connection pooling cut API latency by 45% and boosted throughput by 30%.",
    tech: ["Go", "gRPC", "PostgreSQL", "AWS ECS", "Redis", "Prometheus", "Docker"],
    github: "",
    demo: "",
    closedSource: true,
    gradient: "linear-gradient(135deg, #001020 0%, #001828 40%, #001420 70%, #000c18 100%)",
    accent: "rgba(40,160,255,0.06)",
  },
  {
    id: 6,
    name: "Transactional",
    description: "Distributed payment simulation platform processing 10K+ transactions/sec across containerized microservices. Kafka streaming pipelines ensured 100% transaction integrity; automated testing cut deployment failures by 60%.",
    tech: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Docker", "Kubernetes", "Selenium"],
    github: "",
    demo: "",
    closedSource: true,
    gradient: "linear-gradient(135deg, #0a1400 0%, #121e00 40%, #0a1800 70%, #060e00 100%)",
    accent: "rgba(120,220,40,0.06)",
  },
]

function ProjectCard({
  project,
  index,
  isInView,
}: {
  project: (typeof projects)[0]
  index: number
  isInView: boolean
}) {
  const githubUrl = project.github?.trim() || null
  const hasGithub = Boolean(githubUrl)

  const cardBody = (
    <article
      className={`group relative flex flex-col h-full rounded-2xl overflow-hidden ${hasGithub ? "" : "lift-hover"}`}
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div
        className="flex flex-col flex-1 p-4"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <h3
          className="text-base text-white mb-1.5 leading-snug"
          style={{ fontFamily: "var(--font-sentient)", fontWeight: 200 }}
        >
          {project.name}
        </h3>

        <p
          className="text-white/50 mb-3 leading-relaxed"
          style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tech.map((tag) => (
            <span key={tag} className="skill-tag" style={{ fontSize: "10px" }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 mt-auto">
          {project.demo &&
            (hasGithub ? (
              <button
                type="button"
                aria-label={`${project.name} live demo`}
                className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(project.demo, "_blank", "noopener,noreferrer")
                }}
              >
                <ExternalLink size={15} />
              </button>
            ) : (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} live demo`}
                className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"
              >
                <ExternalLink size={15} />
              </a>
            ))}
          {project.closedSource && (
            <span
              className="flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.28)" }}
            >
              closed source
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "rgba(239,68,68,0.85)", boxShadow: "0 0 5px rgba(239,68,68,0.5)" }}
              />
            </span>
          )}
        </div>
      </div>
    </article>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="h-full"
    >
      {hasGithub ? (
        <a
          href={githubUrl!}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full rounded-2xl lift-hover no-underline text-inherit cursor-pointer"
          aria-label={`${project.name} on GitHub`}
        >
          {cardBody}
        </a>
      ) : (
        cardBody
      )}
    </motion.div>
  )
}

export function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="projects" className="py-16 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-3 tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          // selected work
        </motion.p>

        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-3xl md:text-4xl text-white text-center mb-8"
          style={{ fontFamily: "var(--font-sentient)", fontWeight: 200 }}
        >
          Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"

const blogPosts = [
  {
    title: "Building Scalable Microservices with Node.js",
    excerpt:
      "A deep dive into architecting microservices that can handle millions of requests.",
    date: "Mar 15, 2024",
    slug: "#",
  },
  {
    title: "The Future of Frontend Development",
    excerpt:
      "Exploring emerging trends and technologies shaping how we build web interfaces.",
    date: "Feb 28, 2024",
    slug: "#",
  },
  {
    title: "Optimizing React Performance",
    excerpt:
      "Practical techniques to make your React applications faster and more responsive.",
    date: "Feb 10, 2024",
    slug: "#",
  },
  {
    title: "Understanding TypeScript Generics",
    excerpt:
      "A comprehensive guide to leveraging the power of generics in TypeScript.",
    date: "Jan 22, 2024",
    slug: "#",
  },
  {
    title: "DevOps Best Practices for Small Teams",
    excerpt:
      "How to implement effective CI/CD pipelines without enterprise resources.",
    date: "Jan 5, 2024",
    slug: "#",
  },
  {
    title: "My Journey into Open Source",
    excerpt:
      "Lessons learned from contributing to and maintaining open source projects.",
    date: "Dec 18, 2023",
    slug: "#",
  },
]

export function BlogSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="blog" className="py-32 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-light text-white text-center mb-16"
          style={{ fontFamily: "var(--font-sentient)", fontWeight: 200 }}
        >
          Blog & Writing
        </motion.h2>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.a
              key={index}
              href={post.slug}
              initial={{ opacity: 0, x: 100 }}
              animate={isInView ? { opacity: 1, x: 0, transition: { delay: index * 0.1, duration: 0.6 } } : {}}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgba(255,255,255,0.1)",
                boxShadow: "0px 0px 0px 0px rgba(255,255,255,0), 0px 0px 0px 0px rgba(255,255,255,0), 0px 0px 0px 0px rgba(255,255,255,0)",
              }}
              whileHover={{
                y: -8,
                borderColor: "rgba(255,255,255,0.35)",
                boxShadow: "0 8px 0 0 rgba(255,255,255,0.9), 0 8px 0 1px rgba(255,255,255,0.15), 0 10px 16px 2px rgba(255,255,255,0.12)",
                transition: { duration: 0.22, ease: "easeOut" },
              }}
              className="group block p-6 rounded-xl bg-black/30"
            >
              <p
                className="text-silver/50 text-sm mb-3 font-mono"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {post.date}
              </p>
              <h3 className="text-lg font-medium text-white mb-2 group-hover:text-silver-light transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-silver/60 text-sm leading-relaxed mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 text-silver text-sm group-hover:text-white transition-colors">
                Read more
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

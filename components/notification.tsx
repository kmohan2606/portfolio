"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  X,
  Bell,
  Send,
  MessageSquare,
  FileDown,
} from "lucide-react";
import { SpotifyBadge } from "@/components/spotify-badge"

const skills = [
  {
    category: "languages",
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
    category: "frameworks & libraries",
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
    category: "infrastructure & tools",
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
    category: "cloud & monitoring",
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

const socialLinks = [
  { icon: Github, href: "https://github.com/kedarnath-mohan", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/kedarnath-mohan",
    label: "LinkedIn",
  },
  { icon: Mail, href: "mailto:km67812@uga.edu", label: "Email" },
];

type SmsStatus = "idle" | "sending" | "success" | "error";

export function Notification() {
  const [phase, setPhase] = useState<"idle" | "open" | "collapsed">("idle");
  const [progress, setProgress] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  // false after the first auto-collapse — prevents timer from restarting on tray click
  const timerActiveRef = useRef(true);

  // Easter egg SMS form
  const [showSms, setShowSms] = useState(false);
  const [smsName, setSmsName] = useState("");
  const [smsPhone, setSmsPhone] = useState("");
  const [smsMsg, setSmsMsg] = useState("");
  const [smsStatus, setSmsStatus] = useState<SmsStatus>("idle");
  const [smsError, setSmsError] = useState("");
  const [autoReplied, setAutoReplied] = useState(false);

  const handleSend = async () => {
    if (!smsMsg.trim() || smsStatus === "sending") return;
    setSmsStatus("sending");
    setSmsError("");
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: smsName,
          phone: smsPhone,
          message: smsMsg,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "something went wrong.");
      setSmsStatus("success");
      setAutoReplied(!!data.autoReplied);
      setSmsName("");
      setSmsPhone("");
      setSmsMsg("");
    } catch (err) {
      setSmsStatus("error");
      setSmsError(err instanceof Error ? err.message : "failed to send.");
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setPhase("open"), 900);
    return () => clearTimeout(t);
  }, []);

  // Countdown timer — only runs on the very first open
  useEffect(() => {
    if (phase !== "open" || !timerActiveRef.current) return;
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const remaining = Math.max(0, 1 - elapsed / 5000);
      setProgress(remaining);
      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        timerActiveRef.current = false; // disable forever after first auto-collapse
        setPhase("collapsed");
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  // After the timer has fired, collapse on scroll so it doesn't linger
  useEffect(() => {
    if (phase !== "open" || timerActiveRef.current) return;
    const collapse = () => setPhase("collapsed");
    window.addEventListener("scroll", collapse, { passive: true, once: true });
    return () => window.removeEventListener("scroll", collapse);
  }, [phase]);

  // ESC to close modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll while modal is open so scroll events don't leak to the page
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const handleCardClick = () => {
    cancelAnimationFrame(rafRef.current);
    setPhase("collapsed");
    setModalOpen(true);
  };

  const handleTrayClick = () => {
    setPhase("open"); // re-shows notification; timer won't run since timerActiveRef is false
  };

  return (
    <>
      {/* Notification card + tray */}
      <div className="fixed top-5 right-5 z-50">
        <AnimatePresence mode="wait">
          {phase === "open" && (
            <motion.button
              key="notification"
              initial={{ x: "120%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "120%", opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              onClick={handleCardClick}
              className="relative overflow-hidden rounded-2xl text-left cursor-pointer block"
              style={{
                width: "272px",
                background: "rgba(8, 8, 18, 0.88)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              <div className="px-5 pt-4 pb-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      background: "rgba(168,85,247,0.9)",
                      boxShadow: "0 0 6px rgba(168,85,247,0.7)",
                    }}
                  />
                  <p
                    className="text-white text-sm"
                    style={{
                      fontFamily: "var(--font-sentient)",
                      fontWeight: 200,
                    }}
                  >
                    new message!
                  </p>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "rgba(255,255,255,0.38)",
                  }}
                >
                  hey, kedar here! 👋
                  <br />
                  <span style={{ color: "rgba(168,85,247,0.75)" }}>
                    click to read more →
                  </span>
                </p>
              </div>

              {/* Bottom tracer — shrinks as timer counts down */}
              <div
                className="absolute bottom-0 left-0"
                style={{
                  height: "2px",
                  width: `${progress * 100}%`,
                  background:
                    "linear-gradient(to right, rgba(168,85,247,0.25), rgba(216,180,254,0.75) 35%, rgba(255,255,255,1) 55%, rgba(216,180,254,0.75) 75%, rgba(168,85,247,0.25))",
                  transition: "width 0.05s linear",
                }}
              />
            </motion.button>
          )}

          {phase === "collapsed" && (
            <motion.button
              key="tray"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 18, stiffness: 260 }}
              onClick={handleTrayClick}
              title="about me — click to expand"
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(168,85,247,0.12)",
                border: "1px solid rgba(168,85,247,0.28)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <Bell size={15} style={{ color: "rgba(216,180,254,0.85)" }} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* About Me modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-10"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(0,0,0,0.72)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              onClick={() => setModalOpen(false)}
            />

            {/* Modal card — no backdrop-filter here: it glitches transparent while scrolling on WebKit/Chromium */}
            <motion.div
              key="modal-card"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="relative z-10 w-full max-w-2xl max-h-[82vh] overflow-y-auto rounded-2xl"
              style={{
                background: "rgba(8,8,20,0.97)",
                border: "1px solid rgba(255,255,255,0.08)",
                scrollbarWidth: "none",
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
                isolation: "isolate",
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <X size={14} />
              </button>

              <div className="p-8 md:p-10">
                {/* Heading */}
                <h2
                  className="text-3xl md:text-4xl text-white mb-6 text-center"
                  style={{
                    fontFamily: "var(--font-sentient)",
                    fontWeight: 200,
                  }}
                >
                  a little bit about me
                </h2>

                {/* Bio */}
                <div className="space-y-4 text-silver/80 leading-relaxed mb-8">
                  <p>
                    {
                      "hey! i'm kedar– a computer engineering student at the university of georgia who builds things that (for the most part) work at 3am."
                    }
                  </p>
                  <p>
                    {
                      "i'll joining amazon stores as a sde intern this summer, and i'm currently doing research with prof. yiping zhao (zhao nano lab) helping ship new features into a raman spectroscopy workflow used by 1500+ researchers worldwide (still can't believe i get to say that lol)."
                    }
                  </p>
                  <p>
                    {
                      "i try to spend most of my time at the intersection of systems, ml, and applied engineering. i've built everything from ai tools that turn hand-drawn floorplans into 3d cad models, to an app on a hackable smartwatch that predicts heart attacks — the kind of projects where you learn the most by breaking things spectacularly first."
                    }
                  </p>
                  <p>
                    {
                      "when i'm not coding i'm either deep in a game, finding my next favorite indie track, or reading philosophy and pretending i have answers to questions nobody asked."
                    }
                  </p>
                  <p>
                    {
                      "i like building things that are fast, a little ambitious, and actually useful. if that sounds like your kind of person - hey, nice to meet you."
                    }
                  </p>
                </div>

                {/* Spotify + social links — two columns */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
                  <div className="flex-1 min-w-0">
                    <SpotifyBadge />
                  </div>
                  <div className="flex justify-center sm:justify-end gap-4 flex-shrink-0">
                    {socialLinks.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl border border-silver/30 text-silver hover:text-white lift-hover"
                        aria-label={label}
                      >
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="mb-8"
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.06)",
                  }}
                />

                {/* Skills */}
                <h3
                  className="text-lg text-white mb-6 text-center"
                  style={{
                    fontFamily: "var(--font-sentient)",
                    fontWeight: 200,
                  }}
                >
                  technical skills
                </h3>

                <div className="grid sm:grid-cols-2 gap-6">
                  {skills.map((group) => (
                    <div key={group.category}>
                      <p
                        className="mb-2.5 tracking-widest uppercase"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          color: "rgba(255,255,255,0.3)",
                        }}
                      >
                        {group.category}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-1 rounded-md"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.09)",
                              fontFamily: "var(--font-mono)",
                              fontSize: "11px",
                              color: "rgba(255,255,255,0.65)",
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Resume download ── */}
                <div className="mt-6 flex justify-center">
                  <a
                    href="/resume.pdf"
                    download="Kedarnath_Mohan_Resume.pdf"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl lift-hover"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "rgba(216,180,254,0.85)",
                      border: "1px solid rgba(168,85,247,0.28)",
                      background: "rgba(168,85,247,0.08)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <FileDown size={13} />
                    download resume
                  </a>
                </div>

                {/* ── Easter egg: SMS form ── */}
                <div className="mt-8">
                  <button
                    onClick={() => {
                      setShowSms((v) => !v);
                      setSmsStatus("idle");
                    }}
                    className="flex items-center gap-1.5 mx-auto transition-opacity"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: showSms
                        ? "rgba(168,85,247,0.7)"
                        : "rgba(255,255,255,0.15)",
                      letterSpacing: "0.06em",
                      transition: "color 0.15s",
                    }}
                  >
                    <MessageSquare size={11} />
                    {showSms ? "never mind" : "psst — text me"}
                  </button>

                  <AnimatePresence>
                    {showSms && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          className="mt-4 rounded-xl p-4"
                          style={{
                            background: "rgba(168,85,247,0.05)",
                            border: "1px solid rgba(168,85,247,0.15)",
                          }}
                        >
                          {smsStatus === "success" ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-center py-2 space-y-1"
                            >
                              <p
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "12px",
                                  color: "rgba(168,85,247,0.85)",
                                }}
                              >
                                sent! kedar will hit you back soon 🙌
                              </p>
                              {autoReplied && (
                                <p
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "11px",
                                    color: "rgba(255,255,255,0.3)",
                                  }}
                                >
                                  (check your texts — sent you a confirmation)
                                </p>
                              )}
                            </motion.div>
                          ) : (
                            <div className="flex flex-col gap-2.5">
                              <input
                                type="text"
                                placeholder="your name (optional)"
                                value={smsName}
                                onChange={(e) => setSmsName(e.target.value)}
                                maxLength={60}
                                className="w-full rounded-lg px-3 py-2 outline-none"
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.07)",
                                  color: "rgba(255,255,255,0.75)",
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "12px",
                                }}
                              />
                              <input
                                type="tel"
                                placeholder="your number — so i can text back (optional)"
                                value={smsPhone}
                                onChange={(e) => setSmsPhone(e.target.value)}
                                maxLength={20}
                                className="w-full rounded-lg px-3 py-2 outline-none"
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.07)",
                                  color: "rgba(255,255,255,0.75)",
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "12px",
                                }}
                              />
                              <textarea
                                placeholder="say something..."
                                value={smsMsg}
                                onChange={(e) => setSmsMsg(e.target.value)}
                                maxLength={500}
                                rows={3}
                                className="w-full rounded-lg px-3 py-2 outline-none resize-none"
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.07)",
                                  color: "rgba(255,255,255,0.75)",
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "12px",
                                }}
                              />
                              <div className="flex items-center justify-between">
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "10px",
                                    color: "rgba(255,255,255,0.18)",
                                  }}
                                >
                                  {smsMsg.length}/500
                                </span>
                                <button
                                  onClick={handleSend}
                                  disabled={
                                    !smsMsg.trim() || smsStatus === "sending"
                                  }
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    background: smsMsg.trim()
                                      ? "rgba(168,85,247,0.2)"
                                      : "rgba(255,255,255,0.04)",
                                    border: `1px solid ${smsMsg.trim() ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.07)"}`,
                                    color: smsMsg.trim()
                                      ? "rgba(216,180,254,0.9)"
                                      : "rgba(255,255,255,0.2)",
                                    cursor: smsMsg.trim()
                                      ? "pointer"
                                      : "not-allowed",
                                    transition:
                                      "background 0.15s, border-color 0.15s, color 0.15s",
                                  }}
                                >
                                  <Send size={10} />
                                  {smsStatus === "sending"
                                    ? "sending..."
                                    : "send"}
                                </button>
                              </div>
                              {smsStatus === "error" && (
                                <p
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "11px",
                                    color: "rgba(248,113,113,0.8)",
                                  }}
                                >
                                  {smsError}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

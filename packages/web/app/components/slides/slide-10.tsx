"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Slide10() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden">
      {/* Background gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-mypage/20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-success/20 blur-3xl"
      />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl px-8">
        {/* Theme connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="text-sm font-medium text-mypage tracking-widest uppercase">
            Identity
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl tracking-tight mb-6"
        >
          Every user is{" "}
          <span className="text-mypage">unique</span>.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl text-muted-foreground mb-8 leading-relaxed"
        >
          Their experience should be too.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-24 h-px bg-border mx-auto mb-8"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          Frictionless learns from every click, every scroll, every moment of hesitation.
          Then it evolves your product—automatically—so each user gets the interface
          they deserve.
        </motion.p>

        {/* CTA catchphrase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-12"
        >
          <span className="text-3xl tracking-tight">
            What will{" "}
            <span className="text-mypage">your product</span>
            {" "}become?
          </span>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-mypage text-white rounded-full text-lg font-medium shadow-lg shadow-mypage/25 hover:shadow-xl hover:shadow-mypage/30 transition-shadow"
          >
            Start building
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="size-5" />
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-16 flex items-center justify-center gap-3 text-sm text-muted-foreground"
        >
          <span className="font-semibold text-foreground">Frictionless</span>
          <span className="text-border">|</span>
          <span>The AI Agent that evolves your product</span>
        </motion.div>
      </div>

      {/* Floating user avatars representing different identities */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: "15%", left: "8%", delay: 0.3, label: "New User" },
          { top: "25%", right: "10%", delay: 0.5, label: "Power User" },
          { top: "70%", left: "12%", delay: 0.7, label: "Enterprise" },
          { top: "65%", right: "8%", delay: 0.9, label: "Mobile" },
        ].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 0.5, delay: pos.delay + 0.5 }}
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
            }}
            className="absolute"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1"
            >
              <div className="size-10 rounded-full bg-gradient-to-br from-mypage/30 to-mypage/10 border border-mypage/20 flex items-center justify-center text-xs font-medium text-mypage/70">
                {pos.label[0]}
              </div>
              <span className="text-[10px] text-muted-foreground/50">{pos.label}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

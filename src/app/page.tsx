"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Brain,
  Users,
  Bell,
  TrendingUp,
  Shield,
  ChevronRight,
  Sparkles,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

// Animated gradient orb component
function GradientOrb({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(
        "absolute rounded-full blur-3xl opacity-30 pointer-events-none",
        className
      )}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Feature card component
function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <motion.div
      className="group relative p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border-default)] overflow-hidden"
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Gradient background on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
          gradient
        )}
      />

      <div className="relative space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--surface-3)] flex items-center justify-center group-hover:bg-[var(--accent)]/20 transition-colors">
          <Icon className="w-6 h-6 text-[var(--accent)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// Stat card component
function StatCard({
  value,
  label,
  suffix = "",
}: {
  value: string;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tabular-nums">
        {value}
        <span className="text-[var(--accent)]">{suffix}</span>
      </div>
      <div className="text-sm text-[var(--text-tertiary)] mt-1">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-1)] overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--hot)] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">
                KalshiAI
              </span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Documentation
              </a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" className="hidden sm:inline-flex">
                  Launch App
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4">
        {/* Background orbs */}
        <GradientOrb className="w-[600px] h-[600px] bg-[var(--accent)] -top-40 -left-40" />
        <GradientOrb className="w-[500px] h-[500px] bg-[var(--hot)] top-20 -right-40" />
        <GradientOrb className="w-[400px] h-[400px] bg-[var(--up)] bottom-0 left-1/3" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px),
                             linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-sm text-[var(--accent)] mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Prediction Market Intelligence</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            <span className="text-[var(--text-primary)]">See the market</span>
            <br />
            <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--hot)] to-[var(--up)] bg-clip-text text-transparent">
              before everyone else
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
          >
            AI-powered probability analysis, smart money tracking, and real-time
            alerts. Get the edge you need on Kalshi.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto text-base px-8">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base px-8"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16"
          >
            <StatCard value="$18B+" label="Markets Analyzed" />
            <StatCard value="10K+" label="Active Traders" />
            <StatCard value="87%" label="AI Accuracy" />
            <StatCard value="<100" label="ms Latency" suffix="ms" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-[var(--accent)] uppercase tracking-wider"
            >
              Features
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-4 text-3xl md:text-4xl font-bold text-[var(--text-primary)]"
            >
              Your Unfair Advantage
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-[var(--text-secondary)] max-w-2xl mx-auto"
            >
              Powerful AI tools designed to give you an edge in prediction
              markets
            </motion.p>
          </div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Brain}
              title="Truth Engine"
              description="AI analyzes real-world data to calculate independent probability estimates. Find mispriced markets instantly."
              gradient="bg-gradient-to-br from-[var(--accent)] to-transparent"
            />
            <FeatureCard
              icon={Users}
              title="Smart Money Tracker"
              description="Follow wallets with proven track records. Get alerts when smart money enters positions."
              gradient="bg-gradient-to-br from-[var(--up)] to-transparent"
            />
            <FeatureCard
              icon={Zap}
              title="Grok News Arbitrage"
              description="Real-time news detection from X/Twitter. Trade before breaking news prices in."
              gradient="bg-gradient-to-br from-[var(--hot)] to-transparent"
            />
            <FeatureCard
              icon={Bell}
              title="Real-Time Alerts"
              description="Millisecond notifications for whale moves, price changes, and smart money activity."
              gradient="bg-gradient-to-br from-[var(--warning)] to-transparent"
            />
            <FeatureCard
              icon={Shield}
              title="Oracle Risk Radar"
              description="Avoid disputed markets. AI analyzes resolution criteria for ambiguity risk."
              gradient="bg-gradient-to-br from-[var(--down)] to-transparent"
            />
            <FeatureCard
              icon={BarChart3}
              title="Market Screener"
              description="Filter by liquidity, volume, AI edge, and whale activity. Find opportunities fast."
              gradient="bg-gradient-to-br from-[var(--info)] to-transparent"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-3)] border border-[var(--border-default)] overflow-hidden"
          >
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] rounded-full blur-[100px] opacity-20" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--hot)] rounded-full blur-[80px] opacity-20" />

            <div className="relative text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)]">
                Ready to get your edge?
              </h2>
              <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto">
                Join thousands of traders using AI-powered intelligence to make
                better predictions on Kalshi.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-sm text-[var(--text-muted)]">
                  No credit card required
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--hot)] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[var(--text-primary)]">
                KalshiAI
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-tertiary)]">
              <a href="#" className="hover:text-[var(--text-secondary)]">
                Terms
              </a>
              <a href="#" className="hover:text-[var(--text-secondary)]">
                Privacy
              </a>
              <a href="#" className="hover:text-[var(--text-secondary)]">
                Documentation
              </a>
              <a href="#" className="hover:text-[var(--text-secondary)]">
                Contact
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-[var(--text-muted)]">
              &copy; 2025 KalshiAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

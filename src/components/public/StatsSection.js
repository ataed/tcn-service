"use client";

import { useEffect, useState, useRef } from "react";

export default function StatsSection({ stats }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // 1. Detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once triggered (runs only once)
          observer.disconnect();
        }
      },
      { threshold: 0.3 }, // Trigger when 30% visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
          {stats.map((stat, idx) => (
            <StatItem key={idx} stat={stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 🟢 Sub-component for individual counting logic
function StatItem({ stat, isVisible }) {
  const [count, setCount] = useState(0);

  // Parse the number and suffix (e.g., "12+" -> num: 12, suffix: "+")
  // or "2K+" -> num: 2, suffix: "K+"
  const rawValue = stat.value;
  const numValue = parseFloat(rawValue.replace(/[^0-9.]/g, ""));
  const suffix = rawValue.replace(/[0-9.]/g, "");

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = numValue;
    // Luxury duration: slower is more elegant (2000ms)
    const duration = 2000;
    const incrementTime = 30; // Update every 30ms
    const totalSteps = duration / incrementTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isVisible, numValue]);

  return (
    <div className="py-12 text-center group hover:bg-white/[0.02] transition-colors duration-500">
      <div className="text-4xl md:text-5xl font-serif text-white mb-2 group-hover:text-accent-500 transition-colors flex justify-center items-center gap-0.5">
        {/* The Number */}
        <span>{count % 1 !== 0 ? count.toFixed(1) : Math.floor(count)}</span>

        {/* The Suffix (K, +, etc) */}
        <span className="text-accent-500/80">{suffix}</span>
      </div>
      <div className="text-[10px] uppercase tracking-widest text-white/40">
        {stat.label}
      </div>
    </div>
  );
}

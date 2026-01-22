"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function StatsSection({ stats }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { locale } = useParams();
  const isArabic = locale === "ar";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }, // Trigger slightly earlier for better feel
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="max-w-7xl mx-auto px-4 py-12"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* 🟢 FIXED GRID: 2 columns mobile, 4 columns desktop. Divide handles RTL perfectly */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/10 rounded-3xl overflow-hidden bg-white/[0.02] divide-x divide-y divide-white/10 rtl:divide-x-reverse backdrop-blur-sm">
        {stats.map((stat, idx) => (
          <StatItem key={idx} stat={stat} isVisible={isVisible} index={idx} />
        ))}
      </div>
    </section>
  );
}

function StatItem({ stat, isVisible, index }) {
  const [count, setCount] = useState(0);

  const rawValue = stat.value;
  const numValue = parseFloat(rawValue.replace(/[^0-9.]/g, ""));
  const suffix = rawValue.replace(/[0-9.]/g, "");

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = numValue;
    const duration = 2000;
    const incrementTime = 30;
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
    <div
      className={`
      py-12 px-4 text-center group hover:bg-white/[0.03] transition-all duration-500 flex flex-col justify-center items-center
      ${index < 2 ? "border-t-0" : ""} 
      ${index % 2 === 0 ? "border-l-0" : ""}
      lg:border-t-0
    `}
    >
      <div className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-3 group-hover:text-accent-500 transition-colors flex justify-center items-baseline gap-1">
        <span>{count % 1 !== 0 ? count.toFixed(1) : Math.floor(count)}</span>
        <span className="text-accent-500 font-sans text-2xl md:text-3xl">
          {suffix}
        </span>
      </div>
      <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium leading-tight max-w-[120px] mx-auto">
        {stat.label}
      </div>
    </div>
  );
}

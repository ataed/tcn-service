"use client";

import { useState, useEffect } from "react";

export default function ClientHeaderWrapper({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Switch to solid background after scrolling 50px
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-primary-950/95 backdrop-blur-md shadow-xl py-2" // Scrolled State
          : "bg-transparent py-6" // Transparent State (Top)
      }`}
    >
      {children}
    </header>
  );
}

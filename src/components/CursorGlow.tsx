import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { isInteractingWithUI } from "../stores/themeStore";

const CursorGlow: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const isBlocked = useStore(isInteractingWithUI);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Hidden on mobile or when menu is blocked
  return (
    <div
      className="hidden md:block fixed inset-0 pointer-events-none z-[9999] opacity-30 transition-opacity duration-700"
      style={{
        background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, var(--theme-brand-glow), transparent 60%)`,
        mixBlendMode: 'screen',
        opacity: isBlocked ? 0 : 0.25
      }}
    />
  );
};

export default CursorGlow;

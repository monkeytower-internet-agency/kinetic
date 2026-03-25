import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useTranslations, type Language } from "../i18n/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, ScrollTrigger);
}

interface HeroSliderProps {
  lang?: Language;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ lang = "de" }) => {
  const t = useTranslations(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const shadowGhostRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [currentType, setCurrentType] = useState<"Alltag" | "Abenteuer">(
    "Alltag",
  );

  useEffect(() => {
    if (!containerRef.current || !handleRef.current || !overlayRef.current)
      return;

    const container = containerRef.current;
    const handle = handleRef.current;
    const spinTarget = handle.querySelector(".spin-target");

    let cumulativeRotation = 0;

    // Intro Timeline Ref for interruption
    const introTl = gsap.timeline({
      delay: 0.5,
    });

    // --- 1. DRAGGABLE LOGIC ---
    Draggable.create(handle, {
      type: "x",
      bounds: container,
      allowNativeTouchScrolling: false,
      onPress: function () {
        introTl.kill(); // Stop intro on touch/click
      },
      onDrag: function () {
        introTl.kill(); // Ensure it stays dead
        const x = this.x;
        const progress = x / container.offsetWidth;

        // Pixel-sharp sync: direct DOM manipulation
        gsap.set(overlayRef.current, {
          clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
        });
        gsap.set(shadowGhostRef.current, { x: x });

        // Interaction remains sharp locally, but we stop forcing window scroll
        // to prevent unexpected viewport jumps on click.

        if (progress <= 0.5) setCurrentType("Abenteuer");
        else setCurrentType("Alltag");

        if (spinTarget) {
          cumulativeRotation += this.deltaX * 2;
          gsap.set(spinTarget, { rotation: cumulativeRotation });
        }
      },
      onDragEnd: function () {
        if (spinTarget) {
          const velocity = this.getVelocity("x") || 0;
          const momentumRotation = cumulativeRotation + velocity * 0.1;
          const nearestVertical = Math.round(momentumRotation / 180) * 180;

          gsap.to(spinTarget, {
            rotation: nearestVertical,
            duration: 1.2,
            ease: "power3.out",
            onComplete: () => {
              cumulativeRotation = nearestVertical;
            },
          });
        }
      },
    });

    // Kill intro if user scrolls before it's done
    const killIntro = () => introTl.kill();
    window.addEventListener("wheel", killIntro, { once: true });
    window.addEventListener("touchmove", killIntro, { once: true });

    // --- 3. INITIAL STATE & INTRO ---
    const initialPos = container.offsetWidth;

    // Set starting position for intro (off-canvas)
    gsap.set(handle, {
      x: -300,
      y: -200,
      opacity: 0,
      scale: 1.4,
    });
    gsap.set(spinTarget, { rotation: -720 });
    gsap.set(shadowGhostRef.current, { x: -300 });
    gsap.set(overlayRef.current, { clipPath: "inset(0 100% 0 0)" });

    introTl
      .to(handle, {
        x: initialPos,
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 2.2,
        ease: "power3.inOut",
        onUpdate: function () {
          const x = gsap.getProperty(handle, "x") as number;
          const progress = x / initialPos;
          gsap.set(overlayRef.current, {
            clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
          });
          gsap.set(shadowGhostRef.current, { x: x });
        },
      })
      .to(
        spinTarget,
        {
          rotation: 0,
          duration: 2.5,
          ease: "back.out(1.7)",
        },
        0,
      );

    return () => {
      introTl.kill();
      window.removeEventListener("wheel", killIntro);
      window.removeEventListener("touchmove", killIntro);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/13] md:aspect-[16/10] max-h-[700px] shadow-2xl rounded-[40px] z-20"
    >
      <div className="absolute inset-0 overflow-hidden rounded-[40px] bg-body select-none border border-surface-border">
        {/* Central Interactive Label - Hidden in image on mobile, visible on desktop */}
        <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 z-40">
          <div className="px-6 py-2 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl min-w-[140px] text-center transition-all duration-300">
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-300 ${currentType === "Abenteuer" ? "text-brand" : "text-white"}`}
            >
              {currentType === "Abenteuer"
                ? t("slider.adventure")
                : t("slider.everyday")}
            </span>
          </div>
        </div>

        {/* "After" Image (Background - Abenteuer) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/assets/nachher.jpeg")' }}
        ></div>

        {/* "Before" Image (Overlay - Alltag) */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-cover bg-center transition-none"
          style={{
            backgroundImage: 'url("/assets/vorher.jpeg")',
            clipPath: `inset(0 0% 0 0)`, // Controlled by GSAP
          }}
        ></div>

        {/* Internal Shadow Ghost - Holds the Rail and Shadows so they stay clipped within the image frame */}
        <div
          ref={shadowGhostRef}
          className="absolute top-0 bottom-0 w-1 z-30 pointer-events-none"
          style={{ left: 0 }}
        >
          {/* The Vertical Rail (Airliner Style) with enhanced black distinctive glow - CLIPPED by overflow-hidden parent */}
          <div
            className="absolute -left-1.5 h-full w-3 shadow-[0_0_50px_25px_rgba(0,0,0,0.9)]"
            style={{
              backgroundImage: 'url("/assets/airliner.jpeg")',
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center",
              backgroundSize: "contain",
              opacity: 0.95,
            }}
          ></div>

          {/* Shadow for the Panel - also clipped inside */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 bg-black/40 blur-3xl rounded-full translate-y-4"></div>
          </div>
        </div>
      </div>

      {/* Mobile Label Position - Below the image */}
      <div className="md:hidden mt-6 text-center">
        <div className="inline-block px-6 py-2 bg-surface rounded-full border border-surface-border shadow-sm min-w-[120px]">
          <span
            className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-300 ${currentType === "Abenteuer" ? "text-brand" : "text-content/40"}`}
          >
            {currentType === "Abenteuer"
              ? t("slider.adventure")
              : t("slider.everyday")}
          </span>
        </div>
      </div>

      {/* Slider Handle (Visible Orange Panel) - Outside overflow-hidden to allow protruding beyond edges */}
      <div
        ref={handleRef}
        className="absolute top-0 bottom-0 w-px z-30 cursor-ew-resize flex items-center justify-center"
        style={{ left: 0, touchAction: "none" }}
      >
        {/* Transparent Hit Area - 100px wide, but Doesn't restrict the 1px parent's bounds */}
        <div className="absolute inset-0 w-[60px] -ml-[30px] md:w-[100px] md:-ml-[50px] group/handle flex items-center justify-center">
          <div className="relative pointer-events-none">
            <div className="spin-target w-16 h-16 md:w-24 md:h-24 relative flex items-center justify-center">
              {/* Dynamic CSS Mask to inherit Theme Brand Color */}
              <div
                className="w-full h-full bg-brand scale-110 md:scale-125 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover/handle:scale-[1.15] opacity-95"
                style={{
                  WebkitMaskImage: 'url("/assets/orange_panel_alpha.png")',
                  maskImage: 'url("/assets/orange_panel_alpha.png")',
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                }}
              />
            </div>
            {/* Enhanced Glow to make the panel pop */}
            <div className="absolute inset-0 rounded-full bg-brand/30 blur-3xl opacity-0 group-hover/handle:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;

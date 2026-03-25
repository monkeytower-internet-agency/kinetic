import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

const sources = [
  "Van",
  "Transporter",
  "Caddy",
  "Bus",
  "Alltags-Held",
  "Sprinter",
  "Kastenwagen",
  "Ducato",
  "Firmenwagen",
  "Crafter",
  "Boxer",
  "Transit",
  "Vito",
  "Bulli",
  "T6",
  "Vivaro",
  "Jumper",
  "Daily",
  "Laderaum",
  "Lieferwagen",
  "Kombi",
];

const destinations = [
  { word: "Loft", article: "zum" },
  { word: "Suite", article: "zur" },
  { word: "Workspace", article: "zum" },
  { word: "Camper", article: "zum" },
  { word: "Wohnzimmer", article: "zum" },
  { word: "Basecamp", article: "zum" },
  { word: "Hotelzimmer", article: "zum" },
  { word: "Rückzugsort", article: "zum" },
  { word: "Studio", article: "zum" },
  { word: "mobilen Büro", article: "zum" },
  { word: "Office", article: "zum" },

  { word: "Vanlife", article: "in's" },
  { word: "Wochenende", article: "in's" },
  { word: "Kurzurlaub", article: "in den" },
  { word: "um die Welt", article: "" },
  { word: "Familienausflug", article: "zum" },
  { word: "Urlaubsnest", article: "zum" },
  { word: "Abenteuer", article: "in's" },
  { word: "Paradies", article: "in's" },
  { word: "Freiheit", article: "in die" },
  { word: "Roadtrip", article: "zum" },
  { word: "Lieblingsplatz", article: "zum" },
  { word: "Auszeit", article: "zur" },
  { word: "Penthouse", article: "zum" },
  { word: "Surf-Mobil", article: "zum" },
  { word: "Ferienhaus", article: "zum" },
  { word: "Tiny House", article: "zum" },
  { word: "Expeditionsmobil", article: "zum" },
  { word: "Weltreise", article: "zur" },
  { word: "Nomadenleben", article: "in's" },
  { word: "Horizont", article: "zum" },
  { word: "Nordkap", article: "zum" },
  { word: "Strandhaus", article: "zum" },
  { word: "Strand", article: "an den" },
  { word: "Berge", article: "in die" },
  { word: "Städtetrip", article: "zum" },
  { word: "Meer", article: "ans" },
  { word: "See", article: "an den" },
  { word: "Süden", article: "in den" },
  { word: "Sonne", article: "in die" },
  { word: "Küste", article: "an die" },
];

// Pick a random index different from the current one
const randomNext = (current: number, length: number): number => {
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * length);
  }
  return next;
};

const RotatingHeadline: React.FC = () => {
  // Start at index 0 for both SSR and client to avoid hydration mismatch.
  // Randomize after mount in useEffect.
  const [sourceIdx, setSourceIdx] = useState(0);
  const [destIdx, setDestIdx] = useState(0);
  const sourceRef = useRef<HTMLSpanElement>(null);
  const destRef = useRef<HTMLSpanElement>(null);
  const sourceWrapRef = useRef<HTMLSpanElement>(null);
  const destWrapRef = useRef<HTMLSpanElement>(null);
  const articleRef = useRef<HTMLSpanElement>(null);

  const isInitialSource = useRef(true);
  const isInitialDest = useRef(true);

  // Track if we are currently rotating to handle overflow and width locking
  const [isRotatingSource, setIsRotatingSource] = useState(false);
  const [isRotatingDest, setIsRotatingDest] = useState(false);

  const animateWord = useCallback(
    (
      textRef: React.RefObject<HTMLSpanElement | null>,
      wrapRef: React.RefObject<HTMLSpanElement | null>,
      length: number,
      setIdx: React.Dispatch<React.SetStateAction<number>>,
      setIsRotating: (val: boolean) => void,
      onSwap?: () => void,
    ) => {
      if (!textRef.current || !wrapRef.current) return;

      // Ensure we have a pixel width before starting animation
      wrapRef.current.style.width = textRef.current.scrollWidth + "px";
      setIsRotating(true);

      // Phase 1: Soft fade-out
      gsap.to(textRef.current, {
        opacity: 0,
        y: -6,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setIdx((prev) => randomNext(prev, length));
          if (onSwap) onSwap();
        },
      });
    },
    [],
  );

  // Source width management
  useEffect(() => {
    if (!sourceRef.current || !sourceWrapRef.current) return;
    if (isInitialSource.current) {
      isInitialSource.current = false;
      return;
    }

    const newWidth = sourceRef.current.scrollWidth;

    // Animate width and fade in
    gsap.to(sourceWrapRef.current, {
      width: newWidth,
      duration: 0.5,
      ease: "power3.out",
      onComplete: () => {
        // Return to auto width after animation to stay flexible
        if (sourceWrapRef.current) sourceWrapRef.current.style.width = "auto";
        setIsRotatingSource(false);
      },
    });

    gsap.fromTo(
      sourceRef.current,
      { y: 8, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.1,
      },
    );
  }, [sourceIdx]);

  // Destination width management
  useEffect(() => {
    if (!destRef.current || !destWrapRef.current) return;
    if (isInitialDest.current) {
      isInitialDest.current = false;
      return;
    }

    const newWidth = destRef.current.scrollWidth;

    // Animate width and fade in
    gsap.to(destWrapRef.current, {
      width: newWidth,
      duration: 0.5,
      ease: "power3.out",
      onComplete: () => {
        if (destWrapRef.current) destWrapRef.current.style.width = "auto";
        setIsRotatingDest(false);
      },
    });

    gsap.fromTo(
      destRef.current,
      { y: 8, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.1,
      },
    );
  }, [destIdx]);

  useEffect(() => {
    // Randomize starting positions after mount (client-only, avoids SSR mismatch)
    setSourceIdx(Math.floor(Math.random() * sources.length));
    setDestIdx(Math.floor(Math.random() * destinations.length));

    const interval = setInterval(() => {
      // Source rotates independently
      animateWord(
        sourceRef,
        sourceWrapRef,
        sources.length,
        setSourceIdx,
        setIsRotatingSource,
      );
      // Destination rotates independently with slight delay for rhythm
      setTimeout(() => {
        // Fade article out, swap dest, then fade article back in
        if (articleRef.current) {
          gsap.to(articleRef.current, { opacity: 0, duration: 0.3 });
        }
        animateWord(
          destRef,
          destWrapRef,
          destinations.length,
          setDestIdx,
          setIsRotatingDest,
          () => {
            // Fade article back in after swap
            setTimeout(() => {
              if (articleRef.current) {
                gsap.to(articleRef.current, {
                  opacity: 1,
                  duration: 0.4,
                  delay: 0.15,
                });
              }
            }, 0);
          },
        );
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [animateWord]);

  const dest = destinations[destIdx];

  return (
    <h1 className="text-3xl md:text-[52px] tracking-tighter text-content leading-[1.15] md:leading-[1.3] font-normal w-full mx-auto flex flex-wrap justify-center items-baseline gap-x-[0.22em] min-h-[4em] md:min-h-0 md:whitespace-nowrap translate-y-2 md:translate-y-0">
      <span>Vom</span>
      <span
        ref={sourceWrapRef}
        className={`inline-block align-baseline relative ${isRotatingSource ? "overflow-hidden" : ""}`}
        style={{ width: "auto" }}
      >
        <span
          ref={sourceRef}
          className="inline-block font-medium whitespace-nowrap"
        >
          {sources[sourceIdx]}
        </span>
      </span>
      <span ref={articleRef} className="whitespace-nowrap">
        {dest.article}
      </span>
      <span
        ref={destWrapRef}
        className={`inline-block align-baseline relative ${isRotatingDest ? "overflow-hidden" : ""}`}
        style={{ width: "auto" }}
      >
        <span
          ref={destRef}
          className="inline-block font-medium text-brand whitespace-nowrap"
        >
          {dest.word}
        </span>
      </span>
      <span className="whitespace-nowrap">und zurück.</span>
    </h1>
  );
};

export default RotatingHeadline;

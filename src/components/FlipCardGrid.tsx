import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Lock,
  Hourglass,
  Repeat,
  Car,
  ShieldAlert,
  Timer,
  ArrowRight,
  Gem,
  DraftingCompass,
  Maximize2,
  Sparkles,
  ShieldCheck,
  Rocket,
} from "lucide-react";

// Brand Accent Color - Fallback only, preferred is var(--theme-brand)
const BRAND_BRAND = "var(--theme-brand)";

interface CardContent {
  id: number;
  frontTitle: string;
  frontText: string;
  backTitle: string;
  backText: string;
}

interface WhyContent {
  label?: string;
  headline?: string;
  subtitle?: string;
  mobile_click_label?: string;
  cards?: CardContent[];
}

interface Props {
  content?: WhyContent;
}

const icons = [
  {
    front: <Lock className="w-8 h-8 transition-colors duration-300" />,
    back: <Gem className="w-8 h-8" style={{ color: BRAND_BRAND }} />,
  },
  {
    front: <Hourglass className="w-8 h-8 transition-colors duration-300" />,
    back: (
      <DraftingCompass className="w-8 h-8" style={{ color: BRAND_BRAND }} />
    ),
  },
  {
    front: <Repeat className="w-8 h-8 transition-colors duration-300" />,
    back: <Maximize2 className="w-8 h-8" style={{ color: BRAND_BRAND }} />,
  },
  {
    front: <Car className="w-8 h-8 transition-colors duration-300" />,
    back: <Sparkles className="w-8 h-8" style={{ color: BRAND_BRAND }} />,
  },
  {
    front: <ShieldAlert className="w-8 h-8 transition-colors duration-300" />,
    back: <ShieldCheck className="w-8 h-8" style={{ color: BRAND_BRAND }} />,
  },
  {
    front: <Timer className="w-8 h-8 transition-colors duration-300" />,
    back: <Rocket className="w-8 h-8" style={{ color: BRAND_BRAND }} />,
  },
];

const FlipCard = ({
  data,
  icon,
}: {
  data: CardContent;
  icon: (typeof icons)[0];
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;
    const inner = cardRef.current.querySelector(".card-inner");
    gsap.to(inner, {
      y: isHovered ? -12 : -4,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [isHovered]);

  useGSAP(() => {
    if (!cardRef.current) return;
    const inner = cardRef.current.querySelector(".card-inner");
    gsap.to(inner, {
      rotationY: isLocked ? 180 : 0,
      duration: 0.7,
      ease: "back.out(1.2)",
      overwrite: true,
    });
  }, [isLocked]);

  return (
    <div
      className="group perspective-1000 w-full h-[400px] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.preventDefault();
        setIsLocked((prev) => !prev);
      }}
      ref={cardRef}
    >
      <div className="card-inner relative w-full h-full transform-style-3d">
        <div
          className={`absolute w-full h-full backface-hidden bg-surface border border-surface-border rounded-3xl p-10 flex flex-col justify-between transition-shadow duration-500 ease-out ${
            isHovered
              ? "shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
              : "shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
          }`}
        >
          <div className="pt-4">
            <div className="flex items-center gap-6 mb-8">
              <div
                className={`w-16 h-16 flex-shrink-0 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isLocked ? "bg-brand/10 border-brand/40" : "bg-body border-surface-border group-hover:scale-110"}`}
              >
                <div
                  className={`transition-colors duration-300 ${isHovered && !isLocked ? "text-brand" : "text-content/30"}`}
                >
                  {icon.front}
                </div>
              </div>
              <h3
                className={`text-xl md:text-2xl font-bold tracking-tight antialiased leading-tight transition-colors duration-300 break-words [hyphens:auto] ${isHovered && !isLocked ? "text-brand" : "text-content"}`}
              >
                {data.frontTitle}
              </h3>
            </div>
            <p className="text-content/80 text-base md:text-lg leading-relaxed font-light">
              {data.frontText}
            </p>
          </div>
          <div className="flex items-center gap-2 text-content/30 group-hover:text-brand transition-colors">
            <ArrowRight
              className={`w-5 h-5 transition-all duration-500 ${isHovered && !isLocked ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}
            />
          </div>
        </div>

        <div
          className={`absolute w-full h-full backface-hidden rounded-3xl p-10 rotate-y-180 flex flex-col justify-between border transition-all duration-500 ${
            isLocked
              ? "border-brand shadow-[0_20px_50px_rgba(var(--theme-brand-rgb),0.3)]"
              : "border-surface-border shadow-none"
          }`}
          style={{ backgroundColor: "var(--theme-surface)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent rounded-3xl pointer-events-none"></div>
          <div className="pt-4">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 flex-shrink-0 rounded-2xl flex items-center justify-center border border-white/10 bg-surface/5">
                {icon.back}
              </div>
              <h3
                className="text-xl md:text-2xl font-bold tracking-tight antialiased leading-tight break-words [hyphens:auto]"
                style={{ color: BRAND_BRAND, hyphens: "auto" }}
              >
                {data.backTitle}
              </h3>
            </div>
            <p className="text-content text-base md:text-lg leading-relaxed font-light">
              {data.backText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FlipCardGrid({ content }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const data = {
    label: content?.label || "Transformation",
    headline: content?.headline || "Der Status Quo neu gedacht.",
    subtitle:
      content?.subtitle ||
      "Die Freiheit beginnt dort, wo der Festeinbau endet.",
    mobile_click_label: content?.mobile_click_label || "CLICK CARDS",
    cards: content?.cards || [],
  };

  return (
    <section
      id="transformation-section"
      ref={sectionRef}
      className="pt-16 pb-24 bg-surface relative overflow-visible"
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand mb-4">
            {data.label}
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-content tracking-tighter mb-8 leading-[1.1]">
            {data.headline}
          </h2>
          <p
            className="text-xl text-content/70 font-light leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.subtitle }}
          />
        </div>

        <div className="text-center mb-8 md:hidden">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-content/40 font-medium">
            {data.mobile_click_label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {data.cards.map((card, i) => (
            <FlipCard
              key={card.id}
              data={card}
              icon={icons[i % icons.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

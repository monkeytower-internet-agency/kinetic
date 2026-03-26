import React, { useState, useRef, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";

interface FAQItem {
  label: string;
  value: string;
}

interface Props {
  items: FAQItem[];
}

const FAQAccordion: React.FC<Props> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(isOpening ? index : null);
  };

  useEffect(() => {
    // Entrance animation
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll(".faq-item");
      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        }
      );
    }
  }, []);

  useEffect(() => {
    // Accordion expand/collapse
    contentRefs.current.forEach((el, i) => {
      if (!el) return;
      if (openIndex === i) {
        gsap.to(el, { 
          height: "auto", 
          opacity: 1, 
          duration: 0.5, 
          ease: "elastic.out(1, 0.8)" 
        });
      } else {
        gsap.to(el, { 
          height: 0, 
          opacity: 0, 
          duration: 0.3, 
          ease: "power2.inOut" 
        });
      }
    });
  }, [openIndex]);

  if (!items || items.length === 0) return null;

  return (
    <div ref={containerRef} className="space-y-6 max-w-4xl mx-auto w-full">
      {items.map((item, i) => (
        <div 
          key={i} 
          className={`faq-item group overflow-hidden rounded-[2.5rem] border backdrop-blur-md transition-all duration-500 ${
            openIndex === i 
              ? "bg-brand/[0.03] border-brand/30 shadow-[0_30px_100px_rgba(var(--theme-brand-rgb),0.05)]" 
              : "bg-surface/30 border-surface-border/50 hover:bg-surface/50 hover:border-brand/20"
          }`}
        >
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between p-8 md:p-10 text-left focus:outline-none cursor-pointer"
          >
            <span className={`text-xl md:text-2xl font-bold tracking-tight transition-all duration-300 ${openIndex === i ? "text-brand" : "text-content"}`}>
              {item.label}
            </span>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 ${
              openIndex === i ? "bg-brand rotate-180 shadow-lg" : "bg-surface-border/10 group-hover:bg-brand/10"
            }`}>
              {openIndex === i ? (
                <Minus className="w-6 h-6 text-white" />
              ) : (
                <Plus className={`w-6 h-6 transition-transform group-hover:scale-110 ${openIndex === i ? "text-white" : "text-content"}`} />
              )}
            </div>
          </button>

          
          <div 
            ref={el => contentRefs.current[i] = el}
            className="overflow-hidden h-0 opacity-0"
          >
            <div className="p-8 md:p-10 pt-0 text-content/80 font-light leading-relaxed text-lg max-w-3xl">
              {item.value}
            </div>

          </div>

        </div>
      ))}
    </div>
  );
};


export default FAQAccordion;

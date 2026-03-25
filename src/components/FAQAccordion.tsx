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
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(isOpening ? index : null);
  };

  useEffect(() => {
    contentRefs.current.forEach((el, i) => {
      if (!el) return;
      if (openIndex === i) {
        gsap.to(el, { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" });
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" });
      }
    });
  }, [openIndex]);

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4 max-w-4xl mx-auto w-full">
      {items.map((item, i) => (
        <div 
          key={i} 
          className={`group overflow-hidden rounded-3xl border transition-all duration-300 ${
            openIndex === i 
              ? "bg-white/10 border-brand shadow-2xl" 
              : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
          }`}
        >
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
          >
            <span className={`text-xl font-bold transition-colors ${openIndex === i ? "text-brand" : "text-white"}`}>
              {item.label}
            </span>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
              openIndex === i ? "bg-brand rotate-180" : "bg-white/10"
            }`}>
              {openIndex === i ? <Minus className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
            </div>
          </button>
          
          <div 
            ref={el => contentRefs.current[i] = el}
            className="overflow-hidden h-0 opacity-0"
          >
            <div className="p-6 md:p-8 pt-0 text-zinc-400 font-light leading-relaxed">
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;

import React from "react";
import { Wrench, Timer, RotateCcw, ShieldCheck } from "lucide-react";

interface SystemContent {
  label?: string;
  headline?: string;
  story?: string[];
  story_highlight?: string;
  box_label?: string;
  box_text?: string;
  facts?: string[];
  click_label?: string;
  hover_label?: string;
}

interface Props {
  content?: SystemContent;
}

const SystemSection: React.FC<Props> = ({ content }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Fallback defaults in case content is missing
  const data = {
    label: content?.label || "Das System",
    headline: content?.headline || "Echte Freiheit darf kein Luxus sein.",
    story: content?.story || [],
    story_highlight: content?.story_highlight || "",
    box_label: content?.box_label || "Das Geheimnis dahinter",
    box_text: content?.box_text || "",
    facts: content?.facts || [],
    click_label: content?.click_label || "Klick für Details",
    hover_label: content?.hover_label || "Hover für Details",
  };

  const icons = [
    <Wrench className="w-5 h-5" />,
    <Timer className="w-5 h-5" />,
    <RotateCcw className="w-5 h-5" />,
    <ShieldCheck className="w-5 h-5" />,
  ];

  return (
    <section id="system" className="py-24 md:py-32 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand mb-4">
            {data.label}
          </h2>
          <h2
            className="text-4xl md:text-6xl font-extralight text-content tracking-tighter mb-4 antialiased leading-tight"
            dangerouslySetInnerHTML={{ __html: data.headline }}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Left: Story */}
          <div className="space-y-6">
            {data.story.map((para, i) => (
              <p
                key={i}
                className="text-lg md:text-xl text-content/70 leading-relaxed font-light"
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}

            {data.story_highlight && (
              <p className="text-lg md:text-xl text-content leading-relaxed font-medium">
                {data.story_highlight}
              </p>
            )}

            {/* boxxtool Badge */}
            <div className="pt-4">
              <div className="bg-body rounded-2xl p-6 border border-surface-border">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/assets/boxxtool_logo_new.png"
                    alt="boxxtool Logo"
                    className="h-6 object-contain"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-content/60">
                    {data.box_label}
                  </span>
                </div>
                <p className="text-base text-content/70 font-light leading-relaxed mb-5">
                  {data.box_text}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {data.facts.map((text, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-sm text-content font-medium"
                    >
                      <div className="text-brand flex-shrink-0">
                        {icons[i] || icons[0]}
                      </div>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Panel Image */}
          <div
            className="relative group cursor-pointer touch-manipulation"
            onPointerDown={() => setIsOpen(!isOpen)}
          >
            <div className="rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-surface-border relative bg-white font-sans">
              <img
                src="/assets/panel-closed.jpg"
                alt="boxxtool Panel — geschlossen"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <img
                src="/assets/panel-open.jpg"
                alt="boxxtool Panel — geöffnet"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-100 ${isOpen ? "opacity-100" : "opacity-0"} md:group-hover:opacity-100`}
                loading="lazy"
              />
            </div>
            <div className="text-center mt-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-content/60 font-medium">
                <span className="md:hidden">{data.click_label}</span>
                <span className="hidden md:inline">{data.hover_label}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemSection;

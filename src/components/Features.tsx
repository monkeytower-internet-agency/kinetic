import React from "react";
import { Hammer, LayoutGrid, ShieldCheck } from "lucide-react";

const Features: React.FC = () => {
  const features = [
    {
      title: "Handgefertigte Präzision",
      desc: "Jedes Modul wird mit höchster Sorgfalt aus nachhaltigem Holz gefertigt, das aus verantwortungsvoll bewirtschafteten Wäldern stammt.",
      icon: <Hammer className="w-5 h-5 text-content" />,
      bg: "bg-surface",
    },
    {
      title: "Vollmodular",
      desc: "Passe deinen Raum in Minuten an. Unser System ermöglicht es dir, dein Layout jederzeit flexibel umzugestalten.",
      icon: <LayoutGrid className="w-5 h-5 text-content" />,
      bg: "bg-surface",
    },
    {
      title: "5 Jahre Garantie",
      desc: "Wir stehen zu unserer Handwerkskunst. Genieße volle Sicherheit mit unserer umfassenden Garantie auf alle Innenausbauten.",
      icon: <ShieldCheck className="w-5 h-5 text-content" />,
      bg: "bg-surface",
    },
  ];

  return (
    <section className="py-24 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((f) => (
        <div
          key={f.title}
          className="bg-body/50 p-10 rounded-[32px] border border-surface-border hover:shadow-xl hover:bg-surface transition-all duration-300"
        >
          <div
            className={`${f.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-8 shadow-sm`}
          >
            {f.icon}
          </div>
          <h3 className="font-extrabold text-xl tracking-tight mb-4">
            {f.title}
          </h3>
          <p className="text-content/70 leading-relaxed text-sm">{f.desc}</p>
        </div>
      ))}
    </section>
  );
};

export default Features;

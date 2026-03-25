import React from "react";
import { Wrench, Link2, Package, Wind } from "lucide-react";

interface AboutContent {
  label?: string;
  headline?: string;
  job_title?: string;
  tags?: string[];
  story_1?: string[];
  quote?: string;
  list_label?: string;
  box_text?: string;
  list_items?: string[];
  story_2?: string[];
  story_highlight?: string;
  badges?: { label: string; sub: string }[];
}

interface Props {
  content?: AboutContent;
}

const icons = [
  <Wrench className="w-5 h-5" />,
  <Link2 className="w-5 h-5" />,
  <Package className="w-5 h-5" />,
  <Wind className="w-5 h-5" />,
];

const AboutSection: React.FC<Props> = ({ content }) => {
  const data = {
    label: content?.label || "Perspektive",
    headline: content?.headline || (
      <>
        Vom Siemens-Programmierer <br className="hidden md:block" />
        zum <span className="font-bold">ParaNomaden.</span>
      </>
    ),
    job_title: content?.job_title || "IT-Administrator, Pilot, Dadpreneur",
    tags: content?.tags || ["Radio/TV Tech", "Pilot"],
    story_1: content?.story_1 || [
      "Zehn Jahre Siemens-Programmierung prägen. Man lernt, in Systemen zu denken, Fehlerquellen zu eliminieren und Präzision nicht als Option, sondern als Standard zu sehen.",
      "Aber die wahre Freiheit habe ich nicht im Büro gefunden, sondern im Gurtzeug meines Gleitschirms und hinter dem Steuer meines umgebauten Feuerwehr-Trucks, ein Iveco Magirus von 1988. Den Ausbau habe ich auf die harte Tour gelernt: monatelange Arbeit, Tausende Euro in Sackgassen investiert und am Ende gemerkt:",
    ],
    quote:
      content?.quote ||
      "Ich hab's auf die harte Tour gebaut. Genau deshalb weiß ich heute, was du dir sparen kannst.",
    list_label:
      content?.list_label || "Lehrgeld: Ssangyong Rexton (Klassischer Ausbau)",
    box_text:
      content?.box_text ||
      "Garage voll belegt, schwere KFZ-Platten und etliche Baumarkt-Fahrten (teils 4-5 mal am Tag). Das Ergebnis?",
    list_items: content?.list_items || [
      "Klar: Reisen geht.",
      "Aber: Nur noch zu zweit fahren.",
      "Nichts Größeres mehr mitnehmbar.",
      "Für den TÜV alles wieder ausgebaut!",
    ],
    story_2: content?.story_2 || [
      "Heute kombiniere ich meinen IT-Job mit meiner Leidenschaft für das Fliegen. Mit ParaNomad schließe ich die Lücke zwischen improvisiertem Selbstbau und unbezahlbarem Luxus-Camper.",
      'Boxxtool war für mich der "Aha-Moment". Ein industrielles System, das modular, sicher und wertstabil ist. Ich habe das Potenzial gesehen, eigenes Kapital investiert und die Brücke zu verlässlichen Partnern wie dem Autohaus Kölbl geschlagen.',
    ],
    story_highlight:
      content?.story_highlight ||
      "Bei ParaNomad bekommst du heute das System, welches ich selbst gerne von Anfang an gehabt hätte!",
    badges: content?.badges || [
      {
        label: "Eigener Truck-Ausbau",
        sub: "Magirus 1988 – klassisch, komplett, Corona",
      },
      {
        label: "Tief vernetzt",
        sub: "4wheel24, Klinge Metalltechnik, Boxxtool, Uli Dolde",
      },
      {
        label: "5 Sets im Lager",
        sub: "Eigenes Geld. Zum Sonderpreis. Kein Investor.",
      },
      {
        label: "Paragliding-Pilot",
        sub: "XC & Tandem – ich lebe, was ich empfehle",
      },
    ],
  };

  return (
    <section
      id="about"
      className="py-28 px-4 bg-surface border-t border-surface-border"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-24">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand mb-4">
            {data.label}
          </p>
          <h2 className="text-4xl md:text-6xl font-extralight text-content tracking-tighter mb-4 antialiased leading-[1.1]">
            {data.headline}
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start mb-24">
          {/* Left Side: The Foundation & Person */}
          <div className="space-y-12">
            {/* Portrait & Big Name */}
            <div className="flex items-center gap-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-black rounded-3xl blur-2xl opacity-5 group-hover:opacity-10 transition-opacity" />
                <img
                  src="/assets/about-olaf.png"
                  alt="Olaf Klein – ParaNomad"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover shadow-2xl border border-surface-border relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-content tracking-tight mb-2">
                  Olaf Klein
                </h3>
                <p className="text-brand font-medium tracking-wide">
                  {data.job_title}
                </p>
                <div className="flex gap-4 mt-4">
                  {data.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs text-content/60 dark:text-content/80 font-medium px-3 py-1 bg-body rounded-full border border-surface-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Story Part 1: The Why */}
            <div className="space-y-6 text-content/70 leading-relaxed font-light text-lg">
              {data.story_1.map((para, i) => (
                <p key={i}>{para}</p>
              ))}

              {data.quote && (
                <blockquote className="border-l-4 border-brand pl-6 py-2 my-8">
                  <p className="text-content font-medium text-xl italic leading-relaxed">
                    „{data.quote}“
                  </p>
                </blockquote>
              )}

              {/* Rexton "Lehrgeld" Gallery */}
              <div className="mt-12 group/rexton">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-content/40 mb-6">
                  {data.list_label}
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                  {[1, 2, 3, 4].map((num) => (
                    <div
                      key={num}
                      className="aspect-square rounded-2xl overflow-hidden border border-surface-border shadow-sm relative group/img bg-body"
                    >
                      <img
                        src={`/assets/rexton-${num}.jpg`}
                        alt={`Ssangyong Rexton Ausbau ${num}`}
                        className="w-full h-full object-cover grayscale group-hover/rexton:grayscale-0 md:grayscale md:hover:grayscale-0 transition-all duration-700 hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <div className="bg-body/50 rounded-2xl p-6 border border-surface-border mb-12">
                  <p className="text-sm text-content/70 font-light leading-relaxed mb-4 italic">
                    {data.box_text}
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                    {data.list_items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-[13px] text-content font-semibold"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: The Result & Credibility */}
          <div className="space-y-12">
            {/* Big Impression Image */}
            <div className="group relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-auto lg:h-[500px]">
              <img
                src="/assets/about-truck.jpg"
                alt="NELLI – Magirus Ausbau"
                className="w-full h-full object-cover object-[center_57%] transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-anthrazit/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-10 left-10">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                  Das Fundament
                </p>
                <p className="text-white text-2xl font-light tracking-tight">
                  NELLI · Magirus 12-230
                </p>
              </div>
            </div>

            {/* Story Part 2: The Solution */}
            <div className="space-y-6 text-content/70 leading-relaxed font-light text-lg">
              {data.story_2.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <p className="text-content font-medium">{data.story_highlight}</p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.badges.map((badge, i) => (
            <div
              key={i}
              className="flex items-start gap-5 p-6 rounded-3xl bg-body/50 border border-surface-border hover:border-brand/40 hover:bg-surface hover:shadow-xl hover:shadow-brand/5 transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-surface shadow-sm border border-surface-border flex items-center justify-center text-brand flex-shrink-0 group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                {icons[i % icons.length]}
              </div>
              <div>
                <p className="text-base font-bold text-content leading-tight mb-1">
                  {badge.label}
                </p>
                <p className="text-sm text-content/60 font-light leading-snug">
                  {badge.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

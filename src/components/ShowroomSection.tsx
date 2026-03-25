import React from "react";
import { MapPin, Mail, Phone, Globe, ExternalLink, Wrench } from "lucide-react";
import { useTranslations, type Language } from "../i18n/utils";

interface ShowroomData {
  name: string;
  title: string;
  badge_region: string;
  badge_status: string;
  description: string;
  address: string;
  contact_name: string;
  contact_role: string;
  contact_image?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_url?: string;
}

interface ShowroomSectionProps {
  lang?: Language;
  showrooms?: ShowroomData[];
}

const ShowroomSection: React.FC<ShowroomSectionProps> = ({
  lang = "de",
  showrooms = [],
}) => {
  const t = useTranslations(lang);

  return (
    <section
      id="showroom"
      className="py-24 md:py-32 px-4 bg-body border-t border-surface-border"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand mb-4">
            {t("showroom.label")}
          </p>
          <h2 className="text-4xl md:text-6xl font-extralight text-content tracking-tighter mb-4 antialiased leading-tight">
            Anfassen. <span className="font-bold text-brand">Erleben.</span>{" "}
            Einsteigen.
          </h2>
          <p className="text-content/70 text-lg font-light tracking-wide max-w-2xl mx-auto">
            {t("showroom.desc")}
          </p>
        </div>

        <div
          className={`grid grid-cols-1 ${showrooms.length > 1 ? "lg:grid-cols-2" : "max-w-3xl mx-auto"} gap-8 items-stretch`}
        >
          {showrooms.map((room) => {
            const isGeldern = room.name.toLowerCase().includes("geldern");
            const isMuenchen = room.name.toLowerCase().includes("muenchen");

            return (
              <div
                key={room.name}
                className="bg-surface rounded-3xl overflow-hidden shadow-xl shadow-zinc-200/20 dark:shadow-none flex flex-col border border-surface-border group"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={
                      room.contact_image ||
                      (isMuenchen
                        ? "/assets/showroom-crafter.jpg"
                        : "/assets/showroom-dietwald.jpg")
                    }
                    alt={room.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-anthrazit/60 to-transparent opacity-40" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <span
                      className={`${isMuenchen ? "bg-brand" : "bg-anthrazit"} text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg`}
                    >
                      {room.badge_region}
                    </span>
                    <span className="text-white/80 text-[10px] font-medium backdrop-blur-md bg-surface/10 px-3 py-1 rounded-lg">
                      {room.badge_status}
                    </span>
                  </div>
                </div>

                <div className="p-8 md:p-10 flex-grow flex flex-col">
                  <h3 className="text-2xl font-bold text-content mb-6 tracking-tight">
                    {room.title}
                  </h3>
                  <p className="text-content/70 font-light leading-relaxed mb-8 text-lg">
                    {room.description}
                  </p>

                  <div className="mt-auto">
                    {isMuenchen ? (
                      <div className="pt-10 border-t border-surface-border grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-content/60 mb-4">
                            {t("showroom.munich.address.label")}
                          </p>
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-body flex items-center justify-center text-content/40 flex-shrink-0">
                              <MapPin className="w-5 h-5 transition-transform group-hover:scale-110" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-content leading-relaxed whitespace-pre-line">
                                {room.address}
                              </div>
                              {room.contact_url && (
                                <a
                                  href={room.contact_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-brand font-medium hover:gap-3 transition-all mt-4"
                                >
                                  <Globe className="w-4 h-4" />{" "}
                                  {room.contact_url
                                    .replace(/^https?:\/\//, "")
                                    .replace(/\/$/, "")}{" "}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-content/60 mb-4">
                            Dein Ansprechpartner
                          </p>
                          <div className="bg-body/50 dark:bg-white/5 rounded-2xl p-5 border border-surface-border transition-all duration-300 group-hover:border-brand/30">
                            <p className="text-sm font-bold text-content mb-1">
                              {room.contact_name}
                            </p>
                            <p className="text-[10px] text-content/50 font-medium uppercase tracking-wider mb-3">
                              {room.contact_role}
                            </p>
                            <div className="space-y-2">
                              {room.contact_email && (
                                <a
                                  href={`mailto:${room.contact_email}`}
                                  className="flex items-center gap-2 text-xs text-content/60 hover:text-brand transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5" />{" "}
                                  {room.contact_email}
                                </a>
                              )}
                              {room.contact_phone && (
                                <a
                                  href={`tel:${room.contact_phone}`}
                                  className="flex items-center gap-2 text-xs text-content/60 hover:text-brand transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5" />{" "}
                                  {room.contact_phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="bg-brand/5 dark:bg-brand/10 border border-brand/10 dark:border-brand/20 rounded-2xl p-6">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand flex-shrink-0">
                              <Wrench className="w-5 h-5 transition-transform group-hover:rotate-12" />
                            </div>
                            <div>
                              <p className="text-base font-bold text-content mb-1">
                                {t("showroom.geldern.visit.title") ||
                                  "Besuch nach Absprache"}
                              </p>
                              <p className="text-sm text-content/60 font-light leading-relaxed">
                                {t("showroom.geldern.visit.desc") ||
                                  "Da ich oft im Tandem-Einsatz oder in der IT-Welt unterwegs bin, melde dich einfach kurz für einen individuellen Termin."}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-8 border-t border-surface-border">
                          <a
                            href={
                              lang === "de" ? "/kontakt" : `/${lang}/kontakt`
                            }
                            className="w-full btn-primary text-center block"
                          >
                            {t("showroom.btn")}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShowroomSection;

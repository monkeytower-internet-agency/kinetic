import React, { useMemo, useRef, useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  currentStep,
  nextStep,
  setSelection,
  userSelections,
  resetQuiz,
  setStep,
} from "../stores/quizStore";
import QuizStep from "./QuizStep";
import ContactForm from "./ContactForm";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  RefreshCcw,
  Calendar,
  MessageSquare,
  Heart,
  Send,
} from "lucide-react";

const QuizWizard: React.FC<{ turnstileSiteKey?: string }> = ({
  turnstileSiteKey,
}) => {
  const step = useStore(currentStep);
  const selections = useStore(userSelections);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  // Build a human-readable quiz summary for the email
  const quizSummary = useMemo(() => {
    const labels: Record<string, string> = {
      status: "Ausgangslage",
      timeline: "Zeitplan",
      vehicle: "Fahrzeug",
      usage: "Nutzung",
      needs: "Fokus im Innenraum",
      concern: "Entscheidungsfaktor",
    };
    const summary: Record<string, string> = {};
    for (const [key, value] of Object.entries(selections)) {
      if (value) {
        summary[labels[key] || key] = String(value);
      }
    }
    return summary;
  }, [selections]);

  // Define the dynamic funnel logic
  const activeSteps = useMemo(() => {
    const steps: any[] = [
      {
        id: "status",
        key: "status",
        question: "",
        options: [
          { label: "Ich interessiere mich für ein Neufahrzeug", value: "new" },
          { label: "Mein Fahrzeug ist bereits vorhanden", value: "existing" },
          { label: "Am liebsten sofort ab ins Allrad-Abenteuer", value: "4wd" },
          { label: "Ich schaue mich erst einmal um...", value: "searching" },
        ],
      },
    ];

    // Specific sub-funnel for "searching/gucker"
    if (selections.status === "searching") {
      steps.push({
        id: "why_not_yet",
        key: "timeline",
        question: "Wenn du jetzt sofort reisen würdest: Was wäre dein Ding?",
        options: [
          {
            label: "Ein Selbstausbau mit ParaNomad klingt erstaunlich einfach",
            value: "next_year",
          },
          {
            label: "Dann starte ich am liebsten so schnell wie möglich!",
            value: "asap",
          },
          {
            label:
              "Noch fehlt mir der fahrbare Untersatz, aber ich schau schon...",
            value: "this_year",
          },
        ],
      });
    }

    // Logical Branching for vehicle
    if (selections.status && selections.status !== "searching") {
      if (selections.status === "existing") {
        steps.push({
          id: "vehicle",
          key: "vehicle",
          question: "Cool, darf ich fragen, was es ist?",
          multiSelect: true,
          options: [
            {
              label: "Der Klassiker: VW Crafter (Arbeitstier)",
              value: "crafter",
            },
            {
              label: "Der Boss: Mercedes Sprinter (Silberpfeil)",
              value: "sprinter",
            },
            {
              label:
                "Mein Firmenwagen (Psschtt! Alles bleibt streng vertraulich...)",
              value: "company",
            },
            {
              label: "Vanlife-Traum (noch mit Panzertape zusammengehalten)",
              value: "vanlife",
            },
            {
              label: "Ein verbeulter Ducato mit ganz viel Charakter",
              value: "ducato",
            },
            {
              label: "Die mobile Festung (Allrad & Dachzelt-Vibes)",
              value: "fortress",
            },
            { label: "Ex-Postbus (Gelb ist das neue Schwarz)", value: "post" },
            {
              label: "Ein alter Rettungswagen (Blaulicht auf Anfrage?)",
              value: "rtw",
            },
            {
              label: "Omas alter Transit (unverwüstlich wie ein Panzer)",
              value: "transit",
            },
            {
              label: "Ein leerer Blechkasten mit unendlich Potenzial",
              value: "empty",
            },
            {
              label: "Mein Daily Driver, der bald Urlaub macht",
              value: "daily",
            },
            {
              label: "Ein Camper-Rohbau (Bett aus Euro-Paletten inklusive)",
              value: "pallet",
            },
            { label: "Ist noch streng geheim! 🤫", value: "secret" },
            {
              label: "Das behalte ich lieber für mich (Datenschutz!)",
              value: "anonymous",
            },
            { label: "Ein rollendes Design-Experiment", value: "design" },
            {
              label: "Mein Fluchtwagen für das Wochenende 🚐💨",
              value: "escape",
            },
          ],
        });
      } else if (selections.status === "new" || selections.status === "4wd") {
        steps.push({
          id: "vehicle",
          key: "vehicle",
          question:
            selections.status === "4wd"
              ? "Was ist die Basis für dein Allrad-Monster?"
              : "In welcher Fahrzeug-Klasse möchtest Du dein Loft bauen?",
          multiSelect: true,
          options: [
            {
              label: "Klassischer Kastenwagen (Sprinter/Crafter Klasse)",
              value: "van",
            },
            {
              label: "Maxi-Hochdach (Stehhöhe ohne Kompromisse)",
              value: "maxi",
            },
            {
              label: "Expeditions-LKW (Atego / Man TGM Vibes)",
              value: "truck",
            },
            {
              label: "Der Unimog (wo die Straße aufhört, fängst du erst an)",
              value: "unimog",
            },
            {
              label: "Allrad-Kasten (der Allrounder für grobes Gelände)",
              value: "4wd_van",
            },
            {
              label: "Pickup mit Wohnkabine (absetzbar & flexibel)",
              value: "pickup",
            },
            {
              label: "Kofferaufbau (rechteckig, praktisch, Loft-Feeling)",
              value: "box",
            },
            {
              label: "Kurzer Radstand (wendig, flott, Parkplatz-kompatibel)",
              value: "short",
            },
            {
              label: "Langer Radstand (Viel Platz bietet maximale Freiheit)",
              value: "long",
            },
            {
              label: "Bus / Transporter (die goldene Mitte)",
              value: "transporter",
            },
            {
              label:
                "Spezial-Fahrzeug (ich hab da was ganz Besonderes im Kopf...)",
              value: "special",
            },
            { label: "Ich lass mich noch inspirieren!", value: "open" },
          ],
        });
      }
    }

    // Usage for everyone who got through initial status
    const isPastInitial =
      (selections.status === "searching" && (selections as any).timeline) ||
      (selections.status &&
        selections.status !== "searching" &&
        (selections as any).vehicle);

    if (isPastInitial) {
      steps.push({
        id: "usage",
        key: "usage",
        question: "Wie nutzt Du dein Fahrzeug am meisten?",
        options: [
          { label: "Flexibler Camper für den Urlaub", value: "holiday" },
          { label: "Hybrid (Alltag & Fluchtwagen)", value: "hybrid" },
          { label: "Digital Nomad / Vanlife", value: "daily" },
        ],
      });
      steps.push({
        id: "needs",
        key: "needs",
        question: "Was ist dir im Innenraum am wichtigsten?",
        options: [
          { label: "Viel Stauraum", value: "storage" },
          { label: "Hoher Wohnkomfort", value: "sleep" },
          { label: "Große Sport-Garage", value: "sports" },
        ],
      });
    }

    // Final qualification
    if (selections.needs) {
      steps.push({
        id: "concern",
        key: "concern",
        question: "Was gibt für dich den Ausschlag?",
        options: [
          {
            label: "Ich möchte den Wert meines Fahrzeugs langfristig schützen",
            value: "value",
          },
          {
            label:
              "Ich fahre am liebsten sofort los (lass andere jahrelang warten!)",
            value: "timeline",
          },
          {
            label:
              "Ich möchte meinen Bus im Originalzustand erhalten (keine Löcher!)",
            value: "holes",
          },
        ],
      });
    }

    return steps;
  }, [selections]);

  const handleSelect = (key: any, value: any, stepIdx: number) => {
    const stepDef = activeSteps[stepIdx];

    // 1. History Jumping Logic
    if (stepIdx < step) {
      const oldVal = (selections as any)[key];

      // For multi-select, we need to handle toggling
      if (stepDef?.multiSelect) {
        const currentVal = oldVal || "";
        const selectedArray = currentVal ? currentVal.split(",") : [];
        let newVal;
        if (selectedArray.includes(value)) {
          newVal = selectedArray.filter((v: string) => v !== value).join(",");
        } else {
          newVal = [...selectedArray, value].join(",");
        }

        // If the selection actually changes, reset the path ahead
        if (newVal !== oldVal) {
          const keysToReset = activeSteps.slice(stepIdx + 1).map((s) => s.key);
          keysToReset.forEach((k) => setSelection(k as any, null));
          setSelection(key, newVal as any);
          setStep(stepIdx + 1); // Stay on this step to allow more toggling or confirming
        }
        return;
      }

      // For single select
      if (oldVal !== value) {
        const keysToReset = activeSteps.slice(stepIdx + 1).map((s) => s.key);
        keysToReset.forEach((k) => setSelection(k as any, null));
        setSelection(key, value);
        setStep(stepIdx + 1);
        return;
      }

      // If clicking the same already-selected item, just scroll there/set step context
      setStep(stepIdx + 1);
      return;
    }

    // 2. Regular Step Logic (stepIdx === step)
    if (stepDef?.multiSelect) {
      const currentVal = (selections as any)[key] || "";
      const selectedArray = currentVal ? currentVal.split(",") : [];
      let newVal;
      if (selectedArray.includes(value)) {
        newVal = selectedArray.filter((v: string) => v !== value).join(",");
      } else {
        newVal = [...selectedArray, value].join(",");
      }
      setSelection(key, newVal as any);
      return;
    }

    setSelection(key, value);
    setTimeout(() => {
      nextStep();
    }, 500);
  };

  const handleConfirm = () => {
    nextStep();
  };

  useEffect(() => {
    if (scrollContainerRef.current && step > 0) {
      const elements = scrollContainerRef.current.children;
      // Scroll to the current step's element (clamped to actual children count)
      const targetIdx = Math.min(step, elements.length - 1);
      const targetElement = elements[targetIdx];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [step, activeSteps.length]);

  const resultData = useMemo(() => {
    let title = "Premium-Stratege";
    let subtitle = "Meine Empfehlung für dich";
    let analysis = "";
    let ctaType = "secure";
    let scarcity = "Nur noch 4 Sets reservierbar.";

    // Helper for today's date - 1 day
    const getYesterdayDate = () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };
    const lastSaleDate = getYesterdayDate();

    // 1. Title Determination based on Status & Usage
    if (selections.status === "searching") {
      title = "Abenteuer-Entdecker";
    } else if (selections.status === "4wd") {
      title = "Offroad-Enthusiast";
    } else if (selections.usage === "holiday") {
      title = "Urlaubs-Genießer";
    } else if (selections.usage === "hybrid") {
      title = "Alltags-Protektor";
    } else if (selections.usage === "daily") {
      title = "Digital Nomad";
    }

    // 2. Advanced Analysis Narrative
    if (selections.status === "searching") {
      const timeline = (selections as any).timeline;
      if (timeline === "next_year") {
        analysis =
          "Du planst vorausschauend — und das ist klug. Ein sauberer Ausbau muss kein Mammutprojekt sein. ParaNomad ist modular gedacht: du baust, was du brauchst, und lässt weg, was du nicht willst. Wie ein industrielles Baukasten-System — oder 'Minecraft für Erwachsene'. Kein Schweißen, kein halbes Jahr Baustelle.";
        ctaType = "plan";
      } else if (timeline === "asap") {
        analysis =
          "Das Fernweh sitzt dir schon im Nacken. Gut! ParaNomad ist nicht für Bastler gebaut — es ist für Fahrer gebaut. Ein Nachmittag Aufbau statt monatelanges Basteln, der erste Sonnenuntergang von deiner eigenen Liegefläche. Dieses Jahr wird dein Jahr.";
        ctaType = "call";
      } else {
        analysis =
          "Der perfekte Bus wartet irgendwo auf dich — du weißt es nur noch nicht. Wenn du den Richtigen hast, passt sich mein System an fast jeden Grundriss an. Egal ob Crafter, Sprinter oder was ganz Besonderes: Wenn das Konzept dahinter stimmt, wird jedes Fahrzeug zum Zuhause.";
        ctaType = "call";
      }
    } else {
      // Logic for serious leads (new/existing/4wd)
      // Reference the vehicle specifically
      const vehicleVal = (selections as any).vehicle || "";
      const vehicleNames: Record<string, string> = {
        van: "Kastenwagen",
        maxi: "Maxi-Hochdach",
        truck: "Expeditions-LKW",
        unimog: "Unimog",
        "4wd_van": "Allrad-Kasten",
        pickup: "Pickup mit Wohnkabine",
        box: "Kofferaufbau",
        short: "Kastenwagen mit kurzem Radstand",
        long: "Kastenwagen mit langem Radstand",
        transporter: "Bus / Transporter",
        special: "Spezial-Fahrzeug",
        open: "Fahrzeug", // Fallback for "Ich lass mich noch inspirieren!"
      };

      const vehicleName = vehicleVal
        .split(",")
        .map((v: string) => vehicleNames[v.trim()] || "Fahrzeug")
        .join(" & ");

      const baseText =
        selections.status === "4wd"
          ? `Wo die Straße endet, fängt dein Zuhause im ${vehicleName || "Offroader"} erst an. Mein System ist auf Verwindung ausgelegt — nicht auf Showroom-Glanz. ParaNomad hält, wenn's draußen ungemütlich wird.`
          : selections.status === "existing"
            ? `Dein ${vehicleName || "Bus"} hat eine Seele. Mein System legt sich wie ein Maßanzug in deinen Grundriss, ohne eine einzige Schraube in die Karosserie zu treiben. Das Fahrzeug bleibt im Originalzustand — nur eben besser.`
            : `Ein brandneuer ${vehicleName || "Transporter"}, volle Kontrolle. Du baust dieses Fahrzeug von Anfang an richtig — und ParaNomad ist der Grundstein. Modular, entnehmbar, wertstabil. Ein Invest in die Zukunft.`;

      const usageText =
        selections.usage === "daily"
          ? " Da du dein Fahrzeug täglich nutzt, ist die Entnehmbarkeit dein größter Vorteil: Heute Loft, morgen Transporter."
          : selections.usage === "hybrid"
            ? " Die Mischung aus Alltag und Fluchtwagen verlangt nach Flexibilität — keine festen Holzeinbauten, die den Platz blockieren."
            : " Für deine Urlaubsreisen zählt das Erlebnis: Ankommen, ausbreiten, genießen — ohne Klappern während der Fahrt.";

      const needText =
        selections.needs === "storage"
          ? " Dein Fokus auf Stauraum passt perfekt: Meine Module nutzen das Raumvolumen optimal, ohne den Durchgang zu verbauen."
          : selections.needs === "sleep"
            ? " Schlafen wie zuhause, egal wo du parkst: Mit dem Bettsystem als Basis wird jeder Ort zum 5-Sterne-Spot."
            : " Deine Sport-Ausrüstung braucht Platz? Kein Problem. Wir halten die Mitte frei für Bikes, Boards oder was du sonst dabei hast.";

      const concernText =
        selections.concern === "value"
          ? " Und da dir Werterhalt wichtig ist: Nimm das System beim Fahrzeugwechsel einfach mit. Dein Geld ist nicht im Blech vergraben."
          : selections.concern === "timeline"
            ? " Warum Jahre warten? Wir haben vorkonfigurierte Sets. Dieses Wochenende könntest du schon den ersten Test-Trip machen."
            : " Spurlos rückbaubar — ideal für Leasing oder wenn du keine Löcher im Fahrzeug willst. Keine Reue, 100% Freiheit.";

      analysis = `${baseText}${usageText}${needText}${concernText}`;

      // Adjust subtitle based on profile strength
      if (selections.status === "4wd")
        subtitle = "Maximale Freiheit für grobes Gelände";
      else if (selections.usage === "daily")
        subtitle = "Dein mobiles Office ohne Kompromisse";
      else if (selections.usage === "hybrid")
        subtitle = "Der ultimative Hybrid-Ausbau";
    }

    return { title, subtitle, analysis, ctaType, scarcity, lastSaleDate };
  }, [selections, step]);

  const totalExpectedSteps = 5;

  return (
    <section id="quiz" className="py-32 px-4 bg-surface min-h-[900px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand mb-4">
            Vision
          </h2>
          <h2 className="text-4xl md:text-6xl font-extralight text-content tracking-tighter mb-4 antialiased leading-tight">
            Wie sieht dein{" "}
            <span className="font-bold text-brand">Raum für Abenteuer</span>{" "}
            aus?
          </h2>
          <p className="text-content/40 text-lg font-light tracking-wide">
            In 60 Sekunden zu deiner perfekten Lösung.
          </p>
        </div>

        <div
          className="relative w-full max-w-5xl mx-auto space-y-12"
          ref={scrollContainerRef}
        >
          {activeSteps.slice(0, step + 1).map((s, idx) => (
            <QuizStep
              key={s.id}
              question={s.question}
              options={s.options}
              selectedValue={(selections as any)[s.key]}
              onSelect={(val) => handleSelect(s.key, val as any, idx)}
              isActive={idx === step}
              multiSelect={s.multiSelect}
              onConfirm={handleConfirm}
            />
          ))}

          {/* Dynamic Results based on Funnel Type */}
          {step >= activeSteps.length && selections.concern && (
            <div className="max-w-4xl mx-auto p-10 bg-surface rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-surface-border text-center relative overflow-hidden animate-in fade-in slide-in-from-bottom duration-1000 scroll-mt-40">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Sparkles className="w-48 h-48 text-brand" />
              </div>

              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-body text-content/50 rounded-full text-[10px] font-bold uppercase tracking-widest border border-surface-border">
                  {resultData.subtitle}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-extralight mb-6 tracking-tighter text-content leading-tight">
                Dein Profil:{" "}
                <span className="font-bold text-brand">{resultData.title}</span>
              </h2>

              <div className="bg-body/50 rounded-[1.5rem] p-6 mb-10 border border-surface-border/50 max-w-2xl mx-auto">
                <p className="text-lg text-content/60 leading-relaxed font-light italic">
                  "{resultData.analysis}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
                <div className="aspect-video bg-black/90 rounded-3xl flex items-center justify-center border border-white/10 group cursor-pointer overflow-hidden relative">
                  <div className="px-6 py-2 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl min-w-[140px] text-center transition-all duration-300" />
                  <span className="text-white font-medium z-10 flex items-center gap-2">
                    System-Details ansehen{" "}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute bottom-4 left-4 right-4 h-1 bg-surface/20 rounded-full overflow-hidden">
                    <div className="h-full bg-brand w-2/3" />
                  </div>
                </div>
                <div className="bg-surface rounded-2xl p-6 text-left flex flex-col justify-between text-content relative overflow-hidden group border border-surface-border">
                  <div className="z-10">
                    <h4 className="text-xl font-bold mb-3 text-white">
                      Exklusive Verfügbarkeit
                    </h4>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-black text-brand flex items-center gap-2">
                        <s className="text-content/30 text-xl font-light decoration-brand/50">
                          5
                        </s>{" "}
                        4
                      </span>
                      <span className="text-white/90 font-medium">
                        Sets aus meiner Order
                      </span>
                    </div>
                    <p className="text-content/40 text-[10px] uppercase tracking-wider font-bold">
                      Letztes Set verkauft am {resultData.lastSaleDate}
                    </p>
                  </div>
                  <Sparkles className="absolute -bottom-8 -right-8 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
                </div>
              </div>

              {!showContactForm ? (
                <>
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="btn-primary"
                    >
                      <Send className="w-5 h-5" />
                      Anfrage senden
                    </button>
                  </div>

                  <button
                    onClick={resetQuiz}
                    className="mt-12 text-sm text-content/40 hover:text-brand flex items-center gap-2 mx-auto transition-colors"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Konfigurations-Check neu starten
                  </button>
                </>
              ) : (
                <div className="mt-8 border-t border-surface-border pt-8">
                  <ContactForm
                    turnstileSiteKey={turnstileSiteKey}
                    quizResults={quizSummary}
                    heading="Deine Anfrage"
                    subheading="Deine Quiz-Ergebnisse werden automatisch mitgesendet."
                  />
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="mt-6 text-sm text-content/40 hover:text-brand flex items-center gap-2 mx-auto transition-colors"
                  >
                    ← Zurück zur Übersicht
                  </button>
                </div>
              )}
            </div>
          )}

          {step < activeSteps.length && (
            <div className="pt-20 border-t border-surface-border">
              <div className="max-w-md mx-auto h-1.5 bg-surface-border rounded-full relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-brand transition-all duration-1000"
                  style={{
                    width: `${((step + 1) / totalExpectedSteps) * 100}%`,
                  }}
                />
                <div
                  className="absolute top-0 left-0 h-full bg-brand/30 blur-sm transition-all duration-1000"
                  style={{
                    width: `${((step + 1) / totalExpectedSteps) * 100}%`,
                  }}
                />
              </div>
              <div className="text-center mt-4 text-[10px] font-bold text-content/20 tracking-[0.3em] uppercase">
                Modul {step + 1} von {totalExpectedSteps}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuizWizard;

import React from "react";
import { Check } from "lucide-react";

interface QuizStepProps {
  question: string;
  options: { label: string; value: string; icon?: string }[];
  onSelect: (value: string) => void;
  selectedValue: string | null;
  isActive: boolean;
  multiSelect?: boolean;
  onConfirm?: () => void;
}

const QuizStep: React.FC<QuizStepProps> = ({
  question,
  options,
  onSelect,
  selectedValue,
  isActive,
  multiSelect,
  onConfirm,
}) => {
  const selectedArray = selectedValue ? selectedValue.split(",") : [];

  const isSelected = (val: string) => {
    if (multiSelect) return selectedArray.includes(val);
    return selectedValue === val;
  };

  return (
    <div
      className={`w-full max-w-5xl mx-auto py-8 scroll-mt-40 transition-all duration-700 ${!isActive ? "opacity-60 scale-95 origin-top" : "opacity-100 scale-100"}`}
    >
      {question && (
        <h3
          className={`text-2xl md:text-3xl font-extralight text-center mb-8 tracking-tight leading-tight antialiased transition-colors ${isActive ? "text-content" : "text-content/40"}`}
        >
          {question}
        </h3>
      )}

      <div
        className={`grid grid-cols-1 gap-4 ${options.length > 6 ? "md:grid-cols-3" : options.length === 4 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`
              relative group px-4 py-4 rounded-[1.2rem] border-2 text-center transition-all duration-500 flex flex-col items-center justify-center gap-2
              ${
                isSelected(option.value)
                  ? "border-brand bg-surface shadow-[0_10px_20px_rgba(var(--theme-brand-rgb),0.1)] scale-[1.02] z-10"
                  : "border-surface-border bg-surface hover:border-brand-glow hover:shadow-[0_0_20px_rgba(var(--theme-brand-rgb),0.15)] shadow-sm"
              }
              ${!isActive && !isSelected(option.value) ? "opacity-40 grayscale" : ""}
              ${!isActive && isSelected(option.value) ? "border-brand/40 shadow-none" : ""}
            `}
          >
            <span
              className={`text-sm md:text-base transition-all duration-500 ${isSelected(option.value) ? "text-brand font-bold" : "text-content/60 font-medium group-hover:text-content"}`}
            >
              {option.label}
            </span>

            {isSelected(option.value) && (
              <div className="absolute top-2 right-2">
                <Check className="w-4 h-4 text-brand" />
              </div>
            )}

            {isSelected(option.value) && (
              <div className="absolute inset-0 border border-brand/20 rounded-[1.2rem] pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      {multiSelect && isActive && (
        <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom duration-500">
          <button
            onClick={onConfirm}
            disabled={selectedArray.length === 0}
            className="btn-primary"
          >
            Auswahl bestätigen
          </button>
          <p className="mt-4 text-content/40 text-xs uppercase tracking-widest font-bold">
            Mehrfachauswahl möglich
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizStep;

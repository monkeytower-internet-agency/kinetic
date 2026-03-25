import React from "react";

interface Props {
  text?: string;
}

const Announcement: React.FC<Props> = ({ text }) => {
  if (!text || text.trim() === "") return null;

  return (
    <div className="bg-brand py-2.5 px-4 text-center border-b border-brand/20 relative z-[60]">
      <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse-subtle">
        {text}
      </p>
    </div>
  );
};

export default Announcement;

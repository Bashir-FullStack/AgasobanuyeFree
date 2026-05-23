import { useState, useEffect } from "react";

export default function CountdownTimer({ endDate }) {
  const calcRemaining = () => {
    const diff = new Date(endDate) - Date.now();
    if (diff <= 0) return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    return { days: String(d).padStart(2, "0"), hours: String(h).padStart(2, "0"), minutes: String(m).padStart(2, "0"), seconds: String(s).padStart(2, "0") };
  };

  const [time, setTime] = useState(calcRemaining);
  useEffect(() => {
    const id = setInterval(() => setTime(calcRemaining), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  return (
    <div className="flex items-center gap-1.5 text-center mt-2">
      {[{ label: "DAYS", val: time.days }, { label: "HRS", val: time.hours }, { label: "MIN", val: time.minutes }, { label: "SEC", val: time.seconds }].map((t) => (
        <div key={t.label} className="flex flex-col items-center">
          <span className="bg-dark text-white text-[11px] font-bold w-8 h-7 flex items-center justify-center rounded">{t.val}</span>
          <span className="text-[9px] text-gray-500 mt-0.5">{t.label}</span>
        </div>
      ))}
    </div>
  );
}

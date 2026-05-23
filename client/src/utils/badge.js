const BADGE_DESIGNS = {
  New: {
    color: "bg-green-500 shadow-[0_3px_10px_-2px_rgba(34,197,94,0.6)]",
    shape: "polygon(50% 0%, 68% 25%, 98% 35%, 78% 60%, 85% 90%, 50% 72%, 15% 90%, 22% 60%, 2% 35%, 32% 25%)",
  },
  Hot: {
    color: "bg-orange-500 shadow-[0_3px_10px_-2px_rgba(249,115,22,0.6)]",
    shape: "polygon(0% 0%, 100% 0%, 88% 50%, 100% 100%, 0% 100%)",
  },
  Sale: {
    color: "bg-blue-500 shadow-[0_3px_10px_-2px_rgba(59,130,246,0.6)]",
    shape: "polygon(8% 0%, 100% 0%, 100% 100%, 8% 100%, 0% 50%)",
  },
  Best: {
    color: "bg-purple-500 shadow-[0_3px_10px_-2px_rgba(168,85,247,0.6)]",
    shape: "polygon(50% 0%, 90% 20%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 10% 20%)",
  },
  Trending: {
    color: "bg-pink-500 shadow-[0_3px_10px_-2px_rgba(236,72,153,0.6)]",
    shape: "polygon(5% 0%, 90% 0%, 100% 50%, 90% 100%, 5% 100%, 18% 50%)",
  },
  Popular: {
    color: "bg-teal-500 shadow-[0_3px_10px_-2px_rgba(20,184,166,0.6)]",
    shape: "circle(50% at 50% 50%)",
  },
};

export function badgeDesign(badge) {
  return BADGE_DESIGNS[badge] || {
    color: "bg-gray-500 shadow-[0_3px_10px_-2px_rgba(107,114,128,0.6)]",
    shape: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  };
}

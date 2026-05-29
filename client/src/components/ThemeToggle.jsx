import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ minimal }) {
  const { dark, toggle } = useTheme();

  if (minimal) {
    return (
      <button onClick={toggle} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-100 transition" title={dark ? "Light mode" : "Dark mode"}>
        {dark ? <FiSun size={14} /> : <FiMoon size={14} />}
      </button>
    );
  }

  return (
    <button onClick={toggle} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 transition hover:bg-gray-50 text-xs font-medium">
      {dark ? <FiSun size={14} /> : <FiMoon size={14} />}
      {dark ? "Light" : "Dark"}
    </button>
  );
}

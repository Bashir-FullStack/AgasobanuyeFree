import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHelpCircle } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn, FaTiktok } from "react-icons/fa";
import { API } from "../config";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "../i18n/TranslationContext";
import ThemeToggle from "./ThemeToggle";

const socialIcons = {
  facebook: FaFacebookF,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedinIn,
  tiktok: FaTiktok,
};

export default function TopBar() {
  const { t } = useTranslation();
  const [links, setLinks] = useState({});

  useEffect(() => {
    fetch(`${API}/settings`)
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === "object") {
          const social = {};
          Object.keys(socialIcons).forEach(key => { social[key] = data[key] || "#"; });
          setLinks(social);
        }
      })
      .catch(() => {});
  }, []);

  const socials = Object.keys(socialIcons)
    .filter(key => links[key] && links[key] !== "#")
    .map(key => ({ icon: socialIcons[key], href: links[key], label: key.charAt(0).toUpperCase() + key.slice(1) }));

  return (
    <div className="hidden lg:block bg-dark text-white text-xs">
      <div className="max-w-[1430px] mx-auto px-4 grid grid-cols-3 items-center h-9">
        <div className="flex items-center gap-3">
          <span className="text-gray-500">{t("topbar.followUs")}</span>
          {socials.length > 0 ? socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-6 h-6 flex items-center justify-center rounded-full hover:text-primary transition-colors text-gray-500 hover:bg-primary/10" aria-label={s.label}>
              <s.icon size={11} />
            </a>
          )) : (
            <div className="flex gap-3">
              <FaFacebookF size={11} className="text-gray-500" />
              <FaTwitter size={11} className="text-gray-500" />
              <FaInstagram size={11} className="text-gray-500" />
              <FaYoutube size={11} className="text-gray-500" />
            </div>
          )}
        </div>
        <span className="text-center text-gray-400 tracking-wide">{t("topbar.promo")}</span>
        <div className="flex items-center justify-end gap-5">
          <Link to="/help" className="text-gray-400 hover:text-primary transition flex items-center gap-1"><FiHelpCircle size={12} /> {t("topbar.helpCenter")}</Link>
          <ThemeToggle minimal />
          <LanguageSwitcher variant="minimal" />
          <span className="text-primary font-semibold">FRw</span>
        </div>
      </div>
    </div>
  );
}

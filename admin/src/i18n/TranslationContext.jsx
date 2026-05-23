import { createContext, useContext, useState, useEffect, useMemo } from "react";

const languages = {
  en: { name: "English", native: "English", flag: "🇬🇧", dir: "ltr" },
  fr: { name: "French", native: "Français", flag: "🇫🇷", dir: "ltr" },
  rw: { name: "Kinyarwanda", native: "Kinyarwanda", flag: "🇷🇼", dir: "ltr" },
};

const __en = {
  "common.loading": "Loading...", "common.save": "Save", "common.cancel": "Cancel",
  "common.delete": "Delete", "common.edit": "Edit", "common.search": "Search",
  "common.back": "Back", "common.submit": "Submit", "common.close": "Close",
  "common.noData": "No data available", "common.error": "Something went wrong",
  "common.total": "Total", "common.status": "Status", "common.active": "Active",
  "common.inactive": "Inactive", "common.optional": "optional",
  "admin.dashboard": "Dashboard", "admin.products": "Products",
  "admin.addProduct": "Add Product", "admin.orders": "Orders",
  "admin.customers": "Customers", "admin.categories": "Categories",
  "admin.brands": "Brands", "admin.coupons": "Coupons",
  "admin.delivery": "Delivery", "admin.banners": "Banners",
  "admin.messages": "Messages", "admin.notifications": "Notifications",
  "admin.analytics": "Analytics", "admin.settings": "Settings",
  "admin.profile": "Profile", "admin.logout": "Sign Out",
  "admin.welcome": "Welcome back", "admin.totalSales": "Total Sales",
  "admin.totalRevenue": "Total Revenue", "admin.totalOrders": "Total Orders",
  "admin.totalCustomers": "Total Customers", "admin.recentOrders": "Recent Orders",
  "admin.topProducts": "Top Products", "admin.quickActions": "Quick Actions",
  "admin.recentActivity": "Recent Activity", "admin.storeOverview": "Store Overview",
  "admin.search": "Search...", "admin.darkMode": "Dark Mode",
  "admin.lightMode": "Light Mode",
};

const __fr = {
  "common.loading": "Chargement...", "common.save": "Enregistrer", "common.cancel": "Annuler",
  "common.delete": "Supprimer", "common.edit": "Modifier", "common.search": "Rechercher",
  "common.back": "Retour", "common.submit": "Soumettre", "common.close": "Fermer",
  "common.noData": "Aucune donnée", "common.error": "Une erreur est survenue",
  "common.total": "Total", "common.status": "Statut", "common.active": "Actif",
  "common.inactive": "Inactif", "common.optional": "facultatif",
  "admin.dashboard": "Tableau de bord", "admin.products": "Produits",
  "admin.addProduct": "Ajouter produit", "admin.orders": "Commandes",
  "admin.customers": "Clients", "admin.categories": "Catégories",
  "admin.brands": "Marques", "admin.coupons": "Coupons",
  "admin.delivery": "Livraison", "admin.banners": "Bannières",
  "admin.messages": "Messages", "admin.notifications": "Notifications",
  "admin.analytics": "Analytiques", "admin.settings": "Paramètres",
  "admin.profile": "Profil", "admin.logout": "Déconnexion",
  "admin.welcome": "Bon retour", "admin.totalSales": "Ventes totales",
  "admin.totalRevenue": "Revenu total", "admin.totalOrders": "Commandes totales",
  "admin.totalCustomers": "Clients totaux", "admin.recentOrders": "Commandes récentes",
  "admin.topProducts": "Meilleurs produits", "admin.quickActions": "Actions rapides",
  "admin.recentActivity": "Activité récente", "admin.storeOverview": "Aperçu boutique",
  "admin.search": "Rechercher...", "admin.darkMode": "Mode sombre",
  "admin.lightMode": "Mode clair",
};

const __rw = {
  "common.loading": "Birimo gutwara...", "common.save": "Kubika", "common.cancel": "Guhagarika",
  "common.delete": "Gusiba", "common.edit": "Guhindura", "common.search": "Gushaka",
  "common.back": "Gusubira", "common.submit": "Ohereza", "common.close": "Gufunga",
  "common.noData": "Nta makuru aboneka", "common.error": "Habaye ikibazo",
  "common.total": "Yose hamwe", "common.status": "Imiterere", "common.active": "Ikora",
  "common.inactive": "Ntigikora", "common.optional": "bishoboka",
  "admin.dashboard": "Ikibaho", "admin.products": "Ibicuruzwa",
  "admin.addProduct": "Ongera icuruzwa", "admin.orders": "Ibyategetswe",
  "admin.customers": "Abakiriya", "admin.categories": "Ibyiciro",
  "admin.brands": "Amadirishya", "admin.coupons": "Kupon",
  "admin.delivery": "Ibyoherezwa", "admin.banners": "Ibendera",
  "admin.messages": "Ubutumwa", "admin.notifications": "Amarangamutima",
  "admin.analytics": "Isesengura", "admin.settings": "Igenamiterere",
  "admin.profile": "Mwirasi", "admin.logout": "Sohoka",
  "admin.welcome": "Murakaza neza", "admin.totalSales": "Ibyaguzwe byose",
  "admin.totalRevenue": "Amafaranga yose", "admin.totalOrders": "Ibyategetswe byose",
  "admin.totalCustomers": "Abakiriya bose", "admin.recentOrders": "Ibyategetswe vuba",
  "admin.topProducts": "Ibicuruzwa byiza", "admin.quickActions": "Ibikorwa byihuse",
  "admin.recentActivity": "Ibikorwa biherutse", "admin.storeOverview": "Incamake y'isoko",
  "admin.search": "Shaka...", "admin.darkMode": "Umwijima",
  "admin.lightMode": "Urumuri",
};

const translations = { en: __en, fr: __fr, rw: __rw };

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem("hiromart_admin_lang") || "en"; }
    catch { return "en"; }
  });

  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem("hiromart_admin_lang", l); } catch {}
    try { document.documentElement.lang = l; } catch {}
  };

  useEffect(() => {
    try { document.documentElement.lang = lang; } catch {}
  }, [lang]);

  const t = (key, fallback) => {
    try {
      const val = translations[lang]?.[key];
      if (val !== undefined) return val;
      const enVal = translations.en?.[key];
      if (enVal !== undefined) return enVal;
    } catch {}
    return fallback || key;
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, t, languages, current: languages[lang] || languages.en }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) return { lang: "en", setLang: () => {}, t: (k, f) => f || k, languages, current: languages.en };
  return ctx;
}

export default TranslationContext;

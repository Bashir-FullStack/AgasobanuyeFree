import { useState } from "react";
import { FiMapPin, FiPhone, FiClock, FiNavigation, FiSearch } from "react-icons/fi";

const stores = [
  { name: "AGFrKigali", address: "KG 123 St, Kigali City Center", phone: "+250 788 000 001", hours: "Mon-Sun 12AM-12PM", coords: "-1.9441,30.0619" },
  { name: "AGFrButare", address: "KN 456 Blvd, Butare", phone: "+250 788 000 002", hours: "Mon-Sun 12AM-12PM", coords: "-2.5967,29.7394" },
  { name: "AGFrMusanze", address: "Northern Province, Musanze", phone: "+250 788 000 003", hours: "Mon-Sun 12AM-12PM", coords: "-1.4998,29.6340" },
  { name: "AGFrRubavu", address: "Western Province, Rubavu", phone: "+250 788 000 004", hours: "Mon-Sun 12AM-12PM", coords: "-1.6783,29.2585" },
];

export default function StoresPage() {
  const [search, setSearch] = useState("");
  const filtered = stores.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
        <div className="max-w-[800px] mx-auto px-4 py-14 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><FiMapPin size={28} className="text-primary" /></div>
          <h1 className="text-3xl font-bold text-dark">Our Stores</h1>
          <p className="text-gray-500 text-sm mt-2">Find a hiromart

 store near you.</p>
          <div className="relative max-w-md mx-auto mt-5">
            <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search stores..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition shadow-sm" />
          </div>
        </div>
      </div>
      <div className="max-w-[800px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <div key={s.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
              <h3 className="text-sm font-bold text-dark mb-3">{s.name}</h3>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-start gap-2"><FiMapPin size={14} className="shrink-0 mt-0.5 text-primary" /> {s.address}</p>
                <p className="flex items-center gap-2"><FiPhone size={14} className="shrink-0 text-primary" /> {s.phone}</p>
                <p className="flex items-center gap-2"><FiClock size={14} className="shrink-0 text-primary" /> {s.hours}</p>
              </div>
              <a href={`https://maps.google.com/?q=${s.coords}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"><FiNavigation size={12} /> Get Directions</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

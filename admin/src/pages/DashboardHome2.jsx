import { useState } from "react";

const tabs = ["7 Days", "30 Days", "90 Days", "Year"];

export default function DashboardHome2() {
  const [activeTab, setActiveTab] = useState("7 Days");

  const stats = [
    { label: "Total Visitors", value: "284,390", change: "+12.5%", up: true, color: "#2275fc" },
    { label: "Page Views", value: "1,284,503", change: "+8.2%", up: true, color: "#22C55E" },
    { label: "Bounce Rate", value: "32.15%", change: "-2.4%", up: false, color: "#FF5200" },
    { label: "Avg. Session", value: "4m 32s", change: "+6.7%", up: true, color: "#FFC107" },
  ];

  const browsers = [
    { name: "Chrome", share: 48, color: "#2275fc" },
    { name: "Safari", share: 24, color: "#3B82F6" },
    { name: "Firefox", share: 15, color: "#FF5200" },
    { name: "Edge", share: 8, color: "#22C55E" },
    { name: "Other", share: 5, color: "#95989D" },
  ];

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Analytics</h1>
          <p className="text-sm text-[#575864] mt-1">Detailed analytics and visitor insights</p>
        </div>
        <div className="flex items-center gap-2 bg-[#F2F7FB] rounded-xl p-1">
          {tabs.map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === tab ? "bg-white text-[#2275fc] shadow-[0px_2px_4px_rgba(20,25,38,0.05)]" : "text-[#575864] hover:text-[#111]"}`}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
            <p className="text-xs text-[#95989D] mb-1">{stat.label}</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-[#111]">{stat.value}</p>
              <span className={`text-xs font-semibold mb-1 ${stat.up ? "text-[#22C55E]" : "text-[#FF5200]"}`}>{stat.change}</span>
            </div>
            <div className="mt-3 h-[2px] rounded-full bg-[#F2F7FB] overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.random() * 40 + 60}%`, backgroundColor: stat.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[30px]">
        {/* Visitors Chart */}
        <div className="xl:col-span-2 bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
          <h5 className="text-lg font-bold text-[#111] mb-6">Visitors Overview</h5>
          <div className="flex items-end justify-between gap-1 h-[200px]">
            {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 50, 88, 62].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-80" style={{ height: `${h}%`, background: i === 7 ? "linear-gradient(to top, #2275fc, #60A5FA)" : "linear-gradient(to top, #E2E8F0, #F1F5F9)" }} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-[#95989D]">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
          <h5 className="text-lg font-bold text-[#111] mb-6">Browser Breakdown</h5>
          <div className="space-y-4">
            {browsers.map((b) => (
              <div key={b.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold text-[#111]">{b.name}</span>
                  <span className="text-[#575864]">{b.share}%</span>
                </div>
                <div className="h-2 bg-[#F2F7FB] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${b.share}%`, backgroundColor: b.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#F2F7FB]">
            <h6 className="text-sm font-bold text-[#111] mb-3">Visitor Location</h6>
            <div className="space-y-3">
              {[
                { country: "United States", visitors: "142,890", flag: "🇺🇸" },
                { country: "United Kingdom", visitors: "45,200", flag: "🇬🇧" },
                { country: "Germany", visitors: "32,100", flag: "🇩🇪" },
              ].map((loc) => (
                <div key={loc.country} className="flex items-center justify-between text-sm">
                  <span className="text-[#575864]">{loc.flag} {loc.country}</span>
                  <span className="font-semibold text-[#111]">{loc.visitors}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Referral Traffic */}
      <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
        <h5 className="text-lg font-bold text-[#111] mb-6">Top Referral Sources</h5>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F2F7FB]">
                <th className="text-left py-4 text-[#575864] font-semibold">Source</th>
                <th className="text-left py-4 text-[#575864] font-semibold">Visitors</th>
                <th className="text-left py-4 text-[#575864] font-semibold">Page Views</th>
                <th className="text-left py-4 text-[#575864] font-semibold">Avg. Duration</th>
                <th className="text-left py-4 text-[#575864] font-semibold">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {[
                { source: "Google Organic", visitors: "128,450", views: "412,890", duration: "3m 45s", conv: "4.2%" },
                { source: "Facebook Ads", visitors: "52,300", views: "198,400", duration: "2m 30s", conv: "3.8%" },
                { source: "Direct", visitors: "48,210", views: "284,503", duration: "5m 12s", conv: "6.1%" },
                { source: "Instagram", visitors: "35,890", views: "142,780", duration: "4m 05s", conv: "5.4%" },
              ].map((row) => (
                <tr key={row.source} className="border-b border-[#F2F7FB] last:border-0 hover:bg-[#F2F7FB]/40 transition">
                  <td className="py-4 font-semibold text-[#111]">{row.source}</td>
                  <td className="py-4 text-[#575864]">{row.visitors}</td>
                  <td className="py-4 text-[#575864]">{row.views}</td>
                  <td className="py-4 text-[#575864]">{row.duration}</td>
                  <td className="py-4 font-semibold text-[#22C55E]">{row.conv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DashboardHome3() {
  const topProducts = [
    { name: "Classic T-Shirt", sales: 1,284, revenue: "$37,236", growth: 12, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60" },
    { name: "Running Shoes Pro", sales: 856, revenue: "$68,479", growth: 8, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60" },
    { name: "Denim Jacket", sales: 643, revenue: "$57,870", growth: -3, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=60" },
    { name: "Wireless Earbuds", sales: 512, revenue: "$25,600", growth: 15, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=60" },
  ];

  const funnel = [
    { label: "Visitors", count: "284,390", pct: 100 },
    { label: "Add to Cart", count: "42,658", pct: 15 },
    { label: "Checkout", count: "18,930", pct: 6.7 },
    { label: "Purchase", count: "12,450", pct: 4.4 },
  ];

  return (
    <div className="space-y-[30px]">
      <div>
        <h1 className="text-2xl font-bold text-[#111]">Sales Overview</h1>
        <p className="text-sm text-[#575864] mt-1">E-commerce performance and conversion metrics</p>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
        {[
          { label: "Total Revenue", value: "$284,390", change: "+12.5%", icon: "$" },
          { label: "Orders", value: "12,450", change: "+8.2%", icon: "#" },
          { label: "Conversion Rate", value: "4.38%", change: "+0.6%", icon: "%" },
          { label: "Avg. Order Value", value: "$142.80", change: "+5.3%", icon: "Ø" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#95989D]">{stat.label}</p>
              <div className="w-[38px] h-[38px] rounded-lg bg-[#EEF5FF] flex items-center justify-center text-[#2275fc] font-bold text-sm">{stat.icon}</div>
            </div>
            <p className="text-2xl font-bold text-[#111]">{stat.value}</p>
            <span className="text-xs font-semibold text-[#22C55E]">{stat.change} vs last period</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[30px]">
        {/* Sales Funnel */}
        <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
          <h5 className="text-lg font-bold text-[#111] mb-6">Sales Funnel</h5>
          <div className="space-y-3">
            {funnel.map((step, i) => (
              <div key={step.label} className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#2275fc] text-white text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-semibold text-[#111]">{step.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#111]">{step.count}</span>
                    <span className="text-xs text-[#95989D] ml-2">({step.pct}%)</span>
                  </div>
                </div>
                <div className="h-3 bg-[#F2F7FB] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#2275fc] transition-all" style={{ width: `${step.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
          <h5 className="text-lg font-bold text-[#111] mb-6">Revenue Trend</h5>
          <div className="flex items-end justify-between gap-1 h-[200px]">
            {[30, 55, 42, 78, 65, 90, 82, 95, 70, 88, 76, 98].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full rounded-t-md" style={{ height: `${h}%`, background: "linear-gradient(to top, #22C55E, #86EFAC)" }} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-[#95989D]">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
        <h5 className="text-lg font-bold text-[#111] mb-6">Top Selling Products</h5>
        <div className="space-y-4">
          {topProducts.map((p) => (
            <div key={p.name} className="flex items-center gap-4 py-4 border-b border-[#F2F7FB] last:border-0">
              <span className="text-xs font-bold text-[#95989D] w-5">{topProducts.indexOf(p) + 1}</span>
              <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-[#F2F7FB] border border-[#ECF0F4]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111]">{p.name}</p>
                <p className="text-xs text-[#575864]">{p.sales.toLocaleString()} sales</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#111]">{p.revenue}</p>
                <span className={`text-xs font-semibold ${p.growth >= 0 ? "text-[#22C55E]" : "text-[#FF5200]"}`}>{p.growth >= 0 ? "+" : ""}{p.growth}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

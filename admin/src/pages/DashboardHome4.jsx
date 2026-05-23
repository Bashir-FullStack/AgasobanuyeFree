export default function DashboardHome4() {
  const recentActivity = [
    { action: "New order placed", detail: "Order #ORD-0042 by John Doe", time: "2 minutes ago", icon: "🛒", color: "#EEF5FF" },
    { action: "Product added", detail: "New Balance 574 added to inventory", time: "15 minutes ago", icon: "📦", color: "#F0FDF4" },
    { action: "Payment received", detail: "$129.99 from Sarah Smith", time: "1 hour ago", icon: "💰", color: "#FFF7ED" },
    { action: "New customer", detail: "Emily Davis created an account", time: "3 hours ago", icon: "👤", color: "#F5F3FF" },
    { action: "Order shipped", detail: "Order #ORD-0039 marked as shipped", time: "5 hours ago", icon: "🚚", color: "#EEF5FF" },
    { action: "Review posted", detail: "5-star review on Classic T-Shirt", time: "1 day ago", icon: "⭐", color: "#FFFCE8" },
  ];

  return (
    <div className="space-y-[30px]">
      <div>
        <h1 className="text-2xl font-bold text-[#111]">Dashboard</h1>
        <p className="text-sm text-[#575864] mt-1">Welcome back! Here is what's happening today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
        {[
          { label: "Today's Revenue", value: "$4,890", icon: "💰", bg: "#EEF5FF", textColor: "#2275fc" },
          { label: "New Orders", value: "24", icon: "📋", bg: "#F0FDF4", textColor: "#22C55E" },
          { label: "New Customers", value: "18", icon: "👥", bg: "#FFF7ED", textColor: "#FF5200" },
          { label: "Pending Reviews", value: "7", icon: "⭐", bg: "#F5F3FF", textColor: "#8B5CF6" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] flex items-center gap-4">
            <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: stat.bg }}>{stat.icon}</div>
            <div>
              <p className="text-xs text-[#95989D]">{stat.label}</p>
              <p className="text-2xl font-bold text-[#111]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[30px]">
        {/* Recent Activity */}
        <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
          <h5 className="text-lg font-bold text-[#111] mb-6">Recent Activity</h5>
          <div className="space-y-0">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-4 py-4 border-b border-[#F2F7FB] last:border-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm" style={{ backgroundColor: item.color }}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111]">{item.action}</p>
                  <p className="text-xs text-[#575864]">{item.detail}</p>
                </div>
                <span className="text-[10px] text-[#95989D] flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="space-y-[30px]">
          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
            <h5 className="text-lg font-bold text-[#111] mb-6">Quick Actions</h5>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Add Product", icon: "📦", action: "Add a new product to the store" },
                { label: "View Orders", icon: "📋", action: "Check pending orders" },
                { label: "Send Offer", icon: "✉️", action: "Send promotional offer" },
                { label: "Analytics", icon: "📊", action: "View detailed reports" },
              ].map((q) => (
                <button key={q.label} type="button" className="p-4 rounded-xl border border-[#ECF0F4] hover:bg-[#F2F7FB] transition-all text-left">
                  <span className="text-xl">{q.icon}</span>
                  <p className="text-sm font-semibold text-[#111] mt-2">{q.label}</p>
                  <p className="text-xs text-[#95989D] mt-0.5">{q.action}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
            <h5 className="text-lg font-bold text-[#111] mb-4">Store Overview</h5>
            <div className="space-y-4">
              {[
                { label: "Total Products", value: "1,284" },
                { label: "Total Categories", value: "24" },
                { label: "Total Orders", value: "12,450" },
                { label: "Total Customers", value: "8,392" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#F2F7FB] last:border-0">
                  <span className="text-sm text-[#575864]">{item.label}</span>
                  <span className="text-sm font-bold text-[#111]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

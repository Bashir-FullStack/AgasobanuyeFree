import React, { useState, useEffect } from 'react';
import {
  FiFilm, FiUsers, FiGrid, FiTag, FiMonitor, FiBookOpen, FiUserCheck
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { api } from '../config';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoints = [
          { label: 'Movies', endpoint: '/movies', icon: <FiFilm />, color: 'red' },
          { label: 'Interpreters', endpoint: '/interpreters', icon: <FiUsers />, color: 'blue' },
          { label: 'Genres', endpoint: '/genres', icon: <FiGrid />, color: 'green' },
          { label: 'Categories', endpoint: '/categories', icon: <FiTag />, color: 'yellow' },
          { label: 'Banners', endpoint: '/banners', icon: <FiMonitor />, color: 'purple' },
          { label: 'Bookings', endpoint: '/bookings', icon: <FiBookOpen />, color: 'teal' },
          { label: 'Users', endpoint: '/users', icon: <FiUserCheck />, color: 'red' },
        ];

        const results = await Promise.allSettled(
          endpoints.map((ep) => api.get(ep.endpoint))
        );

        const statData = endpoints.map((ep, i) => {
          const data = results[i].status === 'fulfilled' ? results[i].value : [];
          const count = Array.isArray(data) ? data.length : (data.data ? data.data.length : 0);
          return { ...ep, value: count };
        });

        setStats(statData);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = stats.map((s) => ({ name: s.label, value: s.value }));

  const COLORS = ['#ff1e1e', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#14b8a6', '#ef4444'];

  const bookingTrend = [
    { month: 'Jan', bookings: 12 },
    { month: 'Feb', bookings: 19 },
    { month: 'Mar', bookings: 15 },
    { month: 'Apr', bookings: 27 },
    { month: 'May', bookings: 32 },
    { month: 'Jun', bookings: 25 },
  ];

  if (loading) {
    return <div className="loading-spinner">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
            <div className={`stat-card-icon ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Content Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 8, color: '#fff' }}
                cursor={{ fill: 'rgba(255,30,30,0.1)' }}
              />
              <Bar dataKey="value" fill="#ff1e1e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#555' }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 8, color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Monthly Bookings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: 8, color: '#fff' }}
              />
              <Line type="monotone" dataKey="bookings" stroke="#ff1e1e" strokeWidth={2} dot={{ fill: '#ff1e1e' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import Footer from '../components/Footer';

const AdminStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://megaproyecto-backend-services.vercel.app/api/admins/stats', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchAdminStats();
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brownCardInformation">
        <div className="flex flex-col items-center">
          <img
            src="/static/images/logo_V1.png"
            alt="Loading Logo"
            className="w-32 h-32 animate-spin"
          />
          <p className="text-whiteTextPlatyfa text-xl mt-4">Loading admin stats...</p>
        </div>
      </div>
    );
  }

  const consistentColor = 'rgba(37, 9, 0, 0.7)'; // Uniform color for all graphs

  return (
    <div className="bg-brownCardInformation min-h-screen flex flex-col justify-between">
      <div className="p-4">
        <div className="transition-opacity duration-500 opacity-100">
          <div className="bg-orangePlatyfa text-center rounded-lg p-6 max-w-lg mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-whiteTextPlatyfa">
              Admin Statistics
            </h2>
          </div>

          {/* Grid layout for stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="New Players Over Last Year"
              description="Shows the monthly new player count for the last year."
              chart={
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.newPlayers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="new_players" fill={consistentColor} />
                  </BarChart>
                </ResponsiveContainer>
              }
            />

            <StatCard
              title="Total Sessions Over Last Year"
              description="Shows the monthly total sessions for the last year."
              chart={
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={stats.totalSessions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total_sessions" stroke={consistentColor} />
                  </LineChart>
                </ResponsiveContainer>
              }
            />

            <StatCard
              title="Average Session Duration Over Last Year"
              description="Shows the monthly average session duration in minutes for the last year."
              chart={
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={stats.avgDuration}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avg_duration" stroke={consistentColor} />
                  </LineChart>
                </ResponsiveContainer>
              }
            />

            <StatCard
              title="Top Levels Played"
              description="This graph shows the most played levels and their win rates."
              chart={
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.gameTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="level_count" fill={consistentColor} />
                  </BarChart>
                </ResponsiveContainer>
              }
            />

            <StatCard
              title="Item Usage Frequency"
              description="This graph shows the frequency of items used in the last month."
              chart={
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.itemUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_barringtonia" fill={consistentColor} />
                  </BarChart>
                </ResponsiveContainer>
              }
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const StatCard = ({ title, description, chart }) => {
  return (
    <div className="bg-principalCardColor bg-opacity-90 p-4 rounded-lg shadow-md flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-whiteTextPlatyfa">{title}</h3>
        <p className="text-sm text-whiteTextPlatyfa">{description}</p>
      </div>
      <div>{chart}</div>
    </div>
  );
};

export default AdminStats;

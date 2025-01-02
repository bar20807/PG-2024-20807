import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useInView } from 'react-intersection-observer';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Footer from '../components/Footer';

const Dashboard = () => {
  const [statistics, setStatistics] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username);
    }

    const fetchStatistics = async () => {
      try {
        const response = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/game_statistics`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setStatistics(data.statistics);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brownCardInformation">
        <div className="flex flex-col items-center">
          <img
            src="/static/images/logo_V1.png"
            alt="Loading Logo"
            className="w-32 h-32 animate-spin"
          />
          <p className="text-whiteTextPlatyfa text-xl mt-4">Loading your statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brownCardInformation min-h-screen flex flex-col justify-between">
      <div className="p-4">
        <div
          ref={ref}
          className={`transition-opacity duration-500 ${inView ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Contenedor para el título principal */}
          <div className="bg-orangePlatyfa text-center rounded-lg p-6 max-w-lg mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-whiteTextPlatyfa">
              {username}&apos;s Dashboard
            </h2>
          </div>

          {/* Contenedor para las estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Average Kills"
              description="Average kills per month"
              dataKey="avg_kills"
              data={statistics}
              chartType="line"
              barColor="rgba(37, 9, 0, 0.7)"
            />

            <StatCard
              title="Average Damage Received"
              description="Damage received per month"
              dataKey="avg_damage_received"
              data={statistics}
              chartType="area"
              barColor="rgba(37, 9, 0, 0.7)"
            />

            <StatCard
              title="Average Jumps"
              description="Jumps per month"
              dataKey="avg_jumps"
              data={statistics}
              chartType="bar"
              barColor="rgba(37, 9, 0, 0.7)"
            />

            <StatCard
              title="Total Game Duration"
              description="Total duration per month"
              dataKey="total_duration"
              data={statistics}
              chartType="radar"
              barColor="rgba(37, 9, 0, 0.7)"
            />

            <StatCard
              title="Wins and Losses"
              description="Wins vs Losses"
              data={statistics}
              dualDataKeys={['wins', 'losses']}
              barColors={['rgba(0, 128, 0, 0.7)', 'rgba(128, 0, 0, 0.7)']}
              chartType="stackedBar"
            />
          </div>
        </div>
      </div>

      {/* Footer agregado */}
      <Footer />
    </div>
  );
};

const StatCard = ({ title, description, dataKey, dualDataKeys, data, chartType, barColor, barColors }) => {
  let chart;

  switch (chartType) {
    case 'line':
      chart = (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={barColor} />
          </LineChart>
        </ResponsiveContainer>
      );
      break;

    case 'area':
      chart = (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey={dataKey} stroke={barColor} fill={barColor} />
          </AreaChart>
        </ResponsiveContainer>
      );
      break;

    case 'radar':
      chart = (
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="month" />
            <PolarRadiusAxis />
            <Radar dataKey={dataKey} stroke={barColor} fill={barColor} fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      );
      break;

    case 'stackedBar':
      chart = (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {dualDataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} stackId="a" fill={barColors[index]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
      break;

    default:
      chart = (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={barColor} />
          </BarChart>
        </ResponsiveContainer>
      );
      break;
  }

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

export default Dashboard;

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Bed, Users, Calendar, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface DashboardMetrics {
  bookings: {
    totalBookings: number;
    occupancyRate: number;
  };
  pilgrims: {
    totalPilgrims: number;
  };
  beds: {
    totalBeds: number;
    occupiedBeds: number;
  };
  weeklyStats: Array<{ day: string; bookings: number; revenue: number }>;
  recentBookings: Array<{
    id: number;
    referenceNumber: string;
    guestName: string;
    bedLabel: string | null;
    checkInDate: string;
    status: string | null;
  }>;
}

export interface DashboardProps {
  metrics: DashboardMetrics;
}

const weekdayFormatter = new Intl.DateTimeFormat('en', { weekday: 'short' });

function getStatusColor(status: string | null) {
  switch (status) {
    case 'reserved':
    case 'checked_in':
    case 'completed':
      return 'bg-green-100 text-[#00AB39] border-green-200';
    case 'cancelled':
    case 'expired':
      return 'bg-red-100 text-[#ED1C24] border-red-200';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function Dashboard({ metrics }: DashboardProps) {
  const stats = [
    {
      title: 'Total Bookings',
      value: String(metrics.bookings.totalBookings),
      icon: Calendar,
    },
    {
      title: 'Occupied Beds',
      value: `${metrics.beds.occupiedBeds}/${metrics.beds.totalBeds}`,
      icon: Bed,
    },
    {
      title: 'Total Guests',
      value: String(metrics.pilgrims.totalPilgrims),
      icon: Users,
    },
    {
      title: 'Occupancy Rate',
      value: `${metrics.bookings.occupancyRate}%`,
      icon: TrendingUp,
    },
  ];

  const weeklyData = metrics.weeklyStats.map((s) => ({
    ...s,
    day: weekdayFormatter.format(new Date(`${s.day}T00:00:00`)),
  }));

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-500">Overview of albergue operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-[#00AB39]" />
                  </div>
                </div>
                <h3 className="text-3xl mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#00AB39"
                  strokeWidth={2}
                  dot={{ fill: '#00AB39' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Revenue (€)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#00AB39" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Booking ID</th>
                  <th className="text-left py-3 px-4">Guest Name</th>
                  <th className="text-left py-3 px-4">Bed</th>
                  <th className="text-left py-3 px-4">Check-in</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                      No bookings yet.
                    </td>
                  </tr>
                )}
                {metrics.recentBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-3 px-4">{booking.referenceNumber}</td>
                    <td className="py-3 px-4">{booking.guestName}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{booking.bedLabel ?? '—'}</span>
                    </td>
                    <td className="py-3 px-4">{booking.checkInDate}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status ?? 'unknown'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

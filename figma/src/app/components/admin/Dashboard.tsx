import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Bed, Users, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const stats = [
    {
      title: 'Total Bookings',
      value: '47',
      change: '+12%',
      icon: Calendar,
      trend: 'up',
    },
    {
      title: 'Occupied Beds',
      value: '18/24',
      change: '75%',
      icon: Bed,
      trend: 'up',
    },
    {
      title: 'Total Guests',
      value: '134',
      change: '+8%',
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Occupancy Rate',
      value: '82%',
      change: '+5%',
      icon: TrendingUp,
      trend: 'up',
    },
  ];

  const recentBookings = [
    {
      id: 'BK-001',
      guest: 'John Smith',
      beds: ['D1-B3', 'D1-B4'],
      checkIn: '2024-12-20',
      status: 'confirmed',
    },
    {
      id: 'BK-002',
      guest: 'Maria Garcia',
      beds: ['D2-B5'],
      checkIn: '2024-12-20',
      status: 'confirmed',
    },
    {
      id: 'BK-003',
      guest: 'Pierre Dubois',
      beds: ['D1-B8'],
      checkIn: '2024-12-21',
      status: 'pending',
    },
    {
      id: 'BK-004',
      guest: 'Anna Mueller',
      beds: ['D2-B2', 'D2-B3'],
      checkIn: '2024-12-21',
      status: 'confirmed',
    },
    {
      id: 'BK-005',
      guest: 'Carlos Silva',
      beds: ['D1-B6'],
      checkIn: '2024-12-19',
      status: 'cancelled',
    },
  ];

  const weeklyData = [
    { day: 'Mon', bookings: 12, revenue: 120 },
    { day: 'Tue', bookings: 15, revenue: 150 },
    { day: 'Wed', bookings: 18, revenue: 180 },
    { day: 'Thu', bookings: 14, revenue: 140 },
    { day: 'Fri', bookings: 20, revenue: 200 },
    { day: 'Sat', bookings: 22, revenue: 220 },
    { day: 'Sun', bookings: 16, revenue: 160 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-[#00AB39] border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-[#EAC102] border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-[#ED1C24] border-red-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-500">Overview of albergue operations</p>
      </div>

      {/* Stats Grid */}
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
                  <Badge variant="outline" className="text-[#00AB39] border-[#00AB39]">
                    {stat.change}
                  </Badge>
                </div>
                <h3 className="text-3xl mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
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

        {/* Revenue Chart */}
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

      {/* Recent Bookings Table */}
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
                  <th className="text-left py-3 px-4">Beds</th>
                  <th className="text-left py-3 px-4">Check-in</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-3 px-4">{booking.id}</td>
                    <td className="py-3 px-4">{booking.guest}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{booking.beds.join(', ')}</span>
                    </td>
                    <td className="py-3 px-4">{booking.checkIn}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-sm text-[#0071BC] hover:underline">
                          View
                        </button>
                        <button className="text-sm text-[#00AB39] hover:underline">
                          Edit
                        </button>
                        <button className="text-sm text-[#ED1C24] hover:underline">
                          Cancel
                        </button>
                      </div>
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
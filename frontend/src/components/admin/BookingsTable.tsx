import { useState } from 'react';
import { actions } from 'astro:actions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Search, Filter } from 'lucide-react';

export type BookingStatus =
  'reserved' | 'checked_in' | 'checked_out' | 'completed' | 'cancelled' | 'expired' | 'deleted';

export interface BookingRow {
  id: number;
  referenceNumber: string;
  guestName: string;
  email: string | null;
  phone: string;
  nationality: string | null;
  bedLabel: string | null;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus | null;
  totalAmount: string | null;
  paymentType: string | null;
}

export interface BookingsTableProps {
  initialBookings: BookingRow[];
}

const STATUS_OPTIONS: BookingStatus[] = [
  'reserved',
  'checked_in',
  'checked_out',
  'completed',
  'cancelled',
  'expired',
];

function getStatusColor(status: BookingStatus | null) {
  switch (status) {
    case 'reserved':
      return 'bg-yellow-100 text-[#EAC102] border-yellow-200';
    case 'checked_in':
    case 'completed':
      return 'bg-green-100 text-[#00AB39] border-green-200';
    case 'checked_out':
      return 'bg-blue-100 text-[#0071BC] border-blue-200';
    case 'cancelled':
    case 'expired':
    case 'deleted':
      return 'bg-red-100 text-[#ED1C24] border-red-200';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function BookingsTable({ initialBookings }: BookingsTableProps) {
  const [bookings, setBookings] = useState<BookingRow[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredBookings = bookings.filter((booking) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      booking.guestName.toLowerCase().includes(term) ||
      booking.referenceNumber.toLowerCase().includes(term) ||
      (booking.email ?? '').toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  async function transitionStatus(bookingId: number, status: BookingStatus) {
    setPendingId(bookingId);
    setError(null);
    const { error: actionError } = await actions.bookings.updateStatus({ bookingId, status });
    setPendingId(null);
    if (actionError) {
      setError(actionError.message);
      return;
    }
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-3xl mb-2">Bookings</h1>
        <p className="text-gray-500">Manage all pilgrim reservations</p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Reference</th>
                  <th className="text-left py-3 px-4">Guest</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Bed</th>
                  <th className="text-left py-3 px-4">Check-in</th>
                  <th className="text-left py-3 px-4">Check-out</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-3 px-4">{booking.referenceNumber}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p>{booking.guestName}</p>
                        <p className="text-xs text-gray-500">{booking.nationality ?? '—'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-gray-600">{booking.email ?? '—'}</p>
                        <p className="text-gray-500 text-xs">{booking.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{booking.bedLabel ?? '—'}</span>
                    </td>
                    <td className="py-3 px-4">{booking.checkInDate}</td>
                    <td className="py-3 px-4">{booking.checkOutDate}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status ?? 'unknown'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p>€{booking.totalAmount ?? '0.00'}</p>
                        <p className="text-xs text-gray-500">{booking.paymentType ?? '—'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 items-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Booking Details - {booking.referenceNumber}</DialogTitle>
                              <DialogDescription>
                                Complete information for {booking.guestName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-6 mt-4">
                              <div>
                                <h4 className="font-medium mb-3">Guest Information</h4>
                                <div className="space-y-2 text-sm">
                                  <p>
                                    <strong>Name:</strong> {booking.guestName}
                                  </p>
                                  <p>
                                    <strong>Email:</strong> {booking.email ?? '—'}
                                  </p>
                                  <p>
                                    <strong>Phone:</strong> {booking.phone}
                                  </p>
                                  <p>
                                    <strong>Nationality:</strong> {booking.nationality ?? '—'}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-3">Booking Details</h4>
                                <div className="space-y-2 text-sm">
                                  <p>
                                    <strong>Bed:</strong> {booking.bedLabel ?? '—'}
                                  </p>
                                  <p>
                                    <strong>Check-in:</strong> {booking.checkInDate}
                                  </p>
                                  <p>
                                    <strong>Check-out:</strong> {booking.checkOutDate}
                                  </p>
                                  <p>
                                    <strong>Status:</strong> {booking.status ?? 'unknown'}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-3">Payment</h4>
                                <div className="space-y-2 text-sm">
                                  <p>
                                    <strong>Method:</strong> {booking.paymentType ?? '—'}
                                  </p>
                                  <p>
                                    <strong>Amount:</strong> €{booking.totalAmount ?? '0.00'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                              {booking.status === 'reserved' && (
                                <Button
                                  className="flex-1 bg-[#00AB39] hover:bg-[#008c2f]"
                                  disabled={pendingId === booking.id}
                                  onClick={() => transitionStatus(booking.id, 'checked_in')}
                                >
                                  {pendingId === booking.id ? 'Confirming…' : 'Confirm Check-in'}
                                </Button>
                              )}
                              {(booking.status === 'reserved' ||
                                booking.status === 'checked_in') && (
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  disabled={pendingId === booking.id}
                                  onClick={() => transitionStatus(booking.id, 'cancelled')}
                                >
                                  {pendingId === booking.id ? 'Cancelling…' : 'Cancel Booking'}
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No bookings found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

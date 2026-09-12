import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

interface Bed {
  id: string;
  status: BedStatus;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
}

export function BedManagement() {
  const [date, setDate] = useState<Date>(new Date());
  const [dorm1Beds, setDorm1Beds] = useState<Bed[]>([
    { id: 'D1-B1', status: 'available' },
    { id: 'D1-B2', status: 'occupied', guestName: 'John Smith', checkIn: '2024-12-19', checkOut: '2024-12-21' },
    { id: 'D1-B3', status: 'occupied', guestName: 'John Smith', checkIn: '2024-12-19', checkOut: '2024-12-21' },
    { id: 'D1-B4', status: 'reserved', guestName: 'Maria Garcia', checkIn: '2024-12-21', checkOut: '2024-12-22' },
    { id: 'D1-B5', status: 'available' },
    { id: 'D1-B6', status: 'maintenance' },
    { id: 'D1-B7', status: 'available' },
    { id: 'D1-B8', status: 'occupied', guestName: 'Pierre Dubois', checkIn: '2024-12-19', checkOut: '2024-12-20' },
    { id: 'D1-B9', status: 'available' },
    { id: 'D1-B10', status: 'available' },
    { id: 'D1-B11', status: 'reserved', guestName: 'Anna Mueller', checkIn: '2024-12-21', checkOut: '2024-12-22' },
    { id: 'D1-B12', status: 'available' },
  ]);

  const [dorm2Beds, setDorm2Beds] = useState<Bed[]>([
    { id: 'D2-B1', status: 'available' },
    { id: 'D2-B2', status: 'occupied', guestName: 'Carlos Silva', checkIn: '2024-12-19', checkOut: '2024-12-20' },
    { id: 'D2-B3', status: 'available' },
    { id: 'D2-B4', status: 'available' },
    { id: 'D2-B5', status: 'reserved', guestName: 'Sophie Laurent', checkIn: '2024-12-21', checkOut: '2024-12-22' },
    { id: 'D2-B6', status: 'available' },
    { id: 'D2-B7', status: 'occupied', guestName: 'Thomas Brown', checkIn: '2024-12-19', checkOut: '2024-12-21' },
    { id: 'D2-B8', status: 'available' },
    { id: 'D2-B9', status: 'available' },
    { id: 'D2-B10', status: 'maintenance' },
    { id: 'D2-B11', status: 'available' },
    { id: 'D2-B12', status: 'available' },
  ]);

  const getBedColor = (status: BedStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'occupied':
        return 'bg-red-50 border-[#ED1C24]';
      case 'reserved':
        return 'bg-yellow-50 border-[#EAC102]';
      case 'maintenance':
        return 'bg-gray-200 border-gray-400';
    }
  };

  const getStatusBadge = (status: BedStatus) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-[#00AB39] border-green-200">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-red-100 text-[#ED1C24] border-red-200">Occupied</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-100 text-[#EAC102] border-yellow-200">Reserved</Badge>;
      case 'maintenance':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Maintenance</Badge>;
    }
  };

  const allBeds = [...dorm1Beds, ...dorm2Beds];
  const availableCount = allBeds.filter((b) => b.status === 'available').length;
  const occupiedCount = allBeds.filter((b) => b.status === 'occupied').length;
  const reservedCount = allBeds.filter((b) => b.status === 'reserved').length;
  const maintenanceCount = allBeds.filter((b) => b.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1>Bed Management</h1>
          <p className="text-gray-600 text-sm mt-1">View and manage bed availability</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-[280px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl text-[#00AB39] mb-1">{availableCount}</p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl text-[#ED1C24] mb-1">{occupiedCount}</p>
              <p className="text-sm text-gray-600">Occupied</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl text-[#EAC102] mb-1">{reservedCount}</p>
              <p className="text-sm text-gray-600">Reserved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl text-gray-600 mb-1">{maintenanceCount}</p>
              <p className="text-sm text-gray-600">Maintenance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dormitory 1 */}
      <Card>
        <CardHeader>
          <CardTitle>Dormitory 1</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dorm1Beds.map((bed) => (
              <Card key={bed.id} className={`border-2 ${getBedColor(bed.status)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span>{bed.id}</span>
                    {getStatusBadge(bed.status)}
                  </div>
                  {bed.guestName && (
                    <div className="text-sm mt-3 pt-3 border-t">
                      <p className="text-gray-600 mb-1">{bed.guestName}</p>
                      <p className="text-xs text-gray-500">
                        {bed.checkIn} → {bed.checkOut}
                      </p>
                    </div>
                  )}
                  {bed.status === 'available' && (
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-[#00AB39] hover:bg-[#008c2f]"
                    >
                      Assign
                    </Button>
                  )}
                  {bed.status === 'maintenance' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3"
                    >
                      Mark Available
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dormitory 2 */}
      <Card>
        <CardHeader>
          <CardTitle>Dormitory 2</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dorm2Beds.map((bed) => (
              <Card key={bed.id} className={`border-2 ${getBedColor(bed.status)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span>{bed.id}</span>
                    {getStatusBadge(bed.status)}
                  </div>
                  {bed.guestName && (
                    <div className="text-sm mt-3 pt-3 border-t">
                      <p className="text-gray-600 mb-1">{bed.guestName}</p>
                      <p className="text-xs text-gray-500">
                        {bed.checkIn} → {bed.checkOut}
                      </p>
                    </div>
                  )}
                  {bed.status === 'available' && (
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-[#00AB39] hover:bg-[#008c2f]"
                    >
                      Assign
                    </Button>
                  )}
                  {bed.status === 'maintenance' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3"
                    >
                      Mark Available
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useMemo, useState } from 'react';
import { actions } from 'astro:actions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance' | (string & {});

export interface BedDashboardItem {
  id: number;
  bedNumber: number;
  roomNumber: number;
  roomName: string;
  roomType: string | null;
  status: BedStatus | null;
  guestName: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
}

export interface BedManagementProps {
  initialBeds: BedDashboardItem[];
}

const bedColor: Record<string, string> = {
  available: 'bg-green-50 border-green-200 hover:bg-green-100',
  occupied: 'bg-red-50 border-[#ED1C24]',
  reserved: 'bg-yellow-50 border-[#EAC102]',
  maintenance: 'bg-gray-200 border-gray-400',
};

function StatusBadge({ status }: { status: BedStatus }) {
  switch (status) {
    case 'available':
      return <Badge className="bg-green-100 text-[#00AB39] border-green-200">Available</Badge>;
    case 'occupied':
      return <Badge className="bg-red-100 text-[#ED1C24] border-red-200">Occupied</Badge>;
    case 'reserved':
      return <Badge className="bg-yellow-100 text-[#EAC102] border-yellow-200">Reserved</Badge>;
    case 'maintenance':
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Maintenance</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">{status}</Badge>;
  }
}

export function BedManagement({ initialBeds }: BedManagementProps) {
  const [beds, setBeds] = useState<BedDashboardItem[]>(initialBeds);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rooms = useMemo(() => {
    const byRoom = new Map<string, BedDashboardItem[]>();
    for (const bed of beds) {
      const key = bed.roomName;
      if (!byRoom.has(key)) byRoom.set(key, []);
      byRoom.get(key)!.push(bed);
    }
    return [...byRoom.entries()].sort((a, b) => a[1][0].roomNumber - b[1][0].roomNumber);
  }, [beds]);

  const counts = useMemo(() => {
    const c = { available: 0, occupied: 0, reserved: 0, maintenance: 0 };
    for (const bed of beds) {
      if (bed.status === 'available') c.available++;
      else if (bed.status === 'occupied') c.occupied++;
      else if (bed.status === 'reserved') c.reserved++;
      else if (bed.status === 'maintenance') c.maintenance++;
    }
    return c;
  }, [beds]);

  async function handleReserve(bedId: number) {
    setPendingId(bedId);
    setError(null);
    const { data, error: actionError } = await actions.beds.reserve({ bedId });
    setPendingId(null);
    if (actionError) {
      setError(actionError.message);
      return;
    }
    setBeds((prev) =>
      prev.map((bed) => (bed.id === bedId ? { ...bed, status: data.status } : bed))
    );
  }

  async function handleRelease(bedId: number) {
    setPendingId(bedId);
    setError(null);
    const { data, error: actionError } = await actions.beds.release({ bedId });
    setPendingId(null);
    if (actionError) {
      setError(actionError.message);
      return;
    }
    setBeds((prev) =>
      prev.map((bed) =>
        bed.id === bedId
          ? { ...bed, status: data.status, guestName: null, checkInDate: null, checkOutDate: null }
          : bed
      )
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Bed Management</h1>
        <p className="text-gray-600 text-sm mt-1">View and manage bed availability</p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl text-[#00AB39] mb-1">{counts.available}</p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl text-[#ED1C24] mb-1">{counts.occupied}</p>
              <p className="text-sm text-gray-600">Occupied</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl text-[#EAC102] mb-1">{counts.reserved}</p>
              <p className="text-sm text-gray-600">Reserved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl text-gray-600 mb-1">{counts.maintenance}</p>
              <p className="text-sm text-gray-600">Maintenance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {rooms.map(([roomName, roomBeds]) => (
        <Card key={roomName}>
          <CardHeader>
            <CardTitle>{roomName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {roomBeds.map((bed) => (
                <Card
                  key={bed.id}
                  className={`border-2 ${bedColor[bed.status ?? ''] ?? 'bg-white border-gray-200'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span>
                        {bed.roomName}-B{bed.bedNumber}
                      </span>
                      <StatusBadge status={bed.status ?? 'available'} />
                    </div>
                    {bed.guestName && (
                      <div className="text-sm mt-3 pt-3 border-t">
                        <p className="text-gray-600 mb-1">{bed.guestName}</p>
                        <p className="text-xs text-gray-500">
                          {bed.checkInDate} → {bed.checkOutDate}
                        </p>
                      </div>
                    )}
                    {bed.status === 'available' && (
                      <Button
                        size="sm"
                        disabled={pendingId === bed.id}
                        onClick={() => handleReserve(bed.id)}
                        className="w-full mt-3 bg-[#00AB39] hover:bg-[#008c2f]"
                      >
                        {pendingId === bed.id ? 'Reserving…' : 'Reserve'}
                      </Button>
                    )}
                    {(bed.status === 'reserved' ||
                      bed.status === 'occupied' ||
                      bed.status === 'maintenance') && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pendingId === bed.id}
                        onClick={() => handleRelease(bed.id)}
                        className="w-full mt-3"
                      >
                        {pendingId === bed.id
                          ? 'Releasing…'
                          : bed.status === 'maintenance'
                            ? 'Mark Available'
                            : 'Release'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Search, Filter, Download } from "lucide-react";

export function BookingsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const bookings = [
    {
      id: "BK-001",
      guest: "John Smith",
      email: "john.smith@email.com",
      phone: "+34 123 456 789",
      beds: ["D1-B3", "D1-B4"],
      checkIn: "2024-12-20",
      checkOut: "2024-12-21",
      status: "confirmed",
      paymentMethod: "Card",
      totalAmount: 20,
      nationality: "USA",
    },
    {
      id: "BK-002",
      guest: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+34 987 654 321",
      beds: ["D2-B5"],
      checkIn: "2024-12-20",
      checkOut: "2024-12-22",
      status: "confirmed",
      paymentMethod: "Cash",
      totalAmount: 20,
      nationality: "Spain",
    },
    {
      id: "BK-003",
      guest: "Pierre Dubois",
      email: "pierre.dubois@email.com",
      phone: "+33 123 456 789",
      beds: ["D1-B8"],
      checkIn: "2024-12-21",
      checkOut: "2024-12-22",
      status: "pending",
      paymentMethod: "Transfer",
      totalAmount: 10,
      nationality: "France",
    },
    {
      id: "BK-004",
      guest: "Anna Mueller",
      email: "anna.mueller@email.com",
      phone: "+49 123 456 789",
      beds: ["D2-B2", "D2-B3"],
      checkIn: "2024-12-21",
      checkOut: "2024-12-23",
      status: "confirmed",
      paymentMethod: "Card",
      totalAmount: 40,
      nationality: "Germany",
    },
    {
      id: "BK-005",
      guest: "Carlos Silva",
      email: "carlos.silva@email.com",
      phone: "+351 987 654 321",
      beds: ["D1-B6"],
      checkIn: "2024-12-19",
      checkOut: "2024-12-20",
      status: "cancelled",
      paymentMethod: "Card",
      totalAmount: 10,
      nationality: "Portugal",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-[#00AB39] border-green-200";
      case "pending":
        return "bg-yellow-100 text-[#EAC102] border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-[#ED1C24] border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Bookings</h1>
        <p className="text-gray-500">Manage all pilgrim reservations</p>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Export */}
            <Button variant="outline" className="w-full md:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Guest</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Beds</th>
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
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-3 px-4">{booking.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p>{booking.guest}</p>
                        <p className="text-xs text-gray-500">
                          {booking.nationality}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-gray-600">{booking.email}</p>
                        <p className="text-gray-500 text-xs">{booking.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{booking.beds.join(", ")}</span>
                    </td>
                    <td className="py-3 px-4">{booking.checkIn}</td>
                    <td className="py-3 px-4">{booking.checkOut}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p>€{booking.totalAmount}</p>
                        <p className="text-xs text-gray-500">
                          {booking.paymentMethod}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Booking Details - {booking.id}
                            </DialogTitle>
                            <DialogDescription>
                              Complete information for {booking.guest}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-6 mt-4">
                            <div>
                              <h4 className="font-medium mb-3">
                                Guest Information
                              </h4>
                              <div className="space-y-2 text-sm">
                                <p>
                                  <strong>Name:</strong> {booking.guest}
                                </p>
                                <p>
                                  <strong>Email:</strong> {booking.email}
                                </p>
                                <p>
                                  <strong>Phone:</strong> {booking.phone}
                                </p>
                                <p>
                                  <strong>Nationality:</strong>{" "}
                                  {booking.nationality}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-3">
                                Booking Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <p>
                                  <strong>Beds:</strong>{" "}
                                  {booking.beds.join(", ")}
                                </p>
                                <p>
                                  <strong>Check-in:</strong> {booking.checkIn}
                                </p>
                                <p>
                                  <strong>Check-out:</strong> {booking.checkOut}
                                </p>
                                <p>
                                  <strong>Status:</strong> {booking.status}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-3">Payment</h4>
                              <div className="space-y-2 text-sm">
                                <p>
                                  <strong>Method:</strong>{" "}
                                  {booking.paymentMethod}
                                </p>
                                <p>
                                  <strong>Amount:</strong> €
                                  {booking.totalAmount}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-6">
                            <Button className="flex-1 bg-[#00AB39] hover:bg-[#008c2f]">
                              Confirm Booking
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Edit
                            </Button>
                            <Button variant="destructive" className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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

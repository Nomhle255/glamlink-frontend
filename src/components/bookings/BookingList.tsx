// components/AppointmentList.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Send } from "lucide-react";
import { Booking, BookingStatus } from "@/app/api/bookings";

interface BookingListProps {
  bookings?: Booking[];
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onReschedule: (booking: Booking) => void;
  onComplete: (id: string) => void;
  serviceNames: Record<string, string>;
  slotTimes: Record<string, string>;
}

export default function BookingList(props: BookingListProps) {
  const {
    bookings = [],
    onConfirm,
    onCancel,
    onReschedule,
    onComplete,
    serviceNames = {},
    slotTimes = {},
  } = props;
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });
  const [sortBy, setSortBy] = useState<"bookedAt" | "customerName">("bookedAt");

  // Provided helpers
  const getServiceName = (booking: Booking): string => {
    if (booking.serviceId && serviceNames[booking.serviceId]) {
      return serviceNames[booking.serviceId];
    }
    if (booking.service && typeof booking.service === 'object' && 'name' in booking.service) {
      return booking.service.name;
    }
    return 'Unknown Service';
  };

  const getStartTime = (booking: Booking): string => {
    if (booking.slotId && slotTimes && typeof slotTimes === 'object' && slotTimes[booking.slotId]) {
      return slotTimes[booking.slotId];
    }
    return '';
  };

  const formatBookingDate = (booking: Booking): string => {
    const slotDateStr = getStartTime(booking) || booking.bookedAt || booking.createdAt || booking.updatedAt;
    if (slotDateStr) {
      const date = new Date(slotDateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';
      }
    }
    return '';
  };

  const formatBookingTime = (booking: Booking): string => {
    const startTime = getStartTime(booking);
    if (startTime === 'Unknown Time') {
      return 'Time TBD';
    }
    const date = new Date(startTime);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: true }) + ' UTC';
    }
    return '';
  };

  const formatStartTime = (booking: Booking): string => {
    const startTime = getStartTime(booking);
    if (startTime === 'Unknown Time') {
      return 'Unknown Time';
    }
    const date = new Date(startTime);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC';
    }
    return '';
  };

  const filteredBookings = useMemo(() => {
    let filtered = bookings;
    if (filters.status) {
      filtered = filtered.filter((b) => b.status === filters.status);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.customerName?.toLowerCase().includes(searchLower) ||
          b.client_name?.toLowerCase().includes(searchLower) ||
          getServiceName(b).toLowerCase().includes(searchLower)
      );
    }
    filtered.sort((a, b) => {
      if (sortBy === "bookedAt") {
        return new Date(getStartTime(a) || a.bookedAt || a.createdAt || a.updatedAt || "").getTime() - new Date(getStartTime(b) || b.bookedAt || b.createdAt || b.updatedAt || "").getTime();
      } else {
        return (a.customerName || a.client_name || "").localeCompare(b.customerName || b.client_name || "");
      }
    });
    return filtered;
  }, [bookings, filters, sortBy]);

  const getStatusBadge = (status: BookingStatus | string) => {
    const statusConfig: Record<string, { variant: string; label: string }> = {
      [BookingStatus.CONFIRMED]: {
        variant: "default",
        label: "Confirmed",
      },
      [BookingStatus.CANCELLED]: {
        variant: "destructive",
        label: "Cancelled",
      },
      [BookingStatus.COMPLETED]: {
        variant: "outline",
        label: "Completed",
      },
      [BookingStatus.PENDING]: {
        variant: "secondary",
        label: "Pending",
      },
    };
    const config = statusConfig[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  // No type badge for bookings

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings List</CardTitle>
        <CardDescription>
          View and manage bookings in a detailed list format
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              value={filters.status}
              onValueChange={(value: string) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                {Object.values(BookingStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: string) => setSortBy(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bookedAt">Booking Date</SelectItem>
                <SelectItem value="customerName">Customer Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Input
              placeholder="Search customers or services..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.customerName || booking.client_name || "Client"}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {formatBookingDate(booking) || <span className="italic text-gray-400">Loading date...</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatBookingTime(booking) || <span className="italic text-gray-400">Loading time...</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getServiceName(booking) !== 'Unknown Service'
                      ? getServiceName(booking)
                      : <span className="italic text-gray-400">Loading service...</span>}
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onConfirm(booking.id)}
                        disabled={booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.RESCHEDULED}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReschedule(booking)}
                        disabled={booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.RESCHEDULED}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCancel(booking.id)}
                        disabled={booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED}
                        className="text-destructive"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onComplete(booking.id)}
                        disabled={booking.status === BookingStatus.COMPLETED || (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.RESCHEDULED)}
                      >
                        Complete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No bookings found matching your filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
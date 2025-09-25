// hooks/useBookings.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  getBookingsByProvider,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from "@/app/api/bookings";
enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  RESCHEDULED = "RESCHEDULED",
}


export function useBookings(providerId: number) {
  return useQuery({
    queryKey: ["bookings", providerId],
    queryFn: () => getBookingsByProvider(providerId),
  });
}

export function useBooking(id: number) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["bookings", variables.providerId] });
    },
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: BookingStatus }) =>
      updateBookingStatus(id, status),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["booking", variables.id] });
    },
  });
}



export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelBooking(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["booking", id] });
    },
  });
}
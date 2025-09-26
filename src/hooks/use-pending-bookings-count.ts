import { useBookings } from "@/hooks/use-bookings";
import { useAuth } from "@/context/AuthContext";

export function usePendingBookingsCount() {
  const { user } = useAuth();
  const providerId = user?.id ? String(user.id) : "";
  const { data: bookings = [] } = useBookings(providerId);
  return bookings.filter((b: any) => b.status === "PENDING").length;
}

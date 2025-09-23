"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addServiceToStylist,
  getServicesForStylist,
  getServices,
  getServiceById,
  removeServiceFromStylist
} from "@/app/api/stylists-service";


export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addServiceToStylist,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["stylistServices", variables.stylistId] });
    },
  });
}
export function useStylistsServices(stylistId: number) {
  return useQuery({
    queryKey: ["stylistServices", stylistId],
    queryFn: () => getServicesForStylist(stylistId),
  });
}
export function useService(id: number) {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id),
  });
}
export function useRemoveServiceFromStylist() {
  const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ stylistId, serviceId }: { stylistId: number; serviceId: number }) =>
            removeServiceFromStylist(stylistId, serviceId),
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: ["stylistServices", variables.stylistId] });
        },  
    });
}
export function useAllServices() {
  return useQuery({
    queryKey: ["allServices"],
    queryFn: getServices,
  });
}


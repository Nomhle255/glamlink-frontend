// hooks/useAuth.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  register,
  login,
  RegisterData,
  LoginData,
} from "@/app/api/auth";
import {
  getProviderById,
  getAllProviders,
  updateProvider,
  Provider,
} from "@/app/api/providers";

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // Invalidate auth-related queries on successful registration
      qc.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Invalidate auth-related queries on successful login
      qc.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

// Hook to get provider by ID using server.get('/providers/:id')
export function useProvider(id: number) {
  return useQuery({
    queryKey: ["provider", id],
    queryFn: () => getProviderById(id),
    enabled: !!id, // Only run query if id is provided
  });
}

// Hook to get all providers
export function useProviders() {
  return useQuery({
    queryKey: ["providers"],
    queryFn: getAllProviders,
  });
}

// Hook to update provider
export function useUpdateProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Provider> }) => 
      updateProvider(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch provider queries
      qc.invalidateQueries({ queryKey: ["provider", variables.id] });
      qc.invalidateQueries({ queryKey: ["providers"] });
    },
  });
}
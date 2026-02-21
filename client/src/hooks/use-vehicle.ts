import { useQuery } from "@tanstack/react-query";

export interface VehicleAvailability {
  id: string;
  title: string;
  available: boolean;
  message?: string;
}

export function useVehicleAvailability(id?: string) {
  return useQuery({
    queryKey: ["vehicle-availability", id],
    queryFn: async () => {
      if (!id) return null;
      
      // Return a simple availability response indicating the vehicle is available
      // In a real scenario, this could check actual inventory from a third-party API
      return {
        id,
        title: "Vehicle",
        available: true,
        message: "Contact us to confirm current availability.",
      } as VehicleAvailability;
    },
    enabled: !!id,
    refetchInterval: 20_000,
  });
}

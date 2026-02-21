import { useQuery } from "@tanstack/react-query";
import { DEFAULT_HIGHLIGHTS } from "@/lib/defaultData";

export function useHighlights() {
  return useQuery({
    queryKey: ["highlights"],
    queryFn: async () => {
      // Return default highlights
      // In the future, this could be fetched from an API or stored in environment variables
      return DEFAULT_HIGHLIGHTS;
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { DEFAULT_SITE_SETTINGS } from "@/lib/defaultData";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      // Return default site settings
      // In the future, this could be fetched from an API or stored in environment variables
      return DEFAULT_SITE_SETTINGS;
    },
  });
}

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error: any) => {
        // Ne pas retry les erreurs 401
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Ne pas retry les erreurs 401
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});

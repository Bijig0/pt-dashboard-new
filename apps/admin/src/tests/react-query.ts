import { QueryClient } from "@tanstack/react-query";

export const createTestQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2, // turn off retries for testing
      },
    },
  });
  return queryClient;
};

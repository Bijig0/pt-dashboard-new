import { QueryClient } from "@tanstack/react-query";

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       throwOnError: true,
//     },
//   },
// });

export const queryClient = new QueryClient();

export const companyNamesKeys = {
  all: ["companyNames"] as const,
  lists: () => [...companyNamesKeys.all, "list"] as const,
  list: (filters: string) =>
    [...companyNamesKeys.lists(), { filters }] as const,
  details: () => [...companyNamesKeys.all, "detail"] as const,
  detail: (id: number) => [...companyNamesKeys.details(), id] as const,
  registerCompanyName: () => ["registerCompanyName"],
};

export const initialStokKeys = {
  all: ["stok"] as const,
  lists: () => [...initialStokKeys.all, "list"] as const,
  list: (filters: string) => [...initialStokKeys.lists(), { filters }] as const,
  details: () => [...initialStokKeys.all, "detail"] as const,
  detail: (id: number) => [...initialStokKeys.details(), id] as const,
  addInitialStok: () => ["addInitialStok"],
};

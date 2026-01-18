import { fetcher } from "src/lib";
import { endpoints } from "./endpoints";
import useSWR from "swr";
import { useMemo } from "react";

export const fetchOnboardingAccess = async () => {
  try {
    const response = await fetcher(endpoints.onBoardingAccess.access);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch onboarding access:', error);
    throw error;
  }
};

export function useOnboardingAccess() {
  const { data, error, isLoading, mutate } = useSWR(
    endpoints.onBoardingAccess.access,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      shouldRetryOnError: true,
    }
  );

  // ✅ Memoize return object - only creates new object when dependencies change
  return useMemo(
    () => ({
      data: data?.data,
      error,
      loading: isLoading,
      refresh: mutate,
    }),
    [data, error, isLoading, mutate]
  );
}
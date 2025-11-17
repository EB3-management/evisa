import useSWR from "swr";
import { useMemo } from "react";

import { fetcher } from "src/lib";

import { endpoints } from "./endpoints";

export function useGetVisaStatus() {
  const { data, isLoading, error } = useSWR(endpoints.visaStatus.list, fetcher);

  const memoizedValue = useMemo(
    () => ({
      visaStatus: data?.data || [],
      visaStatusLoading: isLoading,
      visaStatusError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export function useGetVisaStatusLog() {
  const { data, isLoading, error } = useSWR(
    endpoints.visaStatus.visaLogStatus,
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      visaStatusLogs: data?.data || [],
      visaStatusLogsLoading: isLoading,
      visaStatusLogsError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

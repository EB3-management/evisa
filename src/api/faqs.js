import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, poster } from "src/lib";

import { endpoints } from "./endpoints";

export function useGetFaqs() {
  const url = endpoints.faqs.list;

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      faqs: data?.data || [],
      faqsLoading: isLoading,
      faqsError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export function useGettermCondition() {
  const url = endpoints.termCondition.list;

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      termCondition: data?.data || [],
      termConditionLoading: isLoading,
      termConditionError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export function useGetGuide() {
  const url = endpoints.faqs.guide;

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      guide: data?.data || [],
      guideLoading: isLoading,
      guideError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export function useGetDashboard() {
  const url = endpoints.faqs.dashboard;

  const { data, isLoading, error, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      dashboard: data?.data || [],
      dashboardLoading: isLoading,
      dashboardError: error,
      mutateDashboard: mutate,
    }),
    [data?.data, isLoading, error, mutate]
  );

  return memoizedValue;
}

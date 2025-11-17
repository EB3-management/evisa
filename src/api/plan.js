import useSWR from "swr";
import { endpoints } from "./endpoints";
import { fetcher, poster } from "src/lib";
import { useMemo } from "react";

export function useGetPlan(id) {
  const url = endpoints.plan.list(id);

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      plan: data?.data || [],
      planLoading: isLoading,
      planError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export const fetchPlan = async (id) => {
  try {
    const response = await fetcher(endpoints.plan.list);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchFinancePlan = async (id) => {
  try {
    const response = await fetcher(endpoints.plan.financeList);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const assignPlan = async (id, data) => {
  try {
    const response = await poster(endpoints.plan.assign(id), data);

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export function useGetAssignPlanShow(id) {
  const url = endpoints.plan.detail(id);

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      planShow: data?.data || [],
      planShowLoading: isLoading,
      planShowError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

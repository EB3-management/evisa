import { useMemo } from "react";
import useSWR from "swr";
import { endpoints } from "./endpoints";
import { fetcher, poster } from "src/lib";

export function useGetVacancy() {
  const url = endpoints.vacancy.list;

  const { data, isLoading, error } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      vacancy: data?.data || [],
      vacancyLoading: isLoading,
      vacancyError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export const fetchVacancy = async () => {
  try {
    const response = await fetcher(endpoints.vacancy.list);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export function useGetVacancyDetail(id) {
  const url = endpoints.vacancy.detail(id);

  const { data, isLoading, error, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      vacancyDetail: data?.data || {},
      vacancyLoading: isLoading,
      vacancyError: error,
      mutateVacancyDetail: mutate,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

// export const fetchVacancyDetail = async (id) => {
//   try {
//     const response = await fetcher(endpoints.vacancy.detail(id));

//     return response.data;
//   } catch (error) {
//     console.error(error);

//     throw error;
//   }
// };

export const applyVacancy = async (id) => {
  try {
    const response = await poster(endpoints.vacancy.applied(id));
    console.log("this is apply vacancy response", response);
    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export function useGetAppliedVacancy() {
  const url = endpoints.vacancy.appliedVacancy;

  const { data, isLoading, error, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      appliedVacancy: data?.data || [],
      appliedVacancyLoading: isLoading,
      appliedVacancyError: error,
      mutateAppliedVacancy: mutate,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

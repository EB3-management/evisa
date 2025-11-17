import { fetcher, poster } from "src/lib";

import { endpoints } from "./endpoints";
import useSWR from "swr";
import { useMemo } from "react";

export const signUp = async (data) => {
  try {
    const response = await poster(endpoints.auth.signUp, data);

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signIn = async (data) => {
  try {
    const response = await poster(endpoints.auth.signIn, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveEligibilityForm = async (data) => {
  try {
    const response = await poster(endpoints.vacancy.eligibilityForm, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export function useGetEligibilityData() {
  const { data, isLoading, error } = useSWR(endpoints.vacancy.show, fetcher);

  const memoizedValue = useMemo(
    () => ({
      eligibilityData: data?.data || [],
      eligibilityLoading: isLoading,
      eligibilityError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export const signOut = async () => {
  try {
    const response = await poster(endpoints.auth.signOut);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export function useGetCountryCode() {
  const { data, isLoading, error } = useSWR(endpoints.auth.country, fetcher);

  const memoizedValue = useMemo(
    () => ({
      country: data?.data || [],
      countryLoading: isLoading,
      countryError: error,
    }),
    [data?.data, isLoading, error]
  );

  return memoizedValue;
}

export const emailLinkSend = async () => {
  try {
    const response = await poster(endpoints.auth.emailLink);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const emailVerify = async (data) => {
  try {
    const response = await poster(endpoints.auth.emailVerify, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

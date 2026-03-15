import { useMemo } from "react";
import useSWR from "swr";
import { fetcher, poster } from "src/lib";
import { endpoints } from "./endpoints";

export const saveProcessingInformation = async (data) => {
  try {
    const response = await poster(endpoints.form.processingInformation, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};


export const saveMainApplicantDetail = async (data) => {
  try {
    const response = await poster(endpoints.form.mainApplicantDetail, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveCurrentAddress = async (data) => {
  try {
    const response = await poster(endpoints.form.currentAddress, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveContactDetail = async (data) => {
  try {
    const response = await poster(endpoints.form.contactDetail, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveAcademicInformation = async (data) => {
  try {
    const response = await poster(endpoints.form.academicInformation, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveEnglishLanguage = async (data) => {
  try {
    const response = await poster(endpoints.form.englishlanguage, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveWorkExperiences = async (data) => {
  try {
    const response = await poster(endpoints.form.workExperiences, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveDependentInformation = async (data) => {
  try {
    const response = await poster(endpoints.form.dependentInformation, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveMaritalStatus = async (data) => {
  try {
    const response = await poster(endpoints.form.maritalStatus, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveEmergencyContact = async (data) => {
  try {
    const response = await poster(endpoints.form.emergencyContact, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveImmigrationHistory = async (data) => {
  try {
    const response = await poster(endpoints.form.immigrationHistory, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveVisa = async (data) => {
  try {
    const response = await poster(endpoints.form.visa, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveVisaRejection = async (data) => {
  try {
    const response = await poster(endpoints.form.visaRejection, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveImmigrationIncident = async (data) => {
  try {
    const response = await poster(endpoints.form.immigrationIncident, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveCriminalRecords = async (data) => {
  try {
    const response = await poster(endpoints.form.criminalRecord, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveInadmissibility = async (data) => {
  try {
    const response = await poster(endpoints.form.inadmissibility, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveHealth = async (data) => {
  try {
    const response = await poster(endpoints.form.health, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveFinalSubmit = async (data) => {
  try {
    const response = await poster(endpoints.form.finalSubmit, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchOnBoardingStatus = async () => {
  try {
    const response = await fetcher(endpoints.form.status);
    console.log("this is onboarding", response);
    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export function useGetImmigrationTypes(id) {
  const url = endpoints.form.immigrationType(id);
  console.log("🔍 Immigration Types - Fetching for vacancy ID:", id);
  const { data, isLoading, error, mutate } = useSWR(url, fetcher);

  const immigrationTypes = data?.data || [];
  
  // Log available immigration type IDs when data loads
  if (immigrationTypes.length > 0) {
    console.log("✅ Immigration Types loaded:", {
      count: immigrationTypes.length,
      ids: immigrationTypes.map(t => t.id),
      minId: Math.min(...immigrationTypes.map(t => t.id)),
      maxId: Math.max(...immigrationTypes.map(t => t.id)),
    });
  }

  const memoizedValue = useMemo(
    () => ({
      immigrationType: immigrationTypes,
      immigrationTypeLoading: isLoading,
      immigrationTypeError: error,
      mutateImmigrationType: mutate,
    }),
    [immigrationTypes, isLoading, error, mutate]
  );

  return memoizedValue;
}

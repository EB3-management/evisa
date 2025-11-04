import { Box, Divider, Button, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { OnboardingHeader } from "src/components/onboarding/OnboardingHeader";
import { OnboardingSidebar } from "src/components/onboarding/OnboardingSidebar";
import {
  MainApplicantDetails,
  mainApplicantSchema,
} from "src/components/onboarding/forms/MainApplicantDetails";
import {
  CurrentAddress,
  currentAddressSchema,
} from "src/components/onboarding/forms/CurrentAddress";
import {
  ContactDetails,
  contactDetailsSchema,
} from "src/components/onboarding/forms/ContactDetails";
import { ONBOARDING_STEPS } from "src/constant/onboardingSteps";
import { useGetCountryCode } from "src/api";
import {
  SponsorInformation,
  sponsorInformationSchema,
} from "src/components/onboarding/forms/SponsorInformation";
import {
  AcademicInformation,
  academicInformationSchema,
} from "src/components/onboarding/forms/AcademicInformation";
import {
  EnglishLanguageProficiency,
  englishLanguageProficiencySchema,
} from "src/components/onboarding/forms/Englishlanguage";
import {
  PastWorkExperiences,
  pastWorkExperiencesSchema,
} from "src/components/onboarding/forms/PastWorkExperiences";
import {
  DependentInformation,
  dependentsSchema,
} from "src/components/onboarding/forms/DependentInformation";
import {
  MaritalStatus,
  maritalStatusSchema,
} from "src/components/onboarding/forms/MaritalStatus";
import {
  EmergencyContactInformation,
  emergencyContactSchema,
} from "src/components/onboarding/forms/EmergencyContactInformation";
import {
  Inadmissibility,
  inadmissibilitySchema,
} from "src/components/onboarding/forms/Inadmissibility";
import { Health, healthSchema } from "src/components/onboarding/forms/Health";
import {
  ImmigrationHistory,
  immigrationHistorySchema,
} from "src/components/onboarding/forms/ImmigrationHistory";
import { Visa, visaSchema } from "src/components/onboarding/forms/Visa";
import {
  VisaRejection,
  visaRejectionSchema,
} from "src/components/onboarding/forms/VisaRejection";
import {
  ImmigrationIncident,
  immigrationIncidentSchema,
} from "src/components/onboarding/forms/ImmigrationIncident";
import {
  CriminalRecord,
  criminalRecordSchema,
} from "src/components/onboarding/forms/CriminalRecords";
import {
  saveAcademicInformation,
  saveContactDetail,
  saveCriminalRecords,
  saveCurrentAddress,
  saveDependentInformation,
  saveEmergencyContact,
  saveEnglishLanguage,
  saveFinalSubmit,
  saveHealth,
  saveImmigrationHistory,
  saveImmigrationIncident,
  saveInadmissibility,
  saveMainApplicantDetail,
  saveMaritalStatus,
  saveVisa,
  saveVisaRejection,
  saveWorkExperiences,
} from "src/api/onboardingform";
import { useNavigate, useParams } from "react-router";
import { useGetVacancyDetail } from "src/api/vacancy";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchProfileRequest } from "src/redux/actions";

export default function OnboardingLayout() {
  const dispatch = useAppDispatch();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const { country } = useGetCountryCode();
  const { id } = useParams();

  const router = useRouter();

  const { onBoarding, isLoading: isLoadingOnBoarding } = useAppSelector(
    (state) => state.onBoarding || { onBoarding: {}, isLoading: false }
  );

  const { profile } = useAppSelector(
    (state) => state.profile || { profile: null }
  );

  console.log("this is current onbarding status", onBoarding);
  console.log("this is profile data", profile);
  const stepSchemas = [
    mainApplicantSchema,
    currentAddressSchema,
    contactDetailsSchema,
    sponsorInformationSchema,
    academicInformationSchema,
    englishLanguageProficiencySchema,
    pastWorkExperiencesSchema,
    dependentsSchema,
    maritalStatusSchema,
    emergencyContactSchema,
    immigrationHistorySchema,
    visaSchema,
    visaRejectionSchema,
    immigrationIncidentSchema,
    criminalRecordSchema,
    inadmissibilitySchema,
    healthSchema,
  ];
  const methods = useForm({
    resolver: zodResolver(stepSchemas[currentStep]),
    defaultValues: {
      //main applicant
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      countryOfBirth: "",
      citizenship1: "",
      citizenship2: "",

      //current address
      country: "",
      state: "",
      city: "",
      zipCode: "",
      address: "",

      //contact details
      email: "",
      phone: "",

      //sponsor information
      sponsor_name: "",
      sponsor_position: "",
      sponsor_location: "",

      //academic information
      highSchool: "No",
      bachelor: "No",
      postgraduate: "No",
      master: "No",
      phd: "No",

      //english language
      writing: "",
      listening: "",
      reading: "",
      speaking: "",

      //pastwork experience
      recent_job: "no", // radio
      job2: "no",
      job3: "no",
      job4: "no",

      // recent_job_company_name: "",
      // recent_job_job_title: "",
      // recent_job_start_date: "",
      // recent_job_end_date: "",
      // recent_job_currently_employed: false,
      // recent_job_city: "",
      // recent_job_state: "",
      // recent_job_zip_code: "",
      // recent_job_supervisor_name: "",
      // recent_job_job_duty: "",
      // recent_job_job_description: "",

      // job2_company_name: "",
      // job2_job_title: "",
      // job2_start_date: "",
      // job2_end_date: "",
      // job2_currently_employed: false,
      // job2_city: "",
      // job2_state: "",
      // job2_zip_code: "",
      // job2_supervisor_name: "",
      // job2_job_duty: "",
      // job2_job_description: "",

      // job3_company_name: "",
      // job3_job_title: "",
      // job3_start_date: "",
      // job3_end_date: "",
      // job3_currently_employed: false,
      // job3_city: "",
      // job3_state: "",
      // job3_zip_code: "",
      // job3_supervisor_name: "",
      // job3_job_duty: "",
      // job3_job_description: "",

      // job4_company_name: "",
      // job4_job_title: "",
      // job4_start_date: "",
      // job4_end_date: "",
      // job4_currently_employed: false,
      // job4_city: "",
      // job4_state: "",
      // job4_zip_code: "",
      // job4_supervisor_name: "",
      // job4_job_duty: "",
      // job4_job_description: "",

      //dependent
      dependent_1: "no",
      dependent_2: "no",
      dependent_3: "no",
      dependent_4: "no",

      //emergency contact
      emergencyFullName: "",
      emergencyPhone: "",
      degreeOfKinship: "",
      degreeOfKinshipOther: "",
      emergencyAddress: "",

      //immigration history

      types: "",
      beenToUsa: "no",
      socialSecurity: "no",
      socialSecurityNumber: "",
      inUsaApplicant: "no",
      applicantName: "",
      inUsaDependent: "no",
      dependentName: "",
      i94Number: "",

      //visa

      //immigration incident
      e_overstayed_usa_visa_i94_employee: "no",
      e_overstayed_usa_visa_i94_employee_if_yes_who: "",
      e_overstayed_usa_visa_i94_dependents: "no",
      e_overstayed_usa_visa_i94_dependents_if_yes_who: "",
      eb_unlawfully_present_usa_employee: "no",
      eb_unlawfully_present_usa_employee_if_yes_who: "",
      eb_unlawfully_present_usa_dependents: "no",
      eb_unlawfully_present_usa_dependents_if_yes_who: "",
      eb_denied_entry_usa_employee: "no",
      eb_denied_entry_usa_employee_if_yes: "",
      eb_denied_entry_usa_dependents: "no",
      eb_denied_entry_usa_dependents_if_yes: "",
      eb_deported_from_any_country_employee: "no",
      eb_deported_from_any_country_employee_if_yes: "",
      eb_deported_from_any_country_dependents: "no",
      eb_deported_from_any_country_dependents_if_yes: "",
      ebb_imr_judge_h_ofcr_employee: "no",
      ebb_imr_judge_h_ofcr_employee_if_yes: "",
      ebb_imr_judge_h_ofcr_dependents: "no",
      ebb_imr_judge_h_ofcr_dependents_if_yes: "",

      //inadmissibility
      inadmissibility_1: "no",
      inadmissibility_2: "no",
      inadmissibility_3: "no",
      inadmissibility_4: "no",

      //health
      hasSTD: "no",
      hasStdDependent: "no",
      hasTb: "no",
      hasTbDependent: "no",
      hasInsurance: "no",
      hasInsuranceDependent: "no",
      agree_to_terms: false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    dispatch(fetchProfileRequest());
  }, [dispatch]);

  // Populate form with profile and onBoarding data
  useEffect(() => {
    if (profile || onBoarding) {
      const employee = onBoarding?.employee;
      const employeeAddress = onBoarding?.employeeAddress;
      const academicRecords = onBoarding?.academicRecords || [];
      const englishProficiency = onBoarding?.englishProficiency;
      const workExperiences = onBoarding?.workExperiences || [];
      const dependents = onBoarding?.dependents || [];
      const maritalStatus = onBoarding?.maritalStatus;
      const emergencyContact = onBoarding?.emergencyContact;
      const immigrationHistory = onBoarding?.immigrationHistories?.[0]; // Take first item from array
      const visaRecords = onBoarding?.visaRecords || [];
      const visaRejection = onBoarding?.visaRejections?.[0]; // Take first item from array
      const immigrationIncidents = onBoarding?.immigrationIncidents?.[0]; // Take first item from array
      const criminalRecords = onBoarding?.criminalRecords || [];
      const inadmissibilityRecord = onBoarding?.inadmissibilityRecord;
      const healthRecord = onBoarding?.healthRecord;

      // Helper function to check if academic level exists
      const hasAcademicLevel = (programName) =>
        academicRecords.some(
          (record) =>
            record.program_name?.toLowerCase() === programName.toLowerCase()
        );

      // Helper function to get academic record data
      const getAcademicRecord = (programName) =>
        academicRecords.find(
          (record) =>
            record.program_name?.toLowerCase() === programName.toLowerCase()
        ) || {};

      // Helper function to populate work experience fields
      const getWorkExperience = (index) => {
        const exp = workExperiences[index];
        if (!exp) return {};

        const jobKey = index === 0 ? "recent_job" : `job${index + 1}`;
        return {
          [`${jobKey}_company_name`]: exp.company_name || "",
          [`${jobKey}_job_title`]: exp.job_title || "",
          [`${jobKey}_job_description`]: exp.job_desc || "",
          [`${jobKey}_job_duty`]: exp.job_duty || "",
          [`${jobKey}_supervisor_name`]: exp.supervisor_name || "",
          [`${jobKey}_start_date`]: exp.start_date || "",
          [`${jobKey}_end_date`]: exp.end_date || "",
          [`${jobKey}_currently_employed`]: exp.current || false,
          [`${jobKey}_city`]: exp.city || "",
          [`${jobKey}_state`]: exp.state || "",
          [`${jobKey}_zip_code`]: exp.zip_code || "",
        };
      };

      // Helper function to populate dependent fields
      const getDependentFields = (index) => {
        const dep = dependents[index];
        if (!dep) return {};

        return {
          first_name: dep.first_name || "",
          middle_name: dep.middle_name || "",
          last_name: dep.last_name || "",
          dob: dep.dob || "",
          gender: dep.gender?.toLowerCase() || "",
          kinship: dep.relation || "",
          birth_country: dep.country_of_birth || "",
          citizenship_country: dep.country_of_citizenship || "",
          education_level: dep.education_level?.toLowerCase() || "",
        };
      };

      // Helper function to populate visa record fields
      const getVisaRecord = (index) => {
        const visa = visaRecords[index];
        if (!visa) return {};

        const prefix = index === 0 ? "visa" : `visa${index + 1}`;
        return {
          [`${prefix}Name`]: visa.visa_fullname || "",
          [`${prefix}Type`]: visa.visa_type || "",
          [`${prefix}ExpeditionDate`]: visa.visa_expedition_date || "",
          [`${prefix}ExpirationDate`]: visa.visa_expiration_date || "",
        };
      };

      // Populate Academic Information
      const academicFields = {};
      ["highSchool", "bachelor", "postgraduate", "master", "phd"].forEach(
        (level) => {
          const hasLevel = hasAcademicLevel(level);
          academicFields[level] = hasLevel ? "Yes" : "No";

          if (hasLevel) {
            const record = getAcademicRecord(level);
            academicFields[`${level}_instituteName`] =
              record.institution_name || "";
            academicFields[`${level}_graduationYear`] =
              record.graduation_year || "";
            academicFields[`${level}_country`] = record.country || "";
            academicFields[`${level}_state`] = record.state || "";
            academicFields[`${level}_city`] = record.city || "";
            academicFields[`${level}_zipCode`] = record.zip_code || "";
            academicFields[`${level}_address`] = record.address || "";
          }
        }
      );

      // Populate Work Experiences
      const workFields = {};
      const jobKeys = ["recent_job", "job2", "job3", "job4"];
      jobKeys.forEach((key, index) => {
        if (workExperiences[index]) {
          workFields[key] = "yes";
          Object.assign(workFields, getWorkExperience(index));
        } else {
          workFields[key] = "no";
        }
      });

      // Populate Dependents
      const dependentFields = {};
      [1, 2, 3, 4].forEach((num) => {
        const index = num - 1;
        if (dependents[index]) {
          dependentFields[`dependent_${num}`] = "yes";
          dependentFields[`dependent_${num}_fields`] =
            getDependentFields(index);
        } else {
          dependentFields[`dependent_${num}`] = "no";
        }
      });

      // Populate Visa Records
      const visaFields = {};
      const recordKeys = ["recentRecord", "record2", "record3", "record4"];
      recordKeys.forEach((key, index) => {
        if (visaRecords[index]) {
          visaFields[key] = "yes";
          Object.assign(visaFields, getVisaRecord(index));
        } else {
          visaFields[key] = "no";
        }
      });

      // Populate form with all data
      methods.reset({
        // Main Applicant - Priority: onBoarding.employee > profile
        firstName: employee?.first_name || profile?.first_name || "",
        middleName: employee?.middle_name || profile?.middle_name || "",
        lastName: employee?.last_name || profile?.last_name || "",
        dob: employee?.dob || profile?.dob || "",
        gender:
          employee?.gender?.toLowerCase() ||
          profile?.gender?.toLowerCase() ||
          "",
        countryOfBirth: employee?.birth_country || profile?.birth_country || "",
        citizenship1: employee?.nationality || profile?.nationality || "",

        citizenship2: "",

        // Current Address - from employeeAddress
        country: employeeAddress?.current_country || "",
        state: employeeAddress?.current_province_state || "",
        city: employeeAddress?.current_city_town || "",
        zipCode: employeeAddress?.current_zip_code || "",
        address: employeeAddress?.current_street || "",

        // Contact Details
        email: employee?.email || profile?.email || "",
        phone: employee?.phone || profile?.phone || "",

        // Sponsor Information
        // sponsor_name: onBoarding?.sponsor?.sponsor_name || "",
        // sponsor_position: onBoarding?.sponsor?.sponsor_position || "",
        // sponsor_location: onBoarding?.sponsor?.sponsor_location || "",

        // Academic Information
        ...academicFields,

        // English Language Proficiency
        writing:
          englishProficiency?.english_proficiency_writing === "Advance"
            ? "Advanced"
            : englishProficiency?.english_proficiency_writing || "",
        listening:
          englishProficiency?.english_proficiency_listening === "Advance"
            ? "Advanced"
            : englishProficiency?.english_proficiency_listening || "",
        reading:
          englishProficiency?.english_proficiency_reading === "Advance"
            ? "Advanced"
            : englishProficiency?.english_proficiency_reading || "",
        speaking:
          englishProficiency?.english_proficiency_speaking === "Advance"
            ? "Advanced"
            : englishProficiency?.english_proficiency_speaking || "",

        // Past Work Experience
        ...workFields,

        // Dependents
        ...dependentFields,

        // Marital Status
        maritalStatus: maritalStatus?.legally_married || "",
        clarifyMaritalStatus:
          maritalStatus?.legally_married_if_others ||
          maritalStatus?.legally_married_if_d_w_s ||
          "",
        countryOfMarriage: maritalStatus?.legally_married_if_yes_country || "",
        dateOfMarriage:
          maritalStatus?.legally_married_if_yes_date_of_marriage || "",

        // Emergency Contact
        emergencyFullName: emergencyContact?.eci_name || "",
        emergencyPhone: emergencyContact?.eci_phone || "",
        degreeOfKinship: emergencyContact?.eci_degree_of_kinship || "",
        degreeOfKinshipOther:
          emergencyContact?.eci_degree_of_kinship_other || "",
        emergencyAddress: emergencyContact?.eci_address || "",

        // Immigration History
        types: immigrationHistory?.immigration_type || "",
        beenToUsa: immigrationHistory?.been_to_usa?.toLowerCase() || "no",
        socialSecurity: immigrationHistory?.ever_had_ssn?.toLowerCase() || "no",
        socialSecurityNumber: immigrationHistory?.ssn_number || "",
        inUsaApplicant:
          immigrationHistory?.employee_in_usa?.toLowerCase() || "no",
        applicantName: immigrationHistory?.employee_in_usa_if_yes_who || "",
        inUsaDependent:
          immigrationHistory?.dependents_in_usa?.toLowerCase() || "no",
        dependentName: immigrationHistory?.dependents_in_usa_if_yes_who || "",
        i94Number: immigrationHistory?.recent_i94_number || "",

        // Visa Records
        ...visaFields,

        // Visa Rejection - Check if rejection exists in array for Employee or Dependent
        employee_visa_rejected:
          visaRejection?.rejected_for?.toLowerCase() === "employee"
            ? "Yes"
            : "No",
        dependents_visa_rejected:
          visaRejection?.rejected_for?.toLowerCase() === "dependent"
            ? "Yes"
            : "No",

        // Immigration Incidents
        e_overstayed_usa_visa_i94_employee:
          immigrationIncidents?.e_overstayed_usa_visa_i94_employee?.toLowerCase() ||
          "no",
        e_overstayed_usa_visa_i94_employee_if_yes_who:
          immigrationIncidents?.e_overstayed_usa_visa_i94_employee_if_yes_who ||
          "",
        e_overstayed_usa_visa_i94_dependents:
          immigrationIncidents?.e_overstayed_usa_visa_i94_dependents?.toLowerCase() ||
          "no",
        e_overstayed_usa_visa_i94_dependents_if_yes_who:
          immigrationIncidents?.e_overstayed_usa_visa_i94_dependents_if_yes_who ||
          "",
        eb_unlawfully_present_usa_employee:
          immigrationIncidents?.eb_unlawfully_present_usa_employee?.toLowerCase() ||
          "no",
        eb_unlawfully_present_usa_employee_if_yes_who:
          immigrationIncidents?.eb_unlawfully_present_usa_employee_if_yes_who ||
          "",
        eb_unlawfully_present_usa_dependents:
          immigrationIncidents?.eb_unlawfully_present_usa_dependents?.toLowerCase() ||
          "no",
        eb_unlawfully_present_usa_dependents_if_yes_who:
          immigrationIncidents?.eb_unlawfully_present_usa_dependents_if_yes_who ||
          "",
        eb_denied_entry_usa_employee:
          immigrationIncidents?.eb_denied_entry_usa_employee?.toLowerCase() ||
          "no",
        eb_denied_entry_usa_employee_if_yes:
          immigrationIncidents?.eb_denied_entry_usa_employee_if_yes || "",
        eb_denied_entry_usa_dependents:
          immigrationIncidents?.eb_denied_entry_usa_dependents?.toLowerCase() ||
          "no",
        eb_denied_entry_usa_dependents_if_yes:
          immigrationIncidents?.eb_denied_entry_usa_dependents_if_yes || "",
        eb_deported_from_any_country_employee:
          immigrationIncidents?.eb_deported_from_any_country_employee?.toLowerCase() ||
          "no",
        eb_deported_from_any_country_employee_if_yes:
          immigrationIncidents?.eb_deported_from_any_country_employee_if_yes ||
          "",
        eb_deported_from_any_country_dependents:
          immigrationIncidents?.eb_deported_from_any_country_dependents?.toLowerCase() ||
          "no",
        eb_deported_from_any_country_dependents_if_yes:
          immigrationIncidents?.eb_deported_from_any_country_dependents_if_yes ||
          "",
        ebb_imr_judge_h_ofcr_employee:
          immigrationIncidents?.ebb_imr_judge_h_ofcr_employee?.toLowerCase() ||
          "no",
        ebb_imr_judge_h_ofcr_employee_if_yes:
          immigrationIncidents?.ebb_imr_judge_h_ofcr_employee_if_yes || "",
        ebb_imr_judge_h_ofcr_dependents:
          immigrationIncidents?.ebb_imr_judge_h_ofcr_dependents?.toLowerCase() ||
          "no",
        ebb_imr_judge_h_ofcr_dependents_if_yes:
          immigrationIncidents?.ebb_imr_judge_h_ofcr_dependents_if_yes || "",

        // Criminal Records
        criminal_record_employee: criminalRecords.length > 0 ? "Yes" : "No",
        criminal_record_dependents: criminalRecords.some(
          (r) => r.related_to?.toLowerCase() === "dependent"
        )
          ? "Yes"
          : "No",
        criminal_records: criminalRecords.map((record) => ({
          related_to: record.related_to || "",
          name: record.criminal_record_name || "",
          type_of_record: record.criminal_record_type_of_record || "",
          date: record.criminal_record_date || "",
          outcome: record.criminal_record_outcome || "",
        })),

        // Inadmissibility - Single record from API
        inadmissibility_1: inadmissibilityRecord ? "yes" : "no",
        inadmissibility_1_condition:
          inadmissibilityRecord?.inadmissibilities_condition_name || "",
        inadmissibility_1_date:
          inadmissibilityRecord?.inadmissibilities_date || "",
        inadmissibility_1_doctor:
          inadmissibilityRecord?.inadmissibilities_doctor_name || "",
        inadmissibility_1_procedure:
          inadmissibilityRecord?.inadmissibilities_procedure || "",
        inadmissibility_1_name:
          inadmissibilityRecord?.inadmissibilities_procedure_name || "",

        inadmissibility_2: "no",
        inadmissibility_2_condition: "",
        inadmissibility_2_date: "",
        inadmissibility_2_doctor: "",
        inadmissibility_2_procedure: "",
        inadmissibility_2_name: "",

        inadmissibility_3: "no",
        inadmissibility_3_condition: "",
        inadmissibility_3_date: "",
        inadmissibility_3_doctor: "",
        inadmissibility_3_procedure: "",
        inadmissibility_3_name: "",

        inadmissibility_4: "no",
        inadmissibility_4_condition: "",
        inadmissibility_4_date: "",
        inadmissibility_4_doctor: "",
        inadmissibility_4_procedure: "",
        inadmissibility_4_name: "",

        // Health Records
        hasSTD: healthRecord?.std_employee?.toLowerCase() || "no",
        stdDetails: healthRecord?.std_employee_details || "",
        hasStdDependent: healthRecord?.std_dependents?.toLowerCase() || "no",
        stdDependentDetails: healthRecord?.std_dependents_details || "",
        hasTb: healthRecord?.tb_employee?.toLowerCase() || "no",
        tbDetails: healthRecord?.tb_employee_details || "",
        hasTbDependent: healthRecord?.tb_dependents?.toLowerCase() || "no",
        tbDependentDetails: healthRecord?.tb_dependents_details || "",
        hasInsurance:
          healthRecord?.health_insurance_employee?.toLowerCase() || "no",
        insuranceDetails: healthRecord?.health_insurance_employee_details || "",
        hasInsuranceDependent:
          healthRecord?.health_insurance_dependents?.toLowerCase() || "no",
        insuranceDependentDetails:
          healthRecord?.health_insurance_dependents_details || "",
        agree_to_terms: false,
      });
    }
  }, [profile, onBoarding, methods]);

  //main applicant detail
  const transformMainApplicantData = (formData) => ({
    first_name: formData.firstName,
    middle_name: formData.middleName || "",
    last_name: formData.lastName,
    dob: formData.dob,
    gender: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1),
    country_of_birth: formData.countryOfBirth,
    country_of_citizenship: formData.citizenship1,
    country_of_citizenship2: formData.citizenship2 || "",
  });

  //current address
  const transformCurrentAddressData = (formData) => ({
    current_country: formData.country,
    current_state: formData.state,
    current_city: formData.city,
    current_zip_code: formData.zipCode || "",
    current_address: formData.address,
  });

  //contact detail
  const transformContactDetailsData = (formData) => ({
    personal_email: formData.email,
    phone_number: formData.phone,
  });

  //sponsor
  const transformSponsorData = (formData) => ({
    sponsor_name: formData.sponsor_name,
    sponsor_position: formData.sponsor_position,
    sponsor_location: formData.sponsor_location,
  });

  //Academic form
  const transformAcademicData = (formData) => {
    const academicLevels = [
      "highSchool",
      "bachelor",
      "postgraduate",
      "master",
      "phd",
    ];

    const academic_records = academicLevels
      .filter((level) => formData[level] === "Yes") // Only include levels with "Yes"
      .map((level) => ({
        program_name: level,
        institution_name: formData[`${level}_instituteName`] || "",
        graduation_year: formData[`${level}_graduationYear`] || "",
        country: formData[`${level}_country`] || "",
        state: formData[`${level}_state`] || "",
        city: formData[`${level}_city`] || "",
        zip_code: formData[`${level}_zipCode`] || "",
        address: formData[`${level}_address`] || "",
      }));

    return { academic_records };
  };

  //englishlanguage
  const transformEnglishProficiencyData = (formData) => ({
    english_proficiency_listening:
      formData.listening === "Advanced" ? "Advance" : formData.listening,
    english_proficiency_reading:
      formData.reading === "Advanced" ? "Advance" : formData.reading,
    english_proficiency_writing:
      formData.writing === "Advanced" ? "Advance" : formData.writing,
    english_proficiency_speaking:
      formData.speaking === "Advanced" ? "Advance" : formData.speaking,
  });

  //workexperiences form
  const transformWorkExperienceData = (formData) => {
    const jobs = ["recent_job", "job2", "job3", "job4"];

    const work_experiences = jobs
      .filter((job) => formData[job] === "yes")
      .map((job) => ({
        company_name: formData[`${job}_company_name`] || "",
        job_title: formData[`${job}_job_title`] || "",
        job_desc: formData[`${job}_job_description`] || "",
        job_duty: formData[`${job}_job_duty`] || "",
        supervisor_name: formData[`${job}_supervisor_name`] || "",
        start_date: formData[`${job}_start_date`] || "",
        end_date: formData[`${job}_end_date`] || "",
        current: formData[`${job}_currently_employed`] || false,
        city: formData[`${job}_city`] || "",
        state: formData[`${job}_state`] || "",
        zip_code: formData[`${job}_zip_code`] || "",
      }));

    return { work_experiences };
  };

  //dependent information
  const transformDependentData = (formData) => {
    const dependentNumbers = [1, 2, 3, 4];

    const dependents = dependentNumbers
      .filter((num) => formData[`dependent_${num}`] === "yes")
      .map((num) => {
        const fields = formData[`dependent_${num}_fields`] || {};
        return {
          first_name: fields.first_name || "",
          middle_name: fields.middle_name || "",
          last_name: fields.last_name || "",
          dob: fields.dob || "",
          relation: fields.kinship || "", // 👈 mapped to API's "relation"
          country_of_birth: fields.birth_country || "",
          country_of_citizenship: fields.citizenship_country || "",
        };
      });

    return { dependents };
  };

  //marital Status
  const transformMaritalStatusData = (formData) => {
    const status = formData.maritalStatus || "";

    // Clean country name by removing phone code in parentheses
    const cleanCountryName = (countryStr) => {
      if (!countryStr) return "";
      // Remove anything in parentheses (like phone codes)
      return countryStr.replace(/\s*\([^)]*\)\s*/g, "").trim();
    };

    return {
      legally_married:
        status === "Yes" ? "Yes" : status === "No" ? "No" : status,
      legally_married_if_others:
        status &&
        !["Yes", "No", "Divorced", "Widow", "Separated"].includes(status)
          ? formData.clarifyMaritalStatus || ""
          : "",
      legally_married_if_d_w_s: ["Divorced", "Widow", "Separated"].includes(
        status
      )
        ? formData.clarifyMaritalStatus || ""
        : "",
      legally_married_if_yes_country:
        status === "Yes" ? cleanCountryName(formData.countryOfMarriage) : "",
      legally_married_if_yes_date_of_marriage:
        status === "Yes" ? formData.dateOfMarriage || "" : "",
    };
  };

  //emergency contact
  const transformEmergencyContactData = (formData) => {
    const kinship = formData.degreeOfKinship || "";

    return {
      eci_degree_of_kinship: kinship === "Other" ? "Other" : kinship,
      eci_degree_of_kinship_other:
        kinship === "Other" ? formData.degreeOfKinshipOther || "" : "",
      eci_name: formData.emergencyFullName || "",
      eci_phone: formData.emergencyPhone || "",
      eci_address: formData.emergencyAddress || "",
    };
  };

  //immigration history
  const transformImmigrationHistoryData = (formData) => ({
    immigration_history: {
      immigration_type: formData.types,
      been_to_usa: formData.beenToUsa,
      ever_had_ssn: formData.socialSecurity,
      ssn_number: formData.socialSecurityNumber || "",
      employee_in_usa: formData.inUsaApplicant,
      employee_in_usa_if_yes_who: formData.applicantName || "",
      dependents_in_usa: formData.inUsaDependent,
      dependents_in_usa_if_yes_who: formData.dependentName || "",
      recent_i94_number: formData.i94Number || "",
    },
  });

  //visa
  const transformVisaData = (formData) => {
    const records = ["recentRecord", "record2", "record3", "record4"];
    const prefixes = ["visa", "visa2", "visa3", "visa4"];

    const visa_records = records
      .map((record, index) => {
        if (formData[record] === "yes") {
          const prefix = prefixes[index];
          return {
            fullname: formData[`${prefix}Name`] || "",
            type: formData[`${prefix}Type`] || "",
            expedition_date: formData[`${prefix}ExpeditionDate`] || "",
            expiration_date: formData[`${prefix}ExpirationDate`] || "",
          };
        }
        return null;
      })
      .filter(Boolean); // Remove null values

    return { visa_records };
  };

  //visa rejection
  const transformVisaRejectionData = (formData) => ({
    employee_visa_rejected: formData.employee_visa_rejected,
    dependents_visa_rejected: formData.dependents_visa_rejected,
  });

  const transformImmigrationIncidentData = (formData) => ({
    immigration_incidents: {
      e_overstayed_usa_visa_i94_employee:
        formData.e_overstayed_usa_visa_i94_employee === "yes" ? "Yes" : "No",
      e_overstayed_usa_visa_i94_employee_if_yes_who:
        formData.e_overstayed_usa_visa_i94_employee_if_yes_who || "",
      e_overstayed_usa_visa_i94_dependents:
        formData.e_overstayed_usa_visa_i94_dependents === "yes" ? "Yes" : "No",
      e_overstayed_usa_visa_i94_dependents_if_yes_who:
        formData.e_overstayed_usa_visa_i94_dependents_if_yes_who || "",

      eb_unlawfully_present_usa_employee:
        formData.eb_unlawfully_present_usa_employee === "yes" ? "Yes" : "No",
      eb_unlawfully_present_usa_employee_if_yes_who:
        formData.eb_unlawfully_present_usa_employee_if_yes_who || "",
      eb_unlawfully_present_usa_dependents:
        formData.eb_unlawfully_present_usa_dependents === "yes" ? "Yes" : "No",
      eb_unlawfully_present_usa_dependents_if_yes_who:
        formData.eb_unlawfully_present_usa_dependents_if_yes_who || "",

      eb_denied_entry_usa_employee:
        formData.eb_denied_entry_usa_employee === "yes" ? "Yes" : "No",
      eb_denied_entry_usa_employee_if_yes:
        formData.eb_denied_entry_usa_employee_if_yes || "",
      eb_denied_entry_usa_dependents:
        formData.eb_denied_entry_usa_dependents === "yes" ? "Yes" : "No",
      eb_denied_entry_usa_dependents_if_yes:
        formData.eb_denied_entry_usa_dependents_if_yes || "",

      eb_deported_from_any_country_employee:
        formData.eb_deported_from_any_country_employee === "yes" ? "Yes" : "No",
      eb_deported_from_any_country_employee_if_yes:
        formData.eb_deported_from_any_country_employee_if_yes || "",
      eb_deported_from_any_country_dependents:
        formData.eb_deported_from_any_country_dependents === "yes"
          ? "Yes"
          : "No",
      eb_deported_from_any_country_dependents_if_yes:
        formData.eb_deported_from_any_country_dependents_if_yes || "",

      ebb_imr_judge_h_ofcr_employee:
        formData.ebb_imr_judge_h_ofcr_employee === "yes" ? "Yes" : "No",
      ebb_imr_judge_h_ofcr_employee_if_yes:
        formData.ebb_imr_judge_h_ofcr_employee_if_yes || "",
      ebb_imr_judge_h_ofcr_dependents:
        formData.ebb_imr_judge_h_ofcr_dependents === "yes" ? "Yes" : "No",
      ebb_imr_judge_h_ofcr_dependents_if_yes:
        formData.ebb_imr_judge_h_ofcr_dependents_if_yes || "",
    },
  });

  const transformCriminalRecordData = (formData) => ({
    criminal_record_employee: formData.criminal_record_employee,
    criminal_record_dependents: formData.criminal_record_dependents,
    criminal_records: formData.criminal_records?.length
      ? formData.criminal_records.map((r) => ({
          related_to: r.related_to,
          name: r.name,
          type_of_record: r.type_of_record,
          date: r.date,
          outcome: r.outcome,
        }))
      : [],
  });

  //inadmissibilty
  const transformInadmissibilityData = (formData) => {
    const records = [];

    [1, 2, 3, 4].forEach((num) => {
      const selected = formData[`inadmissibility_${num}`];
      if (selected === "yes") {
        records.push({
          condition: `Inadmissibility ${num}`,
          condition_name: formData[`inadmissibility_${num}_condition`] || "",
          date: formData[`inadmissibility_${num}_date`] || "",
          doctor_name: formData[`inadmissibility_${num}_doctor`] || "",
          procedure: formData[`inadmissibility_${num}_procedure`] || "",
          procedure_name: formData[`inadmissibility_${num}_name`] || "",
        });
      }
    });

    return {
      inadmissibility_records: records,
    };
  };

  const transformHealthData = (formData) => ({
    health_records: {
      std_employee: formData.hasSTD || "No",
      std_employee_details: formData.stdDetails || "",
      std_dependents: formData.hasStdDependent || "No",
      std_dependents_details: formData.stdDependentDetails || "",
      tb_employee: formData.hasTb || "No",
      tb_employee_details: formData.tbDetails || "",
      tb_dependents: formData.hasTbDependent || "No",
      tb_dependents_details: formData.tbDependentDetails || "",
      health_insurance_employee: formData.hasInsurance || "No",
      health_insurance_employee_details: formData.insuranceDetails || "",
      health_insurance_dependents: formData.hasInsuranceDependent || "No",
      health_insurance_dependents_details:
        formData.insuranceDependentDetails || "",
    },
  });

  const { handleSubmit } = methods;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const oncloseLayout = () => {
    router.push(paths.dashboard.root);
  };

  const onSubmit = (data) => {
    console.log("✅ Final Submission:", data);
  };

  const saveCurrentStepData = async (stepIndex) => {
    const formData = methods.getValues();

    try {
      switch (stepIndex) {
        case 0:
          await saveMainApplicantDetail(transformMainApplicantData(formData));
          break;
        case 1:
          await saveCurrentAddress(transformCurrentAddressData(formData));
          break;
        case 2:
          await saveContactDetail(transformContactDetailsData(formData));
          break;
        // case 3:
        //   await saveSponsorInformation(transformSponsorData(formData));
        //   break;
        case 4:
          await saveAcademicInformation(transformAcademicData(formData));
          break;
        case 5:
          await saveEnglishLanguage(transformEnglishProficiencyData(formData));
          break;
        case 6:
          await saveWorkExperiences(transformWorkExperienceData(formData));
          break;
        case 7:
          await saveDependentInformation(transformDependentData(formData));
          break;
        case 8:
          await saveMaritalStatus(transformMaritalStatusData(formData));
          break;
        case 9:
          await saveEmergencyContact(transformEmergencyContactData(formData));
          break;
        case 10:
          await saveImmigrationHistory(
            transformImmigrationHistoryData(formData)
          );
          break;
        case 11:
          await saveVisa(transformVisaData(formData));
          break;
        case 12:
          await saveVisaRejection(transformVisaRejectionData(formData));
          break;
        case 13:
          await saveImmigrationIncident(
            transformImmigrationIncidentData(formData)
          );
          break;
        case 14:
          await saveCriminalRecords(transformCriminalRecordData(formData));
          break;
        case 15:
          await saveInadmissibility(transformInadmissibilityData(formData));
          break;
        case 16:
          await saveHealth(transformHealthData(formData));
          await saveFinalSubmit({
            is_draft: false,
            status: "Pending",
            agree_to_terms: formData.agree_to_terms,
          });
          alert("Form submitted successfully!");
          router.push(paths.dashboard.plan);
          break;
        default:
          break;
      }

      console.log(`✅ Step ${stepIndex} saved successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to save step ${stepIndex}:`, error);
      console.error("❌ Error response:", error.response?.data);
      return false;
    }
  };

  const goNext = async () => {
    // Validate current step
    const isValid = await methods.trigger();

    if (!isValid) {
      console.log("❌ Validation failed for current step");
      return;
    }

    // Save current step data
    const saved = await saveCurrentStepData(currentStep);

    if (!saved) {
      console.log("❌ Failed to save current step data");
      return;
    }

    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, currentStep]));

    // Move to next step or submit
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Handle sidebar navigation
  const handleSidebarNavigation = (targetStep) => {
    // Check if user can navigate to target step
    // User can only navigate to:
    // 1. Current step
    // 2. Previous completed steps
    // 3. Next step if current step is completed

    if (targetStep === currentStep) {
      // Already on this step
      return;
    }

    if (targetStep < currentStep) {
      // Allow navigation to any previous step
      setCurrentStep(targetStep);
      return;
    }

    // For forward navigation, check if all previous steps are completed
    const canNavigateForward = Array.from(
      { length: targetStep },
      (_, i) => i
    ).every((step) => completedSteps.has(step));

    if (canNavigateForward) {
      setCurrentStep(targetStep);
    } else {
      // Show message that previous steps must be completed
      alert("Please complete all previous steps before proceeding.");
    }
  };

  // const goNext = async () => {
  //   const isValid = await methods.trigger(); // validate only this step
  //   if (isValid) {
  //     if (currentStep === 0) {
  //       try {
  //         const formData = methods.getValues();
  //         const applicantData = transformMainApplicantData(formData);
  //         console.log("📤 Sending main applicant data:", applicantData);

  //         await saveMainApplicantDetail(applicantData);
  //         console.log("✅ Main applicant saved successfully");
  //       } catch (error) {
  //         console.error("❌ Failed to save main applicant:", error);
  //         console.error("❌ Error response:", error.response?.data);
  //         return; // stop proceeding if failed
  //       }
  //     }

  //     if (currentStep === 1) {
  //       try {
  //         const formData = methods.getValues();
  //         const currentAddress = transformCurrentAddressData(formData);
  //         console.log("📤 Sending current address data:", currentAddress);

  //         await saveCurrentAddress(currentAddress);
  //         console.log("✅ Current address saved successfully");
  //       } catch (error) {
  //         console.error("❌ Failed to save current address:", error);
  //         console.error("❌ Error response:", error.response?.data);
  //         return; // stop proceeding if failed
  //       }
  //     }

  //     if (currentStep === 2) {
  //       try {
  //         const formData = methods.getValues();
  //         const currentAddress = transformContactDetailsData(formData);
  //         console.log("📤 Sending contact detail data:", currentAddress);

  //         await saveContactDetail(currentAddress);
  //         console.log("✅ Contact detail saved successfully");
  //       } catch (error) {
  //         console.error("❌ Failed to save contact detail:", error);
  //         console.error("❌ Error response:", error.response?.data);
  //         return; // stop proceeding if failed
  //       }
  //     }

  //     if (currentStep === 4) {
  //       try {
  //         const formData = methods.getValues(); // Get all form values
  //         const academicData = transformAcademicData(formData);
  //         console.log("this is data", formData);
  //         // Only submit if there are academic records to send
  //         // if (academicData.academic_records.length > 0) {
  //         await saveAcademicInformation(academicData);
  //         console.log("📤 Sent to API:", academicData);
  //         // } else {
  //         //   console.log('ℹ️ No academic records to submit (all "No")');
  //         // }
  //       } catch (error) {
  //         console.error("Failed to submit academic info");
  //         // Optionally show error to user
  //         return; // Don't proceed to next step on error
  //       }
  //     }

  //     if (currentStep === 5) {
  //       try {
  //         const formData = methods.getValues();
  //         const englishLanguage = transformEnglishProficiencyData(formData);
  //         console.log("📤 Sending english language data:", englishLanguage);

  //         await saveEnglishLanguage(englishLanguage);
  //         console.log("✅ English language saved successfully");
  //       } catch (error) {
  //         console.error("❌ Failed to save english language:", error);
  //         console.error("❌ Error response:", error.response?.data);
  //         return; // stop proceeding if failed
  //       }
  //     }
  //     if (currentStep === 6) {
  //       try {
  //         const formData = methods.getValues();
  //         const workData = transformWorkExperienceData(formData);
  //         // Call API
  //         await saveWorkExperiences(workData);
  //         console.log("📤 Work experience sent:", workData);
  //         // Optional: show success message to user
  //       } catch (error) {
  //         console.error("❌ Failed to save work experience:", error);
  //         // Optional: show error toast/snackbar
  //         return; // stop proceeding to next step
  //       }
  //     }
  //     if (currentStep === 7) {
  //       try {
  //         const formData = methods.getValues();
  //         const dependentData = transformDependentData(formData);

  //         await saveDependentInformation(dependentData);
  //       } catch (error) {
  //         console.error("❌ Failed to save dependents:", error);
  //         return; // stop proceeding to next step
  //       }
  //     }

  //     if (currentStep === 8) {
  //       try {
  //         const formData = methods.getValues();
  //         const maritalData = transformMaritalStatusData(formData);
  //         console.log("📤 Sending marital data:", maritalData);
  //         await saveMaritalStatus(maritalData);
  //       } catch (error) {
  //         console.error("❌ Failed to save marital status:", error);
  //         return; // stop proceeding to next step
  //       }
  //     }

  //     if (currentStep === 9) {
  //       try {
  //         const formData = methods.getValues();
  //         console.log("🔍 Raw emergency contact data:", formData);

  //         const emergencyData = transformEmergencyContactData(formData);
  //         console.log("📤 Sending emergency contact data:", emergencyData);

  //         await saveEmergencyContact(emergencyData);
  //         console.log("✅ Emergency contact saved successfully");
  //       } catch (error) {
  //         console.error("❌ Failed to save emergency contact:", error);
  //         console.error("❌ Error response:", error.response?.data);
  //         return;
  //       }
  //     }

  //     if (currentStep === 10) {
  //       try {
  //         const formData = methods.getValues();
  //         console.log("🔍 Raw immigation history:", formData);

  //         const immigrationData = transformImmigrationHistoryData(formData);
  //         console.log("📤 Sending immigration history data:", immigrationData);

  //         await saveImmigrationHistory(immigrationData);
  //         console.log("✅ Immigration history saved successfully");
  //       } catch (error) {
  //         console.error("❌ Failed to save immigration history:", error);
  //         console.error("❌ Error response:", error.response?.data);
  //         return;
  //       }
  //     }

  //     if (currentStep === 11) {
  //       try {
  //         const formData = methods.getValues();
  //         console.log("🔍 Raw visas data:", formData);

  //         const visaData = transformVisaData(formData);
  //         console.log("📤 Sending visas data:", visaData);

  //         await saveVisa(visaData);
  //         console.log("✅ Visa data saved successfully");
  //       } catch (error) {
  //         console.error("❌ Failed to save visa data:", error);
  //         console.error("❌ Error response:", error.response?.data);
  //         return;
  //       }
  //     }
  //     if (currentStep === 12) {
  //       try {
  //         const formData = methods.getValues();
  //         console.log("🔍 Raw visas rejection data:", formData);

  //         const visaRejectionData = transformVisaRejectionData(formData);
  //         console.log("📤 Sending visas rejection data:", visaRejectionData);

  //         await saveVisaRejection(visaRejectionData);
  //         console.log("✅ Visa rejection data saved successfully");
  //       } catch (error) {
  //         console.error("❌ Failed to save visa rejection data:", error);
  //         console.error("❌ Error response:", error.response?.data);
  //         return;
  //       }
  //     }
  //     if (currentStep === 13) {
  //       try {
  //         const formData = methods.getValues();
  //         console.log("🔍 Raw immigration incident data:", formData);

  //         const immigrationIncidentData =
  //           transformImmigrationIncidentData(formData);
  //         console.log(
  //           "📤 Sending immigration incident data:",
  //           immigrationIncidentData
  //         );

  //         await saveImmigrationIncident(immigrationIncidentData); // You'll need to create this API function
  //         console.log("✅ Immigration incident data saved successfully");
  //       } catch (error) {
  //         console.error("❌ Failed to save immigration incident data:", error);
  //         console.error("❌ Error response:", error.response?.data);
  //         return;
  //       }
  //     }
  //     if (currentStep === 14) {
  //       try {
  //         const formData = methods.getValues();
  //         console.log("🔍 Raw criminal records data:", formData);

  //         const criminalRecordsData = transformCriminalRecordData(formData);
  //         console.log("📤 Sending criminal records data:", criminalRecordsData);

  //         await saveCriminalRecords(criminalRecordsData); // You'll need to create this API function
  //         console.log("✅ Criminal Records saved successfully");
  //       } catch (error) {
  //         console.error("❌ Failed to save criminalrecords data:", error);
  //         console.error("❌ Error response:", error.response?.data);
  //         return;
  //       }
  //     }

  //     if (currentStep === 15) {
  //       try {
  //         const formData = methods.getValues();
  //         console.log("🔍 Raw inadmissibility data:", formData);

  //         const inadmissibilityData = transformInadmissibilityData(formData);
  //         console.log("📤 Sending inadmissibility data:", inadmissibilityData);

  //         await saveInadmissibility(inadmissibilityData); // You'll need to create this API function
  //         console.log("✅ Inadmissibility saved successfully");
  //       } catch (error) {
  //         console.error("❌ Failed to save inadmissibility data:", error);
  //         console.error("❌ Error response:", error.response?.data);
  //         return;
  //       }
  //     }
  //     if (currentStep === 16) {
  //       try {
  //         const formData = methods.getValues();
  //         console.log("🔍 Raw health data:", formData);

  //         // Step 1: Save health data
  //         const healthData = transformHealthData(formData);
  //         console.log("📤 Sending health data:", healthData);
  //         await saveHealth(healthData);
  //         console.log("✅ Health saved successfully");

  //         // Step 2: Final submit
  //         const finalSubmitData = {
  //           is_draft: false,
  //           status: "Pending",
  //           agree_to_terms: formData.agree_to_terms,
  //         };
  //         console.log("📤 Sending final submit data:", finalSubmitData);
  //         await saveFinalSubmit(finalSubmitData);
  //         console.log("✅ Final submission successful");

  //         alert("Form submitted successfully!");

  //         router.push(paths.dashboard.plan);
  //         // Optional: navigate to success page
  //       } catch (error) {
  //         console.error("❌ Failed to submit form:", error);
  //         console.error("❌ Error response:", error.response?.data);
  //         alert("Failed to submit form. Please try again.");
  //         return;
  //       }
  //     }

  //     if (currentStep < ONBOARDING_STEPS.length - 1) {
  //       setCurrentStep((prev) => prev + 1);
  //     } else {
  //       handleSubmit(onSubmit)();
  //     }
  //   }
  // };

  // const goPrev = () => {
  //   if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  // };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <MainApplicantDetails country={country} />;
      case 1:
        return <CurrentAddress country={country} />;
      case 2:
        return <ContactDetails />;
      case 3:
        return <SponsorInformation detail={id} />;
      case 4:
        return <AcademicInformation country={country} />;
      case 5:
        return <EnglishLanguageProficiency />;
      case 6:
        return <PastWorkExperiences />;
      case 7:
        return <DependentInformation />;
      case 8:
        return <MaritalStatus />;
      case 9:
        return <EmergencyContactInformation />;
      case 10:
        return <ImmigrationHistory />;
      case 11:
        return <Visa />;
      case 12:
        return <VisaRejection />;
      case 13:
        return <ImmigrationIncident />;
      case 14:
        return <CriminalRecord />;
      case 15:
        return <Inadmissibility />;
      case 16:
        return <Health />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <OnboardingHeader
          onMenuClick={handleDrawerToggle}
          onClose={oncloseLayout}
        />

        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <OnboardingSidebar
            mobileOpen={mobileOpen}
            onClose={handleDrawerToggle}
            onItemClick={handleSidebarNavigation}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />

          <Box
            component="form"
            sx={{
              flexGrow: 1,
              p: { xs: 2, md: 4 },
              backgroundColor: (theme) => theme.palette.grey[100],
              color: (theme) => theme.palette.primary.contrastText,
              overflowY: "auto",
              maxHeight: "calc(100vh - 64px)",
            }}
          >
            <Box
              sx={{
                backgroundColor: "primary.light",
                borderRadius: 2,
                p: 4,
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  textAlign: "center",
                  color: "primary.contrastText",
                }}
              >
                {ONBOARDING_STEPS[currentStep].label}
              </Typography>

              {renderStep()}

              <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 4 }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 2 }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  disabled={currentStep === 0}
                  onClick={goPrev}
                >
                  Previous
                </Button>

                <Button variant="contained" color="secondary" onClick={goNext}>
                  {currentStep === ONBOARDING_STEPS.length - 1
                    ? "Submit"
                    : "Next"}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}

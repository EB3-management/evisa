import {
  Box,
  Divider,
  Button,
  Stack,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Grid from "@mui/material/Grid2";

import { OnboardingHeader } from "src/components/onboarding/OnboardingHeader";
import { OnboardingSidebar } from "src/components/onboarding/OnboardingSidebar";
import {
  ProcessingInformation,
  processingInformationSchema,
} from "src/components/onboarding/forms/ProcessingInformation";
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
import { useGetCountryCode, useGetEligibilityData } from "src/api";
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
  saveProcessingInformation,
  saveVisa,
  saveVisaRejection,
  saveWorkExperiences,
} from "src/api/onboardingform";
import { useNavigate, useParams } from "react-router";
import { useGetVacancyDetail } from "src/api/vacancy";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchOnBoardingRequest, fetchProfileRequest } from "src/redux/actions";
import { toast } from "sonner";

export default function OnboardingLayout() {
  const dispatch = useAppDispatch();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastUserId, setLastUserId] = useState(null);
  const { country } = useGetCountryCode();
  // const { id } = useParams();
  const selectedVacancyId = useAppSelector(
    (state) => state.vacancy.selectedVacancyId,
  );

  // Use selectedVacancyId from Redux or fallback to id from params
  const vacancyId = selectedVacancyId;
  console.log("🔍 Vacancy ID:", { selectedVacancyId, vacancyId });

  const router = useRouter();

  // Fetch vacancy data
  const { vacancyDetail } = useGetVacancyDetail(selectedVacancyId);

  const { eligibilityData, eligibilityLoading, eligibilityError } =
    useGetEligibilityData();

  console.log("this is eligibility", eligibilityData);
  const { onBoarding, isLoading: isLoadingOnBoarding } = useAppSelector(
    (state) => state.onBoarding || { onBoarding: {}, isLoading: false },
  );

  const { profile } = useAppSelector(
    (state) => state.profile || { profile: null },
  );

  // Load user-specific progress when profile is available
  useEffect(() => {
    if (profile?.id) {
      const userId = profile.id.toString();

      console.log("🔍 Profile loaded:", {
        userId,
        lastUserId,
        isInitialized,
        currentStep,
      });

      // Check if user has changed
      if (lastUserId && lastUserId !== userId) {
        console.log("👤 Different user detected, resetting initialization");
        // Different user logged in, reset initialization
        setIsInitialized(false);
      }

      // Load this user's saved step (only once per user)
      if (!isInitialized || lastUserId !== userId) {
        const savedStep = localStorage.getItem(
          `onboarding_current_step_${userId}`,
        );
        const savedCompleted = localStorage.getItem(
          `onboarding_completed_steps_${userId}`,
        );

        console.log("📦 Loading from localStorage:", {
          savedStep,
          savedCompleted,
          key: `onboarding_current_step_${userId}`,
        });

        if (savedStep) {
          console.log("✅ Setting step to:", parseInt(savedStep, 10));
          setCurrentStep(parseInt(savedStep, 10));
        } else {
          console.log("⚠️ No saved step, resetting to 0");
          setCurrentStep(0);
        }

        if (savedCompleted) {
          setCompletedSteps(new Set(JSON.parse(savedCompleted)));
        } else {
          setCompletedSteps(new Set());
        }

        setLastUserId(userId);
        setIsInitialized(true);
      } else {
        console.log("✋ Already initialized for this user, skipping load");
      }
    }
  }, [profile?.id, isInitialized, lastUserId]);

  const stepSchemas = [
    processingInformationSchema,
    mainApplicantSchema,
    maritalStatusSchema,
    dependentsSchema,
    currentAddressSchema,
    contactDetailsSchema,
    academicInformationSchema,
    pastWorkExperiencesSchema,
    englishLanguageProficiencySchema,
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
      //processing information
      adjustment_of_status: true,
      date_of_last_entry: "",
      i944_number: "",
      embassy_name: "",
      embassy_location: "",

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

      //academic information
      hasFormalEducation: false,
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
      has_work_experience: "No",
      work_experiences: [],

      //dependent
      has_dependents: "No",
      dependents: [],

      //emergency contact
      emergencyFullName: "",
      emergencyPhone: "",
      degreeOfKinship: "",
      degreeOfKinshipOther: "",
      emergencyAddress: "",

      //immigration history
      hasImmigrationHistory: false,
      types: "",
      beenToUsa: "No",
      socialSecurity: "No",
      socialSecurityNumber: "",
      inUsaApplicant: "No",
      applicantName: "",
      inUsaDependent: "No",
      dependentName: "",
      i94Number: "",

      //visa
      has_visa_records: "No",
      visa_records: [],

      //visa rejection
      employee_visa_rejected: "No",
      employee_fullname: "",
      employee_visa_type: "",
      employee_rejection_reason: "",
      employee_rejection_date: "",
      dependents_visa_rejected: "No",
      dependent_fullname: "",
      dependent_visa_type: "",
      dependent_rejection_reason: "",
      dependent_rejection_date: "",

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

      //criminal records
      criminal_record_employee: "No",
      criminal_record_dependents: "No",
      criminal_records: [],

      //inadmissibility
      has_inadmissibility: "No",
      inadmissibility_records: [],

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
    dispatch(fetchOnBoardingRequest());
  }, [dispatch]);

  // Persist currentStep to localStorage with user-specific key
  useEffect(() => {
    if (profile?.id && isInitialized) {
      const userId = profile.id.toString();
      console.log("💾 Saving step to localStorage:", currentStep);
      localStorage.setItem(
        `onboarding_current_step_${userId}`,
        currentStep.toString(),
      );
    }
  }, [currentStep, profile?.id, isInitialized]);

  // Persist completedSteps to localStorage with user-specific key
  useEffect(() => {
    if (profile?.id && isInitialized) {
      const userId = profile.id.toString();
      console.log(
        "💾 Saving completed steps to localStorage:",
        Array.from(completedSteps),
      );
      localStorage.setItem(
        `onboarding_completed_steps_${userId}`,
        JSON.stringify(Array.from(completedSteps)),
      );
    }
  }, [completedSteps, profile?.id, isInitialized]);

  // ✅ Helper function to normalize English proficiency levels
  const normalizeEnglishLevel = (level) => {
    if (!level) return "";
    // Convert "Advance" to "Advanced" for consistency
    return level === "Advance" ? "Advanced" : level;
  };

  // ✅ Helper function to get English proficiency with fallback
  const getEnglishProficiency = (skill) => {
    // Priority: onBoarding > eligibilityData
    const onBoardingValue = onBoarding?.english_language_proficiency?.[skill];
    const eligibilityValue =
      eligibilityData?.employee?.english_language_proficiency?.[skill];

    return normalizeEnglishLevel(onBoardingValue || eligibilityValue);
  };

  // Populate form with profile and onBoarding data
  useEffect(() => {
    if (profile || onBoarding || eligibilityData) {
      const employee = onBoarding?.employee;

      console.log("🔍 Debug birth_country:", {
        from_employee: employee?.birth_country,
        from_eligibility: eligibilityData?.employee?.birth_country,
        final_value:
          employee?.birth_country ||
          eligibilityData?.employee?.birth_country ||
          "",
      });
      const employeeAddress = onBoarding?.employeeAddress;
      const academicRecords = onBoarding?.academicRecords || [];
      const englishProficiency = onBoarding?.english_language_proficiency;
      const workExperiences = onBoarding?.workExperiences || [];
      const dependents = onBoarding?.dependents || [];
      const maritalStatus = onBoarding?.maritalStatus;
      const emergencyContact = onBoarding?.emergencyContact;
      const immigrationHistory = onBoarding?.immigrationHistories?.[0]; // Take first item from array
      const visaRecords = onBoarding?.visaRecords || [];
      const visaRejection = onBoarding?.visaRejections || []; // Take first item from array
      const immigrationIncidents = onBoarding?.immigrationIncidents?.[0]; // Take first item from array
      const criminalRecords = onBoarding?.criminalRecords || [];
      const inadmissibilityRecords = onBoarding?.inadmissibilityRecords || [];
      const healthRecord = onBoarding?.healthRecord;
      const processingInformation = onBoarding?.processing_information;

      // Helper function to check if academic level exists
      const hasAcademicLevel = (programName) =>
        academicRecords.some(
          (record) =>
            record.program_name?.toLowerCase() === programName.toLowerCase(),
        );

      // Helper function to get academic record data
      const getAcademicRecord = (programName) =>
        academicRecords.find(
          (record) =>
            record.program_name?.toLowerCase() === programName.toLowerCase(),
        ) || {};

      // Populate Academic Information
      const academicFields = {};
      [
        "lowerSchool",
        "highSchool",
        "bachelor",
        "graduate",
        "doctorate",
      ].forEach((level) => {
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
          // Add grade field for lower school
          if (level === "lowerSchool") {
            academicFields[`${level}_grade`] = record.grade || "";
          }
        }
      });

      // Populate Work Experiences
      const workFields = {
        has_work_experience: workExperiences.length > 0 ? "Yes" : "No",
        work_experiences: workExperiences.map((exp) => ({
          company_name: exp.jwe_company_name || "",
          job_title: exp.jwe_job_title || "",
          start_date: exp.jwe_start_date || "",
          end_date: exp.jwe_end_date || "",
          currently_employed: !!exp.jwe_current, // ✅ Convert to boolean
          job_description: exp.jwe_job_desc || "",
          city: exp.jwe_city || "",
          state: exp.jwe_state || "",
          zip_code: exp.jwe_zip_code || "",
          supervisor_name: exp.jwe_supervisor_name || "",
          job_duty: exp.jwe_job_duty || "",
        })),
      };

      // Populate Dependents
      const dependentFields = {
        has_dependents: dependents.length > 0 ? "Yes" : "No",
        dependents: dependents.map((dep) => ({
          first_name: dep.dependent_first_name || "",
          middle_name: dep.dependent_middle_name || "",
          last_name: dep.dependent_last_name || "",
          dob: dep.dependent_dob || "",
          kinship: dep.dependent_relation || "",
          birth_country: dep.dependent_country_of_birth
            ? String(dep.dependent_country_of_birth)
            : "",
          citizenship_country: dep.dependent_country_of_citizenship
            ? String(dep.dependent_country_of_citizenship)
            : "",
          highest_level_of_education: dep.education || "",
        })),
      };

      // Populate Visa Records
      const visaFields = {
        has_visa_records: visaRecords.length > 0 ? "Yes" : "No",
        visa_records: visaRecords.map((visa) => ({
          visaName: visa.visa_fullname || "",
          visaType: visa.visa_type || "",
          visaExpeditionDate: visa.visa_expedition_date || "",
          visaExpirationDate: visa.visa_expiration_date || "",
        })),
      };

      const employeeRejection = visaRejection.find(
        (r) => r.rejected_for === "Employee",
      );
      const dependentRejection = visaRejection.find(
        (r) => r.rejected_for === "Dependent",
      );

      console.log("📋 Employee Rejection:", employeeRejection);
      console.log("📋 Dependent Rejection:", profile?.birth_country);

      // Helper function to normalize gender value
      const normalizeGender = (gender) => {
        if (!gender) return "";
        const normalized =
          gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
        // Ensure it matches one of the valid options
        return ["Male", "Female", "Other"].includes(normalized)
          ? normalized
          : "";
      };

      // Populate form with all data
      methods.reset({
        // Processing Information
        adjustment_of_status:
          processingInformation?.adjustment_of_status ?? true,
        date_of_last_entry: processingInformation?.date_of_last_entry
          ? processingInformation.date_of_last_entry.split("T")[0]
          : "",
        i944_number: processingInformation?.i944_number || "",
        embassy_name: processingInformation?.embassy_name || "",
        embassy_location: processingInformation?.embassy_location || "",

        // Main Applicant - Priority: onBoarding.employee > profile
        firstName: employee?.first_name || profile?.first_name || "",
        middleName: employee?.middle_name || profile?.middle_name || "",
        lastName: employee?.last_name || profile?.last_name || "",
        dob:
          employee?.dob || profile?.dob || eligibilityData?.employee?.dob || "",
        gender: normalizeGender(employee?.gender || profile?.gender),
        countryOfBirth:
          employee?.birth_country?.id ||
          eligibilityData?.employee?.birth_country?.id ||
          "",
        citizenship1:
          employee?.country_of_citizenship?.id ||
          profile?.country_of_citizenship?.id ||
          "",

        citizenship2:
          employee?.country_of_citizenship2?.id ||
          profile?.country_of_citizenship2?.id ||
          "",

        // Current Address - from employeeAddress
        country:
          employeeAddress?.current_country?.id ||
          eligibilityData?.employee?.employee_address?.current_country?.id ||
          "",
        state:
          employeeAddress?.current_province_state ||
          eligibilityData?.employee?.employee_address?.current_province_state ||
          "",
        city:
          employeeAddress?.current_city_town ||
          eligibilityData?.employee?.employee_address?.current_city_town ||
          "",
        zipCode:
          employeeAddress?.current_zip_code ||
          eligibilityData?.employee?.employee_address?.current_zip_code ||
          "",
        address:
          employeeAddress?.current_street ||
          eligibilityData?.employee?.employee_address?.current_street ||
          "",
        // Contact Details
        email: employee?.email || profile?.email || "",
        phone: employee?.phone || profile?.phone || "",

        // Sponsor Information
        // sponsor_name: onBoarding?.sponsor?.sponsor_name || "",
        // sponsor_position: onBoarding?.sponsor?.sponsor_position || "",
        // sponsor_location: onBoarding?.sponsor?.sponsor_location || "",

        // Academic Information
        hasFormalEducation: onBoarding?.has_formal_education ?? false,
        ...academicFields,

        // ✅ English Language Proficiency - Clean implementation
        writing: getEnglishProficiency("writing"),
        listening: getEnglishProficiency("listening"),
        reading: getEnglishProficiency("reading"),
        speaking: getEnglishProficiency("speaking"),

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
        beenToUsa: immigrationHistory?.been_to_usa || "No",
        socialSecurity: immigrationHistory?.ever_had_ssn || "No",
        socialSecurityNumber: immigrationHistory?.ssn_number || "",
        inUsaApplicant: immigrationHistory?.employee_in_usa || "No",
        applicantName: immigrationHistory?.employee_in_usa_if_yes_who || "",
        inUsaDependent: immigrationHistory?.dependents_in_usa || "No",
        dependentName: immigrationHistory?.dependents_in_usa_if_yes_who || "",
        i94Number: immigrationHistory?.recent_i94_number || "",

        // Visa Records
        ...visaFields,

        // Visa Rejection - Populate from API
        employee_visa_rejected: employeeRejection ? "Yes" : "No",
        employee_fullname: employeeRejection?.rejection_fullname || "",
        employee_visa_type: employeeRejection?.rejection_visa || "",
        employee_rejection_reason: employeeRejection?.rejection_reason || "",
        employee_rejection_date: employeeRejection?.rejection_date || "",

        dependents_visa_rejected: dependentRejection ? "Yes" : "No",
        dependent_fullname: dependentRejection?.rejection_fullname || "",
        dependent_visa_type: dependentRejection?.rejection_visa || "",
        dependent_rejection_reason: dependentRejection?.rejection_reason || "",
        dependent_rejection_date: dependentRejection?.rejection_date || "",

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
          (r) => r.related_to?.toLowerCase() === "dependent",
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

        // Inadmissibility
        has_inadmissibility: inadmissibilityRecords.length > 0 ? "Yes" : "No",
        inadmissibility_records: inadmissibilityRecords.map((record) => ({
          name: record.inadmissibilities_procedure_name || "",
          condition: record.inadmissibilities_condition_name || "",
          doctor: record.inadmissibilities_doctor_name || "",
          procedure: record.inadmissibilities_procedure || "",
          date: record.inadmissibilities_date || "",
        })),

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

  //processing information
  const transformProcessingInformationData = (formData) => {
    const data = {
      adjustment_of_status: formData.adjustment_of_status,
    };

    if (formData.adjustment_of_status) {
      // If adjustment of status is true
      data.date_of_last_entry = formData.date_of_last_entry;
      data.i944_number = formData.i944_number;
    } else {
      // If adjustment of status is false (consular processing)
      data.embassy_name = formData.embassy_name;
      data.embassy_location = formData.embassy_location;
    }

    return data;
  };

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

  //Academic form
  const transformAcademicData = (formData) => {
    console.log("🔍 Full formData:", formData);
    console.log("🔍 hasFormalEducation:", formData.hasFormalEducation);

    // If no formal education, return empty array
    if (!formData.hasFormalEducation) {
      return { has_formal_education: false, academic_records: [] };
    }

    const academicLevels = [
      "lowerSchool",
      "highSchool",
      "bachelor",
      "graduate",
      "doctorate",
    ];

    // Log each level's value
    academicLevels.forEach((level) => {
      console.log(`🔍 ${level}:`, formData[level]);
    });

    const academic_records = academicLevels
      .filter((level) => {
        const isYes = formData[level]?.toLowerCase() === "yes";
        console.log(
          `🔍 Filtering ${level}: ${formData[level]} === "yes"? ${isYes}`,
        );
        return isYes;
      })
      .map((level) => ({
        program_name: level,
        institution_name: formData[`${level}_instituteName`] || "",
        graduation_year: formData[`${level}_graduationYear`] || "",
        country: formData[`${level}_country`] || "",
        state: formData[`${level}_state`] || "",
        city: formData[`${level}_city`] || "",
        zip_code: formData[`${level}_zipCode`] || "",
        address: formData[`${level}_address`] || "",
        ...(level === "lowerSchool" && {
          grade: formData.lowerSchool_grade || "",
        }),
      }));

    console.log("📤 Final academic_records:", academic_records);
    return { has_formal_education: true, academic_records };
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
    const work_experiences = (formData.work_experiences || []).map((exp) => ({
      company_name: exp.company_name || "",
      job_title: exp.job_title || "",
      job_desc: exp.job_description || "",
      job_duty: exp.job_duty || "",
      supervisor_name: exp.supervisor_name || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      current: exp.currently_employed || false,
      city: exp.city || "",
      state: exp.state || "",
      zip_code: exp.zip_code || "",
    }));

    return { work_experiences };
  };

  //dependent information
  //dependent information
  const transformDependentData = (formData) => {
    const dependents = (formData.dependents || []).map((dependent) => ({
      first_name: dependent.first_name || "",
      middle_name: dependent.middle_name || null,
      last_name: dependent.last_name || "",
      dob: dependent.dob || "",
      relation: dependent.kinship || "",
      country_of_birth: dependent.birth_country
        ? parseInt(dependent.birth_country, 10)
        : null,
      country_of_citizenship: dependent.citizenship_country
        ? parseInt(dependent.citizenship_country, 10)
        : null,
      education: dependent.highest_level_of_education || null,
    }));
    return { dependents };
  };

  //marital Status
  const transformMaritalStatusData = (formData) => {
    const status = formData.maritalStatus || "";

    // Clean country name by removing phone code in parentheses
    // const cleanCountryName = (countryStr) => {
    //   if (!countryStr) return "";
    //   // Remove anything in parentheses (like phone codes)
    //   return countryStr.replace(/\s*\([^)]*\)\s*/g, "").trim();
    // };

    return {
      legally_married:
        status === "Yes" ? "Yes" : status === "No" ? "No" : status,
      legally_married_if_others:
        status &&
        !["Yes", "No", "Divorced", "Widow", "Separated"].includes(status)
          ? formData.clarifyMaritalStatus || ""
          : "",
      legally_married_if_d_w_s: ["Divorced", "Widow", "Separated"].includes(
        status,
      )
        ? formData.clarifyMaritalStatus || ""
        : "",
      legally_married_if_yes_country:
        status === "Yes" ? formData.countryOfMarriage || "" : "",
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
  const transformImmigrationHistoryData = (formData) => {
    // If no immigration history, return only the boolean
    if (!formData.hasImmigrationHistory) {
      return { has_immigration_history: false };
    }

    // If yes, return the full immigration history object
    return {
      has_immigration_history: true,
      immigration_history: {
        immigration_type: String(formData.types),
        been_to_usa: formData.beenToUsa,
        ever_had_ssn: formData.socialSecurity,
        ssn_number: formData.socialSecurityNumber || "",
        employee_in_usa: formData.inUsaApplicant,
        employee_in_usa_if_yes_who: formData.applicantName || "",
        dependents_in_usa: formData.inUsaDependent,
        dependents_in_usa_if_yes_who: formData.dependentName || "",
        recent_i94_number: formData.i94Number || "",
      },
    };
  };

  //visa
  const transformVisaData = (formData) => {
    const visa_records = (formData.visa_records || []).map((record) => ({
      fullname: record.visaName || "",
      type: record.visaType || "",
      expedition_date: record.visaExpeditionDate || "",
      expiration_date: record.visaExpirationDate || "",
    }));

    return { visa_records };
  };

  //visa rejection
  const transformVisaRejectionData = (formData) => {
    const visa_rejections = [];

    // Add employee rejection if Yes
    if (formData.employee_visa_rejected === "Yes") {
      visa_rejections.push({
        rejected_for: "Employee",
        fullname: formData.employee_fullname || "",
        visa: formData.employee_visa_type || "",
        reason: formData.employee_rejection_reason || "",
        date: formData.employee_rejection_date || "",
      });
    }

    // Add dependent rejection if Yes
    if (formData.dependents_visa_rejected === "Yes") {
      visa_rejections.push({
        rejected_for: "Dependent",
        fullname: formData.dependent_fullname || "",
        visa: formData.dependent_visa_type || "",
        reason: formData.dependent_rejection_reason || "",
        date: formData.dependent_rejection_date || "",
      });
    }

    return {
      employee_visa_rejected: formData.employee_visa_rejected,
      dependents_visa_rejected: formData.dependents_visa_rejected,
      visa_rejections,
    };
  };

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
  //inadmissibilty
  const transformInadmissibilityData = (formData) => {
    const inadmissibility_records = (
      formData.inadmissibility_records || []
    ).map((record) => ({
      condition: record.condition || "",
      condition_name: record.condition || "",
      date: record.date || "",
      doctor_name: record.doctor || "",
      procedure: record.procedure || "",
      procedure_name: record.name || "",
    }));

    return {
      inadmissibility_records,
    };
  };

  const transformHealthData = (formData) => {
    // Helper function to convert "yes"/"no" to "Yes"/"No"
    const capitalizeYesNo = (value) => {
      if (value === "yes") return "Yes";
      if (value === "no") return "No";
      return "No"; // default
    };

    return {
      health_records: {
        std_employee: capitalizeYesNo(formData.hasSTD),
        std_employee_details: formData.stdDetails || "",
        std_dependents: capitalizeYesNo(formData.hasStdDependent),
        std_dependents_details: formData.stdDependentDetails || "",
        tb_employee: capitalizeYesNo(formData.hasTb),
        tb_employee_details: formData.tbDetails || "",
        tb_dependents: capitalizeYesNo(formData.hasTbDependent),
        tb_dependents_details: formData.tbDependentDetails || "",
        health_insurance_employee: capitalizeYesNo(formData.hasInsurance),
        health_insurance_employee_details: formData.insuranceDetails || "",
        health_insurance_dependents: capitalizeYesNo(
          formData.hasInsuranceDependent,
        ),
        health_insurance_dependents_details:
          formData.insuranceDependentDetails || "",
      },
    };
  };

  const { handleSubmit } = methods;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const oncloseLayout = () => {
    // Optionally: clear progress when user closes the form
    // Uncomment if you want to reset on close
    // localStorage.removeItem('onboarding_current_step');
    // localStorage.removeItem('onboarding_completed_steps');
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
          // Processing Information
          await saveProcessingInformation(
            transformProcessingInformationData(formData),
          );

          // Handle data based on adjustment_of_status choice
          if (formData.adjustment_of_status === true) {
            // Adjustment of Status: Save visa records if exists
            if (formData.has_visa_records === "Yes") {
              await saveVisa(transformVisaData(formData));
            }

            // Clear consular processing data from form
            methods.setValue("embassy_name", "");
            methods.setValue("embassy_location", "");
          } else {
            // Consular Processing: Clear adjustment of status data
            methods.setValue("date_of_last_entry", "");
            methods.setValue("i944_number", "");
            methods.setValue("has_visa_records", "No");
            methods.setValue("visa_records", []);
          }
          break;
        case 1:
          await saveMainApplicantDetail(transformMainApplicantData(formData));
          break;
        case 2:
          await saveMaritalStatus(transformMaritalStatusData(formData));
          break;
        case 3:
          await saveDependentInformation(transformDependentData(formData));
          break;
        case 4:
          await saveCurrentAddress(transformCurrentAddressData(formData));
          break;
        case 5:
          await saveContactDetail(transformContactDetailsData(formData));
          break;
        case 6:
          await saveAcademicInformation(transformAcademicData(formData));
          break;
        case 7:
          await saveWorkExperiences(transformWorkExperienceData(formData));
          break;
        case 8:
          await saveEnglishLanguage(transformEnglishProficiencyData(formData));
          break;
        case 9:
          await saveEmergencyContact(transformEmergencyContactData(formData));
          break;
        case 10:
          console.log("this is immigration ", formData);
          await saveImmigrationHistory(
            transformImmigrationHistoryData(formData),
          );
          break;
        case 11:
          // Only save visa if consular processing (adjustment of status is false)
          if (formData.adjustment_of_status === false) {
            await saveVisa(transformVisaData(formData));
          } else {
            console.log(
              "⚠️ Skipping visa save - adjustment of status is enabled",
            );
          }
          break;
        case 12:
          await saveVisaRejection(transformVisaRejectionData(formData));
          break;
        case 13:
          await saveImmigrationIncident(
            transformImmigrationIncidentData(formData),
          );
          break;
        case 14:
          await saveCriminalRecords(transformCriminalRecordData(formData));
          break;
        case 15:
          await saveInadmissibility(transformInadmissibilityData(formData));
          break;
        case 16: {
          await saveHealth(transformHealthData(formData));
          const response = await saveFinalSubmit({
            is_draft: false,
            status: "Pending",
            agree_to_terms: formData.agree_to_terms,
          });
          toast.success(response.message || "Form submitted successfully!");
          // alert("Form submitted successfully!");
          router.push(paths.dashboard.plan(selectedVacancyId));
          break;
        }
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

    // Check if we should skip step 11 (Visa)
    const adjustmentOfStatus = methods.getValues("adjustment_of_status");
    let nextStep = currentStep + 1;

    // Skip step 11 if adjustment of status is Yes
    if (nextStep === 11 && adjustmentOfStatus === true) {
      nextStep = 12; // Jump to step 12 (Visa Rejection)
    }

    // Move to next step or submit
    if (nextStep < ONBOARDING_STEPS.length) {
      setCurrentStep(nextStep);
    } else {
      // Clear this user's localStorage after final submission
      if (profile?.id) {
        const userId = profile.id.toString();
        localStorage.removeItem(`onboarding_current_step_${userId}`);
        localStorage.removeItem(`onboarding_completed_steps_${userId}`);
      }
      handleSubmit(onSubmit)();
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      const adjustmentOfStatus = methods.getValues("adjustment_of_status");
      let prevStep = currentStep - 1;

      // Skip step 11 when going back if adjustment of status is Yes
      if (prevStep === 11 && adjustmentOfStatus === true) {
        prevStep = 10; // Jump to step 10 (Immigration History)
      }

      setCurrentStep(prevStep);
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
      (_, i) => i,
    ).every((step) => completedSteps.has(step));

    if (canNavigateForward) {
      setCurrentStep(targetStep);
    } else {
      // Show message that previous steps must be completed
      alert("Please complete all previous steps before proceeding.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ProcessingInformation vacancyData={vacancyDetail} />;
      case 1:
        return <MainApplicantDetails country={country} />;
      case 2:
        return <MaritalStatus />;
      case 3:
        return <DependentInformation />;
      case 4:
        return <CurrentAddress country={country} />;
      case 5:
        return <ContactDetails />;
      case 6:
        return <AcademicInformation country={country} />;
      case 7:
        return <PastWorkExperiences />;
      case 8:
        return <EnglishLanguageProficiency />;
      case 9:
        return <EmergencyContactInformation />;
      case 10:
        return <ImmigrationHistory vacancyId={selectedVacancyId} />;
      case 11:
        return <Visa vacancyId={selectedVacancyId} />;
      case 12:
        return <VisaRejection vacancyId={selectedVacancyId} />;
      case 13:
        return <ImmigrationIncident vacancyId={selectedVacancyId} />;
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
            {/* Vacancy Details Card - Shown on all steps */}
            {vacancyDetail && (
              <Card
                sx={{
                  mb: 2,
                  backgroundColor: "primary.light",
                  color: "white",
                  boxShadow: 2,
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.8,
                            textTransform: "uppercase",
                            fontSize: "0.7rem",
                            display: "block",
                          }}
                        >
                          Position
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, mt: 0.5 }}
                        >
                          {vacancyDetail?.title || "N/A"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.8,
                            textTransform: "uppercase",
                            fontSize: "0.7rem",
                            display: "block",
                          }}
                        >
                          Location
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, mt: 0.5 }}
                        >
                          {vacancyDetail?.location || "N/A"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.8,
                            textTransform: "uppercase",
                            fontSize: "0.7rem",
                            display: "block",
                          }}
                        >
                          Country
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            mt: 0.5,
                            textTransform: "capitalize",
                          }}
                        >
                          {vacancyDetail?.visa_category?.country?.name || "N/A"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.8,
                            textTransform: "uppercase",
                            fontSize: "0.7rem",
                            display: "block",
                          }}
                        >
                          Category
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, mt: 0.5 }}
                        >
                          {vacancyDetail?.visa_category?.name || "N/A"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

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

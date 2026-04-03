import { useEffect } from "react";
import {
  normalizeGender,
  normalizeMaritalStatus,
  normalizeRelation,
  hasAcademicLevel,
  getAcademicRecord,
  getEnglishProficiency as getEnglishProficiencyHelper,
} from "src/utils/onboarding-helpers";

/**
 * Custom hook to populate onboarding form with data from profile, onBoarding, and eligibility
 * @param {Object} methods - React Hook Form methods
 * @param {Object} profile - User profile data
 * @param {Object} onBoarding - Onboarding data from API
 * @param {Object} eligibilityData - Eligibility data
 */
export const useOnboardingFormData = (
  methods,
  profile,
  onBoarding,
  eligibilityData,
) => {
  useEffect(() => {
    if (profile || onBoarding || eligibilityData) {
      const employee = onBoarding?.employee;

      //   console.log("🔍 Debug birth_country:", {
      //     from_employee: employee?.birth_country,
      //     from_eligibility: eligibilityData?.employee?.birth_country,
      //     final_value:
      //       employee?.birth_country ||
      //       eligibilityData?.employee?.birth_country ||
      //       "",
      //   });

      const employeeAddress = onBoarding?.employeeAddress;
      const academicRecords = onBoarding?.academicRecords || [];
      const englishProficiency = onBoarding?.english_language_proficiency;
      const workExperiences = onBoarding?.workExperiences || [];
      const dependents = onBoarding?.dependents || [];
      const maritalStatus = onBoarding?.maritalStatus;
      //   console.log("🔍 Debug maritalStatus from API:", maritalStatus);
      const emergencyContact = onBoarding?.emergencyContact;
      const immigrationHistory = onBoarding?.immigrationHistories?.[0];
      const visaRecords = onBoarding?.visaRecords || [];
      const visaRejection = onBoarding?.visaRejections || [];
      const immigrationIncidents = onBoarding?.immigrationIncidents?.[0];
      const criminalRecords = onBoarding?.criminalRecords || [];
      const inadmissibilityRecords = onBoarding?.inadmissibilityRecord || [];
      const healthRecord = onBoarding?.healthRecord;
      const processingInformation = onBoarding?.processing_information;

      // Populate Academic Information
      const academicFields = {};
      [
        "lowerSchool",
        "highSchool",
        "bachelor",
        "graduate",
        "doctorate",
      ].forEach((level) => {
        const hasLevel = hasAcademicLevel(academicRecords, level);
        academicFields[level] = hasLevel ? "Yes" : "No";

        if (hasLevel) {
          const record = getAcademicRecord(academicRecords, level);
          academicFields[`${level}_instituteName`] =
            record.institution_name || "";
          academicFields[`${level}_graduationYear`] =
            record.graduation_year || "";
          academicFields[`${level}_country`] =
            record.country?.id || record.country || "";
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
          currently_employed: !!exp.jwe_current,
          job_description: exp.jwe_job_desc || "",
          city: exp.jwe_city || "",
          state: exp.jwe_state || "",
          zip_code: exp.jwe_zip_code || "",
          supervisor_name: exp.jwe_supervisor_name || "",
          job_duty: exp.jwe_job_duty || "",
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

      // Get employee visa records
      const employeeVisaRecords = onBoarding?.employeeVisaRecords || [];
      const hasEmployeeVisaRecords = employeeVisaRecords.length > 0;
      console.log("this is employee records visa", employeeVisaRecords);

      // Get dependents with their visa records
      const dependentsWithVisaRecords = dependents.map((dep) => {
        const depVisaRecords = dep.visa_records || [];
        return {
          ...dep,
          visa_records: depVisaRecords.map((record) => {
            const visaType = record.visa_type
              ? parseInt(record.visa_type, 10)
              : "";
            console.log("🔍 Populating dependent visa record:", {
              raw_visa_type: record.visa_type,
              parsed_type: visaType,
              dependent_name: dep.dependent_first_name,
            });
            return {
              type: visaType,
              expedition_date: record.visa_expedition_date || "",
              expiration_date: record.visa_expiration_date || "",
            };
          }),
        };
      });

      const hasDependentVisaRecords = dependentsWithVisaRecords.some(
        (dep) => dep.visa_records.length > 0,
      );

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

        // Visa records radio buttons
        visa_records_applicant: hasEmployeeVisaRecords ? "yes" : "no",
        visa_records_dependents: hasDependentVisaRecords ? "yes" : "no",

        // Visa records from processing information (for applicant)
        visa_records: employeeVisaRecords.map((record) => {
          const visaType = record.visa_type
            ? parseInt(record.visa_type, 10)
            : "";

          console.log("🔍 Populating applicant visa record:", {
            raw_visa_type: record.visa_type,
            parsed_type: visaType,
            fullRecord: record,
          });

          return {
            visa_first_name: record.visa_first_name || "",
            visa_middle_name: record.visa_middle_name || "",
            visa_last_name: record.visa_last_name || "",
            type: visaType,
            expedition_date: record.visa_expedition_date || "",
            expiration_date: record.visa_expiration_date || "",
          };
        }),

        // Dependents from processing information with nested visa records
        dependents: dependentsWithVisaRecords.map((dep) => {
          console.log("🔍 Mapping dependent:", dep);
          console.log("🔍 Dependent relation value:", dep.dependent_relation);
          const birthCountry =
            dep.dependent_country_of_birth || dep.country_of_birth?.id || "";
          const citizenshipCountry =
            dep.dependent_country_of_citizenship ||
            dep.country_of_citizenship?.id ||
            "";

          // API returns academicRecords (camelCase), get first record if exists
          const academicRecord = (dep.academicRecords ||
            dep.academic_records)?.[0];

          return {
            first_name: dep.dependent_first_name || "",
            middle_name: dep.dependent_middle_name || "",
            last_name: dep.dependent_last_name || "",
            dob: dep.dependent_dob || "",
            relation: normalizeRelation(dep.dependent_relation),
            country_of_birth: birthCountry ? birthCountry.toString() : "",
            country_of_citizenship: citizenshipCountry
              ? citizenshipCountry.toString()
              : "",
            education: dep.education || "",
            academic_records: academicRecord
              ? {
                  program_name: academicRecord.program_name || "",
                  institution_name: academicRecord.institution_name || "",
                  graduation_year: academicRecord.graduation_year || "",
                  grade: academicRecord.grade || "",
                  country:
                    academicRecord.country?.id || academicRecord.country || "",
                  state: academicRecord.state || "",
                  city: academicRecord.city || "",
                  zip_code: academicRecord.zip_code || "",
                  address: academicRecord.address || "",
                }
              : {
                  program_name: "",
                  institution_name: "",
                  graduation_year: "",
                  grade: "",
                  country: "",
                  state: "",
                  city: "",
                  zip_code: "",
                  address: "",
                },
            visa_records: dep.visa_records,
          };
        }),

        // Main Applicant - Priority: onBoarding.employee > profile
        firstName: employee?.first_name || profile?.first_name || "",
        middleName: employee?.middle_name || profile?.middle_name || "",
        lastName: employee?.last_name || profile?.last_name || "",
        dob:
          employee?.dob || profile?.dob || eligibilityData?.employee?.dob || "",
        gender: normalizeGender(employee?.gender || profile?.gender),
        countryOfBirth:
          employee?.birth_country?.id ||
          employee?.birth_country ||
          eligibilityData?.employee?.birth_country ||
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
          employeeAddress?.current_country ||
          eligibilityData?.employee?.employee_address?.current_country ||
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

        // Academic Information
        hasFormalEducation: onBoarding?.has_formal_education ?? false,
        ...academicFields,

        // English Language Proficiency
        writing: getEnglishProficiencyHelper(
          "writing",
          onBoarding,
          eligibilityData,
        ),
        listening: getEnglishProficiencyHelper(
          "listening",
          onBoarding,
          eligibilityData,
        ),
        reading: getEnglishProficiencyHelper(
          "reading",
          onBoarding,
          eligibilityData,
        ),
        speaking: getEnglishProficiencyHelper(
          "speaking",
          onBoarding,
          eligibilityData,
        ),

        // Past Work Experience
        ...workFields,

        // Marital Status
        maritalStatus: (() => {
          const normalized = normalizeMaritalStatus(
            maritalStatus?.legally_married,
            maritalStatus?.marital_status,
          );
          console.log("🔍 Setting maritalStatus to:", normalized);
          // ⚠️ TEMPORARY: Fallback to localStorage if backend returns null
          const fallback =
            normalized ||
            localStorage.getItem(`maritalStatus_${profile?.id}`) ||
            "";
          console.log("💾 Using maritalStatus value:", fallback);
          return fallback;
        })(),
        clarifyMaritalStatus:
          maritalStatus?.legally_married_if_others ||
          maritalStatus?.legally_married_if_d_w_s ||
          localStorage.getItem(`clarifyMaritalStatus_${profile?.id}`) ||
          "",
        countryOfMarriage:
          maritalStatus?.legally_married_if_yes_country ||
          maritalStatus?.country ||
          localStorage.getItem(`countryOfMarriage_${profile?.id}`) ||
          "",
        dateOfMarriage:
          maritalStatus?.legally_married_if_yes_date_of_marriage ||
          localStorage.getItem(`dateOfMarriage_${profile?.id}`) ||
          "",

        // Emergency Contact
        emergencyFirstName: emergencyContact?.eci_first_name || "",
        emergencyMiddleName: emergencyContact?.eci_middle_name || "",
        emergencyLastName: emergencyContact?.eci_last_name || "",
        emergencyPhone: emergencyContact?.eci_phone || "",
        degreeOfKinship: emergencyContact?.eci_degree_of_kinship || "",
        degreeOfKinshipOther:
          emergencyContact?.eci_degree_of_kinship_other || "",
        emergencyAddress: emergencyContact?.eci_address || "",

        // Immigration History
        hasImmigrationHistory: onBoarding?.has_immigration_history ?? false,
        types: immigrationHistory?.immigration_type || "",
        beenToUsa: immigrationHistory?.been_to_usa || "No",
        socialSecurity: immigrationHistory?.ever_had_ssn || "No",
        socialSecurityNumber: immigrationHistory?.ssn_number || "",
        inUsaApplicant: immigrationHistory?.employee_in_usa || "No",
        applicantName: immigrationHistory?.employee_in_usa_if_yes_who || "",
        inUsaDependent: immigrationHistory?.dependents_in_usa || "No",
        dependentName: immigrationHistory?.dependents_in_usa_if_yes_who || "",
        i94Number: immigrationHistory?.recent_i94_number || "",

        // Visa Rejection
        employee_visa_rejected: employeeRejection ? "Yes" : "No",
        visa_rejections_employee_first_name:
          employeeRejection?.rejection_first_name || "",
        visa_rejections_employee_middle_name:
          employeeRejection?.rejection_middle_name || "",
        visa_rejections_employee_last_name:
          employeeRejection?.rejection_last_name || "",
        employee_visa_type: employeeRejection?.rejection_visa || "",
        employee_rejection_reason: employeeRejection?.rejection_reason || "",
        employee_rejection_date: employeeRejection?.rejection_date || "",

        dependents_visa_rejected: dependentRejection ? "Yes" : "No",
        visa_rejections_dependent_first_name:
          dependentRejection?.rejection_first_name || "",
        visa_rejections_dependent_middle_name:
          dependentRejection?.rejection_middle_name || "",
        visa_rejections_dependent_last_name:
          dependentRejection?.rejection_last_name || "",
        dependent_visa_type: dependentRejection?.rejection_visa || "",
        dependent_rejection_reason: dependentRejection?.rejection_reason || "",
        dependent_rejection_date: dependentRejection?.rejection_date || "",

        // Immigration Incidents
        e_overstayed_usa_visa_i94_employee:
          immigrationIncidents?.e_overstayed_usa_visa_i94_employee?.toLowerCase() ||
          "no",
        e_overstayed_usa_visa_employee_if_yes_from:
          immigrationIncidents?.e_overstayed_usa_visa_employee_if_yes_from ||
          "",
        e_overstayed_usa_visa_employee_if_yes_to:
          immigrationIncidents?.e_overstayed_usa_visa_employee_if_yes_to || "",
        e_overstayed_usa_visa_i94_dependents:
          immigrationIncidents?.e_overstayed_usa_visa_i94_dependents?.toLowerCase() ||
          "no",
        e_overstayed_usa_visa_i94_dependents_if_yes_who:
          immigrationIncidents?.e_overstayed_usa_visa_i94_dependents_if_yes_who ||
          "",
        e_overstayed_usa_visa_i94_dependents_from:
          immigrationIncidents?.e_overstayed_usa_visa_i94_dependents_from || "",
        e_overstayed_usa_visa_i94_dependents_to:
          immigrationIncidents?.e_overstayed_usa_visa_i94_dependents_to || "",
        eb_unlawfully_present_usa_employee:
          immigrationIncidents?.eb_unlawfully_present_usa_employee?.toLowerCase() ||
          "no",
        eb_unlawfully_present_usa_employee_from:
          immigrationIncidents?.eb_unlawfully_present_usa_employee_from || "",
        eb_unlawfully_present_usa_employee_to:
          immigrationIncidents?.eb_unlawfully_present_usa_employee_to || "",
        eb_unlawfully_present_usa_dependents:
          immigrationIncidents?.eb_unlawfully_present_usa_dependents?.toLowerCase() ||
          "no",
        eb_unlawfully_present_usa_dependents_if_yes_who:
          immigrationIncidents?.eb_unlawfully_present_usa_dependents_if_yes_who ||
          "",
        eb_unlawfully_present_usa_dependents_from:
          immigrationIncidents?.eb_unlawfully_present_usa_dependents_from || "",
        eb_unlawfully_present_usa_dependents_to:
          immigrationIncidents?.eb_unlawfully_present_usa_dependents_to || "",
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
          condition: record.inadmissibilities_condition_name || "",
          doctor_first_name: record.inadmissibilities_doctor_first_name || "",
          doctor_middle_name: record.inadmissibilities_doctor_middle_name || "",
          doctor_last_name: record.inadmissibilities_doctor_last_name || "",
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
  }, [profile, onBoarding, eligibilityData, methods]);
};

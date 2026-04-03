import { toast } from "sonner";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import {
  saveProcessingInformation,
  saveMainApplicantDetail,
  saveAcademicInformation,
  saveWorkExperiences,
  saveEnglishLanguage,
  saveEmergencyContact,
  saveVisaRejection,
  saveImmigrationIncident,
  saveCriminalRecords,
  saveInadmissibility,
  saveHealth,
  saveFinalSubmit,
} from "src/api/onboardingform";
import {
  transformProcessingInformationData,
  transformMainApplicantData,
  transformAcademicData,
  transformWorkExperienceData,
  transformEnglishProficiencyData,
  transformEmergencyContactData,
  transformVisaRejectionData,
  transformImmigrationIncidentData,
  transformCriminalRecordData,
  transformInadmissibilityData,
  transformHealthData,
} from "src/utils/onboarding-transformers";

/**
 * Custom hook for saving onboarding step data
 * @param {Object} methods - React Hook Form methods
 * @param {Object} profile - User profile data
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} fetchOnBoardingRequest - Redux action to refresh onboarding data
 * @param {number} selectedVacancyId - Selected vacancy ID for redirect
 * @returns {Function} saveCurrentStepData function
 */
export const useOnboardingSave = (
  methods,
  profile,
  dispatch,
  fetchOnBoardingRequest,
  selectedVacancyId
) => {
  const router = useRouter();
  /**
   * Save current step data to backend
   * @param {number} stepIndex - The step index to save
   * @returns {Promise<boolean>} Success status
   */
  const saveCurrentStepData = async (stepIndex) => {
    console.log("💾 Saving step:", stepIndex);
    const formData = methods.getValues();
    console.log("💾 Form data for step:", formData);

    try {
      switch (stepIndex) {
        case 0: {
          // Processing Information
          console.log("💾 Calling saveProcessingInformation API");
          const transformedData = transformProcessingInformationData(formData);
          console.log("💾 Transformed data:", transformedData);
          await saveProcessingInformation(transformedData);
          console.log("✅ Processing Information saved successfully");
          break;
        }
        case 1:
          await saveMainApplicantDetail(
            transformMainApplicantData(formData, profile),
          );
          break;
        case 2:
          await saveAcademicInformation(transformAcademicData(formData));
          break;
        case 3:
          await saveWorkExperiences(transformWorkExperienceData(formData));
          break;
        case 4:
          await saveEnglishLanguage(transformEnglishProficiencyData(formData));
          break;
        case 5:
          await saveEmergencyContact(transformEmergencyContactData(formData));
          break;
        case 6:
          await saveVisaRejection(transformVisaRejectionData(formData));
          break;
        case 7:
          await saveImmigrationIncident(
            transformImmigrationIncidentData(formData),
          );
          break;
        case 8:
          await saveCriminalRecords(transformCriminalRecordData(formData));
          break;
        case 9:
          await saveInadmissibility(transformInadmissibilityData(formData));
          break;
        case 10: {
          await saveHealth(transformHealthData(formData));
          const response = await saveFinalSubmit({
            is_draft: false,
            status: "Pending",
            agree_to_terms: formData.agree_to_terms,
          });
          toast.success(response.message || "Form submitted successfully!");
          // Redirect to plan page after successful submission
          setTimeout(() => {
            router.push(paths.dashboard.plan(selectedVacancyId));
          }, 1000);
          break;
        }
        default:
          break;
      }

      console.log(`✅ Step ${stepIndex} saved successfully`);

      // Refresh onboarding data from backend to update form with latest data
      dispatch(fetchOnBoardingRequest());

      return true;
    } catch (error) {
      console.error(`❌ Failed to save step ${stepIndex}:`, error);
      console.error("❌ Error response:", error.response?.data);
      return false;
    }
  };

  return { saveCurrentStepData };
};

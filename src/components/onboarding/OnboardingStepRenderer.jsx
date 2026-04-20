import { ProcessingInformation } from "src/components/onboarding/forms/ProcessingInformation";
import { MainApplicantDetails } from "src/components/onboarding/forms/MainApplicantDetails";
import { AcademicInformation } from "src/components/onboarding/forms/AcademicInformation";
import { EnglishLanguageProficiency } from "src/components/onboarding/forms/Englishlanguage";
import { PastWorkExperiences } from "src/components/onboarding/forms/PastWorkExperiences";
import { EmergencyContactInformation } from "src/components/onboarding/forms/EmergencyContactInformation";
import { Inadmissibility } from "src/components/onboarding/forms/Inadmissibility";
import { Health } from "src/components/onboarding/forms/Health";
import { VisaRejection } from "src/components/onboarding/forms/VisaRejection";
import { ImmigrationIncident } from "src/components/onboarding/forms/ImmigrationIncident";
import { CriminalRecord } from "src/components/onboarding/forms/CriminalRecords";

/**
 * OnboardingStepRenderer component
 * Renders the appropriate form based on current step
 * @param {number} currentStep - Current step index
 * @param {Object} vacancyDetail - Vacancy details
 * @param {Object} country - Country data
 * @param {number} selectedVacancyId - Selected vacancy ID
 * @param {Array} dependents - List of dependents
 */
export const OnboardingStepRenderer = ({
  currentStep,
  vacancyDetail,
  country,
  selectedVacancyId,
  dependents = [],
}) => {
  switch (currentStep) {
    case 0:
      return <ProcessingInformation vacancyData={vacancyDetail} vacancyId={selectedVacancyId} />;
    case 1:
      return <MainApplicantDetails country={country} />;
    case 2:
      return <AcademicInformation country={country} />;
    case 3:
      return <PastWorkExperiences />;
    case 4:
      return <EnglishLanguageProficiency />;
    case 5:
      return <EmergencyContactInformation />;
    case 6:
      return <VisaRejection vacancyId={selectedVacancyId} />;
    case 7:
      return <ImmigrationIncident vacancyId={selectedVacancyId} />;
    case 8:
      return <CriminalRecord dependents={dependents} />;
    case 9:
      return <Inadmissibility />;
    case 10:
      return <Health />;
    default:
      return null;
  }
};

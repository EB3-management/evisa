/**
 * Helper functions for onboarding form data manipulation
 */

/**
 * Normalize English proficiency levels
 * Converts "Advance" to "Advanced" for consistency
 */
export const normalizeEnglishLevel = (level) => {
  if (!level) return "";
  return level === "Advance" ? "Advanced" : level;
};

/**
 * Get English proficiency with fallback
 * Priority: onBoarding > eligibilityData
 */
export const getEnglishProficiency = (skill, onBoarding, eligibilityData) => {
  const onBoardingValue = onBoarding?.english_language_proficiency?.[skill];
  const eligibilityValue =
    eligibilityData?.employee?.english_language_proficiency?.[skill];

  return normalizeEnglishLevel(onBoardingValue || eligibilityValue);
};

/**
 * Normalize gender value
 * Ensures proper capitalization and validates against allowed options
 */
export const normalizeGender = (gender) => {
  if (!gender) return "";
  const normalized =
    gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  // Ensure it matches one of the valid options
  return ["Male", "Female", "Other"].includes(normalized) ? normalized : "";
};

/**
 * Normalize marital status from API to form
 * Converts API values to form values
 */
export const normalizeMaritalStatus = (legallyMarried, maritalStatusField) => {
  const statusValue = legallyMarried || maritalStatusField;

  console.log(
    "🔄 normalizeMaritalStatus input - legally_married:",
    legallyMarried,
    "| marital_status:",
    maritalStatusField,
  );

  if (!statusValue) return "";
  if (statusValue === "Yes") return "Married";
  if (statusValue === "No") return "Unmarried";
  // Return as is for Divorced, Widow, Separated, Others
  return statusValue;
};

/**
 * Capitalize first letter of relation to match Select options
 */
export const normalizeRelation = (relation) => {
  if (!relation) return "";
  return relation.charAt(0).toUpperCase() + relation.slice(1).toLowerCase();
};

/**
 * Convert "yes"/"no" to "Yes"/"No"
 */
export const capitalizeYesNo = (value) => {
  if (value === "yes") return "Yes";
  if (value === "no") return "No";
  return "No"; // default
};

/**
 * Check if academic level exists
 */
export const hasAcademicLevel = (academicRecords, programName) =>
  academicRecords.some(
    (record) =>
      record.program_name?.toLowerCase() === programName.toLowerCase(),
  );

/**
 * Get academic record data
 */
export const getAcademicRecord = (academicRecords, programName) =>
  academicRecords.find(
    (record) =>
      record.program_name?.toLowerCase() === programName.toLowerCase(),
  ) || {};

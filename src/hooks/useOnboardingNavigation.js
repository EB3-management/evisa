import { ONBOARDING_STEPS } from "src/constant/onboardingSteps";

/**
 * Custom hook for onboarding navigation logic
 * @param {number} currentStep - Current step index
 * @param {Function} setCurrentStep - Function to set current step
 * @param {Set} completedSteps - Set of completed step indices
 * @param {Function} setCompletedSteps - Function to update completed steps
 * @param {Object} methods - React Hook Form methods
 * @param {Function} saveCurrentStepData - Function to save current step data
 * @param {Function} clearPersistence - Function to clear localStorage
 * @param {Function} handleSubmit - React Hook Form handleSubmit
 * @param {Function} onSubmit - Final submission callback
 * @returns {Object} Navigation functions
 */
export const useOnboardingNavigation = (
  currentStep,
  setCurrentStep,
  completedSteps,
  setCompletedSteps,
  methods,
  saveCurrentStepData,
  clearPersistence,
  handleSubmit,
  onSubmit,
) => {
  /**
   * Navigate to next step
   */
  const goNext = async () => {
    // Validate current step
    console.log("🔍 Validating step:", currentStep);
    console.log("🔍 Form values before validation:", methods.getValues());

    const isValid = await methods.trigger();

    if (!isValid) {
      console.log("❌ Validation failed for current step");
      console.log("❌ Validation errors:", methods.formState.errors);
      console.log("❌ Current form values:", methods.getValues());
      return;
    }

    console.log("✅ Validation passed");

    // Save current step data
    const saved = await saveCurrentStepData(currentStep);

    if (!saved) {
      console.log("❌ Failed to save current step data");
      return;
    }

    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, currentStep]));

    // Move to next step or submit
    const nextStep = currentStep + 1;

    if (nextStep < ONBOARDING_STEPS.length) {
      setCurrentStep(nextStep);
    } else {
      // Final step completed - submit the form
      console.log("🎉 All steps completed, submitting form");
      handleSubmit(onSubmit)();
      // Clear localStorage after final submission
      clearPersistence();
    }
  };

  /**
   * Navigate to previous step
   */
  const goPrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
    }
  };

  /**
   * Handle sidebar navigation
   * @param {number} targetStep - Target step index to navigate to
   */
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

  return {
    goNext,
    goPrev,
    handleSidebarNavigation,
  };
};

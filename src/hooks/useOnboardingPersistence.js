import { useEffect, useState } from "react";

/**
 * Custom hook for persisting onboarding state to localStorage
 * Manages user-specific current step and completed steps
 * @param {Object} profile - User profile data
 * @returns {Object} Persistence state and setters
 */
export const useOnboardingPersistence = (profile) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastUserId, setLastUserId] = useState(null);

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
  }, [profile?.id, isInitialized, lastUserId, currentStep]);

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

  /**
   * Clear user-specific localStorage
   */
  const clearPersistence = () => {
    if (profile?.id) {
      const userId = profile.id.toString();
      localStorage.removeItem(`onboarding_current_step_${userId}`);
      localStorage.removeItem(`onboarding_completed_steps_${userId}`);
      console.log("🧹 Cleared localStorage for user:", userId);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps,
    isInitialized,
    clearPersistence,
  };
};

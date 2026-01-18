import { useEffect, useState, useMemo } from "react";
import { fetchOnboardingAccess } from "src/api/onboardingaccess";

export function useOnboardingAccess() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAccess = async () => {
    try {
      setLoading(true);
      const result = await fetchOnboardingAccess();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccess();
  }, []);

  const memoizedValue = useMemo(
    () => ({
      onboardingAccess: data,
      onboardingAccessLoading: loading,
      onboardingAccessError: error,
      refreshAccess: loadAccess,
      // Helper properties
      isEmailVerified: data?.email_verified || false,
      permissions: data?.permissions || {},
      progress: data?.progress || {},
      currentStep: data?.current_step || null,
      nextAction: data?.next_action || null,
    }),
    [data, loading, error],
  );

  return memoizedValue;
}

// Helper function to check if a feature is accessible
export const canAccessFeature = (permissions, featureName) =>
  permissions?.[featureName]?.allowed || false;

// Helper function to get access denial reason
export const getAccessReason = (permissions, featureName) =>
  permissions?.[featureName]?.reason || null;

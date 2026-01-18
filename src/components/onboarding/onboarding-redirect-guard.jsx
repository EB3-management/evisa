import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Box, CircularProgress } from "@mui/material";
import { useOnboardingAccess } from "src/hooks/useOnBoardingAccess";

/**
 * OnboardingRedirectGuard
 * Redirects users based on their onboarding progress:
 * - If eligibility_form_status is "Not Filled" -> redirect to eligibility form page
 * - Otherwise -> allow access to dashboard and other routes
 */
export function OnboardingRedirectGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { onboardingAccess, onboardingAccessLoading, progress } =
    useOnboardingAccess();

  useEffect(() => {
    // Wait for data to load
    if (onboardingAccessLoading || !onboardingAccess) {
      return;
    }

    const currentPath = location.pathname;
    const eligibilityFormPath = "/auth/register-step-form";
    const dashboardPath = "/dashboard";
    console.log("thi sis value of onbaording guard", progress);
    // If eligibility form status is "Not Filled", redirect to eligibility form page
    if (progress?.eligibility_form_status === "Not Filled") {
      if (!currentPath.includes(eligibilityFormPath)) {
        navigate(eligibilityFormPath, { replace: true });
      }
    } else {
      // If status is anything other than "Not Filled" (Approved, In Progress, etc.)
      // and user is on the eligibility form page, redirect to dashboard
      if (currentPath.includes(eligibilityFormPath)) {
        navigate(dashboardPath, { replace: true });
      }
    }
  }, [
    onboardingAccessLoading,
    onboardingAccess,
    progress,
    navigate,
    location.pathname,
  ]);

  // Show loading while checking
  if (onboardingAccessLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}

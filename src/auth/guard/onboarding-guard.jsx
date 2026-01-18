import { useEffect, useState } from "react";
import { useRouter } from "src/routes/hooks";
import { LoadingScreen } from "src/components/loading-screen";
import { Alert, Container, Typography } from "@mui/material";
import { useOnboardingAccess } from "src/api/onboardingaccess";

// ----------------------------------------------------------------------

export function OnboardingGuard({ children }) {
  const router = useRouter();
  const { data, loading, error } = useOnboardingAccess();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading && data) {
      // Check 1: Email verification
      if (!data.email_verified) {
        console.warn("Email not verified, redirecting to verification page");
        router.replace("/auth/verify-email");
        return;
      }

      // Check 2: Admin approval (lead must exist and be sent to onboarding)
      const isApproved =
        data.lead_exists && data.lead_status === "Sent_to_Onboarding";

      if (!isApproved) {
        console.warn(
          "User not approved by admin, redirecting to thank you page"
        );
        router.replace("/dashboard/thank-you");
        return;
      }

      // Check 3: If blocked for any reason
      if (data.blocked_reason) {
        console.warn("User blocked:", data.blocked_reason);
        router.replace("/dashboard/blocked");
        return;
      }

      // All checks passed
      setChecked(true);
    }
  }, [data, loading, router]);

  // Show loading while checking
  if (loading || !checked) {
    return <LoadingScreen />;
  }

  // Show error if API failed
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Failed to load access permissions
          </Typography>
          <Typography variant="body2">
            {error.message || "Please try refreshing the page"}
          </Typography>
        </Alert>
      </Container>
    );
  }

  // All good, render protected content
  return <>{children}</>;
}

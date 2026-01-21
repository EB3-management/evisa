import { Navigate } from "react-router";
import {
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  Button,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import {
  useOnboardingAccess,
  canAccessFeature,
  getAccessReason,
} from "src/hooks/useOnBoardingAccess";
import { Iconify } from "src/components/iconify";

export function PermissionGuard({
  children,
  feature,
  redirectTo = "/dashboard",
}) {
  const {
    onboardingAccess,
    onboardingAccessLoading,
    onboardingAccessError,
    isEmailVerified,
    permissions,
  } = useOnboardingAccess();

  // Loading state
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

  // Error state
  if (onboardingAccessError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">
          <AlertTitle>Error Loading Permissions</AlertTitle>
          Failed to load your access permissions. Please try refreshing the
          page.
        </Alert>
      </Container>
    );
  }

  // No data
  if (!onboardingAccess) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check email verification first
  if (!isEmailVerified) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "warning.lighter",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <Iconify icon="mdi:email-alert" width={40} color="warning.main" />
          </Box>
          <Typography variant="h4" gutterBottom>
            Email Verification Required
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Please verify your email address to access this feature. Check your
            inbox for the verification link.
          </Typography>
          <Alert severity="info" sx={{ mt: 3 }}>
            <AlertTitle>Didn&apos;t receive the email?</AlertTitle>
            Check your spam folder or contact support for assistance.
          </Alert>
        </Paper>
      </Container>
    );
  }

  // Check feature permission
  if (feature) {
    const hasAccess = canAccessFeature(permissions, feature);
    const reason = getAccessReason(permissions, feature);

    if (!hasAccess) {
      return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "error.lighter",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <Iconify icon="mdi:lock" width={40} color="error.main" />
            </Box>
            <Typography variant="h4" gutterBottom>
              Access Restricted
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {reason ||
                "You don&apos;t have permission to access this feature yet."}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:web" />}
              href="https://www.abroadworld.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 2 }}
            >
              Go to Website
            </Button>
            <Button variant="text" href={redirectTo} sx={{ mt: 2, ml: 2 }}>
              Go to Dashboard
            </Button>
          </Paper>
        </Container>
      );
    }
  }

  // All checks passed
  return <>{children}</>;
}

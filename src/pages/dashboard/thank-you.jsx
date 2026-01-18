import { Helmet } from "react-helmet-async";
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { useRouter } from "src/routes/hooks";
import { useOnboardingAccess } from "src/api/onboardingaccess";

// ----------------------------------------------------------------------

export default function ThankYouPage() {
  const router = useRouter();
  const { data } = useOnboardingAccess();

  const handleLogout = () => {
    // Implement your logout logic
    router.push("/auth/login");
  };

  return (
    <>
      <Helmet>
        <title>Thank You - Pending Approval</title>
      </Helmet>

      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
          }}
        >
          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ p: 5, textAlign: "center" }}>
              <Iconify
                icon="material-symbols:check-circle-outline"
                sx={{
                  fontSize: 80,
                  color: "success.main",
                  mb: 3,
                }}
              />

              <Typography variant="h4" gutterBottom>
                Thank You for Registering!
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ mt: 2 }}
              >
                Your registration has been successfully submitted.
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph>
                Your account is currently pending approval from our admin team.
                You will receive an email notification once your account has
                been approved.
              </Typography>

              {data?.email_verified && (
                <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
                  ✓ Your email has been verified
                </Typography>
              )}

              <Stack spacing={2} sx={{ mt: 4 }}>
                <Typography variant="h6" color="primary">
                  What happens next?
                </Typography>

                <Stack spacing={1} sx={{ textAlign: "left" }}>
                  <Typography variant="body2">
                    • Our admin team will review your registration
                  </Typography>
                  <Typography variant="body2">
                    • You&apos;ll receive an email once approved (usually within
                    24-48 hours)
                  </Typography>
                  <Typography variant="body2">
                    • After approval, you can access your dashboard and start
                    the onboarding process
                  </Typography>
                </Stack>
              </Stack>

              <Box sx={{ mt: 4 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleLogout}
                  fullWidth
                >
                  Log Out
                </Button>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 3, display: "block" }}
              >
                If you have any questions, please contact our support team.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

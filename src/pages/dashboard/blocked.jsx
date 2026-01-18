import { Helmet } from "react-helmet-async";
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Stack,
  Button,
  Alert,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { useRouter } from "src/routes/hooks";
import { useOnboardingAccess } from "src/api/onboardingaccess";

// ----------------------------------------------------------------------

export default function BlockedPage() {
  const router = useRouter();
  const { data } = useOnboardingAccess();

  const handleLogout = () => {
    // Implement your logout logic
    router.push("/auth/login");
  };

  const handleContactSupport = () => {
    // Implement your contact support logic
    window.location.href = "mailto:support@abroadworld.com";
  };

  return (
    <>
      <Helmet>
        <title>Account Blocked</title>
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
                icon="material-symbols:block"
                sx={{
                  fontSize: 80,
                  color: "error.main",
                  mb: 3,
                }}
              />

              <Typography variant="h4" gutterBottom>
                Access Restricted
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ mt: 2 }}
              >
                Your account access has been temporarily restricted.
              </Typography>

              {data?.blocked_reason && (
                <Alert severity="warning" sx={{ mt: 3, textAlign: "left" }}>
                  <Typography variant="body2">
                    <strong>Reason:</strong> {data.blocked_reason}
                  </Typography>
                </Alert>
              )}

              <Stack spacing={2} sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleContactSupport}
                  fullWidth
                >
                  Contact Support
                </Button>

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleLogout}
                  fullWidth
                >
                  Log Out
                </Button>
              </Stack>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 3, display: "block" }}
              >
                If you believe this is an error, please contact our support team
                for assistance.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

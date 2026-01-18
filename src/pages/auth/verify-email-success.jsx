import { useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { toast } from "src/components/snackbar";
import { useRouter } from "src/routes/hooks";

export default function VerifyEmailSuccessPage() {
  const router = useRouter();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if verification was successful from query params
    const status = searchParams.get("status");
    const message = searchParams.get("message");

    if (status === "success") {
      toast.success(message || "Email verified successfully!");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else if (status === "error") {
      toast.error(message || "Email verification failed!");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 3000);
    } else {
      // No status param, redirect immediately
      router.push("/dashboard");
    }
  }, [router, searchParams]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "success.lighter",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <Iconify icon="mdi:check-circle" width={40} color="success.main" />
        </Box>
        <Typography variant="h4" gutterBottom>
          Email Verified!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Your email has been successfully verified. Redirecting to dashboard...
        </Typography>
        <CircularProgress size={24} sx={{ mt: 2 }} />
      </Paper>
    </Container>
  );
}

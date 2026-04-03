import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { useRouter } from "src/routes/hooks";
import { resetPassword } from "src/api/auth";
import { useSnackbar } from "src/components/snackbar";

// ----------------------------------------------------------------------

export function ResetPassword() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.new_password !== formData.new_password_confirmation) {
      setError("New password and confirmation password do not match");
      return;
    }

    // Validate password strength (optional)
    if (formData.new_password.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(formData);
      
      if (response.success) {
        enqueueSnackbar(response.message || "Password changed successfully", {
          variant: "success",
        });
        // Clear form
        setFormData({
          old_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
        // Optionally redirect after success
        // router.push('/dashboard');
      }
    } catch (err) {
      const errorMessage = err?.message || "Failed to change password. Please try again.";
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Stack
          spacing={2}
          sx={{
            mb: { xs: 2, sm: 2.5, md: 3 },
            px: { xs: 0, sm: 1 },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: "secondary.main",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
              fontWeight: 600,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Reset Password
          </Typography>
        </Stack>

        {/* Content Section */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3, md: 4, lg: 5 },
            borderRadius: { xs: 1, sm: 2 },
            bgcolor: "background.paper",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" onClose={() => setError("")}>
                  {error}
                </Alert>
              )}
              
              <TextField
                fullWidth
                name="old_password"
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.old_password}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        edge="end"
                      >
                        <Iconify
                          icon={
                            showCurrentPassword
                              ? "solar:eye-bold"
                              : "solar:eye-closed-bold"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                name="new_password"
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                value={formData.new_password}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        <Iconify
                          icon={
                            showNewPassword
                              ? "solar:eye-bold"
                              : "solar:eye-closed-bold"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                name="new_password_confirmation"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.new_password_confirmation}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        <Iconify
                          icon={
                            showConfirmPassword
                              ? "solar:eye-bold"
                              : "solar:eye-closed-bold"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
                disabled={loading}
                sx={{
                  mt: 2,
                }}
              >
                {loading ? "Changing Password..." : "Reset Password"}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

//

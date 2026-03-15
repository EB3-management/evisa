import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Typography,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { Iconify } from "src/components/iconify";
import { useAppSelector } from "src/redux/hooks";
import { Form, Field } from "src/components/hook-form";
import { useState } from "react";
import { emailLinkSend, emailVerify } from "src/api";

// ----------------------------------------------------------------------

export const VerifyEmailSchema = zod.object({
  new_email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
});

// ----------------------------------------------------------------------

export function VerifyEmailView() {
  const employee = useAppSelector((state) => state.auth.employee);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    type: "success", // 'success' or 'error'
    title: "",
    message: "",
  });

  const defaultValues = {
    new_email: employee?.email || "",
  };

  const methods = useForm({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const currentEmail = watch("new_email");
  const isEmailChanged = currentEmail !== employee?.email;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("Email to verify:", data.new_email);

      let response;

      // Check if email has been changed
      if (isEmailChanged) {
        // Call email change API with new email
        response = await emailVerify({ new_email: data.new_email });

        setDialogContent({
          type: "success",
          title: "Email Change Verification Sent!",
          message: `We've sent a verification link to ${data.new_email}. Please check your inbox and spam folder to verify your new email address.`,
        });
      } else {
        // Call resend verification link API (no body needed)
        response = await emailLinkSend();

        setDialogContent({
          type: "success",
          title: "Verification Link Sent!",
          message: `We've resent the verification link to ${data.new_email}. Please check your inbox and spam folder.`,
        });
      }

      setOpenDialog(true);
    } catch (error) {
      // Show error dialog
      setDialogContent({
        type: "error",
        title: "Failed to Send Email",
        message:
          error?.message ||
          "Something went wrong. Please try again or contact support.",
      });
      setOpenDialog(true);
    }
  });
  console.log("this is employee", employee?.email);
  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            py: 5,
          }}
        >
          {/* Email Icon */}
          <Box
            sx={{
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              bgcolor: "primary.lighter",
              mb: 3,
            }}
          >
            <Iconify
              icon="solar:letter-opened-bold-duotone"
              width={80}
              sx={{ color: "primary.main" }}
            />
          </Box>

          {/* Title */}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Verify Your Email Address
          </Typography>

          {/* Description */}
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            We&apos;ve sent a verification email to:
          </Typography>

          {/* Email Input */}
          <Field.Text
            name="new_email"
            placeholder="Enter your email address"
            type="email"
            sx={{
              maxWidth: 500,
              mb: 3,
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "background.paper",
                fontWeight: 600,
                color: "primary.main",
                textAlign: "center",
                "& input": {
                  textAlign: "center",
                },
              },
            }}
          />

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 4, maxWidth: 500 }}
          >
            Please check your inbox and click on the verification link to
            activate your account.
          </Typography>

          {/* Info Alert */}
          <Stack spacing={2} sx={{ width: "100%", maxWidth: 500 }}>
            <Alert severity="info" sx={{ borderRadius: 2, textAlign: "left" }}>
              <Typography variant="body2">
                <strong>Didn&apos;t receive the email?</strong>
                <br />
                Check your spam folder or click the button below to resend.
              </Typography>
            </Alert>

            {/* Resend Button */}
            <Button
              type="submit"
              variant="outlined"
              size="large"
              disabled={isSubmitting}
              startIcon={<Iconify icon="solar:letter-bold-duotone" />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                py: 1.5,
              }}
            >
              {isSubmitting ? "Sending..." : "Send Verification Email"}
            </Button>

            {/* Back to Sign In Link */}
            <Button
              variant="text"
              component={RouterLink}
              href={paths.auth.signIn}
              sx={{
                textTransform: "none",
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: "transparent",
                },
              }}
            >
              Back to Sign In
            </Button>
          </Stack>
        </Box>
      </Form>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              bgcolor:
                dialogContent.type === "success"
                  ? "success.lighter"
                  : "error.lighter",
              mx: "auto",
              mb: 2,
            }}
          >
            <Iconify
              icon={
                dialogContent.type === "success"
                  ? "solar:check-circle-bold"
                  : "solar:close-circle-bold"
              }
              width={48}
              sx={{
                color:
                  dialogContent.type === "success"
                    ? "success.main"
                    : "error.main",
              }}
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {dialogContent.title}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {dialogContent.message}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 4,
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

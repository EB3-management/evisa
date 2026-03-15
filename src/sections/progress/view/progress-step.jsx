
import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";
import {
  Box,
  Chip,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { useState } from "react";

// ----------------------------------------------------------------------

const steps = [
  { label: "Contract Verification", icon: "mdi:check-circle-outline" },
  { label: "Documents Submission", icon: "mdi:upload-outline" },
  { label: "Embassy Submission", icon: "mdi:office-building-outline" },
  { label: "Visa Status", icon: "mdi:passport-biometric" },
];

export function ProgressStatus() {
  const [activeStep, setActiveStep] = useState(1);
  const router = useRouter();

  return (
    <DashboardContent maxWidth="xl">
      <Box
        sx={{
          bgcolor: "#ffffffff",
          minHeight: "100vh",
          p: { xs: 3, md: 6 },
          color: "#fff",
        }}
      >
        {/* Stepper */}
        <Stepper
          alternativeLabel
          activeStep={1}
          connector={
            <StepConnector
              sx={{
                top: 20,
                left: "calc(-50% + 20px)",
                right: "calc(50% + 20px)",
                "& .MuiStepConnector-line": {
                  borderColor: "#5DC8B9",
                  borderTopWidth: 2,
                },
              }}
            />
          }
          sx={{
            mb: 6,
            "& .MuiStepLabel-label": {
              color: "#114B46",
              fontSize: 14,
              fontWeight: 500,
              mt: 1,
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: "#2BA597",
              fontWeight: 600,
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: "#4F8E88",
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={index} completed={index < 1}>
              <StepLabel
                sx={{ cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor:
                        index === activeStep
                          ? "#2BA597"
                          : index < activeStep
                          ? "#5DC8B9"
                          : "#ffffff",
                      border: index > activeStep ? "2px solid #2BA597" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 1,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {index < activeStep ? (
                      <Iconify
                        icon="mdi:check"
                        width={22}
                        height={22}
                        color="#ffffff"
                      />
                    ) : (
                      <Iconify
                        icon={step.icon}
                        width={22}
                        height={22}
                        color={index === activeStep ? "#ffffff" : "#2BA597"}
                      />
                    )}
                  </Box>
                )}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography>{step.label}</Typography>

                  {/* Conditionally render chip only for last step (Visa Status) */}
                  {step.label === "Visa Status" && (
                    <Chip
                      label="Pending"
                      size="small"
                      sx={{
                        mt: 0.5,
                        bgcolor: "#FFF4E5",
                        color: "#F57C00",
                        fontSize: 11,
                        fontWeight: 500,
                        height: 20,
                      }}
                    />
                  )}
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box textAlign="center" mb={5}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
          >
            Please regularly check your status here
          </Typography>
          <Typography color="text.secondary">
            You will be notified via email of any updates or changes.
          </Typography>
        </Box>
      </Box>
    </DashboardContent>
  );
}

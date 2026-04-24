import Grid from "@mui/material/Grid2";
import { DashboardContent } from "src/layouts/dashboard";
import { Iconify } from "src/components/iconify";
import {
  Box,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
  Card,
  Stack,
  Button,
  LinearProgress,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  AlertTitle,
  Alert,
  Avatar,
  Chip,
} from "@mui/material";
import { useGetVacancy, useGetAppliedVacancy } from "src/api/vacancy";
import { useRouter } from "src/routes/hooks";
import { useState, useEffect, useRef } from "react";
import { paths } from "src/routes/paths";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchProfileRequest } from "src/redux/actions";
import { useGetDashboard } from "src/api";
import { useNavigate } from "react-router";

// ----------------------------------------------------------------------

// Map visa status names to icons
const statusIcons = {
  DRAFT: "mdi:file-document-edit-outline",
  PERM_FILED: "mdi:file-send-outline",
  PERM_APPROVED: "mdi:file-check-outline",
  I140_FILED: "mdi:file-upload-outline",
  I140_APPROVED: "mdi:shield-check-outline",
  NVC_CASE_CREATED: "mdi:briefcase-outline",
  DOCUMENTARILY_QUALIFIED: "mdi:file-certificate-outline",
  INTERVIEW_SCHEDULED: "mdi:calendar-clock",
  VISA_APPROVED: "mdi:check-decagram",
  VISA_ISSUED: "mdi:passport",
  GREEN_CARD_ISSUED: "mdi:card-account-details",
};

// Format status name for display
const formatStatusName = (name) =>
  name
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

// Visa Status Mini Timeline Component (shows 3 statuses at a time)
const VisaStatusMiniTimeline = ({
  visaStatusList,
  currentVisaStatus,
  selectedVacancyId,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  if (!visaStatusList || visaStatusList.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
        <Typography variant="body2">No visa status data available</Typography>
      </Box>
    );
  }

  // Find current status index
  const currentIndex = visaStatusList.findIndex(
    (status) => status.id === currentVisaStatus?.id,
  );

  // Get 3 statuses: previous, current, next
  const startIndex = Math.max(0, currentIndex - 1);
  const displayStatuses = visaStatusList.slice(startIndex, startIndex + 3);

  return (
    <Box sx={{ minWidth: { xs: 600, sm: "auto" } }}>
      <Stepper
        alternativeLabel
        activeStep={displayStatuses.findIndex(
          (s) => s.id === currentVisaStatus?.id,
        )}
        connector={
          <StepConnector
            sx={{
              "& .MuiStepConnector-line": {
                borderColor: theme.palette.primary.main,
                borderTopWidth: 3,
              },
            }}
          />
        }
        sx={{
          "& .MuiStepLabel-label": {
            color: theme.palette.text.secondary,
            fontSize: { xs: 11, sm: 12, md: 14 },
            fontWeight: 500,
            mt: 1,
          },
          "& .MuiStepLabel-label.Mui-active": {
            color: theme.palette.primary.dark,
            fontWeight: 600,
            fontSize: { xs: 13, sm: 14, md: 16 },
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: theme.palette.success.main,
          },
        }}
      >
        {displayStatuses.map((status, index) => {
          const isCurrent = status.id === currentVisaStatus?.id;
          const isCompleted =
            visaStatusList.findIndex((s) => s.id === status.id) < currentIndex;
          const icon = statusIcons[status.name] || "mdi:check-circle";

          return (
            <Step key={status.id} completed={isCompleted}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    onClick={() => {
                      if (isCurrent) {
                        navigate(
                          `${paths.dashboard.visaStatus.root}?vacancyId=${selectedVacancyId}`,
                        );
                      }
                    }}
                    sx={{
                      width: isCurrent
                        ? { xs: 56, sm: 64 }
                        : { xs: 40, sm: 48 },
                      height: isCurrent
                        ? { xs: 56, sm: 64 }
                        : { xs: 40, sm: 48 },
                      borderRadius: "50%",
                      bgcolor: isCompleted
                        ? theme.palette.success.main
                        : isCurrent
                          ? theme.palette.primary.main
                          : "transparent",
                      border:
                        !isCompleted && !isCurrent
                          ? `3px solid ${theme.palette.divider}`
                          : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s",
                      boxShadow: isCompleted || isCurrent ? 3 : 0,
                      transform: isCurrent ? "scale(1.1)" : "scale(1)",
                      cursor: isCurrent ? "pointer" : "default",
                      "&:hover": isCurrent
                        ? {
                            transform: "scale(1.15)",
                            boxShadow: 4,
                          }
                        : {},
                    }}
                  >
                    {isCompleted ? (
                      <Iconify
                        icon="mdi:check-bold"
                        width={
                          isCurrent ? { xs: 28, sm: 32 } : { xs: 20, sm: 24 }
                        }
                        height={
                          isCurrent ? { xs: 28, sm: 32 } : { xs: 20, sm: 24 }
                        }
                        color={theme.palette.common.white}
                        sx={{ display: "flex" }}
                      />
                    ) : (
                      <Iconify
                        icon={icon}
                        width={
                          isCurrent ? { xs: 28, sm: 32 } : { xs: 20, sm: 24 }
                        }
                        height={
                          isCurrent ? { xs: 28, sm: 32 } : { xs: 20, sm: 24 }
                        }
                        color={
                          isCurrent
                            ? theme.palette.common.white
                            : theme.palette.text.disabled
                        }
                        sx={{ display: "flex" }}
                      />
                    )}
                  </Box>
                )}
              >
                <Box>{formatStatusName(status.name)}</Box>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {/* View All Button */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            console.log(
              "🔗 Navigating to Visa Status with Vacancy ID:",
              selectedVacancyId,
            );
            navigate(
              `${paths.dashboard.visaStatus.root}?vacancyId=${selectedVacancyId}`,
            );
          }}
          endIcon={<Iconify icon="mdi:arrow-right" />}
          sx={{ borderRadius: 2 }}
        >
          View Full Timeline
        </Button>
      </Box>
    </Box>
  );
};

const steps = [
  {
    label: "Eligibility",
    icon: "mdi:check-circle-outline",
    status: "eligibility",
  },
  {
    label: "Job Selection",
    icon: "mdi:briefcase-outline",
    status: "job_selection",
  },
  {
    label: "OnBoarding Form",
    icon: "mdi:file-document-outline",
    status: "onboarding_form",
  },
  { label: "Contract", icon: "mdi:file-document-outline", status: "contract" },
  { label: "Payment", icon: "mdi:credit-card-outline", status: "payment" },
  { label: "Visa Wait", icon: "mdi:airplane-takeoff", status: "visa_wait" },
];

// Map API status to step index (case-insensitive matching)
const getStepIndexFromStatus = (status) => {
  if (!status) return 0;

  // Normalize the status - Map "Visa" to "visa_wait"
  const normalizedStatus =
    status.toLowerCase() === "visa" ? "visa_wait" : status.toLowerCase();

  const stepIndex = steps.findIndex(
    (step) => step.status.toLowerCase() === normalizedStatus,
  );

  return stepIndex !== -1 ? stepIndex : 0;
};

export function AppView() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { vacancy } = useGetVacancy();
  const { appliedVacancy, appliedVacancyLoading, mutateAppliedVacancy } =
    useGetAppliedVacancy();
  const { dashboard, dashboardLoading, mutateDashboard } = useGetDashboard();
  const router = useRouter();
  const [selectedVacancyId, setSelectedVacancyId] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedVacancyData, setSelectedVacancyData] = useState(null);
  const navigate = useNavigate();

  // Get user profile from Redux
  const { profile } = useAppSelector((state) => state.profile || {});

  //to avoid rerender
  const hasCheckedEligibility = useRef(false);

  // ✅ Redirect to eligibility form if not filled (only once on mount)
  useEffect(() => {
    if (dashboardLoading) return; // Wait for data to load

    if (
      dashboard?.eligibilityFormStatus &&
      dashboard.eligibilityFormStatus !== "Approved"
    ) {
      hasCheckedEligibility.current = true;
      navigate("/auth/register-step-form", { replace: true });
    } else {
      hasCheckedEligibility.current = true;
    }
  }, [dashboard?.eligibilityFormStatus, dashboardLoading, navigate]);

  // ✅ Refresh data when component mounts
  useEffect(() => {
    dispatch(fetchProfileRequest());
    mutateAppliedVacancy();
    mutateDashboard();
  }, [dispatch, mutateAppliedVacancy, mutateDashboard]);

  // ✅ Set initial state when applied vacancies are loaded
  useEffect(() => {
    if (appliedVacancy && appliedVacancy.length > 0) {
      const firstVacancy = appliedVacancy[0];
      console.log("🎯 First Vacancy ID:", firstVacancy.id);
      setSelectedVacancyId(firstVacancy.id); // Select the first vacancy by default
      setSelectedVacancyData(firstVacancy);

      // Set the stepper to match the status of the first vacancy
      if (
        firstVacancy.employee_applied_vacancy &&
        firstVacancy.employee_applied_vacancy.length > 0
      ) {
        const status = firstVacancy.employee_applied_vacancy[0].status;
        const stepIndex = getStepIndexFromStatus(status);
        setActiveStep(stepIndex);
      } else {
        setActiveStep(0); // Default to first step if no status
      }
    } else {
      // If there are no applied vacancies, reset everything
      setSelectedVacancyId("");
      setSelectedVacancyData(null);
      setActiveStep(0);
    }
  }, [appliedVacancy]);

  // Handle vacancy selection change
  const handleVacancyChange = (event) => {
    const vacancyId = event.target.value;
    setSelectedVacancyId(vacancyId);

    // If no vacancy selected, default to Eligibility (step 0)
    if (!vacancyId) {
      setActiveStep(0);
      setSelectedVacancyData(null);
      return;
    }

    // Find selected vacancy and update active step based on its status
    const selectedVacancy = appliedVacancy.find((v) => v.id === vacancyId);
    setSelectedVacancyData(selectedVacancy);

    if (
      selectedVacancy?.employee_applied_vacancy &&
      selectedVacancy.employee_applied_vacancy.length > 0
    ) {
      const status = selectedVacancy.employee_applied_vacancy[0].status;
      const stepIndex = getStepIndexFromStatus(status);
      setActiveStep(stepIndex);

      console.log("✅ Selected Vacancy:", selectedVacancy.id);
      console.log("✅ Current Status:", status);
      console.log("✅ Step Index:", stepIndex);
    } else {
      // If selected vacancy has no status data, default to Eligibility
      setActiveStep(0);
    }
  };

  // Handle step click to navigate
  const handleStepClick = (stepStatus) => {
    const statusLower = stepStatus.toLowerCase();

    if (statusLower === "contract") {
      navigate(paths.dashboard.contract.root);
    } else if (statusLower === "payment") {
      navigate(paths.dashboard.payment.root);
    } else if (statusLower === "visa_wait") {
      navigate(paths.dashboard.visaStatus.root);
    }
  };

  // Calculate progress percentage
  if (dashboardLoading) {
    return (
      <DashboardContent maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Typography>Loading...</Typography>
        </Box>
      </DashboardContent>
    );
  }
  return (
    <DashboardContent maxWidth="xl">
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          p: { xs: 2, sm: 3, md: 6 },
        }}
      >
        {/* Welcome Header */}
        <Box sx={{ mb: { xs: 3, md: 5 } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Welcome back, {profile?.first_name || "Applicant"}! 👋
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            You&apos;re making great progress on your EB-3 visa journey.
            Here&apos;s your current status.
          </Typography>
        </Box>
        {dashboard?.onboardingFormStatus === "Rejected" && (
          <Alert
            severity="error"
            sx={{ mb: { xs: 3, md: 5 }, borderRadius: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate(`/apply`)}
                endIcon={<Iconify icon="mdi:arrow-right" />}
              >
                Review Form
              </Button>
            }
          >
            <AlertTitle>Action Required</AlertTitle>
            Your Onboarding Form has been rejected. Please review and resubmit.
          </Alert>
        )}
        {/* Stats Overview Cards */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3 }}
          sx={{ mb: { xs: 3, md: 5 } }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: "primary.main",
                color: "white",
                borderRadius: { xs: 2, md: 3 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      mb: 1,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Application Progress
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                    }}
                  >
                    {dashboard?.progress_percentage}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: { xs: 48, sm: 56, md: 64 },
                    height: { xs: 48, sm: 56, md: 64 },
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Iconify
                    icon="mdi:chart-line"
                    width={{ xs: 28, sm: 32, md: 36 }}
                  />
                </Box>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={dashboard?.progress_percentage || 0}
                sx={{
                  mt: 2,
                  height: { xs: 4, sm: 6 },
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.3)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "white",
                    borderRadius: 3,
                  },
                }}
              />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: "secondary.main",
                color: "white",
                borderRadius: { xs: 2, md: 3 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      mb: 1,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Current Step
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                    }}
                  >
                    {dashboard?.current_step_number}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.9,
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    }}
                  >
                    {steps[activeStep].label}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: { xs: 48, sm: 56, md: 64 },
                    height: { xs: 48, sm: 56, md: 64 },
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Iconify
                    icon={steps[activeStep].icon}
                    width={{ xs: 28, sm: 32, md: 36 }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: "primary.main",
                color: "white",
                borderRadius: { xs: 2, md: 3 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      mb: 1,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Available Jobs
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                    }}
                  >
                    {dashboard?.available_vacancies_count || 0}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.9,
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    }}
                  >
                    Matching positions
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: { xs: 48, sm: 56, md: 64 },
                    height: { xs: 48, sm: 56, md: 64 },
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Iconify
                    icon="mdi:briefcase-variant"
                    width={{ xs: 28, sm: 32, md: 36 }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: "secondary.main",
                color: "white",
                borderRadius: { xs: 2, md: 3 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      mb: 1,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Total paying fees
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                    }}
                  >
                    {dashboard?.total_fee || 0}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: { xs: 48, sm: 56, md: 64 },
                    height: { xs: 48, sm: 56, md: 64 },
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Iconify icon="mdi:cash" width={{ xs: 28, sm: 32, md: 36 }} />
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Progress Stepper / Visa Status Timeline */}
        <Card
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: { xs: 3, md: 5 },
            borderRadius: { xs: 2, md: 3 },
            overflowX: "auto",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={{ xs: 2, sm: 3 }}
            sx={{ mb: { xs: 2, md: 3 } }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              {activeStep === 5
                ? "Visa Status Timeline"
                : "Your Application Journey"}
            </Typography>

            {/* Vacancy Dropdown */}
            {appliedVacancy && appliedVacancy.length > 0 && (
              <FormControl
                sx={{
                  minWidth: { xs: "100%", sm: 300, md: 350 },
                }}
              >
                <InputLabel id="vacancy-select-label">
                  Select Applied Vacancy
                </InputLabel>
                <Select
                  labelId="vacancy-select-label"
                  id="vacancy-select"
                  value={selectedVacancyId}
                  label="Select Applied Vacancy"
                  onChange={handleVacancyChange}
                  sx={{ borderRadius: 2 }}
                >
                  {appliedVacancy.map((vac) => (
                    <MenuItem key={vac.id} value={vac.id}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon="mdi:briefcase" width={20} />
                        <Typography variant="body2">
                          {vac.title} - {vac.employer_name}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>

          {/* Show Visa Status Timeline if in Visa stage */}
          {activeStep === 5 &&
          selectedVacancyData?.employee_applied_vacancy?.[0]
            ?.visa_status_list ? (
            <VisaStatusMiniTimeline
              visaStatusList={
                selectedVacancyData.employee_applied_vacancy[0].visa_status_list
              }
              currentVisaStatus={
                selectedVacancyData.employee_applied_vacancy[0]
                  .current_visa_status
              }
              selectedVacancyId={selectedVacancyId}
            />
          ) : (
            <Box sx={{ minWidth: { xs: 600, sm: "auto" } }}>
              <Stepper
                alternativeLabel
                activeStep={activeStep}
                connector={
                  <StepConnector
                    sx={{
                      "& .MuiStepConnector-line": {
                        borderColor: theme.palette.primary.main,
                        borderTopWidth: 3,
                      },
                    }}
                  />
                }
                sx={{
                  "& .MuiStepLabel-label": {
                    color: theme.palette.text.secondary,
                    fontSize: { xs: 11, sm: 12, md: 14 },
                    fontWeight: 500,
                    mt: 1,
                  },
                  "& .MuiStepLabel-label.Mui-active": {
                    color: theme.palette.primary.dark,
                    fontWeight: 600,
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color: theme.palette.success.main,
                  },
                }}
              >
                {steps.map((step, index) => {
                  const isCompleted = index < activeStep;
                  const isReached = isCompleted || index === activeStep;
                  const isClickable =
                    isReached &&
                    (step.status === "contract" ||
                      step.status === "payment" ||
                      step.status === "visa_wait");

                  return (
                    <Step key={index} completed={isCompleted}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            onClick={() =>
                              isClickable && handleStepClick(step.status)
                            }
                            sx={{
                              width: { xs: 40, sm: 48 },
                              height: { xs: 40, sm: 48 },
                              borderRadius: "50%",
                              bgcolor: isCompleted
                                ? theme.palette.success.main
                                : index === activeStep
                                  ? theme.palette.primary.main
                                  : "transparent",
                              border:
                                !isCompleted && index !== activeStep
                                  ? `3px solid ${theme.palette.divider}`
                                  : "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.3s",
                              boxShadow:
                                isCompleted || index === activeStep ? 3 : 0,
                              cursor: isClickable ? "pointer" : "default",
                              "&:hover": isClickable
                                ? {
                                    transform: "scale(1.1)",
                                    boxShadow: 4,
                                  }
                                : {},
                            }}
                          >
                            {isCompleted ? (
                              <Iconify
                                icon="mdi:check-bold"
                                width={{ xs: 20, sm: 24 }}
                                height={{ xs: 20, sm: 24 }}
                                color={theme.palette.common.white}
                              />
                            ) : (
                              <Iconify
                                icon={step.icon}
                                width={{ xs: 20, sm: 24 }}
                                height={{ xs: 20, sm: 24 }}
                                color={
                                  index === activeStep
                                    ? theme.palette.common.white
                                    : theme.palette.text.disabled
                                }
                              />
                            )}
                          </Box>
                        )}
                      >
                        {step.label}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>
          )}
        </Card>

        {/* Finance Plan & Payment Details */}
        {selectedVacancyId && appliedVacancy && (
          <>
            {appliedVacancy
              .filter((vac) => vac.id === selectedVacancyId)
              .map((selectedVac) => (
                <Card
                  key={selectedVac.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1.5 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                      }}
                    >
                      Finance & Payments
                    </Typography>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        bgcolor: "primary.lighter",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Iconify
                        icon="mdi:cash-multiple"
                        width={18}
                        sx={{ color: "primary.main" }}
                      />
                    </Box>
                  </Stack>

                  {/* Application Status */}
                  {/* {selectedVac.employee_applied_vacancy &&
                    selectedVac.employee_applied_vacancy.length > 0 && (
                      <Box
                        sx={{
                          p: 1,
                          mb: 1.5,
                          borderRadius: 1,
                          bgcolor: "success.lighter",
                          border: "1px solid",
                          borderColor: "success.light",
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ width: "fit-content" }}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: 0.75,
                              bgcolor: "success.main",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Iconify
                              icon="mdi:check"
                              width={14}
                              sx={{ color: "white" }}
                            />
                          </Box>
                          <Box sx={{ flexShrink: 0 }}>
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              sx={{
                                fontSize: "0.8rem",
                                display: "block",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {selectedVac.employee_applied_vacancy[0].status}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                            >
                              Applied{" "}
                              {new Date(
                                selectedVac.employee_applied_vacancy[0]
                                  .applied_at,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    )} */}

                  {/* Finance Plans */}
                  {selectedVac.finance && selectedVac.finance.length > 0 ? (
                    selectedVac.finance.map((financeItem) => (
                      <Box key={financeItem.id} sx={{ mb: 3 }}>
                        {/* Finance Summary Cards */}
                        <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                borderRadius: 1.5,
                                bgcolor: "primary.lighter",
                                border: "1px solid",
                                borderColor: "primary.light",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: "0.7rem", display: "block" }}
                              >
                                Total Fee
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                color="primary.main"
                                sx={{ fontSize: "1.1rem" }}
                              >
                                $
                                {parseFloat(
                                  financeItem.total_fee,
                                ).toLocaleString()}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                borderRadius: 1.5,
                                bgcolor: "success.lighter",
                                border: "1px solid",
                                borderColor: "success.light",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: "0.7rem", display: "block" }}
                              >
                                Paid Amount
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                color="success.main"
                                sx={{ fontSize: "1.1rem" }}
                              >
                                $
                                {parseFloat(
                                  financeItem.paid_amount,
                                ).toLocaleString()}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                borderRadius: 1.5,
                                bgcolor: "warning.lighter",
                                border: "1px solid",
                                borderColor: "warning.light",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: "0.7rem", display: "block" }}
                              >
                                Due Amount
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                color="warning.main"
                                sx={{ fontSize: "1.1rem" }}
                              >
                                $
                                {parseFloat(
                                  financeItem.due_amount,
                                ).toLocaleString()}
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>

                        {/* Finance Plan Details */}
                        {financeItem.finance_plan && (
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              borderRadius: 1.5,
                              border: "1px solid",
                              borderColor: "divider",
                              bgcolor: "grey.50",
                              mb: 1.5,
                            }}
                          >
                            <Stack spacing={1}>
                              <Box>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Box
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: 0.75,
                                      bgcolor: "primary.main",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Iconify
                                      icon="mdi:file-document"
                                      width={14}
                                      sx={{ color: "white" }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    fontWeight={700}
                                    sx={{ fontSize: "0.85rem" }}
                                  >
                                    {financeItem.finance_plan.plan_name}
                                  </Typography>
                                </Stack>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    ml: 4,
                                    display: "block",
                                    fontSize: "0.7rem",
                                    mt: 0.25,
                                  }}
                                >
                                  {financeItem.finance_plan.description}
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: "white",
                                  border: "1px solid",
                                  borderColor: "divider",
                                }}
                              >
                                <Grid container spacing={1.5}>
                                  <Grid size={{ xs: 6, sm: 3 }}>
                                    <Stack spacing={0.25}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        fontWeight={600}
                                        sx={{ fontSize: "0.7rem" }}
                                      >
                                        Visa Type
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        sx={{ fontSize: "0.875rem" }}
                                      >
                                        {financeItem.finance_plan.visa_type}
                                      </Typography>
                                    </Stack>
                                  </Grid>
                                  <Grid size={{ xs: 6, sm: 3 }}>
                                    <Stack spacing={0.25}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        fontWeight={600}
                                        sx={{ fontSize: "0.7rem" }}
                                      >
                                        Currency
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        sx={{ fontSize: "0.875rem" }}
                                      >
                                        {financeItem.finance_plan.currency}
                                      </Typography>
                                    </Stack>
                                  </Grid>
                                  <Grid size={{ xs: 6, sm: 3 }}>
                                    <Stack spacing={0.25}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        fontWeight={600}
                                        sx={{ fontSize: "0.7rem" }}
                                      >
                                        Status
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: "inline-flex",
                                          px: 1,
                                          py: 0.25,
                                          borderRadius: 0.75,
                                          bgcolor:
                                            financeItem.status === "pending"
                                              ? "warning.lighter"
                                              : "success.lighter",
                                          width: "fit-content",
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          fontWeight={700}
                                          sx={{
                                            color:
                                              financeItem.status === "pending"
                                                ? "warning.main"
                                                : "success.main",
                                            textTransform: "capitalize",
                                            fontSize: "0.75rem",
                                          }}
                                        >
                                          {financeItem.status.replace(
                                            /_/g,
                                            " ",
                                          )}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  </Grid>
                                  <Grid size={{ xs: 6, sm: 3 }}>
                                    <Stack spacing={0.25}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        fontWeight={600}
                                        sx={{ fontSize: "0.7rem" }}
                                      >
                                        Installments
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        sx={{ fontSize: "0.875rem" }}
                                      >
                                        {
                                          financeItem.finance_plan
                                            .installment_count
                                        }
                                      </Typography>
                                    </Stack>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Stack>
                          </Paper>
                        )}

                        {/* Payment History */}
                        {financeItem.payments &&
                        financeItem.payments.length > 0 ? (
                          <Box>
                            <Typography
                              variant="caption"
                              fontWeight={700}
                              sx={{
                                mb: 1,
                                fontSize: "0.8rem",
                                display: "block",
                              }}
                            >
                              Payment History
                            </Typography>
                            <Stack spacing={1}>
                              {financeItem.payments.map((payment) => (
                                <Paper
                                  key={payment.id}
                                  elevation={0}
                                  sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    bgcolor: "white",
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    spacing={1}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                      flex={1}
                                    >
                                      <Box
                                        sx={{
                                          width: 24,
                                          height: 24,
                                          borderRadius: 0.75,
                                          bgcolor:
                                            payment.status === "completed"
                                              ? "success.lighter"
                                              : "warning.lighter",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <Iconify
                                          icon={
                                            payment.status === "completed"
                                              ? "mdi:check"
                                              : "mdi:clock-outline"
                                          }
                                          width={12}
                                          sx={{
                                            color:
                                              payment.status === "completed"
                                                ? "success.main"
                                                : "warning.main",
                                          }}
                                        />
                                      </Box>
                                      <Box>
                                        <Typography
                                          variant="caption"
                                          fontWeight={700}
                                          sx={{
                                            fontSize: "0.8rem",
                                            display: "block",
                                          }}
                                        >
                                          $
                                          {parseFloat(
                                            payment.amount,
                                          ).toLocaleString()}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          sx={{ fontSize: "0.7rem" }}
                                        >
                                          {new Date(
                                            payment.date,
                                          ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          })}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                    <Box
                                      sx={{
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 0.75,
                                        bgcolor:
                                          payment.status === "completed"
                                            ? "success.lighter"
                                            : "warning.lighter",
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        fontWeight={700}
                                        sx={{
                                          color:
                                            payment.status === "completed"
                                              ? "success.main"
                                              : "warning.main",
                                          textTransform: "capitalize",
                                          fontSize: "0.65rem",
                                        }}
                                      >
                                        {payment.status}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Paper>
                              ))}
                            </Stack>
                          </Box>
                        ) : (
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 1.5,
                              bgcolor: "grey.50",
                              border: "1px dashed",
                              borderColor: "grey.300",
                              textAlign: "center",
                            }}
                          >
                            <Iconify
                              icon="mdi:cash-clock"
                              width={24}
                              sx={{ color: "text.disabled", mb: 0.5 }}
                            />
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              color="text.secondary"
                              sx={{ display: "block", fontSize: "0.75rem" }}
                            >
                              No Payments Yet
                            </Typography>
                          </Paper>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 1.5,
                        bgcolor: "grey.50",
                        border: "1px dashed",
                        borderColor: "grey.300",
                        textAlign: "center",
                      }}
                    >
                      <Iconify
                        icon="mdi:file-document-outline"
                        width={28}
                        sx={{ color: "text.disabled", mb: 1 }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color="text.secondary"
                        sx={{ display: "block", fontSize: "0.8rem" }}
                      >
                        No Finance Plan Assigned
                      </Typography>
                    </Paper>
                  )}
                </Card>
              ))}
          </>
        )}

        {/* Main Content Grid */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Current Focus Card */}
            <Card
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                mb: { xs: 2, sm: 3 },
                borderRadius: { xs: 2, md: 3 },
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2, sm: 3 }}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Box
                  sx={{
                    width: { xs: 56, sm: 64, md: 72 },
                    height: { xs: 56, sm: 64, md: 72 },
                    borderRadius: { xs: 2, md: 3 },
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: 3,
                  }}
                >
                  <Iconify
                    icon="mdi:target"
                    width={{ xs: 32, sm: 36, md: 40 }}
                    color="white"
                  />
                </Box>
                <Box flexGrow={1}>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                  >
                    Focus Now
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
                    }}
                  >
                    Select Your Preferred Employer
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                  >
                    Review {vacancy?.length || 0} matching job positions and
                    choose the one that fits your skills and preferences.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<Iconify icon="mdi:arrow-right" />}
                  onClick={() => router.push(paths.dashboard.vacancy.root)}
                  sx={{
                    borderRadius: 2,
                    px: { xs: 2, md: 3 },
                    py: { xs: 1, md: 1.5 },
                    fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
                    whiteSpace: "nowrap",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  View Jobs
                </Button>
              </Stack>
            </Card>

            {/* Key Milestones */}
            <Card
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: { xs: 2, md: 3 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
                }}
              >
                Steps to Complete Your Application
              </Typography>
              <Stack spacing={{ xs: 1.5, sm: 2 }}>
                {[
                  {
                    title: "Complete Job Selection",
                    subtitle: "Select from available positions",
                    status: "current",
                    icon: "mdi:briefcase-check",
                    color: "primary",
                  },
                  {
                    title: "Submit OnBoarding Documents",
                    subtitle: "After job selection",
                    status: "upcoming",
                    icon: "mdi:file-upload",
                    color: "secondary",
                  },
                  {
                    title: "Review & Sign Contract",
                    subtitle: "Digital signature required",
                    status: "upcoming",
                    icon: "mdi:file-sign",
                    color: "primary",
                  },
                  {
                    title: "Complete Payment",
                    subtitle: "Process visa application fee",
                    status: "upcoming",
                    icon: "mdi:credit-card-check",
                    color: "secondary",
                  },
                ].map((milestone, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      border: 2,
                      borderColor: `${milestone.color}.main`,
                      borderRadius: { xs: 1.5, sm: 2 },
                      // bgcolor:
                      //   milestone.status === "current"
                      //     ? `${milestone.color}.lighter`
                      //     : "transparent",
                      // transition: "all 0.3s",
                      // "&:hover": {
                      //   borderColor: `${milestone.color}.main`,
                      //   bgcolor: `${milestone.color}.lighter`,
                      // },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={{ xs: 1.5, sm: 2 }}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 },
                          borderRadius: { xs: 1.5, sm: 2 },
                          bgcolor: `${milestone.color}.main`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Iconify
                          icon={milestone.icon}
                          width={{ xs: 20, sm: 24 }}
                          color="white"
                        />
                      </Box>
                      <Box flexGrow={1} sx={{ minWidth: 0 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          flexWrap="wrap"
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                          >
                            {milestone.title}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                            display: "block",
                          }}
                        >
                          {milestone.subtitle}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Finance Overview */}
            <Card
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                bgcolor: "white",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={3}>
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "text.primary" }}
                    >
                      Finance Overview
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: "primary.lighter",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Iconify
                        icon="mdi:finance"
                        width={24}
                        sx={{ color: "primary.main" }}
                      />
                    </Box>
                  </Stack>
                </Box>

                {/* Payment Details */}
                <Stack spacing={2}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "primary.lighter",
                      border: "1px solid",
                      borderColor: "primary.light",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ display: "block", color: "text.secondary" }}
                        >
                          Amount Paid
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          ${dashboard?.total_paid?.toLocaleString() || "0"}
                        </Typography>
                      </Box>
                      <Iconify
                        icon="mdi:check-circle"
                        width={32}
                        sx={{ color: "primary.main" }}
                      />
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "secondary.lighter",
                      border: "1px solid",
                      borderColor: "secondary.light",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ display: "block", color: "text.secondary" }}
                        >
                          Due Amount
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "secondary.main" }}
                        >
                          ${dashboard?.due_amount?.toLocaleString() || "0"}
                        </Typography>
                      </Box>
                      <Iconify
                        icon="mdi:clock-alert-outline"
                        width={32}
                        sx={{ color: "secondary.main" }}
                      />
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "primary.lighter",
                      border: "1px solid",
                      borderColor: "primary.light",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ display: "block", color: "text.secondary" }}
                        >
                          Finance Plans
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          {dashboard?.total_finances || 0} Selected
                        </Typography>
                      </Box>
                      <Iconify
                        icon="mdi:file-document-multiple"
                        width={32}
                        sx={{ color: "primary.main" }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </Card>

            {/* Resources */}
            <Card sx={{ p: 3, borderRadius: 3, bgcolor: "secondary.lighter" }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Iconify
                    icon="mdi:book-open-variant"
                    width={24}
                    color="white"
                  />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                    Helpful Resources
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Learn more about the EB-3 visa process
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => router.push(paths.dashboard.guide.root)}
                    startIcon={<Iconify icon="mdi:file-document" />}
                    sx={{ justifyContent: "flex-start", borderRadius: 1.5 }}
                  >
                    EB-3 Visa Guide
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => router.push(paths.dashboard.faqs.root)}
                    startIcon={
                      <Iconify icon="mdi:frequently-asked-questions" />
                    }
                    sx={{ justifyContent: "flex-start", borderRadius: 1.5 }}
                  >
                    FAQs
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}

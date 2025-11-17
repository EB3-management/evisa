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
  Chip,
  Button,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  AlertTitle,
  Alert,
} from "@mui/material";
import { useGetVacancy, useGetAppliedVacancy } from "src/api/vacancy";
import { useRouter } from "src/routes/hooks";
import { useState, useEffect } from "react";
import { paths } from "src/routes/paths";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchProfileRequest } from "src/redux/actions";
import { useGetDashboard } from "src/api";
import { useNavigate } from "react-router";

// ----------------------------------------------------------------------

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

  const stepIndex = steps.findIndex(
    (step) => step.status.toLowerCase() === status.toLowerCase()
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
  const navigate = useNavigate();

  // Get user profile from Redux
  const { profile } = useAppSelector((state) => state.profile || {});

  // // ✅ Redirect to eligibility form if not filled (only once on mount)
  // useEffect(() => {
  //   if (dashboardLoading) return; // Wait for data to load

  //   if (dashboard?.eligibilityFormStatus === "Not Filled") {
  //     navigate("/auth/register-step-form", { replace: true });
  //   }
  // }, [dashboard?.eligibilityFormStatus, dashboardLoading, navigate]);

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
      setSelectedVacancyId(firstVacancy.id); // Select the first vacancy by default

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
      setActiveStep(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedVacancy]);

  // Handle vacancy selection change
  const handleVacancyChange = (event) => {
    const vacancyId = event.target.value;
    setSelectedVacancyId(vacancyId);

    // If no vacancy selected, default to Eligibility (step 0)
    if (!vacancyId) {
      setActiveStep(0);
      return;
    }

    // Find selected vacancy and update active step based on its status
    const selectedVacancy = appliedVacancy.find((v) => v.id === vacancyId);

    if (
      selectedVacancy?.employee_applied_vacancy &&
      selectedVacancy.employee_applied_vacancy.length > 0
    ) {
      const status = selectedVacancy.employee_applied_vacancy[0].status;
      const stepIndex = getStepIndexFromStatus(status);
      setActiveStep(stepIndex);

      console.log("✅ Selected Vacancy:", selectedVacancy.title);
      console.log("✅ Current Status:", status);
      console.log("✅ Step Index:", stepIndex);
    } else {
      // If selected vacancy has no status data, default to Eligibility
      setActiveStep(0);
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: { xs: 2, md: 3 },
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
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                borderRadius: { xs: 2, md: 3 },
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
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                borderRadius: { xs: 2, md: 3 },
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
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                color: "white",
                borderRadius: { xs: 2, md: 3 },
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
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                    }}
                  >
                    {dashboard?.total_fee}
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

        {/* Progress Stepper */}
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
              Your Application Journey
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
                const isCompleted = index <= activeStep;

                return (
                  <Step key={index} completed={isCompleted}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box
                          sx={{
                            width: { xs: 40, sm: 48 },
                            height: { xs: 40, sm: 48 },
                            borderRadius: "50%",
                            bgcolor: isCompleted
                              ? theme.palette.success.main
                              : "transparent",
                            border: !isCompleted
                              ? `3px solid ${theme.palette.divider}`
                              : "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s",
                            boxShadow: isCompleted ? 3 : 0,
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
                              color={theme.palette.text.disabled}
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
        </Card>

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
                    color: "info",
                  },
                  {
                    title: "Review & Sign Contract",
                    subtitle: "Digital signature required",
                    status: "upcoming",
                    icon: "mdi:file-sign",
                    color: "warning",
                  },
                  {
                    title: "Complete Payment",
                    subtitle: "Process visa application fee",
                    status: "upcoming",
                    icon: "mdi:credit-card-check",
                    color: "success",
                  },
                ].map((milestone, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      border: 2,
                      borderColor:
                        milestone.status === "current"
                          ? `${milestone.color}.main`
                          : "divider",
                      borderRadius: { xs: 1.5, sm: 2 },
                      bgcolor:
                        milestone.status === "current"
                          ? `${milestone.color}.lighter`
                          : "transparent",
                      transition: "all 0.3s",
                      "&:hover": {
                        borderColor: `${milestone.color}.main`,
                        bgcolor: `${milestone.color}.lighter`,
                      },
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
                          {milestone.status === "current" && (
                            <Chip
                              label="Current"
                              size="small"
                              color={milestone.color}
                              sx={{
                                height: { xs: 20, sm: 24 },
                                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                              }}
                            />
                          )}
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
                      {milestone.status === "current" && (
                        <Iconify
                          icon="mdi:chevron-right"
                          width={{ xs: 20, sm: 24 }}
                          color="text.secondary"
                          sx={{ flexShrink: 0 }}
                        />
                      )}
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
                        color="primary.main"
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
                        color="primary.main"
                      />
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "warning.lighter",
                      border: "1px solid",
                      borderColor: "warning.light",
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
                          sx={{ fontWeight: 700, color: "warning.main" }}
                        >
                          ${dashboard?.due_amount?.toLocaleString() || "0"}
                        </Typography>
                      </Box>
                      <Iconify
                        icon="mdi:clock-alert-outline"
                        width={32}
                        color="warning.main"
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
                        color="primary.main"
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </Card>

            {/* Resources */}
            <Card sx={{ p: 3, borderRadius: 3, bgcolor: "warning.lighter" }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: "warning.main",
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
                    color="warning"
                    onClick={() => router.push(paths.dashboard.guide.root)}
                    startIcon={<Iconify icon="mdi:file-document" />}
                    sx={{ justifyContent: "flex-start", borderRadius: 1.5 }}
                  >
                    EB-3 Visa Guide
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="warning"
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

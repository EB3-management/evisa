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
} from "@mui/material";
import { useGetVacancy } from "src/api/vacancy";
import { useRouter } from "src/routes/hooks";
import { useState } from "react";
import { paths } from "src/routes/paths";
import { useAppSelector } from "src/redux/hooks";

// ----------------------------------------------------------------------

const steps = [
  { label: "Eligibility", icon: "mdi:check-circle-outline" },
  { label: "Job Selection", icon: "mdi:briefcase-outline" },
  { label: "OnBoarding Form", icon: "mdi:file-document-outline" },
  { label: "Contract", icon: "mdi:file-document-outline" },
  { label: "Payment", icon: "mdi:credit-card-outline" },
  { label: "Visa Wait", icon: "mdi:airplane-takeoff" },
];

export function AppView() {
  const theme = useTheme();
  const { vacancy } = useGetVacancy();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  // Get user profile from Redux
  const { profile } = useAppSelector((state) => state.profile || {});

  const handleStepClick = (index, label) => {
    if (label === "Contract") {
      router.push(paths.dashboard.contract.root);
    } else if (label === "Job Selection") {
      router.push(paths.dashboard.vacancy.root);
    } else if (label === "Payment") {
      router.push(paths.dashboard.finance);
    }
    setActiveStep(index);
  };

  // Calculate progress percentage
  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

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
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Welcome back, {profile?.first_name || "Applicant"}! 👋
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            You&apos;re making great progress on your EB-3 visa journey.
            Here&apos;s your current status.
          </Typography>
        </Box>

        {/* Stats Overview Cards */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, md: 5 } }}>
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
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Application Progress
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                    {Math.round(progressPercentage)}%
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
                  <Iconify icon="mdi:chart-line" width={{ xs: 28, sm: 32, md: 36 }} />
                </Box>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
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
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Current Step
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
                    {activeStep + 1} of {steps.length}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
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
                  <Iconify icon={steps[activeStep].icon} width={{ xs: 28, sm: 32, md: 36 }} />
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                borderRadius: 3,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Available Jobs
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {vacancy?.length || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Matching positions
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Iconify icon="mdi:briefcase-variant" width={36} />
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                color: "white",
                borderRadius: 3,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Est. Processing Time
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    45-60
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Days remaining
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Iconify icon="mdi:clock-fast" width={36} />
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Progress Stepper */}
        <Card sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: { xs: 3, md: 5 }, borderRadius: { xs: 2, md: 3 }, overflowX: 'auto' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: { xs: 2, md: 3 }, 
              fontWeight: 600,
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
            }}
          >
            Your Application Journey
          </Typography>
          <Box sx={{ minWidth: { xs: 600, sm: 'auto' } }}>
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
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <Step key={index} completed={isCompleted}>
                  <StepLabel
                    onClick={() => handleStepClick(index, step.label)}
                    sx={{ cursor: "pointer", "&:hover": { opacity: 0.85 } }}
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 },
                          borderRadius: "50%",
                          bgcolor: isActive
                            ? theme.palette.primary.main
                            : isCompleted
                            ? theme.palette.success.main
                            : "transparent",
                          border:
                            !isActive && !isCompleted
                              ? `3px solid ${theme.palette.divider}`
                              : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s",
                          boxShadow: isActive || isCompleted ? 3 : 0,
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
                              isActive
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
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={{ xs: 2, sm: 3 }} 
                alignItems={{ xs: 'flex-start', sm: 'center' }}
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
                  <Iconify icon="mdi:target" width={{ xs: 32, sm: 36, md: 40 }} color="white" />
                </Box>
                <Box flexGrow={1}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    Focus Now
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.5,
                      fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                    }}
                  >
                    Select Your Preferred Employer
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
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
                    fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  View Jobs
                </Button>
              </Stack>
            </Card>

            {/* Success Stories */}
            <Card sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3 }, borderRadius: { xs: 2, md: 3 } }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                sx={{ mb: { xs: 2, md: 3 } }}
                spacing={{ xs: 2, sm: 0 }}
              >
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 0.5,
                      fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                    }}
                  >
                    Success Stories
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Real people who achieved their American dream
                  </Typography>
                </Box>
                <AvatarGroup max={4}>
                  <Avatar sx={{ bgcolor: "primary.main", width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>JD</Avatar>
                  <Avatar sx={{ bgcolor: "success.main", width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>MS</Avatar>
                  <Avatar sx={{ bgcolor: "info.main", width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>RK</Avatar>
                  <Avatar sx={{ bgcolor: "warning.main", width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>+50</Avatar>
                </AvatarGroup>
              </Stack>

              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {[
                  {
                    name: "John Martinez",
                    role: "Healthcare Worker",
                    time: "Visa approved in 8 months",
                    color: "primary",
                  },
                  {
                    name: "Sarah Chen",
                    role: "Food Service Manager",
                    time: "Visa approved in 7 months",
                    color: "success",
                  },
                  {
                    name: "Raj Patel",
                    role: "Construction Worker",
                    time: "Visa approved in 9 months",
                    color: "info",
                  },
                ].map((story, index) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        textAlign: "center",
                        transition: "all 0.3s",
                        "&:hover": {
                          borderColor: `${story.color}.main`,
                          boxShadow: 2,
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: `${story.color}.main`,
                          mx: "auto",
                          mb: 1.5,
                          fontSize: "1.25rem",
                          fontWeight: 700,
                        }}
                      >
                        {story.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {story.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 1 }}
                      >
                        {story.role}
                      </Typography>
                      <Chip
                        label={story.time}
                        size="small"
                        color={story.color}
                        sx={{ fontSize: "0.7rem" }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>

            {/* Key Milestones */}
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Upcoming Milestones
              </Typography>
              <Stack spacing={2}>
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
                      p: 2,
                      border: 2,
                      borderColor:
                        milestone.status === "current"
                          ? `${milestone.color}.main`
                          : "divider",
                      borderRadius: 2,
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
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: `${milestone.color}.main`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Iconify
                          icon={milestone.icon}
                          width={24}
                          color="white"
                        />
                      </Box>
                      <Box flexGrow={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {milestone.title}
                          </Typography>
                          {milestone.status === "current" && (
                            <Chip
                              label="Current"
                              size="small"
                              color={milestone.color}
                            />
                          )}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {milestone.subtitle}
                        </Typography>
                      </Box>
                      {milestone.status === "current" && (
                        <Iconify
                          icon="mdi:chevron-right"
                          width={24}
                          color="text.secondary"
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
            {/* Quick Stats */}
            <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Stats
              </Typography>
              <Stack spacing={2.5}>
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Profile Completion
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      85%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "divider",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        background:
                          "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Documents Submitted
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      3/5
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={60}
                    color="success"
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "divider",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Payment Progress
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      $0/$9,000
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={0}
                    color="warning"
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "divider",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Card>

            {/* Important Dates */}
            <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Important Dates
              </Typography>
              <Stack spacing={2}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "primary.lighter",
                    borderRadius: 2,
                    borderLeft: 4,
                    borderColor: "primary.main",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="primary.dark"
                    sx={{ fontWeight: 600 }}
                  >
                    APPLICATION STARTED
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                    Oct 28, 2025
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: "info.lighter",
                    borderRadius: 2,
                    borderLeft: 4,
                    borderColor: "info.main",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="info.dark"
                    sx={{ fontWeight: 600 }}
                  >
                    ESTIMATED COMPLETION
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                    Jan 15, 2026
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: "success.lighter",
                    borderRadius: 2,
                    borderLeft: 4,
                    borderColor: "success.main",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="success.dark"
                    sx={{ fontWeight: 600 }}
                  >
                    VISA INTERVIEW (EST.)
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                    Mar 2026
                  </Typography>
                </Box>
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
                    startIcon={<Iconify icon="mdi:file-document" />}
                    sx={{ justifyContent: "flex-start", borderRadius: 1.5 }}
                  >
                    EB-3 Visa Guide
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="warning"
                    startIcon={
                      <Iconify icon="mdi:frequently-asked-questions" />
                    }
                    sx={{ justifyContent: "flex-start", borderRadius: 1.5 }}
                  >
                    FAQs
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="warning"
                    startIcon={<Iconify icon="mdi:video" />}
                    sx={{ justifyContent: "flex-start", borderRadius: 1.5 }}
                  >
                    Video Tutorials
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

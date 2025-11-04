import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  Stack,
  Container,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { DashboardContent } from "src/layouts/dashboard";
import { useGetVacancyDetail } from "src/api/vacancy";
import { Iconify } from "src/components/iconify";
import { useNavigate } from "react-router";
import { paths } from "src/routes/paths";
import { toast } from "src/components/snackbar";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchOnBoardingRequest } from "src/redux/actions";
import { useRouter } from "src/routes/hooks";
import { setSelectedVacancyId } from "src/redux/actions/vacancy-actions";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

export function VacancyDetailView({ id }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { vacancyDetail, vacancyLoading } = useGetVacancyDetail(id);
  const { onBoarding, isLoading: isLoadingOnBoarding } = useAppSelector(
    (state) => state.onBoarding || { onBoarding: {}, isLoading: false }
  );

  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Fetch onboarding status on component mount
  useEffect(() => {
    dispatch(fetchOnBoardingRequest());
  }, [dispatch]);

  // Parse job duties into list items
  const jobDutiesList = vacancyDetail?.job_duties
    ? vacancyDetail.job_duties.split(",").map((duty) => duty.trim())
    : [];

  // Parse requirements into list items (handle null case)
  const requirementsList = vacancyDetail?.requirement
    ? vacancyDetail.requirement.split(",").map((req) => req.trim())
    : [];

  // Parse benefits into chips
  const benefitsList = vacancyDetail?.benefits
    ? vacancyDetail.benefits.split(",").map((benefit) => benefit.trim())
    : [];

  // Handle Apply Now click
  const handleApplyNow = async () => {
    try {
      setIsCheckingStatus(true);

      // Check onboarding status from Redux store
      const status = onBoarding?.status;

      if (status) {
        if (status === "In Progress") {
          // Redirect to apply form if In Progress
          navigate(`/apply/${id}`);
        } else if (status === "Completed") {
          // Redirect to dashboard plan if Completed

          dispatch(setSelectedVacancyId(id));
          navigate(paths.dashboard.plan);
          // router.push(paths.dashboard.plan(id));
          toast.success("Your onboarding form is already completed!");
        } else {
          // Handle other statuses - default to apply form
          navigate(`/apply/${id}`);
        }
      } else {
        // If no status found, redirect to apply form
        navigate(`/apply/${id}`);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);

      // If error occurs, still allow navigation to apply form
      navigate(`/apply/${id}`);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return ""; // prevent crash
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (vacancyLoading) {
    return (
      <DashboardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={48} />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      {/* <Box sx={{ py: { xs: 2, sm: 3 } }}> */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <CustomBreadcrumbs
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Vacancy", href: paths.dashboard.vacancy.root },
            { name: vacancyDetail?.title || "Detail" },
          ]}
          sx={{ mb: { xs: 3, md: 4 } }}
        />
        <Card
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            {/* Header with Avatar and Company Name */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "center", sm: "flex-start" }}
              // spacing={{ xs: 2, sm: 0 }}
              // sx={{ mb: { xs: 3, sm: 4 } }}
            >
              <Avatar
                sx={{
                  width: { xs: 64, sm: 72, md: 80 },
                  height: { xs: 64, sm: 72, md: 80 },
                  bgcolor: theme.palette.primary.main,
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  fontWeight: 600,
                  mr: { xs: 0, sm: 2, md: 3 },
                }}
              >
                {getInitials(vacancyDetail.employer_name)}
              </Avatar>
              <Box flexGrow={1}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 1 }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    {vacancyDetail?.title}
                  </Typography>
                </Stack>
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 400,
                    mb: 2,
                  }}
                >
                  {vacancyDetail?.employer_name}
                </Typography>
                <Stack direction="row" spacing={1.5} flexWrap="wrap">
                  <Chip
                    label={vacancyDetail?.status}
                    size="small"
                    sx={{
                      bgcolor:
                        vacancyDetail?.status === "Open"
                          ? "secondary.main"
                          : "grey.400",
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                </Stack>
              </Box>
            </Stack>

            {/* <Divider sx={{ my: { xs: 2, sm: 3 } }} /> */}

            {/* Key Information Grid */}
            {/* <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: { xs: 2, sm: 2.5, md: 3 },
                  mb: { xs: 3, sm: 4 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: { xs: 1.5, sm: 2 },
                    bgcolor: "info.lighter",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "grey.100",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Iconify
                    icon="mingcute:location-fill"
                    sx={{
                      color: "error.main",
                      mr: { xs: 1, sm: 1.5 },
                      mt: 0.3,
                      fontSize: { xs: 18, sm: 20 },
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "grey.600",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        display: "block",
                        mb: 0.5,
                        fontWeight: 500,
                        fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      }}
                    >
                      Location
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "grey.900",
                        fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        wordBreak: "break-word",
                      }}
                    >
                      {vacancyDetail.location}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: { xs: 1.5, sm: 2 },
                    bgcolor: "success.lighter",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "grey.100",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Iconify
                    icon="mdi:cash-multiple"
                    sx={{
                      color: "success.main",
                      mr: { xs: 1, sm: 1.5 },
                      mt: 0.3,
                      fontSize: { xs: 18, sm: 20 },
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "grey.600",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        display: "block",
                        mb: 0.5,
                        fontWeight: 500,
                        fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      }}
                    >
                      Hourly Wage
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "grey.900",
                        fontSize: { xs: "0.85rem", sm: "0.95rem" },
                      }}
                    >
                      ${vacancyDetail.wages}/hour
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: { xs: 1.5, sm: 2 },
                    bgcolor: "secondary.lighter",
                    transition: "all 0.2s ease-in-out",
                    gridColumn: { xs: "1", sm: "span 2", md: "auto" },
                    "&:hover": {
                      bgcolor: "grey.100",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Iconify
                    icon="mdi:calendar-month"
                    sx={{
                      color: "info.main",
                      mr: { xs: 1, sm: 1.5 },
                      mt: 0.3,
                      fontSize: { xs: 18, sm: 20 },
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "grey.600",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        display: "block",
                        mb: 0.5,
                        fontWeight: 500,
                        fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      }}
                    >
                      Estimated Filing Date
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "grey.900",
                        fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        wordBreak: "break-word",
                      }}
                    >
                      {formatDate(vacancyDetail.estimated_lc_filling_date)}
                    </Typography>
                  </Box>
                </Box>
              </Box> */}

            {/* <Divider sx={{ my: { xs: 2, sm: 3 } }} /> */}

            {/* Job Duties Section */}
            {/* <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "grey.900",
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  }}
                >
                  Job Duties
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: { xs: 2.5, sm: 3 },
                    listStyleType: "disc",
                  }}
                >
                  {jobDutiesList.map((duty, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        mb: { xs: 1, sm: 1.5 },
                        "&::marker": {
                          color: "grey.400",
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "grey.700",
                          lineHeight: { xs: 1.6, sm: 1.7 },
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        }}
                      >
                        {duty}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box> */}

            {/* Requirements Section */}
            {/* {requirementsList.length > 0 && (
                <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: "grey.900",
                      mb: { xs: 1.5, sm: 2 },
                      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                    }}
                  >
                    Requirements
                  </Typography>
                  <Box
                    component="ul"
                    sx={{
                      m: 0,
                      pl: { xs: 2.5, sm: 3 },
                      listStyleType: "disc",
                    }}
                  >
                    {requirementsList.map((req, index) => (
                      <Box
                        component="li"
                        key={index}
                        sx={{
                          mb: { xs: 1, sm: 1.5 },
                          "&::marker": {
                            color: "grey.400",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "grey.700",
                            lineHeight: { xs: 1.6, sm: 1.7 },
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                          }}
                        >
                          {req}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )} */}

            {/* <Divider sx={{ my: { xs: 2, sm: 3 } }} /> */}

            {/* Benefits Section */}
            {/* <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "grey.900",
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  }}
                >
                  Benefits
                </Typography>
                <Stack
                  direction="row"
                  spacing={{ xs: 0.75, sm: 1 }}
                  sx={{
                    flexWrap: "wrap",
                    gap: { xs: 0.75, sm: 1 },
                  }}
                >
                  {benefitsList.map((benefit, index) => (
                    <Chip
                      key={index}
                      label={benefit}
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: "white",
                        fontWeight: 500,
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        height: { xs: 28, sm: 32 },
                        "& .MuiChip-icon": {
                          color: theme.palette.primary.main,
                          ml: 1,
                        },
                        "& .MuiChip-label": {
                          px: { xs: 1, sm: 1.5 },
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box> */}

            {/* <Divider sx={{ my: { xs: 3, sm: 4 } }} /> */}

            {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleApplyNow}
                  disabled={
                    vacancyDetail.is_applied ||
                    isCheckingStatus ||
                    isLoadingOnBoarding
                  }
                  fullWidth={false}
                  startIcon={
                    vacancyDetail.is_applied ? (
                      <Iconify icon="mdi:check-circle" />
                    ) : isCheckingStatus || isLoadingOnBoarding ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                  sx={{
                    bgcolor: vacancyDetail.is_applied
                      ? "success.main"
                      : theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 600,
                    px: { xs: 4, sm: 6 },
                    py: { xs: 1.25, sm: 1.5 },
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    textTransform: "none",
                    borderRadius: { xs: 1.5, sm: 2 },
                    minWidth: { xs: "100%", sm: "auto" },
                    maxWidth: { xs: "100%", sm: 300 },
                    boxShadow: vacancyDetail.is_applied
                      ? "0 4px 12px rgba(46, 125, 50, 0.4)"
                      : `0 4px 12px ${theme.palette.primary.main}40`,
                    "&:hover": {
                      bgcolor: vacancyDetail.is_applied
                        ? "success.dark"
                        : theme.palette.primary.dark,
                      boxShadow: vacancyDetail.is_applied
                        ? "0 6px 16px rgba(46, 125, 50, 0.6)"
                        : `0 6px 16px ${theme.palette.primary.main}60`,
                      transform: "translateY(-2px)",
                      transition: "all 0.2s ease-in-out",
                    },
                    "&.Mui-disabled": {
                      ...(vacancyDetail.is_applied && {
                        bgcolor: "success.main",
                        color: "white",
                        opacity: 0.8,
                      }),
                    },
                  }}
                >
                  {vacancyDetail.is_applied
                    ? "Applied"
                    : isCheckingStatus || isLoadingOnBoarding
                    ? "Loading..."
                    : "Apply Now"}
                </Button>
              </Box> */}
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Row 2: Quick Overview + Apply Button in same row */}
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={3}>
              {/* Quick Overview Section */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    height: "100%",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: { xs: 2.5, sm: 3 },
                        fontWeight: 700,
                        color: "text.primary",
                        fontSize: { xs: "1.1rem", sm: "1.25rem" },
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 4,
                          height: 24,
                          bgcolor: "primary.main",
                          borderRadius: 1,
                        }}
                      />
                      Quick Overview
                    </Typography>
                    <Grid container spacing={2.5}>
                      {[
                        {
                          icon: "mdi:briefcase",
                          label: "Position",
                          value: vacancyDetail?.title,
                          color: "#00B4C6",
                          bgcolor: "#B8F2F0",
                        },
                        {
                          icon: "mdi:map-marker",
                          label: "Location",
                          value: vacancyDetail?.location,
                          color: "#FF6A00",
                          bgcolor: "#FFD6B8",
                        },
                        {
                          icon: "mdi:cash",
                          label: "Hourly Rate",
                          value: `$${vacancyDetail?.wages}/hour`,
                          color: "#22C55E",
                          bgcolor: "#D3FCD2",
                        },
                        {
                          icon: "mdi:calendar",
                          label: "LC Filing Date",
                          value: formatDate(
                            vacancyDetail?.estimated_lc_filling_date
                          ),
                          color: "#FFAB00",
                          bgcolor: "#FFF5CC",
                        },
                      ].map((item, index) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={index}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "white",
                              border: "1px solid",
                              borderColor: "divider",
                              transition: "all 0.3s ease-in-out",
                              "&:hover": {
                                borderColor: item.color,
                                bgcolor: item.bgcolor,
                                transform: "translateX(4px)",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                              },
                            }}
                          >
                            <Stack spacing={1}>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 1.5,
                                    bgcolor: item.bgcolor,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Iconify
                                    icon={item.icon}
                                    width={18}
                                    sx={{ color: item.color }}
                                  />
                                </Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                  }}
                                >
                                  {item.label}
                                </Typography>
                              </Stack>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: "text.primary",
                                  fontSize: { xs: "0.9rem", sm: "0.95rem" },
                                  pl: 5,
                                }}
                              >
                                {item.value}
                              </Typography>
                            </Stack>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Apply Button Section */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 3,
                    background: vacancyDetail?.is_applied
                      ? "linear-gradient(135deg, #22C55E 0%, #77ED8B 100%)"
                      : "linear-gradient(135deg, #00B4C6 0%, #4ED6D0 100%)",
                    height: "100%",
                    minHeight: { xs: "auto", md: "100%" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: vacancyDetail?.is_applied
                      ? "0 8px 24px rgba(34, 197, 94, 0.3)"
                      : "0 8px 24px rgba(0, 180, 198, 0.3)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: vacancyDetail?.is_applied
                        ? "0 12px 32px rgba(34, 197, 94, 0.4)"
                        : "0 12px 32px rgba(0, 180, 198, 0.4)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)",
                      pointerEvents: "none",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "40%",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.05) 0%, transparent 100%)",
                      pointerEvents: "none",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 72, sm: 80 },
                      height: { xs: 72, sm: 80 },
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.95)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2.5,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease-in-out",
                      animation: vacancyDetail?.is_applied
                        ? "none"
                        : "pulse 2s ease-in-out infinite",
                      "@keyframes pulse": {
                        "0%, 100%": {
                          transform: "scale(1)",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        },
                        "50%": {
                          transform: "scale(1.05)",
                          boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
                        },
                      },
                    }}
                  >
                    <Iconify
                      icon={
                        vacancyDetail?.is_applied
                          ? "mdi:check-circle"
                          : "mdi:rocket-launch"
                      }
                      width={{ xs: 36, sm: 40 }}
                      sx={{
                        color: vacancyDetail?.is_applied
                          ? "#22C55E"
                          : "#00B4C6",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: "white",
                      fontSize: { xs: "1.15rem", sm: "1.4rem" },
                      textShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    {vacancyDetail?.is_applied
                      ? "Application Submitted!"
                      : "Ready to Apply?"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.95)",
                      mb: { xs: 2.5, sm: 3 },
                      fontSize: { xs: "0.85rem", sm: "0.95rem" },
                      lineHeight: 1.6,
                      textShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {vacancyDetail?.is_applied
                      ? "Your application is under review. We'll contact you soon!"
                      : "Take the next step in your career journey"}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleApplyNow}
                    disabled={
                      vacancyDetail?.is_applied ||
                      isCheckingStatus ||
                      isLoadingOnBoarding
                    }
                    startIcon={
                      vacancyDetail?.is_applied ? (
                        <Iconify icon="mdi:check-circle" width={22} />
                      ) : isCheckingStatus || isLoadingOnBoarding ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Iconify icon="mdi:send" width={22} />
                      )
                    }
                    sx={{
                      py: { xs: 1.5, sm: 1.75 },
                      px: 3,
                      fontWeight: 700,
                      bgcolor: "white",
                      color: vacancyDetail?.is_applied ? "#22C55E" : "#00B4C6",
                      fontSize: { xs: "0.95rem", sm: "1.05rem" },
                      borderRadius: 2,
                      textTransform: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        bgcolor: "white",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "rgba(255,255,255,0.7)",
                        color: "rgba(0,0,0,0.4)",
                      },
                    }}
                  >
                    {vacancyDetail?.is_applied
                      ? "Already Applied"
                      : isCheckingStatus || isLoadingOnBoarding
                      ? "Loading..."
                      : "Apply Now"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Row 3: Job Duties + Benefits */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Job Duties */}
            <Card
              elevation={0}
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 2.5, sm: 3 },
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      bgcolor: "primary.main",
                      borderRadius: 1,
                    }}
                  />
                  Job Duties & Responsibilities
                </Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  {jobDutiesList.map((duty, index) => (
                    <Box component="li" key={index} sx={{ mb: 1.5 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.8 }}
                      >
                        {duty}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Requirements */}
            {requirementsList.length > 0 && (
              <Card
                elevation={0}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: { xs: 2.5, sm: 3 },
                      fontWeight: 700,
                      color: "text.primary",
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 24,
                        bgcolor: "primary.main",
                        borderRadius: 1,
                      }}
                    />
                    Requirements
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    {requirementsList.map((req, index) => (
                      <Box component="li" key={index} sx={{ mb: 1.5 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.8 }}
                        >
                          {req}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Benefits Package */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 2.5, sm: 3 },
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      bgcolor: "secondary.main",
                      borderRadius: 1,
                    }}
                  />
                  Benefits Package
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  {benefitsList.map((benefit, index) => (
                    <Chip
                      key={index}
                      label={benefit}
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Row 3: About Employer */}
          <Grid size={{ xs: 12, md: 4 }}>
            {vacancyDetail?.employer && (
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2.5, fontWeight: 600, color: "text.primary" }}
                  >
                    About Employer
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
                      >
                        Company Name
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {vacancyDetail.employer.company_name}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
                      >
                        Industry
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {vacancyDetail.employer.industry_type}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
                      >
                        Company Size
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {vacancyDetail.employer.number_of_employees} employees
                      </Typography>
                    </Box>
                    {vacancyDetail.employer.website && (
                      <>
                        <Divider />
                        <Button
                          variant="contained"
                          fullWidth
                          href={vacancyDetail.employer.website}
                          target="_blank"
                          startIcon={<Iconify icon="mdi:web" />}
                          sx={{
                            borderRadius: 1,
                            bgcolor: "primary.main",
                            color: "white",
                            fontWeight: 600,
                            "&:hover": {
                              bgcolor: "primary.dark",
                            },
                          }}
                        >
                          Visit Website
                        </Button>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}

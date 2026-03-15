import { useEffect } from "react";

import {
  Box,
  Card,
  Stack,
  Typography,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Iconify } from "src/components/iconify";
import { fDate } from "src/utils/format-time";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchProfileRequest } from "src/redux/actions";

// ----------------------------------------------------------------------

export function ProfileGeneral() {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector(
    (state) => state.profile || { profile: null, loading: false }
  );

  useEffect(() => {
    console.log("Dispatching fetchProfileRequest...");
    dispatch(fetchProfileRequest());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const statusColors = {
      Eligibility: "info",
      "In Progress": "warning",
      Approved: "success",
      Rejected: "error",
      Onboarding: "info",
    };
    return statusColors[status] || "default";
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Failed to load profile data
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2.5}>
      {/* Profile Card - Left Side */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          sx={{
            p: 2.5,
            textAlign: "center",
            position: "relative",
          }}
        >
          <Stack spacing={2} alignItems="center">
            {/* Avatar */}
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={profile.profile_image}
                alt={`${profile.first_name} ${profile.last_name}`}
                sx={{
                  width: { xs: 80, sm: 96 },
                  height: { xs: 80, sm: 96 },
                  border: 3,
                  borderColor: "background.paper",
                  boxShadow: (theme) =>
                    `0 8px 16px -4px ${
                      theme.palette.mode === "light"
                        ? "rgba(145, 158, 171, 0.12)"
                        : "rgba(0, 0, 0, 0.20)"
                    }`,
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                {!profile.profile_image &&
                profile.first_name &&
                profile.last_name
                  ? `${profile.first_name[0]}${profile.last_name[0]}`
                  : null}
              </Avatar>
            </Box>

            {/* Name & Status */}
            <Stack spacing={0.75} alignItems="center">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                }}
              >
                {profile.first_name} {profile.last_name}
              </Typography>
              <Chip
                label={profile.status}
                color={getStatusColor(profile.status)}
                size="small"
                sx={{ fontWeight: 600, fontSize: "0.75rem", height: 24 }}
              />
            </Stack>

            <Divider sx={{ width: "100%", borderStyle: "dashed" }} />
          </Stack>
        </Card>
      </Grid>

      {/* Information Card - Right Side */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack spacing={2.5}>
            {/* Header */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 0.25, fontWeight: 700, fontSize: "1rem" }}
              >
                Personal Information
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8125rem" }}
              >
                Your personal details and information
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: "dashed" }} />

            {/* Name Fields */}
            <Box
              sx={{
                display: "grid",
                gap: { xs: 1.5, sm: 2 },
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: 1.5,
                  bgcolor: "background.neutral",
                  border: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: (theme) => theme.shadows[2],
                  },
                }}
              >
                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Iconify
                      icon="solar:user-bold-duotone"
                      width={16}
                      sx={{ color: "primary.main" }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: "0.6875rem",
                      }}
                    >
                      First Name
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
                  >
                    {profile.first_name}
                  </Typography>
                </Stack>
              </Card>

              <Card
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: 1.5,
                  bgcolor: "background.neutral",
                  border: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: (theme) => theme.shadows[2],
                  },
                }}
              >
                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Iconify
                      icon="solar:user-bold-duotone"
                      width={16}
                      sx={{ color: "primary.main" }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: "0.6875rem",
                      }}
                    >
                      Last Name
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
                  >
                    {profile.last_name}
                  </Typography>
                </Stack>
              </Card>
            </Box>

            {/* Email & Gender */}
            <Box
              sx={{
                display: "grid",
                gap: { xs: 1.5, sm: 2 },
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: 1.5,
                  bgcolor: "background.neutral",
                  border: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: (theme) => theme.shadows[2],
                  },
                }}
              >
                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Iconify
                      icon="solar:letter-bold-duotone"
                      width={16}
                      sx={{ color: "primary.main" }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: "0.6875rem",
                      }}
                    >
                      Email Address
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {profile.email}
                  </Typography>
                </Stack>
              </Card>

              <Card
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: 1.5,
                  bgcolor: "background.neutral",
                  border: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: (theme) => theme.shadows[2],
                  },
                }}
              >
                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Iconify
                      icon="solar:users-group-rounded-bold-duotone"
                      width={16}
                      sx={{ color: "primary.main" }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: "0.6875rem",
                      }}
                    >
                      Gender
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
                  >
                    {profile.gender}
                  </Typography>
                </Stack>
              </Card>
            </Box>

            {/* Phone Fields */}
            <Box
              sx={{
                display: "grid",
                gap: { xs: 1.5, sm: 2 },
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: 1.5,
                  bgcolor: "background.neutral",
                  border: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: (theme) => theme.shadows[2],
                  },
                }}
              >
                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Iconify
                      icon="solar:phone-calling-bold-duotone"
                      width={16}
                      sx={{ color: "success.main" }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: "0.6875rem",
                      }}
                    >
                      Birth Country
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
                  >
                    {profile.birth_country?.name || ""}
                  </Typography>
                </Stack>
              </Card>

              <Card
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: 1.5,
                  bgcolor: "background.neutral",
                  border: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: (theme) => theme.shadows[2],
                  },
                }}
              >
                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Iconify
                      icon="solar:smartphone-bold-duotone"
                      width={16}
                      sx={{ color: "success.main" }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: "0.6875rem",
                      }}
                    >
                      Phone Number
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
                  >
                    {profile.phone}
                  </Typography>
                </Stack>
              </Card>
            </Box>

            {/* DOB & Nationality */}
            <Box
              sx={{
                display: "grid",
                gap: { xs: 1.5, sm: 2 },
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: 1.5,
                  bgcolor: "background.neutral",
                  border: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: (theme) => theme.shadows[2],
                  },
                }}
              >
                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Iconify
                      icon="solar:calendar-bold-duotone"
                      width={16}
                      sx={{ color: "info.main" }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: "0.6875rem",
                      }}
                    >
                      Date of Birth
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
                  >
                    {fDate(profile.dob)}
                  </Typography>
                </Stack>
              </Card>

              <Card
                variant="outlined"
                sx={{
                  p: 1.75,
                  borderRadius: 1.5,
                  bgcolor: "background.neutral",
                  border: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: (theme) => theme.shadows[2],
                  },
                }}
              >
                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Iconify
                      icon="solar:flag-bold-duotone"
                      width={16}
                      sx={{ color: "warning.main" }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: "0.6875rem",
                      }}
                    >
                      Nationality
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
                  >
                    {profile.nationality}
                  </Typography>
                </Stack>
              </Card>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}

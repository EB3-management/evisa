import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Avatar,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { useGetVisaStatus, useGetVisaStatusLog } from "src/api";
import { DashboardContent } from "src/layouts/dashboard";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";

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

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function VisaStatusTimeline() {
  const [selectedVacancyId, setSelectedVacancyId] = useState("");
  
  const { visaStatus, visaStatusLoading, visaStatusError } = useGetVisaStatus();

  const { visaStatusLogs, visaStatusLogsLoading, visaStatusLogsError } =
    useGetVisaStatusLog();

  // All applied vacancies
  const allAppliedVacancies = visaStatusLogs || [];

  // Set default selected vacancy when data loads
  useEffect(() => {
    if (allAppliedVacancies.length > 0 && !selectedVacancyId) {
      setSelectedVacancyId(allAppliedVacancies[0].id);
    }
  }, [allAppliedVacancies, selectedVacancyId]);

  // Find selected vacancy data
  const selectedVacancyData = allAppliedVacancies.find(
    (v) => v.id === selectedVacancyId
  );

  // Use selected vacancy data or sample data
  const data = selectedVacancyData;
  const logs = data?.logs || [];
  const currentStatus = data?.visa_status;
  const statuses = visaStatus || [];

  // Handle vacancy selection change
  const handleVacancyChange = (event) => {
    setSelectedVacancyId(event.target.value);
  };

  // Create a Set of completed status names from logs (including current_visa_status)
  const completedStatuses = new Set(
    logs.map((log) => log.current_visa_status?.name)
  );

  // ✅ DRAFT is always completed
  completedStatuses.add("DRAFT");

  // Find the log for each status if it exists
  const getLogForStatus = (statusName) =>
    logs.find((log) => log.current_visa_status?.name === statusName);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Visa Status",
            href: paths.dashboard.visaStatus.root,
          },
          { name: "Status" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card
        elevation={0}
        sx={{
          borderColor: "divider",
          background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Header */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={{ xs: 2, sm: 3 }}
            sx={{ mb: 4 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Visa Status Timeline
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {/* Vacancy Dropdown */}
              {allAppliedVacancies.length > 0 && (
                <FormControl
                  sx={{
                    minWidth: { xs: "100%", sm: 250, md: 300 },
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
                    {allAppliedVacancies.map((vacancy) => (
                      <MenuItem key={vacancy.id} value={vacancy.id}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Iconify icon="mdi:briefcase" width={20} />
                          <Typography variant="body2">
                            {vacancy.applied_vacancy?.vacancy?.title || "N/A"} -{" "}
                            {vacancy.applied_vacancy?.vacancy?.employer_name ||
                              "N/A"}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Current Status Badge */}
              {currentStatus && (
                <Chip
                  label={formatStatusName(currentStatus.name)}
                  icon={
                    <Iconify
                      icon={
                        statusIcons[currentStatus.name] || "mdi:information"
                      }
                      width={18}
                    />
                  }
                  sx={{
                    bgcolor: "success.lighter",
                    color: "success.darker",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    px: 1,
                    minWidth: { xs: "auto", sm: 150 },
                  }}
                />
              )}
            </Stack>
          </Stack>

          {/* Timeline */}
          {statuses.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                color: "text.secondary",
              }}
            >
              <Iconify
                icon="mdi:timeline-clock-outline"
                width={64}
                sx={{ mb: 2, opacity: 0.5 }}
              />
              <Typography variant="body1">
                No visa status updates yet
              </Typography>
            </Box>
          ) : (
            <Box sx={{ position: "relative" }}>
              {statuses.map((status, index) => {
                const isLast = index === statuses.length - 1;
                const isCompleted = completedStatuses.has(status.name);
                const isCurrent = currentStatus?.name === status.name;
                const log = getLogForStatus(status.name);
                const icon = statusIcons[status.name] || "mdi:check-circle";

                return (
                  <Box
                    key={status.id}
                    sx={{
                      position: "relative",
                      pb: isLast ? 0 : 4,
                      opacity: isCompleted ? 1 : 0.4,
                      transition: "opacity 0.3s",
                    }}
                  >
                    {/* Timeline line */}
                    {!isLast && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: 20,
                          top: 48,
                          bottom: -16,
                          width: 2,
                          bgcolor: isCompleted ? "success.main" : "divider",
                        }}
                      />
                    )}

                    {/* Timeline item */}
                    <Stack direction="row" spacing={2}>
                      {/* Icon */}
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: isCompleted
                            ? isCurrent
                              ? "primary.main"
                              : "success.main"
                            : "grey.300",
                          boxShadow: isCompleted ? (isCurrent ? 3 : 2) : 0,
                          zIndex: 1,
                        }}
                      >
                        <Iconify
                          icon={isCompleted ? icon : "mdi:clock-outline"}
                          width={20}
                          color={isCompleted ? "white" : "grey.500"}
                        />
                      </Avatar>

                      {/* Content */}
                      <Box
                        sx={{
                          flex: 1,
                          bgcolor: isCompleted
                            ? isCurrent
                              ? "primary.lighter"
                              : "background.paper"
                            : "grey.50",
                          border: 1,
                          borderColor: isCompleted
                            ? isCurrent
                              ? "primary.main"
                              : "divider"
                            : "grey.300",
                          borderRadius: 2,
                          p: 2.5,
                          transition: "all 0.3s",
                          "&:hover": isCompleted
                            ? {
                                boxShadow: 2,
                                transform: "translateX(4px)",
                              }
                            : {},
                        }}
                      >
                        <Stack spacing={1.5}>
                          {/* Status name */}
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                color: isCompleted
                                  ? isCurrent
                                    ? "primary.dark"
                                    : "text.primary"
                                  : "text.disabled",
                              }}
                            >
                              {formatStatusName(status.name)}
                            </Typography>
                            {isCurrent && isCompleted && (
                              <Chip
                                label="Current"
                                size="small"
                                sx={{
                                  bgcolor: "primary.main",
                                  color: "white",
                                  fontWeight: 600,
                                  fontSize: "0.7rem",
                                  height: 20,
                                }}
                              />
                            )}
                            {!isCompleted && (
                              <Chip
                                label="Pending"
                                size="small"
                                sx={{
                                  bgcolor: "grey.300",
                                  color: "text.disabled",
                                  fontWeight: 600,
                                  fontSize: "0.7rem",
                                  height: 20,
                                }}
                              />
                            )}
                          </Stack>

                          {/* Description */}
                          <Typography
                            variant="body2"
                            sx={{
                              color: isCompleted
                                ? "text.secondary"
                                : "text.disabled",
                              fontSize: "0.875rem",
                            }}
                          >
                            {status.description}
                          </Typography>

                          {/* Show additional info only for completed statuses */}
                          {isCompleted && log && (
                            <>
                              {/* Remarks */}
                              {log.remarks && (
                                <Box
                                  sx={{
                                    bgcolor: isCurrent
                                      ? "primary.lighter"
                                      : "background.neutral",
                                    borderRadius: 1,
                                    p: 1.5,
                                    borderLeft: 3,
                                    borderColor: isCurrent
                                      ? "primary.main"
                                      : "success.main",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: 600,
                                      textTransform: "uppercase",
                                      fontSize: "0.65rem",
                                      mb: 0.5,
                                      display: "block",
                                    }}
                                  >
                                    Remarks
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "text.primary",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    {log.remarks}
                                  </Typography>
                                </Box>
                              )}

                              <Divider sx={{ my: 0.5 }} />

                              {/* Date and Updated by */}
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                justifyContent="space-between"
                                spacing={1}
                              >
                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  alignItems="center"
                                >
                                  <Iconify
                                    icon="mdi:calendar-clock"
                                    width={16}
                                    sx={{ color: "text.secondary" }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {formatDate(log.created_at)}
                                  </Typography>
                                </Stack>

                                {log.updated_by && (
                                  <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                  >
                                    <Iconify
                                      icon="mdi:account-circle"
                                      width={16}
                                      sx={{ color: "text.secondary" }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{ color: "text.secondary" }}
                                    >
                                      Updated by {log.updated_by.name}
                                    </Typography>
                                  </Stack>
                                )}
                              </Stack>
                            </>
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>
    </DashboardContent>
  );
}

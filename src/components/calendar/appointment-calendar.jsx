import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { Box, Card, IconButton, Typography, Stack, Chip } from "@mui/material";
import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export function AppointmentCalendar({ appointments, onEventClick, isLoading }) {
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Flatten all appointments by date, across all categories
  const availableDatesMap = useMemo(() => {
    const map = new Map();
    if (!appointments || appointments.length === 0) return map;
    const today = dayjs().startOf("day");
    appointments.forEach((category) => {
      (category.appointments || []).forEach((appt) => {
        const apptDate = dayjs(appt.date).startOf("day");
        if (
          (apptDate.isSame(today, "day") || apptDate.isAfter(today)) &&
          appt.status === "Available"
        ) {
          const key = apptDate.format("YYYY-MM-DD");
          if (!map.has(key)) map.set(key, []);
          map.get(key).push({ ...appt, category });
        }
      });
    });
    return map;
  }, [appointments]);

  // Calendar grid for current month
  const calendarData = useMemo(() => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");
    const days = [];
    let day = startDate;
    while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
      days.push(day);
      day = day.add(1, "day");
    }
    return days;
  }, [currentDate]);

  const handlePrevMonth = () =>
    setCurrentDate(currentDate.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));
  const handleToday = () => setCurrentDate(dayjs());
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card
      sx={{
        p: { xs: 3, sm: 4 },
        width: "100%",
        maxWidth: { xs: "100%", sm: 480, md: 520 },
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
      }}
    >
      {/* Calendar Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: { xs: 2, md: 3 } }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
            background: "linear-gradient(135deg, #0e8b7e 0%, #ffbc48 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {currentDate.format("MMMM YYYY")}
        </Typography>
        <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
          <IconButton
            size="small"
            onClick={handleToday}
            sx={{
              bgcolor: "primary.lighter",
            }}
          >
            <Iconify icon="solar:calendar-bold" width={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={handlePrevMonth}
            sx={{
              bgcolor: "action.hover",
              "&:hover": {
                bgcolor: "primary.lighter",
                transform: "translateX(-2px)",
              },
              transition: "all 0.2s",
            }}
          >
            <Iconify icon="eva:arrow-ios-back-fill" width={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleNextMonth}
            sx={{
              bgcolor: "action.hover",
              "&:hover": {
                bgcolor: "primary.lighter",
                transform: "translateX(2px)",
              },
              transition: "all 0.2s",
            }}
          >
            <Iconify icon="eva:arrow-ios-forward-fill" width={18} />
          </IconButton>
        </Stack>
      </Stack>

      {/* Week Days Header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: { xs: 0.5, sm: 1 },
          mb: { xs: 0.5, sm: 1 },
        }}
      >
        {weekDays.map((day) => (
          <Box
            key={day}
            sx={{
              textAlign: "center",
              py: { xs: 0.5, sm: 1 },
              fontWeight: 700,
              color: "text.secondary",
              fontSize: { xs: "0.65rem", sm: "0.75rem" },
              textTransform: "uppercase",
            }}
          >
            {day}
          </Box>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        {calendarData.map((day, index) => {
          const key = day.format("YYYY-MM-DD");
          const slots = availableDatesMap.get(key) || [];
          const isCurrentMonth = day.month() === currentDate.month();
          const isToday = day.isSame(dayjs(), "day");
          const isAvailable = slots.length > 0;
          return (
            <Box
              key={index}
              onClick={() => isAvailable && onEventClick(day)}
              sx={{
                minHeight: { xs: 50, sm: 60, md: 70 },
                p: { xs: 0.3, sm: 0.5 },
                border: 2,
                borderColor: isToday ? "primary.main" : "divider",
                borderRadius: 1.5,
                cursor: isAvailable ? "pointer" : "default",
                bgcolor: isCurrentMonth
                  ? isAvailable
                    ? "primary.lighter"
                    : "background.paper"
                  : "action.hover",
                opacity: isCurrentMonth ? 1 : 0.4,
                transition: "all 0.2s ease-in-out",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  ...(isAvailable && {
                    bgcolor: "primary.light",
                    transform: "scale(1.08)",
                    boxShadow: 3,
                    zIndex: 1,
                  }),
                },
                ...(isToday && {
                  boxShadow: 2,
                  bgcolor: isAvailable ? "primary.lighter" : "action.selected",
                }),
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isToday ? 800 : 600,
                  color: isToday ? "primary.main" : "text.primary",
                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.85rem" },
                  mb: isAvailable ? 0.3 : 0,
                }}
              >
                {day.format("D")}
              </Typography>
              {isAvailable && (
                <Chip
                  label={`${slots.length} slots`}
                  size="small"
                  sx={{
                    height: { xs: 16, sm: 18 },
                    fontSize: { xs: "0.6rem", sm: "0.65rem" },
                    fontWeight: 700,
                    minWidth: { xs: 45, sm: 50 },
                    width: "auto",
                    "& .MuiChip-label": {
                      px: { xs: 0.75, sm: 1 },
                      whiteSpace: "nowrap",
                    },
                  }}
                  color="success"
                />
              )}
            </Box>
          );
        })}
      </Box>

      {isLoading && (
        <Box sx={{ textAlign: "center", py: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            🔄 Loading appointments...
          </Typography>
        </Box>
      )}
    </Card>
  );
}

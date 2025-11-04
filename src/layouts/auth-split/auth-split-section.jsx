import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import { RouterLink } from "src/routes/components";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchAppointmentsRequest } from "src/redux/actions";
import { AppointmentCalendar } from "src/components/calendar/appointment-calendar";
import { AppointmentBookingDialog } from "src/components/calendar/appointment-booking-dialog";

// ----------------------------------------------------------------------

export function AuthSplitSection(props) {
  const {
    sx,
    method,
    methods,
    layoutQuery = "md",
    title = "Book an Appointment",
    imgUrl = `/assets/illustrations/illustration-dashboard.webp`,
    subtitle = "Your Gateway to the American Dream 🇺🇸",
    disableSplit,
    ...other
  } = props;

  const dispatch = useAppDispatch();
  const [animate, setAnimate] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  // Get appointments from Redux store
  const { appointments, isLoading } = useAppSelector(
    (state) => state.appointment || { appointments: [], isLoading: false }
  );

  // Fetch appointments when component mounts
  useEffect(() => {
    dispatch(fetchAppointmentsRequest());
  }, [dispatch]);

  // Animation effect
  useEffect(() => {
    // Initial animation trigger
    const initialTimer = setTimeout(() => {
      setAnimate(true);
    }, 100);

    // Set up interval to repeat animation every second
    const animationInterval = setInterval(() => {
      setAnimate(false); // Reset
      setTimeout(() => {
        setAnimate(true); // Re-trigger
      }, 50);
    }, 1000); // Repeat every 1 second

    return () => {
      clearTimeout(initialTimer);
      clearInterval(animationInterval);
    };
  }, []); // Run once on mount

  // Handle calendar event click
  const handleEventClick = (date, timeSlots) => {
    setSelectedDate(date);
    setSelectedTimeSlots(timeSlots);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDate(null);
    setSelectedTimeSlots([]);
  };

  const handleBookingSuccess = () => {
    // Refresh appointments after successful booking
    dispatch(fetchAppointmentsRequest());
  };

  return (
    <Box
      sx={[
        (theme) => ({
          px: 3,
          pb: 3,
          width: 1,
          maxWidth: 480,
          display: "none",
          position: "relative",
          pt: "var(--layout-header-desktop-height)",
          [theme.breakpoints.up(layoutQuery)]: {
            gap: 8,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <div>
        <Zoom in={animate} timeout={500}>
          <Typography
            variant="h3"
            key={animate ? "title-animated" : "title-reset"}
            sx={{
              textAlign: "center",
              color: "white",
              animation: animate ? "popup 0.4s ease-out" : "none",
              "@keyframes popup": {
                "0%": {
                  transform: "scale(0.7)",
                  opacity: 0,
                },
                "60%": {
                  transform: "scale(1.1)",
                },
                "100%": {
                  transform: "scale(1)",
                  opacity: 1,
                },
              },
            }}
          >
            {title}
          </Typography>
        </Zoom>

        {subtitle && (
          <Zoom in={animate} timeout={500}>
            <Typography
              key={animate ? "animated" : "reset"}
              sx={{
                textAlign: "center",
                mt: 2,
                color: "white",
                animation: animate ? "popup 0.4s ease-out" : "none",
                "@keyframes popup": {
                  "0%": {
                    transform: "scale(0.7)",
                    opacity: 0,
                  },
                  "60%": {
                    transform: "scale(1.1)",
                  },
                  "100%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                },
              }}
            >
              {subtitle}
            </Typography>
          </Zoom>
        )}
      </div>

      {/* Calendar replacing image */}
      <AppointmentCalendar
        appointments={appointments}
        onEventClick={handleEventClick}
        isLoading={isLoading}
      />

      {/* Booking Dialog */}
      <AppointmentBookingDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        selectedDate={selectedDate}
        timeSlots={selectedTimeSlots}
        onBookingSuccess={handleBookingSuccess}
      />

      {!!methods?.length && method && (
        <Box component="ul" sx={{ gap: 2, display: "flex" }}>
          {methods.map((option) => {
            const selected = method === option.label.toLowerCase();

            return (
              <Box
                key={option.label}
                component="li"
                sx={{
                  ...(!selected && {
                    cursor: "not-allowed",
                    filter: "grayscale(1)",
                  }),
                }}
              >
                <Tooltip title={option.label} placement="top">
                  <Link
                    component={RouterLink}
                    href={option.path}
                    sx={{ ...(!selected && { pointerEvents: "none" }) }}
                  >
                    <Box
                      component="img"
                      alt={option.label}
                      src={option.icon}
                      sx={{ width: 32, height: 32 }}
                    />
                  </Link>
                </Tooltip>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

AuthSplitSection.propTypes = {
  sx: PropTypes.object,
  method: PropTypes.string,
  title: PropTypes.string,
  imgUrl: PropTypes.string,
  subtitle: PropTypes.string,
  methods: PropTypes.array,
  layoutQuery: PropTypes.string,
  disableSplit: PropTypes.bool || undefined,
};

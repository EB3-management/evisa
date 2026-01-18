import { z as zod } from "zod";
import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  Box,
  Button,
  Stack,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip,
  TextField,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import {
  fetchAppointmentsRequest,
  fetchProfileRequest,
} from "src/redux/actions";

import { Form } from "src/components/hook-form";

import { toast } from "src/components/snackbar";

import { createAppointment } from "src/api";
import Grid from "@mui/material/Grid2";

// ----------------------------------------------------------------------

// Schema for booking form
export const bookingSchema = zod.object({
  name: zod.string().min(1, "Name is required"),
  email: zod.string().email("Invalid email address"),
  contact_number: zod
    .string()
    .min(10, "Contact number must be at least 10 digits"),
  address: zod.string().min(1, "Address is required"),
  remarks: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function AppointmentTimeSlotNewEditForm({
  open,
  onClose,
  selectedTimeSlot,
  onClearSelectedTimeSlot,
}) {
  const dispatch = useAppDispatch();

  // Get appointments from Redux store (matching the slice structure)
  const { appointments, isLoading } = useAppSelector(
    (state) => state.appointment || { appointments: [], isLoading: false }
  );

  // Get profile data from Redux store
  const { profile } = useAppSelector(
    (state) => state.profile || { profile: null }
  );

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Initialize form with useForm hook
  const methods = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      contact_number: "",
      address: "",
      remarks: "",
    },
  });

  // Fetch appointments and profile when component mounts
  useEffect(() => {
    if (open) {
      dispatch(fetchAppointmentsRequest());
      dispatch(fetchProfileRequest());
    }
  }, [dispatch, open]);

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile && showBookingForm) {
      const fullName = `${profile.first_name || ""} ${
        profile.last_name || ""
      }`.trim();
      const phoneNumber =
        profile.country_code && profile.phone
          ? `${profile.country_code}${profile.phone}`
          : profile.phone || "";

      methods.reset({
        name: fullName,
        email: profile.email || "",
        contact_number: phoneNumber,
        address: profile.address || "",
        remarks: "",
      });
    }
  }, [profile, showBookingForm, methods]);

  // Get unique categories from API response
  const categoryList = useMemo(() => {
    if (!appointments || appointments.length === 0) return [];

    return appointments.map((item) => ({
      id: item.category_id,
      name: item.appointments[0]?.category?.title || `Category ${item.category_id}`,
    }));
  }, [appointments]);

  // Get available dates for selected category (filter out past dates)
  const dateList = useMemo(() => {
    if (!appointments || appointments.length === 0 || !selectedCategory) return [];

    const today = dayjs().startOf('day');

    // Find the selected category data
    const categoryData = appointments.find(
      (item) => item.category_id === selectedCategory
    );

    if (!categoryData || !categoryData.appointments) return [];

    // Extract unique dates from appointments
    const uniqueDates = new Map();
    categoryData.appointments.forEach((appointment) => {
      const dateKey = dayjs(appointment.date).format("YYYY-MM-DD");
      const appointmentDate = dayjs(appointment.date).startOf('day');
      
      // Only include today or future dates
      if (appointmentDate.isSame(today, 'day') || appointmentDate.isAfter(today)) {
        if (!uniqueDates.has(dateKey)) {
          uniqueDates.set(dateKey, {
            value: dateKey,
            label: dayjs(appointment.date).format("dddd, MMMM D, YYYY"),
            rawDate: appointment.date,
          });
        }
      }
    });

    return Array.from(uniqueDates.values());
  }, [appointments, selectedCategory]);

  // Get time slots for selected date and category
  const timeSlots = useMemo(() => {
    if (!selectedDate || !selectedCategory || !appointments) return [];

    // Find the selected category data
    const categoryData = appointments.find(
      (item) => item.category_id === selectedCategory
    );

    if (!categoryData || !categoryData.appointments) return [];

    // Filter appointments by selected date
    return categoryData.appointments.filter(
      (appointment) => dayjs(appointment.date).format("YYYY-MM-DD") === selectedDate
    );
  }, [selectedDate, selectedCategory, appointments]);

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const handleCloseAndReset = () => {
    onClose();
    reset();
    setSelectedCategory("");
    setSelectedDate("");
    setSelectedTime(null);
    setShowBookingForm(false);
    onClearSelectedTimeSlot?.();
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedDate("");
    setSelectedTime(null);
    setShowBookingForm(false);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTime(null);
    setShowBookingForm(false);
  };

  const handleTimeSlotClick = (timeSlot) => {
    if (timeSlot.status === "Available") {
      setSelectedTime(timeSlot);
      setShowBookingForm(true);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Prepare booking data matching API requirements
      const bookingData = {
        appointment_id: selectedTime.id, // ID from the selected time slot
        name: data.name,
        email: data.email,
        contact_number: data.contact_number,
        address: data.address,
        remarks: data.remarks || "",
      };

      console.log("Booking Data:", bookingData);

      // Call the create appointment API
      const response = await createAppointment(bookingData);

      console.log("API Response:", response);

      toast.success(response?.message || "Appointment booked successfully!");

      // Refresh appointments list
      dispatch(fetchAppointmentsRequest());

      handleCloseAndReset();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to book appointment. Please try again."
      );
    }
  });

  const renderCategorySelection = () => (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        bgcolor: "background.paper",
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        boxShadow: 1,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1.5,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          fontSize: { xs: "0.85rem", sm: "0.9rem" },
        }}
      >
        <span style={{ fontSize: "1rem" }}>📋</span>
        Select Category
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel>Choose a category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Choose a category"
          disabled={isLoading}
          sx={{
            borderRadius: 1.5,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "divider",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
          }}
        >
          {categoryList.length === 0 ? (
            <MenuItem value="">
              <em>No categories available</em>
            </MenuItem>
          ) : (
            categoryList.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))
          )}
        </Select>
        {!selectedCategory && (
          <FormHelperText sx={{ fontSize: "0.7rem", mt: 0.75 }}>
            Please select a category first
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );

  const renderDateSelection = () => {
    if (!selectedCategory) return null;

    return (
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          bgcolor: "background.paper",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          boxShadow: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
          }}
        >
          <span style={{ fontSize: "1rem" }}>📆</span>
          Select Date
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel>Choose a date</InputLabel>
          <Select
            value={selectedDate}
            onChange={handleDateChange}
            label="Choose a date"
            disabled={isLoading}
            sx={{
              borderRadius: 1.5,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "divider",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            }}
          >
            {dateList.length === 0 ? (
              <MenuItem value="">
                <em>No dates available</em>
              </MenuItem>
            ) : (
              dateList.map((date) => (
                <MenuItem key={date.value} value={date.value}>
                  {date.label}
                </MenuItem>
              ))
            )}
          </Select>
          {!selectedDate && (
            <FormHelperText sx={{ fontSize: "0.7rem", mt: 0.75 }}>
              Please select a date to view available slots
            </FormHelperText>
          )}
        </FormControl>
      </Box>
    );
  };

  const renderTimeSlots = () => {
    if (!selectedDate) return null;

    if (isLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={32} />
        </Box>
      );
    }

    return (
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          bgcolor: "background.paper",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          boxShadow: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
          }}
        >
          <span style={{ fontSize: "1rem" }}>⏰</span>
          Available Time Slots
        </Typography>
        {timeSlots.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
              py: 3,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            No time slots available for this date
          </Typography>
        ) : (
          <Grid container spacing={{ xs: 1, sm: 1.5 }}>
            {timeSlots.map((slot) => (
              <Grid item xs={6} sm={4} key={slot.id}>
                <Chip
                  label={`${slot.start_time} - ${slot.end_time}`}
                  onClick={() => handleTimeSlotClick(slot)}
                  color={selectedTime?.id === slot.id ? "primary" : "default"}
                  variant={selectedTime?.id === slot.id ? "filled" : "outlined"}
                  disabled={slot.status !== "Available"}
                  sx={{
                    width: "100%",
                    height: "auto",
                    py: { xs: 1.25, sm: 1.5 },
                    cursor:
                      slot.status === "Available" ? "pointer" : "not-allowed",
                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                    fontWeight: selectedTime?.id === slot.id ? 600 : 400,
                    borderRadius: 1.5,
                    "&:hover": {
                      backgroundColor:
                        slot.status === "Available"
                          ? "action.hover"
                          : "transparent",
                      transform:
                        slot.status === "Available" ? "scale(1.05)" : "none",
                      boxShadow: slot.status === "Available" ? 2 : 0,
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  };

  const renderBookingForm = () => {
    if (!showBookingForm) return null;

    return (
      <Box
        sx={{
          mt: 2,
          p: { xs: 1.5, sm: 2 },
          bgcolor: "background.paper",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          boxShadow: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
          }}
        >
          <span style={{ fontSize: "1rem" }}>📝</span>
          Your Information
        </Typography>

        <Stack spacing={{ xs: 1.5, sm: 2 }}>
          {/* Selected Date & Time Display */}
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              bgcolor: "primary.lighter",
              borderRadius: 1.5,
              border: 1.5,
              borderColor: "primary.main",
              boxShadow: 1,
            }}
          >
            <Stack spacing={0.3}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
                fontSize="0.7rem"
              >
                Selected Date & Time
              </Typography>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                fontSize={{ xs: "0.85rem", sm: "0.9rem" }}
              >
                {dateList.find((d) => d.value === selectedDate)?.label}
              </Typography>
              <Typography
                variant="body2"
                color="primary.main"
                fontWeight={600}
                fontSize={{ xs: "0.8rem", sm: "0.875rem" }}
              >
                ⏰ {selectedTime?.start_time} - {selectedTime?.end_time}
              </Typography>
            </Stack>
          </Box>

          {/* Name Field - Read Only */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Full Name"
                placeholder="Enter your full name"
                fullWidth
                size="small"
                error={!!error}
                helperText={error?.message}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    bgcolor: "action.hover",
                    cursor: "not-allowed",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            )}
          />

          {/* Email Field - Read Only */}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                fullWidth
                size="small"
                error={!!error}
                helperText={error?.message}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    bgcolor: "action.hover",
                    cursor: "not-allowed",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            )}
          />

          {/* Contact Field - Read Only */}
          <Controller
            name="contact_number"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Contact Number"
                placeholder="Enter your contact number"
                fullWidth
                size="small"
                error={!!error}
                helperText={error?.message}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    bgcolor: "action.hover",
                    cursor: "not-allowed",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            )}
          />

          {/* Address Field - Editable */}
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Address"
                placeholder="Enter your address"
                multiline
                rows={2}
                fullWidth
                size="small"
                error={!!error}
                helperText={error?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    "&:hover": {
                      boxShadow: 1,
                    },
                    "&.Mui-focused": {
                      boxShadow: 2,
                    },
                  },
                }}
              />
            )}
          />

          {/* Remarks Field */}
          <Controller
            name="remarks"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Remarks (Optional)"
                placeholder="Any additional information"
                multiline
                rows={3}
                fullWidth
                size="small"
                error={!!error}
                helperText={error?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    "&:hover": {
                      boxShadow: 1,
                    },
                    "&.Mui-focused": {
                      boxShadow: 2,
                    },
                  },
                }}
              />
            )}
          />
        </Stack>
      </Box>
    );
  };

  const renderActions = () => (
    <Box
      sx={{
        gap: { xs: 1.5, sm: 2 },
        display: "flex",
        flexDirection: { xs: "column-reverse", sm: "row" },
        justifyContent: "flex-end",
        pt: 2,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Button
        variant="outlined"
        onClick={handleCloseAndReset}
        fullWidth={false}
        sx={{
          minWidth: { xs: "100%", sm: 120 },
          borderRadius: 1.5,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Cancel
      </Button>

      {showBookingForm && (
        <LoadingButton
          color="primary"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          loadingIndicator="Booking..."
          sx={{
            minWidth: { xs: "100%", sm: 160 },
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Confirm Booking
        </LoadingButton>
      )}
    </Box>
  );

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleCloseAndReset}
      PaperProps={{
        sx: {
          maxHeight: { xs: "100vh", sm: "90vh" },
          borderRadius: { xs: 0, sm: 3 },
          m: { xs: 0, sm: 2 },
          maxWidth: { xs: "100%", sm: 500 },
          boxShadow: { xs: 0, sm: 8 },
        },
      }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 2, sm: 2.5 }} sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Header */}
          <Box
            sx={{
              textAlign: "center",
              pb: 1,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                mb: 0.5,
              }}
            >
              📅 Book an Appointment
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Select a category, date and time slot to continue
            </Typography>
          </Box>

          {renderCategorySelection()}

          {renderDateSelection()}

          {renderTimeSlots()}

          {renderBookingForm()}

          {renderActions()}
        </Stack>
      </Form>
    </Dialog>
  );
}

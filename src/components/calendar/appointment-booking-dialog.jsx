import { z as zod } from "zod";
import { useMemo, useState, useEffect } from "react";
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
  Chip,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

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

export function AppointmentBookingDialog({
  open,
  onClose,
  selectedDate,
  timeSlots,
  onBookingSuccess,
  allAppointments = [],
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

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

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const handleCloseAndReset = () => {
    onClose();
    reset();
    setSelectedCategory(null);
    setSelectedTime(null);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedTime(null);
  };

  const handleTimeSlotClick = (timeSlot) => {
    if (timeSlot.status === "Available") {
      setSelectedTime(timeSlot);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!selectedTime) {
      toast.error("Please select a time slot");
      return;
    }

    try {
      const bookingData = {
        appointment_id: selectedTime.id,
        name: data.name,
        email: data.email,
        contact_number: data.contact_number,
        address: data.address,
        remarks: data.remarks || "",
      };

      console.log("Booking Data:", bookingData);

      const response = await createAppointment(bookingData);

      console.log("API Response:", response);

      toast.success(response?.message || "Appointment booked successfully!");

      if (onBookingSuccess) {
        onBookingSuccess();
      }

      handleCloseAndReset();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to book appointment. Please try again.",
      );
    }
  });

  // Get categories that have appointments on the selected date
  const categoriesForSelectedDate = useMemo(() => {
    if (!selectedDate || !Array.isArray(allAppointments)) return [];

    const dateKey = dayjs(selectedDate).format("YYYY-MM-DD");

    const categoriesWithAppointments = allAppointments
      .filter((item) => {
        const hasAppointmentOnDate = item.appointments?.some(
          (appt) =>
            dayjs(appt.date).format("YYYY-MM-DD") === dateKey &&
            appt.status === "Available",
        );
        return hasAppointmentOnDate;
      })
      .map((item) => ({
        id: item.category?.id || item.category_id,
        title:
          item.category?.title || item.category_name || item.category?.name,
      }))
      .filter((cat) => cat.id && cat.title);

    return categoriesWithAppointments;
  }, [selectedDate, allAppointments]);

  // Auto-select category and date when modal opens
  useEffect(() => {
    if (open && selectedDate && categoriesForSelectedDate.length > 0) {
      // If only one category, auto-select it
      if (categoriesForSelectedDate.length === 1) {
        setSelectedCategory(categoriesForSelectedDate[0]);
      }
    }
  }, [open, selectedDate, categoriesForSelectedDate]);

  // Get available time slots for selected date
  const availableTimeSlots = useMemo(() => {
    if (!selectedCategory || !selectedDate) return [];
    const cat = allAppointments.find(
      (c) => (c.category?.id || c.category_id) === selectedCategory.id,
    );
    if (!cat) return [];
    return (cat.appointments || []).filter(
      (appt) =>
        appt.status === "Available" &&
        dayjs(appt.date).format("YYYY-MM-DD") ===
          dayjs(selectedDate).format("YYYY-MM-DD"),
    );
  }, [selectedCategory, selectedDate, allAppointments]);

  // Show Selected Date
  const renderSelectedDate = () => {
    if (!selectedDate) return null;
    return (
      <Box
        sx={{
          mb: 2,
          p: 2,
          bgcolor: "primary.lighter",
          borderRadius: 1.5,
          border: 1.5,
          borderColor: "primary.main",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={500}
          fontSize="0.7rem"
        >
          📅 SELECTED DATE
        </Typography>
        <Typography
          variant="body1"
          fontWeight={700}
          color="primary.main"
          sx={{ mt: 0.5 }}
        >
          {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}
        </Typography>
      </Box>
    );
  };

  // Step 1: Select Category (only if multiple categories)
  const renderCategoryStep = () => {
    if (!selectedDate) return null;

    // If only one category, show it as selected
    if (categoriesForSelectedDate.length === 1 && selectedCategory) {
      return (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            📋 Category
          </Typography>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "background.neutral",
              borderRadius: 1.5,
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {selectedCategory.title}
            </Typography>
          </Box>
        </Box>
      );
    }

    // If multiple categories, show dropdown
    if (categoriesForSelectedDate.length > 1) {
      return (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            1️⃣ Select Appointment Category
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory ? selectedCategory.id : ""}
              label="Category"
              onChange={(e) => {
                const cat = categoriesForSelectedDate.find(
                  (c) => c.id === e.target.value,
                );
                handleCategorySelect(cat);
              }}
            >
              {categoriesForSelectedDate.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );
    }

    return null;
  };

  // Date step is removed - date comes from calendar click

  // Step 2 or 3: Select Time Slot (depends on if category selection is shown)
  const renderTimeSlots = () => {
    if (!selectedCategory || !selectedDate) return null;

    const stepNumber = categoriesForSelectedDate.length === 1 ? "1️⃣" : "2️⃣";

    return (
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          bgcolor: "background.neutral",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
            fontWeight: 600,
            color: "text.primary",
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
          }}
        >
          {stepNumber} Select Time Slot
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1.5, display: "block" }}
        >
          {dayjs(selectedDate).format("ddd, MMM D, YYYY")}
        </Typography>
        {availableTimeSlots.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 3,
              px: 2,
              bgcolor: "background.paper",
              borderRadius: 1.5,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize="0.85rem"
            >
              😔 No slots available
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 0.75, sm: 1 }}>
            {availableTimeSlots.map((slot) => (
              <Grid item xs={6} sm={6} key={slot.id}>
                <Chip
                  label={`${slot.start_time} - ${slot.end_time}`}
                  onClick={() => handleTimeSlotClick(slot)}
                  color={selectedTime?.id === slot.id ? "primary" : "default"}
                  variant={selectedTime?.id === slot.id ? "filled" : "outlined"}
                  disabled={slot.status !== "Available"}
                  icon={
                    selectedTime?.id === slot.id ? (
                      <span style={{ fontSize: "0.9rem" }}>✓</span>
                    ) : null
                  }
                  sx={{
                    width: "100%",
                    height: "auto",
                    py: { xs: 1, sm: 1.2 },
                    cursor:
                      slot.status === "Available" ? "pointer" : "not-allowed",
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    fontWeight: selectedTime?.id === slot.id ? 600 : 400,
                    boxShadow: selectedTime?.id === slot.id ? 2 : 0,
                    "&:hover": {
                      backgroundColor:
                        slot.status === "Available"
                          ? selectedTime?.id === slot.id
                            ? "primary.dark"
                            : "action.hover"
                          : "transparent",
                      transform:
                        slot.status === "Available" ? "scale(1.03)" : "none",
                      boxShadow: slot.status === "Available" ? 3 : 0,
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
    if (!selectedCategory || !selectedDate || !selectedTime) return null;
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
                📅 SELECTED TIME SLOT
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                color="primary.dark"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.85rem" } }}
              >
                {dayjs(selectedDate).format("ddd, MMM D, YYYY")}
              </Typography>
              <Typography
                variant="body1"
                color="primary.main"
                fontWeight={700}
                sx={{
                  fontSize: { xs: "0.9rem", sm: "0.95rem" },
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <span>🕒</span>
                {selectedTime?.start_time} - {selectedTime?.end_time}
              </Typography>
            </Stack>
          </Box>

          {/* Name Field - Editable */}
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

          {/* Email Field - Editable */}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Email Address"
                type="email"
                placeholder="your.email@example.com"
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

          {/* Contact Field - Editable */}
          <Controller
            name="contact_number"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Contact Number"
                placeholder="+1 (555) 123-4567"
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

          {/* Address Field - Editable */}
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Address"
                placeholder="Enter your full address"
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
                placeholder="Any additional information or special requests..."
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

      {selectedTime && (
        <LoadingButton
          color="primary"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          loadingIndicator="Booking..."
          fullWidth={false}
          sx={{
            minWidth: { xs: "100%", sm: 160 },
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-2px)",
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
                color: "primary.main",
                WebkitBackgroundClip: "text",
                mb: 0.5,
              }}
            >
              📅 Book Appointment
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Please follow the steps to book your appointment
            </Typography>
          </Box>

          {renderSelectedDate()}
          {renderCategoryStep()}
          {renderTimeSlots()}
          {renderBookingForm()}
          {renderActions()}
        </Stack>
      </Form>
    </Dialog>
  );
}

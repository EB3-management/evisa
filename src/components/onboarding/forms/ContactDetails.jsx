import { Box, Typography, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFormContext, Controller } from "react-hook-form";
import { z } from "zod";

// ✅ Step-specific Zod schema
export const contactDetailsSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required"),
    // .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
});

export const ContactDetails = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box id="section-2" sx={{ mb: 6 }}>
      {/* <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Contact details
      </Typography> */}

      <Grid container spacing={3}>
        {/* Personal Email */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ mb: 1 }}>Personal Email</Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="example@email.com"
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>

        {/* Phone Number */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ mb: 1 }}>Phone Number</Typography>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="9800000000"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import Grid from "@mui/material/Grid2";
import { z } from "zod";

// ✅ Step-specific Zod schema
export const currentAddressSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip Code is required"),
  address: z.string().min(1, "Address is required"),
});

export const CurrentAddress = ({ country }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext(); // ✅ get from FormProvider context

  return (
    <Box id="section-1" sx={{ mb: 6 }}>
      {/* <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Current Address
      </Typography> */}

      <Grid container spacing={3}>
        {/* Country */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>Country</Typography>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select
                  {...field}
                  displayEmpty
                  error={!!errors.country}
                  sx={{ backgroundColor: "#fff" }}
                >
                  <MenuItem value="">
                    <em>Select Country</em>
                  </MenuItem>
                  {country?.map((option) => (
                    <MenuItem key={option.value} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.country && (
                  <Typography color="error" variant="caption">
                    {errors.country.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* State */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>State</Typography>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Enter state"
                error={!!errors.state}
                helperText={errors.state?.message}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>

        {/* City */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>City</Typography>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Enter city"
                error={!!errors.city}
                helperText={errors.city?.message}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>

        {/* ZIP */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>Zip Code</Typography>
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Enter zipcode"
                error={!!errors.zipCode}
                helperText={errors.zipCode?.message}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>

        {/* Address */}
        <Grid size={{ xs: 12, sm: 6, md: 8 }}>
          <Typography sx={{ mb: 1 }}>Address</Typography>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Enter your full address"
                error={!!errors.address}
                helperText={errors.address?.message}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

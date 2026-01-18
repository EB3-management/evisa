// MainApplicantDetails.jsx
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  FormControl,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";

export const mainApplicantSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  countryOfBirth: z.string().min(1, "Country of birth is required"),
  citizenship1: z.string().min(1, "Citizenship country is required"),
  citizenship2: z.string().optional(),
});

export const MainApplicantDetails = ({ country }) => {
  const theme = useTheme();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const today = new Date().toISOString().split("T")[0];

  return (
    <Box id="section-0" sx={{ mb: 6 }}>
      {/* <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 600, color: "primary.main" }}
      >
        Main Applicant Details
      </Typography> */}

      <Grid container spacing={3}>
        {/* First Name */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>First Name</Typography>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Name"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>

        {/* Middle Name */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>Middle Name</Typography>
          <Controller
            name="middleName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Optional"
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>

        {/* Last Name */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>Last Name</Typography>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>

        {/* DOB */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>Date of Birth</Typography>
          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                fullWidth
                error={!!errors.dob}
                helperText={errors.dob?.message}
                inputProps={{
                  max: today,
                }}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>

        {/* Gender */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>Gender</Typography>

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <>
                <RadioGroup row {...field}>
                  {["Male", "Female", "Other"].map((value) => (
                    <FormControlLabel
                      key={value}
                      value={value}
                      control={
                        <Radio
                          sx={{
                            color: "secondary.main",
                            "&.Mui-checked": {
                              color: "secondary.main",
                            },
                          }}
                        />
                      }
                      label={value.charAt(0).toUpperCase() + value.slice(1)}
                    />
                  ))}
                </RadioGroup>

                {errors.gender && (
                  <FormHelperText error>{errors.gender.message}</FormHelperText>
                )}
              </>
            )}
          />
        </Grid>

        {/* Country of Birth */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>Country of Birth *</Typography>
          <Controller
            name="countryOfBirth"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select
                  {...field}
                  displayEmpty
                  error={!!errors.countryOfBirth}
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
                {errors.countryOfBirth && (
                  <Typography color="error" variant="caption">
                    {errors.countryOfBirth.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Citizenship 1 */}
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Typography sx={{ mb: 1 }}>Country of Citizenship 1</Typography>
          <Controller
            name="citizenship1"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Nepal"
                error={!!errors.citizenship1}
                helperText={errors.citizenship1?.message}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>

        {/* Citizenship 2 */}
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Typography sx={{ mb: 1 }}>Country of Citizenship 2</Typography>
          <Controller
            name="citizenship2"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Nepal"
                error={!!errors.citizenship2}
                helperText={errors.citizenship2?.message}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

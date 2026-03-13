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
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

export const mainApplicantSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  countryOfBirth: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "" && val !== null && val !== undefined, {
      message: "Country of birth is required",
    }),
  citizenship1: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "" && val !== null && val !== undefined, {
      message: "Country of citizenship is required",
    }),
  citizenship2: z
    .union([z.number(), z.string()])
    .transform((val) =>
      val === "" || val === null || val === undefined ? "" : val,
    )
    .optional(),
  country: z
    .union([z.number(), z.string()])
    .refine((val) => val !== "" && val !== null && val !== undefined, {
      message: "Country is required",
    }),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  maritalStatus: z
    .string()
    .refine((val) => val !== "" && val !== null && val !== undefined, {
      message: "Please select your marital status",
    }),
  clarifyMaritalStatus: z.string().optional(),
  countryOfMarriage: z.union([z.number(), z.string()]).optional(),
  dateOfMarriage: z.string().optional(),
});

const maritalStatusOptions = [
  "Married",
  "Unmarried",
  "Divorced",
  "Widow",
  "Separated",
  "Others",
];

export const MainApplicantDetails = ({ country }) => {
  const theme = useTheme();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  //  const { country } = useGetCountryCode();

  const maritalStatus = useWatch({ control, name: "maritalStatus" });

  const today = new Date().toISOString().split("T")[0];

  const skills = [
    { key: "writing", label: "Writing" },
    { key: "listening", label: "Listening" },
    { key: "reading", label: "Reading" },
    { key: "speaking", label: "Speaking" },
  ];

  return (
    <>
      <Box id="section-0" sx={{ mb: 6 }}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
                />
              )}
            />
          </Grid>

          {/* DOB */}
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
                />
              )}
            />
          </Grid>

          {/* Gender */}
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
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
                    <FormHelperText error>
                      {errors.gender.message}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          </Grid>

          {/* Country of Birth */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>Country of Birth</Typography>
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
                      <MenuItem key={option.id} value={option.id}>
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
                <FormControl fullWidth>
                  <Select
                    {...field}
                    displayEmpty
                    error={!!errors.citizenship1}
                    sx={{ backgroundColor: "#fff" }}
                  >
                    <MenuItem value="">
                      <em>Select Country</em>
                    </MenuItem>
                    {country?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.citizenship1 && (
                    <Typography color="error" variant="caption">
                      {errors.citizenship1.message}
                    </Typography>
                  )}
                </FormControl>
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
                <FormControl fullWidth>
                  <Select
                    {...field}
                    displayEmpty
                    error={!!errors.citizenship2}
                    sx={{ backgroundColor: "#fff" }}
                  >
                    <MenuItem value="">
                      <em>Select Country</em>
                    </MenuItem>
                    {country?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.citizenship2 && (
                    <Typography color="error" variant="caption">
                      {errors.citizenship2.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </Box>

      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          textAlign: "center",
          color: "primary.contrastText",
        }}
      >
        Current Address
      </Typography>
      <Box id="section-1" sx={{ mb: 6 }}>
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
                      <MenuItem key={option.id} value={option.id}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          textAlign: "center",
          color: "primary.contrastText",
        }}
      >
        Contact detail
      </Typography>

      <Box id="section-2" sx={{ mb: 6 }}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          textAlign: "center",
          color: "primary.contrastText",
        }}
      >
        Marital Status
      </Typography>
      <Box
        id="section-3"
        sx={{
          mb: 6,
        }}
      >
        <Grid container spacing={3}>
          {/* ✅ Marital Status Select */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography sx={{ mb: 1, fontSize: 14, color: "#fff" }}>
              Marital Status
            </Typography>
            <Controller
              name="maritalStatus"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  error={!!errors.maritalStatus}
                  helperText={errors.maritalStatus?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Marital Status</em>
                  </MenuItem>
                  {maritalStatusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        </Grid>

        {/* ✅ Show Country + Date of Marriage if "Yes" */}
        {maritalStatus === "Married" && (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Country of Marriage */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1, fontSize: 14, color: "#fff" }}>
                Country of Marriage
              </Typography>
              <Controller
                name="countryOfMarriage"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.countryOfMarriage}>
                    <Select
                      {...field}
                      displayEmpty
                      sx={{
                        backgroundColor: "#fff",
                      }}
                    >
                      <MenuItem value="">
                        <em>Select Country</em>
                      </MenuItem>
                      {country?.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.countryOfMarriage && (
                      <FormHelperText error>
                        {errors.countryOfMarriage.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Date of Marriage */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1, fontSize: 14, color: "#fff" }}>
                Date of Marriage
              </Typography>
              <Controller
                name="dateOfMarriage"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    fullWidth
                    error={!!errors.dateOfMarriage}
                    helperText={errors.dateOfMarriage?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        )}

        {/* ✅ If Other Options (Divorced, Widow, etc) */}
        {maritalStatus &&
          maritalStatus !== "Married" &&
          maritalStatus !== "Unmarried" && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ mb: 1, fontSize: 14, color: "#fff" }}>
                  Please Clarify <span style={{ color: "#f44336" }}>*</span>
                </Typography>
                <Controller
                  name="clarifyMaritalStatus"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Provide details"
                      error={!!errors.clarifyMaritalStatus}
                      helperText={errors.clarifyMaritalStatus?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}
      </Box>
    </>
  );
};

import { Box, Typography, TextField, MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { z } from "zod";

/* ---------------------- ✅ ZOD SCHEMA ---------------------- */
export const emergencyContactSchema = z
  .object({
    emergencyFullName: z.string().min(1, "Full name is required"),
    emergencyPhone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
    degreeOfKinship: z.string().min(1, "Degree of kinship is required"),
    degreeOfKinshipOther: z.string().optional(),
    emergencyAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If "Other" is selected, require clarification
    if (data.degreeOfKinship === "Other" && !data.degreeOfKinshipOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["degreeOfKinshipOther"],
        message: "Please specify the relationship",
      });
    }
  });

/* ---------------------- ✅ CONSTANTS ---------------------- */
const kinshipOptions = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Children",
  "Other",
];

/* ---------------------- ✅ MAIN COMPONENT ---------------------- */
export const EmergencyContactInformation = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const degreeOfKinship = useWatch({ control, name: "degreeOfKinship" });

  return (
    <Box id="section-9" sx={{ mb: 6, p: { xs: 2, md: 3 } }}>
      {/* <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "#fff",
          fontSize: { xs: 18, md: 22 },
        }}
      >
        Emergency Contact Information
      </Typography> */}

      <Grid container spacing={3}>
        {/* Full Name */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={{ mb: 1, fontSize: 14, color: "#ffffff" }}>
            Full Name <span style={{ color: "#f44336" }}>*</span>
          </Typography>
          <Controller
            name="emergencyFullName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                error={!!errors.emergencyFullName}
                helperText={errors.emergencyFullName?.message}
                sx={{
                  "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                }}
              />
            )}
          />
        </Grid>

        {/* Phone Number */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={{ mb: 1, fontSize: 14, color: "#ffffff" }}>
            Phone Number <span style={{ color: "#f44336" }}>*</span>
          </Typography>
          <Controller
            name="emergencyPhone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                error={!!errors.emergencyPhone}
                helperText={errors.emergencyPhone?.message}
                sx={{
                  "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                }}
              />
            )}
          />
        </Grid>

        {/* Degree of Kinship */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={{ mb: 1, fontSize: 14, color: "#ffffff" }}>
            Degree of Kinship <span style={{ color: "#f44336" }}>*</span>
          </Typography>
          <Controller
            name="degreeOfKinship"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                error={!!errors.degreeOfKinship}
                helperText={errors.degreeOfKinship?.message}
                sx={{
                  "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                }}
              >
                {kinshipOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Address */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={{ mb: 1, fontSize: 14, color: "#ffffff" }}>
            Address
          </Typography>
          <Controller
            name="emergencyAddress"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                }}
              />
            )}
          />
        </Grid>

        {/* Show "Other" text field if "Other" is selected */}
        {degreeOfKinship === "Other" && (
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1, fontSize: 14, color: "#ffffff" }}>
              Please Specify Relationship{" "}
              <span style={{ color: "#f44336" }}>*</span>
            </Typography>
            <Controller
              name="degreeOfKinshipOther"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="e.g., Cousin, Uncle, Friend"
                  error={!!errors.degreeOfKinshipOther}
                  helperText={errors.degreeOfKinshipOther?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

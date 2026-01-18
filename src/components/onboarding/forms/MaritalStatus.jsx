import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { useGetCountryCode } from "src/api";

/* ---------------------- ✅ ZOD SCHEMA ---------------------- */
export const maritalStatusSchema = z
  .object({
    maritalStatus: z.string().min(1, "Please select your marital status"),
    countryOfMarriage: z.string().optional(),
    dateOfMarriage: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(new Date(val).getTime()), "Invalid date"),
    clarifyMaritalStatus: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // ✅ If Yes, country and date required
    if (data.maritalStatus === "Yes") {
      if (!data.countryOfMarriage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["countryOfMarriage"],
          message: "Country of marriage is required",
        });
      }
      if (!data.dateOfMarriage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateOfMarriage"],
          message: "Date of marriage is required",
        });
      }
    }

    // ✅ If it's not Yes or No (e.g. Divorced, Widow...), clarify is required
    if (
      data.maritalStatus &&
      data.maritalStatus !== "Yes" &&
      data.maritalStatus !== "No" &&
      !data.clarifyMaritalStatus
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["clarifyMaritalStatus"],
        message: "Please provide clarification",
      });
    }
  });

/* ---------------------- ✅ CONSTANTS ---------------------- */
const maritalStatusOptions = [
  "Yes",
  "No",
  "Divorced",
  "Widow",
  "Separated",
  "Others",
];

/* ---------------------- ✅ MAIN COMPONENT ---------------------- */
export const MaritalStatus = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { country } = useGetCountryCode();

  const maritalStatus = useWatch({ control, name: "maritalStatus" });

  return (
    <Box
      id="section-8"
      sx={{
        mb: 6,
        p: { xs: 2, md: 3 },
      }}
    >
      {/* <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "#fff",
          fontSize: { xs: 18, md: 22 },
        }}
      >
        Marital Status
      </Typography> */}

      <Grid container spacing={3}>
        {/* ✅ Marital Status Select */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={{ mb: 1, fontSize: 14, color: "#fff" }}>
            Marital Status
          </Typography>
          <Controller
            name="maritalStatus"
            control={control}
            defaultValue=""
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
      {maritalStatus === "Yes" && (
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
                  <TextField
                    {...field}
                    select
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                    }}
                  >
                    {country?.map((option) => (
                      <MenuItem key={option.value} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
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
      {maritalStatus && maritalStatus !== "Yes" && maritalStatus !== "No" && (
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
  );
};
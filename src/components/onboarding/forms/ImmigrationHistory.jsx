import React from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Stack,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Grid from "@mui/material/Grid2";
import { useGetImmigrationTypes } from "src/api/onboardingform";
import { useGetVacancyDetail } from "src/api/vacancy";

// ------------------ Validation Schema ------------------
export const immigrationHistorySchema = z
  .object({
    hasImmigrationHistory: z.boolean().default(false),
    types: z.union([z.string(), z.number()]).optional(),
    beenToUsa: z.enum(["Yes", "No"]).optional(),
    socialSecurity: z.enum(["Yes", "No"]).optional(),
    socialSecurityNumber: z.string().optional(),
    inUsaApplicant: z.enum(["Yes", "No"]).optional(),
    applicantName: z.string().optional(),
    inUsaDependent: z.enum(["Yes", "No"]).optional(),
    dependentName: z.string().optional(),
    i94Number: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate if user has immigration history
    if (data.hasImmigrationHistory === true) {
      // Type is required
      if (!data.types) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a type",
          path: ["types"],
        });
      }

      // beenToUsa is required
      if (!data.beenToUsa) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select an option",
          path: ["beenToUsa"],
        });
      }

      // socialSecurity is required
      if (!data.socialSecurity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select an option",
          path: ["socialSecurity"],
        });
      }

      // Social Security Number required if "Yes"
      if (data.socialSecurity === "Yes" && !data.socialSecurityNumber?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter your Social Security Number",
          path: ["socialSecurityNumber"],
        });
      }

      // inUsaApplicant is required
      if (!data.inUsaApplicant) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select an option",
          path: ["inUsaApplicant"],
        });
      }

      // Applicant Name required if in USA
      if (data.inUsaApplicant === "Yes" && !data.applicantName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter applicant name",
          path: ["applicantName"],
        });
      }

      // inUsaDependent is required
      if (!data.inUsaDependent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select an option",
          path: ["inUsaDependent"],
        });
      }

      // Dependent Name required if in USA
      if (data.inUsaDependent === "Yes" && !data.dependentName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter dependent name",
          path: ["dependentName"],
        });
      }

      // I-94 Number required if applicant or dependent in USA
      if (
        (data.inUsaApplicant === "Yes" || data.inUsaDependent === "Yes") &&
        !data.i94Number?.trim()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter your most recent I-94 number",
          path: ["i94Number"],
        });
      }
    }
  });

// ------------------ Component ------------------
export const ImmigrationHistory = ({ vacancyId }) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const { immigrationType, immigrationTypeLoading } =
    useGetImmigrationTypes(vacancyId);
  const { vacancyDetail } = useGetVacancyDetail(vacancyId);
  console.log("thisis vacancy id immigration", vacancyId);
  const hasImmigrationHistory = watch("hasImmigrationHistory");
  const socialSecurity = watch("socialSecurity");
  const inUsaApplicant = watch("inUsaApplicant");
  const inUsaDependent = watch("inUsaDependent");
  const recentRecord = watch("recentRecord");
  const record2 = watch("record2");
  const record3 = watch("record3");
  const record4 = watch("record4");

  return (
    <Box id="section-10" sx={{ mb: 6 }}>
      {/* <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Immigration History
      </Typography> */}

      <Grid container spacing={3}>
        {/* First Question: Do you have immigration history? */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1, fontWeight: 500 }}>
            Do you have any immigration history?
          </Typography>
          <Controller
            name="hasImmigrationHistory"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControl error={!!errors.hasImmigrationHistory}>
                <RadioGroup
                  row
                  value={field.value ? "Yes" : "No"}
                  onChange={(e) => field.onChange(e.target.value === "Yes")}
                >
                  <FormControlLabel
                    value="Yes"
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
                    label="Yes"
                  />
                  <FormControlLabel
                    value="No"
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
                    label="No"
                  />
                </RadioGroup>
                {errors.hasImmigrationHistory && (
                  <FormHelperText>
                    {errors.hasImmigrationHistory?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Show all fields only if Yes */}
        {hasImmigrationHistory === true && (
          <>
            {/* Type */}
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ mb: 1 }}>Type </Typography>
              <Controller
                name="types"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.types}>
                    <TextField
                      {...field}
                      select
                      fullWidth
                      displayEmpty
                      error={!!errors.types}
                      disabled={immigrationTypeLoading}
                      sx={{
                        "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                      }}
                    >
                      <MenuItem value="">
                        <em>
                          {immigrationTypeLoading
                            ? "Loading..."
                            : "Select Type"}
                        </em>
                      </MenuItem>
                      {immigrationType.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    {errors.types && (
                      <FormHelperText>{errors.types?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Have you ever been to USA */}
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ mb: 1 }}>
                Have you ever been to{" "}
                {vacancyDetail?.visa_category?.country?.name ||
                  "the United States of America"}
                ?
              </Typography>
              <Controller
                name="beenToUsa"
                control={control}
                defaultValue="No"
                render={({ field }) => (
                  <FormControl error={!!errors.beenToUsa}>
                    <RadioGroup row {...field}>
                      <FormControlLabel
                        value="Yes"
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
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
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
                        label="No"
                      />
                    </RadioGroup>
                    {errors.beenToUsa && (
                      <FormHelperText>
                        {errors.beenToUsa?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Social Security */}
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ mb: 1 }}>
                Have you ever had a Social Security Number?
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Controller
                  name="socialSecurity"
                  control={control}
                  defaultValue="No"
                  render={({ field }) => (
                    <FormControl error={!!errors.socialSecurity}>
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="Yes"
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
                          label="Yes"
                        />
                        <FormControlLabel
                          value="No"
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
                          label="No"
                        />
                      </RadioGroup>
                      {errors.socialSecurity && (
                        <FormHelperText>
                          {errors.socialSecurity?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                {socialSecurity === "Yes" && (
                  <Controller
                    name="socialSecurityNumber"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="Social Security Number"
                        fullWidth
                        sx={{
                          maxWidth: { xs: "100%", sm: 400 },
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#fff",
                          },
                        }}
                        error={!!errors.socialSecurityNumber}
                        helperText={errors.socialSecurityNumber?.message}
                      />
                    )}
                  />
                )}
              </Stack>
            </Grid>

            {/* Section Header */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                Please answer for the Principal Applicant and Dependents
              </Typography>

              <Typography>
                Are you currently in the{" "}
                {vacancyDetail?.visa_category?.country?.name ||
                  "the United States of America"}
                ?
              </Typography>
            </Grid>

            {/* Applicant */}
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ mb: 1 }}>Applicant</Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Controller
                  name="inUsaApplicant"
                  control={control}
                  defaultValue="No"
                  render={({ field }) => (
                    <FormControl error={!!errors.inUsaApplicant}>
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="Yes"
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
                          label="Yes"
                        />
                        <FormControlLabel
                          value="No"
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
                          label="No"
                        />
                      </RadioGroup>
                      {errors.inUsaApplicant && (
                        <FormHelperText>
                          {errors.inUsaApplicant?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                {inUsaApplicant === "Yes" && (
                  <Controller
                    name="applicantName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="If yes, who?"
                        fullWidth
                        sx={{
                          maxWidth: { xs: "100%", sm: 400 },
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#fff",
                          },
                        }}
                        error={!!errors.applicantName}
                        helperText={errors.applicantName?.message}
                      />
                    )}
                  />
                )}
              </Stack>
            </Grid>

            {/* Dependent */}
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ mb: 1 }}>Dependents</Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Controller
                  name="inUsaDependent"
                  control={control}
                  defaultValue="No"
                  render={({ field }) => (
                    <FormControl error={!!errors.inUsaDependent}>
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="Yes"
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
                          label="Yes"
                        />
                        <FormControlLabel
                          value="No"
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
                          label="No"
                        />
                      </RadioGroup>
                      {errors.inUsaDependent && (
                        <FormHelperText>
                          {errors.inUsaDependent?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                {inUsaDependent === "Yes" && (
                  <Controller
                    name="dependentName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="If yes, who?"
                        fullWidth
                        sx={{
                          maxWidth: { xs: "100%", sm: 400 },
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#fff",
                          },
                        }}
                        error={!!errors.dependentName}
                        helperText={errors.dependentName?.message}
                      />
                    )}
                  />
                )}
              </Stack>
            </Grid>

            {/* I-94 Number */}
            {(inUsaApplicant === "Yes" || inUsaDependent === "Yes") && (
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ mb: 1 }}>
                  If you are currently in the US, please provide your most
                  recent I-94 number
                </Typography>
                <Controller
                  name="i94Number"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter I-94 Number"
                      sx={{
                        "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                      }}
                      error={!!errors.i94Number}
                      helperText={errors.i94Number?.message}
                    />
                  )}
                />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
};

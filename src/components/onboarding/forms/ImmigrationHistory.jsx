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

// ------------------ Visa Type Data ------------------
const types = [
  { id: "E11", name: "EB-1 Extraordinary Ability" },
  { id: "E12", name: "EB-1 Outstanding Professor/Researcher" },
  { id: "E13", name: "EB-1 Multinational Executive/Manager" },
  { id: "E21", name: "EB-2 Advanced Degree / Exceptional Ability" },
  { id: "E31", name: "EB-3 Skilled Worker" },
  { id: "E32", name: "EB-3 Professional" },
  { id: "EW3", name: "EB-3 Other Worker" },
  { id: "SD", name: "EB-4 Religious Worker" },
  { id: "SR", name: "EB-4 Minister of Religion" },
  { id: "T5", name: "EB-5 Investor (Regional Center)" },
  { id: "I5", name: "EB-5 Investor (Direct Investment)" },
  { id: "F11", name: "Unmarried Son/Daughter of U.S. Citizen" },
  { id: "F21", name: "Spouse of Lawful Permanent Resident" },
  { id: "F22", name: "Child of Lawful Permanent Resident" },
  { id: "F23", name: "Unmarried Son/Daughter of LPR" },
  { id: "F24", name: "Married Son/Daughter of U.S. Citizen" },
  { id: "F41", name: "Brother/Sister of U.S. Citizen" },
  { id: "F1", name: "Academic Student" },
  { id: "F2", name: "Dependent of F1" },
  { id: "M1", name: "Vocational Student" },
  { id: "M2", name: "Dependent of M1" },
  { id: "J1", name: "Exchange Visitor" },
  { id: "J2", name: "Dependent of J1" },
  { id: "H1B", name: "Specialty Occupation Worker" },
  { id: "H1B1", name: "Singapore/Chile Specialty Worker" },
  { id: "H2A", name: "Temporary Agricultural Worker" },
  { id: "H2B", name: "Temporary Non-Agricultural Worker" },
  { id: "L1A", name: "Intracompany Executive/Manager" },
  { id: "L1B", name: "Intracompany Specialized Knowledge" },
  { id: "O1", name: "Extraordinary Ability (Arts, Science, etc.)" },
  { id: "O2", name: "Assistant to O1" },
  { id: "P1", name: "Internationally Recognized Athlete/Performer" },
  { id: "P2", name: "Artist/Entertainer in Exchange Program" },
  { id: "P3", name: "Culturally Unique Artist/Entertainer" },
  { id: "R1", name: "Religious Worker" },
  { id: "K1", name: "Fiancé(e) of U.S. Citizen" },
  { id: "K2", name: "Child of K1" },
  { id: "K3", name: "Spouse of U.S. Citizen (awaiting immigrant visa)" },
  { id: "K4", name: "Child of K3" },
  { id: "U1", name: "Victim of Criminal Activity" },
  { id: "T1", name: "Victim of Human Trafficking" },
  { id: "Refugee", name: "Granted Abroad" },
  { id: "Asylee", name: "Granted Inside U.S." },
  { id: "TPS", name: "Temporary Protected Status" },
  { id: "VAWA", name: "Violence Against Women Act Self-Petitioner" },
  { id: "SIJ", name: "Special Immigrant Juvenile" },
  { id: "DACA", name: "Deferred Action for Childhood Arrivals" },
  { id: "DV1", name: "Diversity Immigrant (Principal Applicant)" },
  { id: "DV2", name: "Spouse of DV1" },
  { id: "DV3", name: "Child of DV1" },
];

// ------------------ Validation Schema ------------------
export const immigrationHistorySchema = z
  .object({
    types: z.string().min(1, "Please select a type"),
    beenToUsa: z.enum(["Yes", "No"], {
      errorMap: () => ({ message: "Please select an option" }),
    }),
    socialSecurity: z.enum(["Yes", "No"], {
      // ✅ Changed from lowercase
      errorMap: () => ({ message: "Please select an option" }),
    }),
    socialSecurityNumber: z.string().optional(),
    inUsaApplicant: z.enum(["Yes", "No"], {
      // ✅ Changed from lowercase
      errorMap: () => ({ message: "Please select an option" }),
    }),
    applicantName: z.string().optional(),
    inUsaDependent: z.enum(["Yes", "No"], {
      // ✅ Changed from lowercase
      errorMap: () => ({ message: "Please select an option" }),
    }),
    dependentName: z.string().optional(),
    i94Number: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Social Security Number required if "Yes"
    if (data.socialSecurity === "Yes" && !data.socialSecurityNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter your Social Security Number",
        path: ["socialSecurityNumber"],
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
  });

// ------------------ Component ------------------
export const ImmigrationHistory = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const socialSecurity = watch("socialSecurity");
  const inUsaApplicant = watch("inUsaApplicant");
  const inUsaDependent = watch("inUsaDependent");
  const recentRecord = watch("recentRecord");
  const record2 = watch("record2");
  const record3 = watch("record3");
  const record4 = watch("record4");

  return (
    <Box id="section-10" sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Immigration History
      </Typography>

      <Grid container spacing={3}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Type</em>
                  </MenuItem>
                  {types.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.id} – {option.name}
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
            Have you ever been to the United States of America?
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
                  <FormHelperText>{errors.beenToUsa?.message}</FormHelperText>
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
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
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

          <Typography>Are you currently in the US?</Typography>
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
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
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
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
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
              If you are currently in the US, please provide your most recent
              I-94 number
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
      </Grid>
    </Box>
  );
};

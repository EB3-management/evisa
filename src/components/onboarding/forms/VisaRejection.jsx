import React from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  MenuItem,
  FormHelperText,
  Stack,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";
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
export const visaRejectionSchema = z
  .object({
    employee_visa_rejected: z.enum(["Yes", "No"]).default("No"),
    employee_fullname: z.string().optional(),
    employee_visa_type: z.string().optional(),
    employee_rejection_reason: z.string().optional(),
    employee_rejection_date: z.string().optional(),

    dependents_visa_rejected: z.enum(["Yes", "No"]).default("No"),
    dependent_fullname: z.string().optional(),
    dependent_visa_type: z.string().optional(),
    dependent_rejection_reason: z.string().optional(),
    dependent_rejection_date: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Employee rejection details required if "Yes"
    if (data.employee_visa_rejected === "Yes") {
      if (!data.employee_fullname?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter full name",
          path: ["employee_fullname"],
        });
      }
      if (!data.employee_visa_type?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter visa type",
          path: ["employee_visa_type"],
        });
      }
      if (!data.employee_rejection_reason?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter rejection reason",
          path: ["employee_rejection_reason"],
        });
      }
      if (!data.employee_rejection_date?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter rejection date",
          path: ["employee_rejection_date"],
        });
      }
    }

    // Dependent rejection details required if "Yes"
    if (data.dependents_visa_rejected === "Yes") {
      if (!data.dependent_fullname?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter full name",
          path: ["dependent_fullname"],
        });
      }
      if (!data.dependent_visa_type?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter visa type",
          path: ["dependent_visa_type"],
        });
      }
      if (!data.dependent_rejection_reason?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter rejection reason",
          path: ["dependent_rejection_reason"],
        });
      }
      if (!data.dependent_rejection_date?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter rejection date",
          path: ["dependent_rejection_date"],
        });
      }
    }
  });

// ------------------ Component ------------------
export const VisaRejection = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const employee_visa_rejected = watch("employee_visa_rejected");
  const dependents_visa_rejected = watch("dependents_visa_rejected");

  return (
    <Box id="section-12" sx={{ mb: 6 }}>
      <Grid container spacing={3}>
        {/* Recent Record */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>
            Have you ever been rejected for the visa ?{" "}
          </Typography>
          {/* <Controller
            name="employee_visa_rejected"
            control={control}
            defaultValue="no"
            render={({ field }) => (
              <FormControl error={!!errors.recentRecord}>
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value="yes"
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
                    value="no"
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
                {errors.recentRecord && (
                  <FormHelperText>
                    {errors.recentRecord?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          /> */}
        </Grid>

        {/* Applicant */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>Applicant</Typography>
          <Controller
            name="employee_visa_rejected"
            control={control}
            defaultValue="No"
            render={({ field }) => (
              <FormControl error={!!errors.employee_visa_rejected}>
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
                {errors.employee_visa_rejected && (
                  <FormHelperText>
                    {errors.employee_visa_rejected?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Employee Details - Show if rejected */}
        {employee_visa_rejected === "Yes" && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1 }}>Full Name</Typography>
              <Controller
                name="employee_fullname"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter full name"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                    }}
                    error={!!errors.employee_fullname}
                    helperText={errors.employee_fullname?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1 }}>Visa Type</Typography>
              <Controller
                name="employee_visa_type"
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

            <Grid size={{ xs: 12 }}>
              <Typography sx={{ mb: 1 }}>Reason for Rejection</Typography>
              <Controller
                name="employee_rejection_reason"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter reason"
                    fullWidth
                    multiline
                    rows={3}
                    sx={{
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                    }}
                    error={!!errors.employee_rejection_reason}
                    helperText={errors.employee_rejection_reason?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1 }}>Date of Rejection</Typography>
              <Controller
                name="employee_rejection_date"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                    }}
                    error={!!errors.employee_rejection_date}
                    helperText={errors.employee_rejection_date?.message}
                  />
                )}
              />
            </Grid>
          </>
        )}

        {/* Record 2 */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>
            Have your dependent ever been rejected for the visa ?
          </Typography>
          {/* <Controller
            name="dependents_visa_rejected"
            control={control}
            defaultValue="no"
            render={({ field }) => (
              <FormControl error={!!errors.record2}>
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value="yes"
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
                    value="no"
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
                {errors.record2 && (
                  <FormHelperText>{errors.record2?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          /> */}
        </Grid>

        {/* Dependent */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>Dependents</Typography>
          <Controller
            name="dependents_visa_rejected"
            control={control}
            defaultValue="No"
            render={({ field }) => (
              <FormControl error={!!errors.dependents_visa_rejected}>
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
                {errors.dependents_visa_rejected && (
                  <FormHelperText>
                    {errors.dependents_visa_rejected?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Dependent Details - Show if rejected */}
        {dependents_visa_rejected === "Yes" && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1 }}>Full Name</Typography>
              <Controller
                name="dependent_fullname"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter full name"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                    }}
                    error={!!errors.dependent_fullname}
                    helperText={errors.dependent_fullname?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1 }}>Visa Type</Typography>
              <Controller
                name="dependent_visa_type"
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

            <Grid size={{ xs: 12 }}>
              <Typography sx={{ mb: 1 }}>Reason for Rejection</Typography>
              <Controller
                name="dependent_rejection_reason"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter reason"
                    fullWidth
                    multiline
                    rows={3}
                    sx={{
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                    }}
                    error={!!errors.dependent_rejection_reason}
                    helperText={errors.dependent_rejection_reason?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1 }}>Date of Rejection</Typography>
              <Controller
                name="dependent_rejection_date"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                    }}
                    error={!!errors.dependent_rejection_date}
                    helperText={errors.dependent_rejection_date?.message}
                  />
                )}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

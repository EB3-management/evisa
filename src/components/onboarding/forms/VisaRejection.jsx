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
import { useGetImmigrationTypes } from "src/api/onboardingform";
import { useGetVacancyDetail } from "src/api/vacancy";

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
export const VisaRejection = ({vacancyId}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

   const { immigrationType, immigrationTypeLoading } =
      useGetImmigrationTypes(vacancyId);

      const { vacancyDetail } = useGetVacancyDetail(vacancyId);

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
                  <FormControl fullWidth error={!!errors.employee_visa_type}>
                    <TextField
                      {...field}
                      select
                      fullWidth
                      disabled={immigrationTypeLoading}
                      error={!!errors.employee_visa_type}
                      onChange={(e) => {
                        // Find the selected type and extract the code from the name
                        const selectedType = immigrationType?.find(
                          (type) => type.id === e.target.value,
                        );
                        if (selectedType) {
                          // Extract code from name (e.g., "E11-EB-1 Extraordinary Ability" -> "E11")
                          const typeCode = selectedType.name
                            .split(/[-–\s]/)[0]
                            .trim();
                          field.onChange(typeCode);
                        } else {
                          field.onChange(e.target.value);
                        }
                      }}
                      value={
                        // Find the ID that matches the stored code
                        immigrationType?.find(
                          (type) =>
                            type.name.split(/[-–\s]/)[0].trim() ===
                            field.value,
                        )?.id ||
                        field.value ||
                        ""
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                      }}
                    >
                      <MenuItem value="">
                        <em>{immigrationTypeLoading ? "Loading..." : "Select Visa Type"}</em>
                      </MenuItem>
                      {immigrationType?.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    {errors.employee_visa_type && (
                      <FormHelperText>{errors.employee_visa_type?.message}</FormHelperText>
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
                  <FormControl fullWidth error={!!errors.dependent_visa_type}>
                    <TextField
                      {...field}
                      select
                      fullWidth
                      disabled={immigrationTypeLoading}
                      error={!!errors.dependent_visa_type}
                      onChange={(e) => {
                        // Find the selected type and extract the code from the name
                        const selectedType = immigrationType?.find(
                          (type) => type.id === e.target.value,
                        );
                        if (selectedType) {
                          // Extract code from name (e.g., "E11-EB-1 Extraordinary Ability" -> "E11")
                          const typeCode = selectedType.name
                            .split(/[-–\s]/)[0]
                            .trim();
                          field.onChange(typeCode);
                        } else {
                          field.onChange(e.target.value);
                        }
                      }}
                      value={
                        // Find the ID that matches the stored code
                        immigrationType?.find(
                          (type) =>
                            type.name.split(/[-–\s]/)[0].trim() ===
                            field.value,
                        )?.id ||
                        field.value ||
                        ""
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                      }}
                    >
                      <MenuItem value="">
                        <em>{immigrationTypeLoading ? "Loading..." : "Select Visa Type"}</em>
                      </MenuItem>
                      {immigrationType?.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    {errors.dependent_visa_type && (
                      <FormHelperText>{errors.dependent_visa_type?.message}</FormHelperText>
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

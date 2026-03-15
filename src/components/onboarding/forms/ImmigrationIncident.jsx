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
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";
import Grid from "@mui/material/Grid2";
import { useGetVacancyDetail } from "src/api/vacancy";

// ------------------ Validation Schema ------------------
export const immigrationIncidentSchema = z
  .object({
    e_overstayed_usa_visa_i94_employee: z.enum(["yes", "no"]),
    e_overstayed_usa_visa_employee_if_yes_from: z.string().optional(),
    e_overstayed_usa_visa_employee_if_yes_to: z.string().optional(),
    e_overstayed_usa_visa_i94_dependents: z.enum(["yes", "no"]),
    e_overstayed_usa_visa_i94_dependents_if_yes_who: z.string().optional(),
    e_overstayed_usa_visa_i94_dependents_from: z.string().optional(),
    e_overstayed_usa_visa_i94_dependents_to: z.string().optional(),

    eb_unlawfully_present_usa_employee: z.enum(["yes", "no"]),
    eb_unlawfully_present_usa_employee_from: z.string().optional(),
    eb_unlawfully_present_usa_employee_to: z.string().optional(),
    eb_unlawfully_present_usa_dependents: z.enum(["yes", "no"]),
    eb_unlawfully_present_usa_dependents_if_yes_who: z.string().optional(),
    eb_unlawfully_present_usa_dependents_from: z.string().optional(),
    eb_unlawfully_present_usa_dependents_to: z.string().optional(),

    eb_denied_entry_usa_employee: z.enum(["yes", "no"]),
    eb_denied_entry_usa_employee_if_yes: z.string().optional(),
    eb_denied_entry_usa_dependents: z.enum(["yes", "no"]),
    eb_denied_entry_usa_dependents_if_yes: z.string().optional(),

    eb_deported_from_any_country_employee: z.enum(["yes", "no"]),
    eb_deported_from_any_country_employee_if_yes: z.string().optional(),
    eb_deported_from_any_country_dependents: z.enum(["yes", "no"]),
    eb_deported_from_any_country_dependents_if_yes: z.string().optional(),

    ebb_imr_judge_h_ofcr_employee: z.enum(["yes", "no"]),
    ebb_imr_judge_h_ofcr_employee_if_yes: z.string().optional(),
    ebb_imr_judge_h_ofcr_dependents: z.enum(["yes", "no"]),
    ebb_imr_judge_h_ofcr_dependents_if_yes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Overstayed - Employee
    if (data.e_overstayed_usa_visa_i94_employee === "yes") {
      if (!data.e_overstayed_usa_visa_employee_if_yes_from?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "From date is required",
          path: ["e_overstayed_usa_visa_employee_if_yes_from"],
        });
      }
      if (!data.e_overstayed_usa_visa_employee_if_yes_to?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "To date is required",
          path: ["e_overstayed_usa_visa_employee_if_yes_to"],
        });
      }
    }

    // Overstayed - Dependents
    if (data.e_overstayed_usa_visa_i94_dependents === "yes") {
      if (!data.e_overstayed_usa_visa_i94_dependents_if_yes_who?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Who is required",
          path: ["e_overstayed_usa_visa_i94_dependents_if_yes_who"],
        });
      }
      if (!data.e_overstayed_usa_visa_i94_dependents_from?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "From date is required",
          path: ["e_overstayed_usa_visa_i94_dependents_from"],
        });
      }
      if (!data.e_overstayed_usa_visa_i94_dependents_to?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "To date is required",
          path: ["e_overstayed_usa_visa_i94_dependents_to"],
        });
      }
    }

    // Unlawfully Present - Employee
    if (data.eb_unlawfully_present_usa_employee === "yes") {
      if (!data.eb_unlawfully_present_usa_employee_from?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "From date is required",
          path: ["eb_unlawfully_present_usa_employee_from"],
        });
      }
      if (!data.eb_unlawfully_present_usa_employee_to?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "To date is required",
          path: ["eb_unlawfully_present_usa_employee_to"],
        });
      }
    }

    // Unlawfully Present - Dependents
    if (data.eb_unlawfully_present_usa_dependents === "yes") {
      if (!data.eb_unlawfully_present_usa_dependents_if_yes_who?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Who is required",
          path: ["eb_unlawfully_present_usa_dependents_if_yes_who"],
        });
      }
      if (!data.eb_unlawfully_present_usa_dependents_from?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "From date is required",
          path: ["eb_unlawfully_present_usa_dependents_from"],
        });
      }
      if (!data.eb_unlawfully_present_usa_dependents_to?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "To date is required",
          path: ["eb_unlawfully_present_usa_dependents_to"],
        });
      }
    }

    // Denied Entry - Employee
    if (data.eb_denied_entry_usa_employee === "yes") {
      if (!data.eb_denied_entry_usa_employee_if_yes?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Explanation is required",
          path: ["eb_denied_entry_usa_employee_if_yes"],
        });
      }
    }

    // Denied Entry - Dependents
    if (data.eb_denied_entry_usa_dependents === "yes") {
      if (!data.eb_denied_entry_usa_dependents_if_yes?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Explanation is required",
          path: ["eb_denied_entry_usa_dependents_if_yes"],
        });
      }
    }

    // Deported - Employee
    if (data.eb_deported_from_any_country_employee === "yes") {
      if (!data.eb_deported_from_any_country_employee_if_yes?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Explanation is required",
          path: ["eb_deported_from_any_country_employee_if_yes"],
        });
      }
    }

    // Deported - Dependents
    if (data.eb_deported_from_any_country_dependents === "yes") {
      if (!data.eb_deported_from_any_country_dependents_if_yes?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Explanation is required",
          path: ["eb_deported_from_any_country_dependents_if_yes"],
        });
      }
    }

    // Immigration Judge - Employee
    if (data.ebb_imr_judge_h_ofcr_employee === "yes") {
      if (!data.ebb_imr_judge_h_ofcr_employee_if_yes?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Explanation is required",
          path: ["ebb_imr_judge_h_ofcr_employee_if_yes"],
        });
      }
    }

    // Immigration Judge - Dependents
    if (data.ebb_imr_judge_h_ofcr_dependents === "yes") {
      if (!data.ebb_imr_judge_h_ofcr_dependents_if_yes?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Explanation is required",
          path: ["ebb_imr_judge_h_ofcr_dependents_if_yes"],
        });
      }
    }
  });

// ------------------ Component ------------------
export const ImmigrationIncident = ({ vacancyId }) => {
  const { vacancyDetail } = useGetVacancyDetail(vacancyId);
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const overstayedEmployee = watch("e_overstayed_usa_visa_i94_employee");
  const overstayedDependent = watch("e_overstayed_usa_visa_i94_dependents");
  const unLawfulEmployee = watch("eb_unlawfully_present_usa_employee");
  const unLawfullDependent = watch("eb_unlawfully_present_usa_dependents");
  const deniedEmployee = watch("eb_denied_entry_usa_employee");
  const deniedDependent = watch("eb_denied_entry_usa_dependents");
  const deportedEmployee = watch("eb_deported_from_any_country_employee");
  const deportedDependent = watch("eb_deported_from_any_country_dependents");
  const judgeEmployee = watch("ebb_imr_judge_h_ofcr_employee");
  const judgeDependent = watch("ebb_imr_judge_h_ofcr_dependents");

  return (
    <Box id="section-13" sx={{ mb: 6 }}>
      <Grid container spacing={3}>
        {/* over stayed */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
            Have you ever over stayed in the{" "}
            {vacancyDetail?.visa_category?.country?.name ||
              "the United States of America"}{" "}
            ?
          </Typography>

          {/* Applicant */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>Applicant</Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Controller
                name="e_overstayed_usa_visa_i94_employee"
                control={control}
                defaultValue="no"
                render={({ field }) => (
                  <FormControl>
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
                  </FormControl>
                )}
              />

              {overstayedEmployee === "yes" && (
                <>
                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Typography sx={{ mb: 1 }}>From Date</Typography>
                    <Controller
                      name="e_overstayed_usa_visa_employee_if_yes_from"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={
                            !!errors.e_overstayed_usa_visa_employee_if_yes_from
                          }
                          helperText={
                            errors.e_overstayed_usa_visa_employee_if_yes_from
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Typography sx={{ mb: 1 }}>To Date</Typography>
                    <Controller
                      name="e_overstayed_usa_visa_employee_if_yes_to"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={
                            !!errors.e_overstayed_usa_visa_employee_if_yes_to
                          }
                          helperText={
                            errors.e_overstayed_usa_visa_employee_if_yes_to
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </Stack>
          </Grid>

          {/* Dependent */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1, fontWeight: 500, mt: 2 }}>
              Dependents
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Controller
                name="e_overstayed_usa_visa_i94_dependents"
                control={control}
                defaultValue="no"
                render={({ field }) => (
                  <FormControl>
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
                  </FormControl>
                )}
              />

              {overstayedDependent === "yes" && (
                <>
                  <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <Typography sx={{ mb: 1 }}>Who</Typography>
                    <Controller
                      name="e_overstayed_usa_visa_i94_dependents_if_yes_who"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="Enter name"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={
                            !!errors.e_overstayed_usa_visa_i94_dependents_if_yes_who
                          }
                          helperText={
                            errors
                              .e_overstayed_usa_visa_i94_dependents_if_yes_who
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <Typography sx={{ mb: 1 }}>From Date</Typography>
                    <Controller
                      name="e_overstayed_usa_visa_i94_dependents_from"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={
                            !!errors.e_overstayed_usa_visa_i94_dependents_from
                          }
                          helperText={
                            errors.e_overstayed_usa_visa_i94_dependents_from
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <Typography sx={{ mb: 1 }}>To Date</Typography>
                    <Controller
                      name="e_overstayed_usa_visa_i94_dependents_to"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={
                            !!errors.e_overstayed_usa_visa_i94_dependents_to
                          }
                          helperText={
                            errors.e_overstayed_usa_visa_i94_dependents_to
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* Unlawfull */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
            Have you ever been Unlawfully Present in{" "}
            {vacancyDetail?.visa_category?.country?.name ||
              "the United States of America"}{" "}
            ?
          </Typography>

          {/* Applicant */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>Applicant</Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Controller
                name="eb_unlawfully_present_usa_employee"
                control={control}
                defaultValue="no"
                render={({ field }) => (
                  <FormControl>
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
                  </FormControl>
                )}
              />

              {unLawfulEmployee === "yes" && (
                <>
                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Typography sx={{ mb: 1 }}>From Date</Typography>
                    <Controller
                      name="eb_unlawfully_present_usa_employee_from"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={
                            !!errors.eb_unlawfully_present_usa_employee_from
                          }
                          helperText={
                            errors.eb_unlawfully_present_usa_employee_from
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Typography sx={{ mb: 1 }}>To Date</Typography>
                    <Controller
                      name="eb_unlawfully_present_usa_employee_to"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={!!errors.eb_unlawfully_present_usa_employee_to}
                          helperText={
                            errors.eb_unlawfully_present_usa_employee_to
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </Stack>
          </Grid>

          {/* Dependent */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1, fontWeight: 500, mt: 2 }}>
              Dependents
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Controller
                name="eb_unlawfully_present_usa_dependents"
                control={control}
                defaultValue="no"
                render={({ field }) => (
                  <FormControl>
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
                  </FormControl>
                )}
              />

              {unLawfullDependent === "yes" && (
                <>
                  <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <Typography sx={{ mb: 1 }}>Who</Typography>
                    <Controller
                      name="eb_unlawfully_present_usa_dependents_if_yes_who"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="Enter name"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={
                            !!errors.eb_unlawfully_present_usa_dependents_if_yes_who
                          }
                          helperText={
                            errors
                              .eb_unlawfully_present_usa_dependents_if_yes_who
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <Typography sx={{ mb: 1 }}>From Date</Typography>
                    <Controller
                      name="eb_unlawfully_present_usa_dependents_from"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={
                            !!errors.eb_unlawfully_present_usa_dependents_from
                          }
                          helperText={
                            errors.eb_unlawfully_present_usa_dependents_from
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <Typography sx={{ mb: 1 }}>To Date</Typography>
                    <Controller
                      name="eb_unlawfully_present_usa_dependents_to"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={
                            !!errors.eb_unlawfully_present_usa_dependents_to
                          }
                          helperText={
                            errors.eb_unlawfully_present_usa_dependents_to
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* denied */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
            Have you ever been denied entry to{" "}
            {vacancyDetail?.visa_category?.country?.name ||
              "the United States of America"}{" "}
            ?
          </Typography>

          {/* Applicant */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>Applicant</Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Controller
                name="eb_denied_entry_usa_employee"
                control={control}
                defaultValue="no"
                render={({ field }) => (
                  <FormControl>
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
                  </FormControl>
                )}
              />

              {deniedEmployee === "yes" && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ mb: 1 }}>Explanation</Typography>
                    <Controller
                      name="eb_denied_entry_usa_employee_if_yes"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Please explain the circumstances"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={!!errors.eb_denied_entry_usa_employee_if_yes}
                          helperText={
                            errors.eb_denied_entry_usa_employee_if_yes?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </Stack>
          </Grid>

          {/* Dependent */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1, fontWeight: 500, mt: 2 }}>
              Dependents
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Controller
                name="eb_denied_entry_usa_dependents"
                control={control}
                defaultValue="no"
                render={({ field }) => (
                  <FormControl>
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
                  </FormControl>
                )}
              />

              {deniedDependent === "yes" && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ mb: 1 }}>Explanation</Typography>
                    <Controller
                      name="eb_denied_entry_usa_dependents_if_yes"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Please explain the circumstances"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={!!errors.eb_denied_entry_usa_dependents_if_yes}
                          helperText={
                            errors.eb_denied_entry_usa_dependents_if_yes
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* deported */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
            Have you ever been deported or told to leave from any Country ?
          </Typography>

          {/* Applicant */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>Applicant</Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Controller
                name="eb_deported_from_any_country_employee"
                control={control}
                defaultValue="no"
                render={({ field }) => (
                  <FormControl>
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
                  </FormControl>
                )}
              />

              {deportedEmployee === "yes" && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ mb: 1 }}>Explanation</Typography>
                    <Controller
                      name="eb_deported_from_any_country_employee_if_yes"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Please explain the circumstances"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={
                            !!errors.eb_deported_from_any_country_employee_if_yes
                          }
                          helperText={
                            errors.eb_deported_from_any_country_employee_if_yes
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </Stack>
          </Grid>

          {/* Dependent */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1, fontWeight: 500, mt: 2 }}>
              Dependents
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Controller
                name="eb_deported_from_any_country_dependents"
                control={control}
                defaultValue="no"
                render={({ field }) => (
                  <FormControl>
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
                  </FormControl>
                )}
              />

              {deportedDependent === "yes" && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ mb: 1 }}>Explanation</Typography>
                    <Controller
                      name="eb_deported_from_any_country_dependents_if_yes"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Please explain the circumstances"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={
                            !!errors.eb_deported_from_any_country_dependents_if_yes
                          }
                          helperText={
                            errors
                              .eb_deported_from_any_country_dependents_if_yes
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* immigration */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
            Have you ever faced an immigration judge/hearing officer?
          </Typography>

          {/* Applicant */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>Applicant</Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Controller
                name="ebb_imr_judge_h_ofcr_employee"
                control={control}
                defaultValue="no"
                render={({ field }) => (
                  <FormControl>
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
                  </FormControl>
                )}
              />

              {judgeEmployee === "yes" && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ mb: 1 }}>Explanation</Typography>
                    <Controller
                      name="ebb_imr_judge_h_ofcr_employee_if_yes"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Please explain the circumstances"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={!!errors.ebb_imr_judge_h_ofcr_employee_if_yes}
                          helperText={
                            errors.ebb_imr_judge_h_ofcr_employee_if_yes?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </Stack>
          </Grid>

          {/* Dependent */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1, fontWeight: 500, mt: 2 }}>
              Dependents
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Controller
                name="ebb_imr_judge_h_ofcr_dependents"
                control={control}
                defaultValue="no"
                render={({ field }) => (
                  <FormControl>
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
                  </FormControl>
                )}
              />

              {judgeDependent === "yes" && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ mb: 1 }}>Explanation</Typography>
                    <Controller
                      name="ebb_imr_judge_h_ofcr_dependents_if_yes"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Please explain the circumstances"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                            },
                          }}
                          error={
                            !!errors.ebb_imr_judge_h_ofcr_dependents_if_yes
                          }
                          helperText={
                            errors.ebb_imr_judge_h_ofcr_dependents_if_yes
                              ?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

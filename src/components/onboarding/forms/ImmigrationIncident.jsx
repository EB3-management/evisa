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
    e_overstayed_usa_visa_i94_employee_if_yes_who: z.string().optional(),
    e_overstayed_usa_visa_i94_dependents: z.enum(["yes", "no"]),
    e_overstayed_usa_visa_i94_dependents_if_yes_who: z.string().optional(),

    eb_unlawfully_present_usa_employee: z.enum(["yes", "no"]),
    eb_unlawfully_present_usa_employee_if_yes_who: z.string().optional(),
    eb_unlawfully_present_usa_dependents: z.enum(["yes", "no"]),
    eb_unlawfully_present_usa_dependents_if_yes_who: z.string().optional(),

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
    if (
      data.e_overstayed_usa_visa_i94_employee === "yes" &&
      !data.e_overstayed_usa_visa_i94_employee_if_yes_who?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify who overstayed",
        path: ["e_overstayed_usa_visa_i94_employee_if_yes_who"],
      });
    }

    // Overstayed - Dependents
    if (
      data.e_overstayed_usa_visa_i94_dependents === "yes" &&
      !data.e_overstayed_usa_visa_i94_dependents_if_yes_who?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify who overstayed",
        path: ["e_overstayed_usa_visa_i94_dependents_if_yes_who"],
      });
    }

    // Unlawfully Present - Employee
    if (
      data.eb_unlawfully_present_usa_employee === "yes" &&
      !data.eb_unlawfully_present_usa_employee_if_yes_who?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify who was unlawfully present",
        path: ["eb_unlawfully_present_usa_employee_if_yes_who"],
      });
    }

    // Unlawfully Present - Dependents
    if (
      data.eb_unlawfully_present_usa_dependents === "yes" &&
      !data.eb_unlawfully_present_usa_dependents_if_yes_who?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify who was unlawfully present",
        path: ["eb_unlawfully_present_usa_dependents_if_yes_who"],
      });
    }

    // Denied Entry - Employee
    if (
      data.eb_denied_entry_usa_employee === "yes" &&
      !data.eb_denied_entry_usa_employee_if_yes?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide details",
        path: ["eb_denied_entry_usa_employee_if_yes"],
      });
    }

    // Denied Entry - Dependents
    if (
      data.eb_denied_entry_usa_dependents === "yes" &&
      !data.eb_denied_entry_usa_dependents_if_yes?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide details",
        path: ["eb_denied_entry_usa_dependents_if_yes"],
      });
    }

    // Deported - Employee
    if (
      data.eb_deported_from_any_country_employee === "yes" &&
      !data.eb_deported_from_any_country_employee_if_yes?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide details",
        path: ["eb_deported_from_any_country_employee_if_yes"],
      });
    }

    // Deported - Dependents
    if (
      data.eb_deported_from_any_country_dependents === "yes" &&
      !data.eb_deported_from_any_country_dependents_if_yes?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide details",
        path: ["eb_deported_from_any_country_dependents_if_yes"],
      });
    }

    // Immigration Judge - Employee
    if (
      data.ebb_imr_judge_h_ofcr_employee === "yes" &&
      !data.ebb_imr_judge_h_ofcr_employee_if_yes?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide details",
        path: ["ebb_imr_judge_h_ofcr_employee_if_yes"],
      });
    }

    // Immigration Judge - Dependents
    if (
      data.ebb_imr_judge_h_ofcr_dependents === "yes" &&
      !data.ebb_imr_judge_h_ofcr_dependents_if_yes?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide details",
        path: ["ebb_imr_judge_h_ofcr_dependents_if_yes"],
      });
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
          <Typography sx={{ mb: 1 }}>
            Have you ever over stayed in the{" "}
            {vacancyDetail?.visa_category?.country?.name ||
              "the United States of America"}{" "}
            ?
          </Typography>

          {/* Applicant */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1 }}>Applicant</Typography>
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
                <Controller
                  name="e_overstayed_usa_visa_i94_employee_if_yes_who"
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
                      error={
                        !!errors.e_overstayed_usa_visa_i94_employee_if_yes_who
                      }
                      helperText={
                        errors.e_overstayed_usa_visa_i94_employee_if_yes_who
                          ?.message
                      }
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
                <Controller
                  name="e_overstayed_usa_visa_i94_dependents_if_yes_who"
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
                      error={
                        !!errors.e_overstayed_usa_visa_i94_dependents_if_yes_who
                      }
                      helperText={
                        errors.e_overstayed_usa_visa_i94_dependents_if_yes_who
                          ?.message
                      }
                    />
                  )}
                />
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* Unlawfull */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>
            Have you ever been Unlawfull Present in{" "}
            {vacancyDetail?.visa_category?.country?.name ||
              "the United States of America"}{" "}
            ?
          </Typography>

          {/* Applicant */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1 }}>Applicant</Typography>
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
                <Controller
                  name="eb_unlawfully_present_usa_employee_if_yes_who"
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
                      error={
                        !!errors.eb_unlawfully_present_usa_employee_if_yes_who
                      }
                      helperText={
                        errors.eb_unlawfully_present_usa_employee_if_yes_who
                          ?.message
                      }
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
                <Controller
                  name="eb_unlawfully_present_usa_dependents_if_yes_who"
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
                      error={
                        !!errors.eb_unlawfully_present_usa_dependents_if_yes_who
                      }
                      helperText={
                        errors.eb_unlawfully_present_usa_dependents_if_yes_who
                          ?.message
                      }
                    />
                  )}
                />
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* denied */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>
            Have you ever been denied entry to{" "}
            {vacancyDetail?.visa_category?.country?.name ||
              "the United States of America"}{" "}
            ?
          </Typography>

          {/* Applicant */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1 }}>Applicant</Typography>
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
                <Controller
                  name="eb_denied_entry_usa_employee_if_yes"
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
                      error={!!errors.eb_denied_entry_usa_employee_if_yes}
                      helperText={
                        errors.eb_denied_entry_usa_employee_if_yes?.message
                      }
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
                <Controller
                  name="eb_denied_entry_usa_dependents_if_yes"
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
                      error={!!errors.eb_denied_entry_usa_dependents_if_yes}
                      helperText={
                        errors.eb_denied_entry_usa_dependents_if_yes?.message
                      }
                    />
                  )}
                />
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* deported */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>
            Have you ever been deported or told to leave from any Country ?
          </Typography>

          {/* Applicant */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1 }}>Applicant</Typography>
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
                <Controller
                  name="eb_deported_from_any_country_employee_if_yes"
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
                <Controller
                  name="eb_deported_from_any_country_dependents_if_yes"
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
                      error={
                        !!errors.eb_deported_from_any_country_dependents_if_yes
                      }
                      helperText={
                        errors.eb_deported_from_any_country_dependents_if_yes
                          ?.message
                      }
                    />
                  )}
                />
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* immigration */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>
            Have you ever faced an immigration judge/hearing officer?
          </Typography>

          {/* Applicant */}
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1 }}>Applicant</Typography>
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
                <Controller
                  name="ebb_imr_judge_h_ofcr_employee_if_yes"
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
                      error={!!errors.ebb_imr_judge_h_ofcr_employee_if_yes}
                      helperText={
                        errors.ebb_imr_judge_h_ofcr_employee_if_yes?.message
                      }
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
                <Controller
                  name="ebb_imr_judge_h_ofcr_dependents_if_yes"
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
                      error={!!errors.ebb_imr_judge_h_ofcr_dependents_if_yes}
                      helperText={
                        errors.ebb_imr_judge_h_ofcr_dependents_if_yes?.message
                      }
                    />
                  )}
                />
              )}
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

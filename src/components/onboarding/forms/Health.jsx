import React from "react";
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Stack,
  Checkbox,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import { z } from "zod";

export const healthSchema = z
  .object({
    // === STD ===
    hasSTD: z.enum(["yes", "no"]).default("no"),
    stdDetails: z.string().optional(),

    hasStdDependent: z.enum(["yes", "no"]).default("no"),
    stdDependentDetails: z.string().optional(),

    // === Tuberculosis ===
    hasTb: z.enum(["yes", "no"]).default("no"),
    tbDetails: z.string().optional(),

    hasTbDependent: z.enum(["yes", "no"]).default("no"),
    tbDependentDetails: z.string().optional(),

    // === Health Insurance ===
    hasInsurance: z.enum(["yes", "no"]).default("no"),
    insuranceDetails: z.string().optional(),

    hasInsuranceDependent: z.enum(["yes", "no"]).default("no"),
    insuranceDependentDetails: z.string().optional(),

    agree_to_terms: z.boolean().refine((val) => val === true, {
      message: "You must agree before submitting",
    }),
  })
  .superRefine((data, ctx) => {
    // Validate STD details
    if (
      data.hasSTD === "yes" &&
      (!data.stdDetails || data.stdDetails.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please elaborate if you selected Yes",
        path: ["stdDetails"],
      });
    }

    // Validate STD dependent details
    if (
      data.hasStdDependent === "yes" &&
      (!data.stdDependentDetails || data.stdDependentDetails.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please elaborate if you selected Yes",
        path: ["stdDependentDetails"],
      });
    }

    // Validate TB details
    if (
      data.hasTb === "yes" &&
      (!data.tbDetails || data.tbDetails.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please elaborate if you selected Yes",
        path: ["tbDetails"],
      });
    }

    // Validate TB dependent details
    if (
      data.hasTbDependent === "yes" &&
      (!data.tbDependentDetails || data.tbDependentDetails.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please elaborate if you selected Yes",
        path: ["tbDependentDetails"],
      });
    }

    // Validate insurance details
    if (
      data.hasInsurance === "yes" &&
      (!data.insuranceDetails || data.insuranceDetails.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please elaborate if you selected Yes",
        path: ["insuranceDetails"],
      });
    }

    // Validate insurance dependent details
    if (
      data.hasInsuranceDependent === "yes" &&
      (!data.insuranceDependentDetails ||
        data.insuranceDependentDetails.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please elaborate if you selected Yes",
        path: ["insuranceDependentDetails"],
      });
    }
  });

export const Health = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const hasSTD = watch("hasSTD");
  const hasStdDependent = watch("hasStdDependent");

  const hasTb = watch("hasTb");
  const hasTbDependent = watch("hasTbDependent");

  const hasInsurance = watch("hasInsurance");
  const hasInsuranceDependent = watch("hasInsuranceDependent");

  return (
    <Box sx={{ mt: 4 }}>
      {/* STD Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
          Have you ever been diagnosed with a sexually transmitted disease?
        </Typography>

        <Typography sx={{ mb: 1, fontWeight: 500 }}>Applicant</Typography>

        <FormControl fullWidth>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Controller
              name="hasSTD"
              control={control}
              render={({ field }) => (
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
              )}
            />

            {hasSTD === "yes" && (
              <Controller
                name="stdDetails"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="If yes, please elaborate*"
                    size="small"
                    sx={{
                      minWidth: 300,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                      },
                    }}
                    error={!!errors.stdDetails}
                    helperText={errors.stdDetails?.message}
                  />
                )}
              />
            )}
          </Stack>

          {errors.hasSTD && (
            <Typography variant="caption" color="error">
              {errors.hasSTD.message}
            </Typography>
          )}
        </FormControl>

        {/* std (Dependent) */}
        <Box sx={{ mt: 5 }}>
          <Typography sx={{ mb: 1, fontWeight: 500, mt: 2 }}>
            Dependent
          </Typography>

          <FormControl fullWidth>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Controller
                name="hasStdDependent"
                control={control}
                render={({ field }) => (
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
                )}
              />

              {hasStdDependent === "yes" && (
                <Controller
                  name="stdDependentDetails"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="If yes, please elaborate*"
                      size="small"
                      sx={{
                        minWidth: 300,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                        },
                      }}
                      error={!!errors.stdDependentDetails}
                      helperText={errors.stdDependentDetails?.message}
                    />
                  )}
                />
              )}
            </Stack>
          </FormControl>
        </Box>
      </Box>

      {/* tb Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
          Have you ever been diagnosed with Tuberculosis ?
        </Typography>

        <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
          Applicant
        </Typography>

        <FormControl fullWidth>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Controller
              name="hasTb"
              control={control}
              render={({ field }) => (
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
              )}
            />

            {hasTb === "yes" && (
              <Controller
                name="tbDetails"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="If yes, please elaborate*"
                    size="small"
                    sx={{
                      minWidth: 300,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                      },
                    }}
                    error={!!errors.tbDetails}
                    helperText={errors.tbDetails?.message}
                  />
                )}
              />
            )}
          </Stack>

          {errors.hasTb && (
            <Typography variant="caption" color="error">
              {errors.hasTb.message}
            </Typography>
          )}
        </FormControl>

        {/* tb (Dependent) */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 500, mt: 2 }}>
            Dependent
          </Typography>

          <FormControl fullWidth>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Controller
                name="hasTbDependent"
                control={control}
                render={({ field }) => (
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
                )}
              />

              {hasTbDependent === "yes" && (
                <Controller
                  name="tbDependentDetails"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="If yes, please elaborate*"
                      size="small"
                      sx={{
                        minWidth: 300,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                        },
                      }}
                      error={!!errors.tbDependentDetails}
                      helperText={errors.tbDependentDetails?.message}
                    />
                  )}
                />
              )}
            </Stack>
          </FormControl>
        </Box>
      </Box>

      {/* health Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
          Do you have Health Insurance ?
        </Typography>

        <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
          Applicant
        </Typography>

        <FormControl fullWidth>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Controller
              name="hasInsurance"
              control={control}
              render={({ field }) => (
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
              )}
            />

            {hasInsurance === "yes" && (
              <Controller
                name="insuranceDetails"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="If yes, please elaborate*"
                    size="small"
                    sx={{
                      minWidth: 300,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                      },
                    }}
                    error={!!errors.insuranceDetails}
                    helperText={errors.insuranceDetails?.message}
                  />
                )}
              />
            )}
          </Stack>

          {errors.hasInsurance && (
            <Typography variant="caption" color="error">
              {errors.hasInsurance.message}
            </Typography>
          )}
        </FormControl>

        {/* tb (Dependent) */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 500, mt: 2 }}>
            Dependent
          </Typography>

          <FormControl fullWidth>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Controller
                name="hasInsuranceDependent"
                control={control}
                render={({ field }) => (
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
                )}
              />

              {hasInsuranceDependent === "yes" && (
                <Controller
                  name="insuranceDependentDetails"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="If yes, please elaborate*"
                      size="small"
                      sx={{
                        minWidth: 300,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                        },
                      }}
                      error={!!errors.insuranceDependentDetails}
                      helperText={errors.insuranceDependentDetails?.message}
                    />
                  )}
                />
              )}
            </Stack>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ mt: 6 }}>
        <Controller
          name="agree_to_terms"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    sx={{
                      color: "secondary.main",
                      "&.Mui-checked": {
                        color: "secondary.main",
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body1" fontWeight={700}>
                    I agree to all required form data
                  </Typography>
                }
              />
              {errors.agree_to_terms && (
                <Typography variant="caption" color="error">
                  {errors.agree_to_terms.message}
                </Typography>
              )}
            </FormControl>
          )}
        />
      </Box>
    </Box>
  );
};

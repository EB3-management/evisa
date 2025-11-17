import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  MenuItem,
  Select,
  FormHelperText,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useGetCountryCode } from "src/api";
import React, { useEffect } from "react";
import { Icon } from "@iconify/react";

/* ---------------------- ✅ CONSTANTS ---------------------- */
const kinshipOptions = ["Fiancee", "Daughter", "Son", "Spouse"];

/* ---------------------- ✅ ZOD SCHEMA ---------------------- */
export const dependentsSchema = z
  .object({
    has_dependents: z.enum(["Yes", "No"]),
    dependents: z
      .array(
        z.object({
          kinship: z.string().min(1, "Degree of kinship is required"),
          first_name: z.string().min(1, "First name is required"),
          middle_name: z.string().optional(),
          last_name: z.string().min(1, "Last name is required"),
          dob: z.string().min(1, "Date of birth is required"),
          birth_country: z.string().min(1, "Country of birth is required"),
          citizenship_country: z.string().min(1, "Country of citizenship is required"),
        })
      )
      .optional()
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (data.has_dependents === "Yes") {
      if (!data.dependents || data.dependents.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please add at least one dependent",
          path: ["dependents"],
        });
      } else {
        data.dependents.forEach((dependent, index) => {
          if (!dependent.first_name?.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "First name is required",
              path: ["dependents", index, "first_name"],
            });
          }
          if (!dependent.last_name?.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Last name is required",
              path: ["dependents", index, "last_name"],
            });
          }
          if (!dependent.dob) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Date of birth is required",
              path: ["dependents", index, "dob"],
            });
          }
          if (!dependent.birth_country) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Country of birth is required",
              path: ["dependents", index, "birth_country"],
            });
          }
          if (!dependent.citizenship_country) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Country of citizenship is required",
              path: ["dependents", index, "citizenship_country"],
            });
          }
          if (!dependent.kinship) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Degree of kinship is required",
              path: ["dependents", index, "kinship"],
            });
          }
        });
      }
    }
  });


/* ---------------------- ✅ MAIN COMPONENT ---------------------- */
export const DependentInformation = () => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();
  const { country } = useGetCountryCode();

  const hasDependents = watch("has_dependents");

  const {
    fields: dependents,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "dependents",
  });

  const showForm = hasDependents === "Yes";

  // ✅ Auto-add first dependent when "Yes" is selected, clear when "No"
  useEffect(() => {
    if (showForm && dependents.length === 0) {
      // Add first dependent when "Yes" is selected
      append({
        kinship: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        dob: "",
        birth_country: "",
        citizenship_country: "",
      });
    } else if (!showForm && dependents.length > 0) {
      // Clear all records when "No" is selected
      setValue("dependents", []);
      console.log("🗑️ Cleared dependents");
    }
  }, [showForm, dependents.length, setValue, append]);

  const today = new Date().toISOString().split("T")[0];

  /* ---------------------- ✅ MAIN RENDER ---------------------- */
  return (
    <Box id="section-7" sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Dependent Information
      </Typography>

      <Grid container spacing={4}>
        {/* Main Question */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>
            Do you have any dependents?
          </Typography>

          <Controller
            name="has_dependents"
            control={control}
            defaultValue="No"
            render={({ field }) => (
              <FormControl>
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
              </FormControl>
            )}
          />
        </Grid>

        {/* Dependent Forms */}
        {showForm && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Please provide your dependent details
              </Typography>

              {dependents.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    mb: 3,
                    p: 3,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="primary"
                    >
                      {index === 0 ? "Dependent" : `Dependent ${index + 1}`}
                    </Typography>
                    {dependents.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => remove(index)}
                        size="small"
                      >
                        <Icon icon="mdi:delete" width={20} />
                      </IconButton>
                    )}
                  </Stack>

                  <Grid container spacing={3}>
                    {/* Row 1: First Name, Middle Name, Last Name */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name={`dependents.${index}.first_name`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="First Name"
                            fullWidth
                            required
                            placeholder="Enter first name"
                            error={!!errors.dependents?.[index]?.first_name}
                            helperText={
                              errors.dependents?.[index]?.first_name?.message
                            }
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#fff",
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name={`dependents.${index}.middle_name`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Middle Name"
                            fullWidth
                            placeholder="Enter middle name"
                            error={!!errors.dependents?.[index]?.middle_name}
                            helperText={
                              errors.dependents?.[index]?.middle_name?.message
                            }
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#fff",
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name={`dependents.${index}.last_name`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Last Name"
                            fullWidth
                            required
                            placeholder="Enter last name"
                            error={!!errors.dependents?.[index]?.last_name}
                            helperText={
                              errors.dependents?.[index]?.last_name?.message
                            }
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#fff",
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Row 2: DOB and Kinship */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`dependents.${index}.dob`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Date of Birth"
                            type="date"
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ max: today }}
                            error={!!errors.dependents?.[index]?.dob}
                            helperText={errors.dependents?.[index]?.dob?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#fff",
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`dependents.${index}.kinship`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            error={!!errors.dependents?.[index]?.kinship}
                          >
                            <Select
                              {...field}
                              displayEmpty
                              sx={{ backgroundColor: "#fff" }}
                            >
                              <MenuItem value="">
                                <em>Select Degree of Kinship</em>
                              </MenuItem>
                              {kinshipOptions.map((option) => (
                                <MenuItem key={option} value={option.toLowerCase()}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.dependents?.[index]?.kinship && (
                              <FormHelperText>
                                {errors.dependents?.[index]?.kinship?.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    {/* Row 3: Country of Birth and Citizenship */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`dependents.${index}.birth_country`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            error={!!errors.dependents?.[index]?.birth_country}
                          >
                            <Select
                              {...field}
                              displayEmpty
                              sx={{ backgroundColor: "#fff" }}
                            >
                              <MenuItem value="">
                                <em>Select Country of Birth</em>
                              </MenuItem>
                              {country?.map((option) => (
                                <MenuItem key={option.value} value={String(option.value)}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.dependents?.[index]?.birth_country && (
                              <FormHelperText>
                                {errors.dependents?.[index]?.birth_country?.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`dependents.${index}.citizenship_country`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            error={!!errors.dependents?.[index]?.citizenship_country}
                          >
                            <Select
                              {...field}
                              displayEmpty
                              sx={{ backgroundColor: "#fff" }}
                            >
                              <MenuItem value="">
                                <em>Select Country of Citizenship</em>
                              </MenuItem>
                              {country?.map((option) => (
                                <MenuItem key={option.value} value={String(option.value)}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.dependents?.[index]?.citizenship_country && (
                              <FormHelperText>
                                {errors.dependents?.[index]?.citizenship_country?.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}

              {/* ✅ Add button shown just below the fields */}
              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:plus" />}
                onClick={() =>
                  append({
                    kinship: "",
                    first_name: "",
                    middle_name: "",
                    last_name: "",
                    dob: "",
                    birth_country: "",
                    citizenship_country: "",
                  })
                }
                sx={{ mt: 1 }}
              >
                Add Another Dependent
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

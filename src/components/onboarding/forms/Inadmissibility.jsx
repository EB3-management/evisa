import React, { useEffect } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  FormControl,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Icon } from "@iconify/react";

/* ---------------------- ✅ ZOD SCHEMA ---------------------- */
export const inadmissibilitySchema = z
  .object({
    has_inadmissibility: z.enum(["Yes", "No"]),
    inadmissibility_records: z
      .array(
        z.object({
          condition: z.string().min(1, "Condition is required"),
          doctor_first_name: z.string().min(1, "Doctor first name is required"),
          doctor_middle_name: z.string().optional().default(""),
          doctor_last_name: z.string().min(1, "Doctor last name is required"),
          procedure: z.string().min(1, "Procedure is required"),
          date: z.string().min(1, "Date is required"),
        }),
      )
      .optional()
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (data.has_inadmissibility === "Yes") {
      if (
        !data.inadmissibility_records ||
        data.inadmissibility_records.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please add at least one inadmissibility record",
          path: ["inadmissibility_records"],
        });
      } else {
        data.inadmissibility_records.forEach((record, index) => {
          if (!record.condition?.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Condition is required",
              path: ["inadmissibility_records", index, "condition"],
            });
          }
          if (!record.doctor_first_name?.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Doctor first name is required",
              path: ["inadmissibility_records", index, "doctor_first_name"],
            });
          }
          if (!record.doctor_last_name?.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Doctor last name is required",
              path: ["inadmissibility_records", index, "doctor_last_name"],
            });
          }
          if (!record.procedure?.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Procedure is required",
              path: ["inadmissibility_records", index, "procedure"],
            });
          }
          if (!record.date) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Date is required",
              path: ["inadmissibility_records", index, "date"],
            });
          }
        });
      }
    }
  });

/* ---------------------- ✅ MAIN COMPONENT ---------------------- */
export const Inadmissibility = () => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const hasInadmissibility = watch("has_inadmissibility");

  const {
    fields: inadmissibilityRecords,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "inadmissibility_records",
  });

  const showForm = hasInadmissibility === "Yes";

  // ✅ Auto-add first inadmissibility record when "Yes" is selected, clear when "No"
  useEffect(() => {
    if (showForm && inadmissibilityRecords.length === 0) {
      // Add first inadmissibility record when "Yes" is selected
      append({
        first_name: "",
        middle_name: "",
        last_name: "",
        condition: "",
        doctor: "",
        procedure: "",
        date: "",
      });
    } else if (!showForm && inadmissibilityRecords.length > 0) {
      // Clear all records when "No" is selected
      setValue("inadmissibility_records", []);
      console.log("🗑️ Cleared inadmissibility records");
    }
  }, [showForm, inadmissibilityRecords.length, setValue, append]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <Box id="section-11" sx={{ mb: 6 }}>
      {/* <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Inadmissibility
      </Typography> */}

      <Grid container spacing={4}>
        {/* Main Question */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>
            Do you have any inadmissibility issues?
          </Typography>

          <Controller
            name="has_inadmissibility"
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

        {/* Inadmissibility Record Forms */}
        {showForm && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Please provide your inadmissibility details
              </Typography>

              {inadmissibilityRecords.map((item, index) => (
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
                      {index === 0
                        ? "Inadmissibility Record"
                        : `Inadmissibility Record ${index + 1}`}
                    </Typography>
                    {inadmissibilityRecords.length > 1 && (
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
                    {/* Doctor First Name */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name={`inadmissibility_records.${index}.doctor_first_name`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="First Name"
                            fullWidth
                            required
                            placeholder="Enter first name"
                            error={
                              !!errors.inadmissibility_records?.[index]
                                ?.doctor_first_name
                            }
                            helperText={
                              errors.inadmissibility_records?.[index]
                                ?.doctor_first_name?.message
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

                    {/* Doctor Middle Name */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name={`inadmissibility_records.${index}.doctor_middle_name`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Middle Name"
                            fullWidth
                            placeholder="Enter middle name"
                            error={
                              !!errors.inadmissibility_records?.[index]
                                ?.doctor_middle_name
                            }
                            helperText={
                              errors.inadmissibility_records?.[index]
                                ?.doctor_middle_name?.message
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

                    {/* Doctor Last Name */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name={`inadmissibility_records.${index}.doctor_last_name`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Last Name"
                            fullWidth
                            required
                            placeholder="Enter last name"
                            error={
                              !!errors.inadmissibility_records?.[index]
                                ?.doctor_last_name
                            }
                            helperText={
                              errors.inadmissibility_records?.[index]
                                ?.doctor_last_name?.message
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

                    {/* Condition */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name={`inadmissibility_records.${index}.condition`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Condition"
                            fullWidth
                            required
                            placeholder="Enter condition"
                            error={
                              !!errors.inadmissibility_records?.[index]
                                ?.condition
                            }
                            helperText={
                              errors.inadmissibility_records?.[index]?.condition
                                ?.message
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

                    {/* Procedure */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name={`inadmissibility_records.${index}.procedure`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Procedure"
                            fullWidth
                            required
                            placeholder="Enter procedure"
                            error={
                              !!errors.inadmissibility_records?.[index]
                                ?.procedure
                            }
                            helperText={
                              errors.inadmissibility_records?.[index]?.procedure
                                ?.message
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

                    {/* Date */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name={`inadmissibility_records.${index}.date`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Date"
                            type="date"
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ max: today }}
                            error={
                              !!errors.inadmissibility_records?.[index]?.date
                            }
                            helperText={
                              errors.inadmissibility_records?.[index]?.date
                                ?.message
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
                  </Grid>
                </Box>
              ))}

              {/* ✅ Add button shown just below the fields */}
              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:plus" />}
                onClick={() =>
                  append({
                    condition: "",
                    doctor_first_name: "",
                    doctor_middle_name: "",
                    doctor_last_name: "",
                    procedure: "",
                    date: "",
                  })
                }
                sx={{ mt: 1 }}
              >
                Add Another Inadmissibility Record
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

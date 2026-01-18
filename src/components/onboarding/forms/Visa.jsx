import React, { useEffect } from "react";
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
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";
import Grid from "@mui/material/Grid2";
import { Icon } from "@iconify/react";
import { useGetImmigrationTypes } from "src/api/onboardingform";

// ------------------ Validation Schema ------------------
export const visaSchema = z
  .object({
    has_visa_records: z.enum(["Yes", "No"]),
    visa_records: z
      .array(
        z.object({
          visaName: z.string().min(1, "Name is required"),
          visaType: z.union([z.string(), z.number()]).refine((val) => val !== "" && val !== null && val !== undefined, {
            message: "Visa type is required",
          }),
          visaExpeditionDate: z.string().min(1, "Expedition date is required"),
          visaExpirationDate: z.string().min(1, "Expiration date is required"),
        }),
      )
      .optional()
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (data.has_visa_records === "Yes") {
      if (!data.visa_records || data.visa_records.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please add at least one visa record",
          path: ["visa_records"],
        });
      } else {
        data.visa_records.forEach((record, index) => {
          if (!record.visaName?.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Name is required",
              path: ["visa_records", index, "visaName"],
            });
          }
          if (!record.visaType && record.visaType !== 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Visa type is required",
              path: ["visa_records", index, "visaType"],
            });
          }
          if (!record.visaExpeditionDate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Expedition date is required",
              path: ["visa_records", index, "visaExpeditionDate"],
            });
          }
          if (!record.visaExpirationDate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Expiration date is required",
              path: ["visa_records", index, "visaExpirationDate"],
            });
          }
        });
      }
    }
  });

// ------------------ Component ------------------
export const Visa = ({ vacancyId }) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const hasVisaRecords = watch("has_visa_records");
  const { immigrationType, immigrationTypeLoading } =
    useGetImmigrationTypes(vacancyId);
  const {
    fields: visaRecords,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "visa_records",
  });

  const showForm = hasVisaRecords === "Yes";

  // ✅ Auto-add first visa record when "Yes" is selected, clear when "No"
  useEffect(() => {
    if (showForm && visaRecords.length === 0) {
      // Add first visa record when "Yes" is selected
      append({
        visaName: "",
        visaType: "",
        visaExpeditionDate: "",
        visaExpirationDate: "",
      });
    } else if (!showForm && visaRecords.length > 0) {
      // Clear all records when "No" is selected
      setValue("visa_records", []);
      console.log("🗑️ Cleared visa records");
    }
  }, [showForm, visaRecords.length, setValue, append]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <Box id="section-12" sx={{ mb: 6 }}>
      {/* <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        US Visa Records
      </Typography> */}

      <Grid container spacing={4}>
        {/* Main Question */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>
            Do you or your dependent hold any US Visa?
          </Typography>

          <Controller
            name="has_visa_records"
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

        {/* Visa Record Forms */}
        {showForm && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Please provide your visa record details
              </Typography>

              {visaRecords.map((item, index) => (
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
                      {index === 0 ? "Visa Record" : `Visa Record ${index + 1}`}
                    </Typography>
                    {visaRecords.length > 1 && (
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
                    {/* Name */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`visa_records.${index}.visaName`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Name"
                            fullWidth
                            required
                            placeholder="Enter name"
                            error={!!errors.visa_records?.[index]?.visaName}
                            helperText={
                              errors.visa_records?.[index]?.visaName?.message
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

                    {/* Type of Visa */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`visa_records.${index}.visaType`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            error={!!errors.visa_records?.[index]?.visaType}
                          >
                            <TextField
                              {...field}
                              select
                              label="Type of Visa"
                              fullWidth
                              required
                              disabled={immigrationTypeLoading}
                              error={!!errors.visa_records?.[index]?.visaType}
                              onChange={(e) => {
                                // Find the selected type and extract the code from the name
                                const selectedType = immigrationType?.find(
                                  (type) => type.id === e.target.value
                                );
                                if (selectedType) {
                                  // Extract code from name (e.g., "E11-EB-1 Extraordinary Ability" -> "E11")
                                  const typeCode = selectedType.name.split(/[-–\s]/)[0].trim();
                                  field.onChange(typeCode);
                                } else {
                                  field.onChange(e.target.value);
                                }
                              }}
                              value={
                                // Find the ID that matches the stored code
                                immigrationType?.find((type) => 
                                  type.name.split(/[-–\s]/)[0].trim() === field.value
                                )?.id || field.value || ""
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#fff",
                                },
                              }}
                            >
                              <MenuItem value="">
                                <em>
                                  {immigrationTypeLoading
                                    ? "Loading..."
                                    : "Select Visa Type"}
                                </em>
                              </MenuItem>
                              {immigrationType?.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                  {type.name}
                                </MenuItem>
                              ))}
                            </TextField>
                            {errors.visa_records?.[index]?.visaType && (
                              <FormHelperText>
                                {
                                  errors.visa_records?.[index]?.visaType
                                    ?.message
                                }
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    {/* Expedition Date */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`visa_records.${index}.visaExpeditionDate`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Expedition Date"
                            type="date"
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            error={
                              !!errors.visa_records?.[index]?.visaExpeditionDate
                            }
                            helperText={
                              errors.visa_records?.[index]?.visaExpeditionDate
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

                    {/* Expiration Date */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`visa_records.${index}.visaExpirationDate`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Expiration Date"
                            type="date"
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            error={
                              !!errors.visa_records?.[index]?.visaExpirationDate
                            }
                            helperText={
                              errors.visa_records?.[index]?.visaExpirationDate
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
                    visaName: "",
                    visaType: "",
                    visaExpeditionDate: "",
                    visaExpirationDate: "",
                  })
                }
                sx={{ mt: 1 }}
              >
                Add Another Visa Record
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

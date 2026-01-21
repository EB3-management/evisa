import React, { useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  TextField,
  FormHelperText,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  IconButton,
  Stack,
  MenuItem,
} from "@mui/material";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";
import Grid from "@mui/material/Grid2";
import { Icon } from "@iconify/react";
import { useGetImmigrationTypes } from "src/api/onboardingform";

// ------------------ Validation Schema ------------------
export const processingInformationSchema = z
  .object({
    adjustment_of_status: z.boolean().default(true),
    date_of_last_entry: z.string().optional(),
    i944_number: z.string().optional(),
    embassy_name: z.string().optional(),
    embassy_location: z.string().optional(),
    has_visa_records: z.enum(["Yes", "No"]).optional(),
    visa_records: z
      .array(
        z.object({
          visaName: z.string().min(1, "Name is required"),
          visaType: z
            .union([z.string(), z.number()])
            .refine((val) => val !== "" && val !== null && val !== undefined, {
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
    if (data.adjustment_of_status === true) {
      // If yes, require date_of_last_entry and i944_number
      if (!data.date_of_last_entry) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date of last entry is required",
          path: ["date_of_last_entry"],
        });
      }
      if (!data.i944_number?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "I-944 number is required",
          path: ["i944_number"],
        });
      }
      
      // Validate visa records when adjustment of status is Yes
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
    } else {
      // If no, require embassy_name and embassy_location
      if (!data.embassy_name?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Embassy name is required",
          path: ["embassy_name"],
        });
      }
      if (!data.embassy_location?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Embassy location is required",
          path: ["embassy_location"],
        });
      }
    }
  });

// ------------------ Component ------------------
export const ProcessingInformation = ({ vacancyData }) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const adjustmentOfStatus = watch("adjustment_of_status", true);
  const hasVisaRecords = watch("has_visa_records");
  const { immigrationType, immigrationTypeLoading } =
    useGetImmigrationTypes(vacancyData?.id);
  
  const {
    fields: visaRecords,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "visa_records",
  });

  const showVisaForm = adjustmentOfStatus === true && hasVisaRecords === "Yes";

  // Auto-add first visa record when "Yes" is selected, clear when "No"
  useEffect(() => {
    if (showVisaForm && visaRecords.length === 0) {
      append({
        visaName: "",
        visaType: "",
        visaExpeditionDate: "",
        visaExpirationDate: "",
      });
    } else if (!showVisaForm && visaRecords.length > 0 && adjustmentOfStatus === true) {
      setValue("visa_records", []);
    }
  }, [showVisaForm, visaRecords.length, setValue, append, adjustmentOfStatus]);

  return (
    <Box id="section-0" sx={{ mb: 6 }}>
      {/* <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Processing Information
      </Typography> */}

      <Grid container spacing={3}>
        {/* Adjustment of Status */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1, fontWeight: 500 }}>
            Are you currently applying for{" "}
            {vacancyData?.visa_category?.country?.name ||
              "the United States of America"}
            ?
          </Typography>
          <Controller
            name="adjustment_of_status"
            control={control}
            // eslint-disable-next-line react/jsx-boolean-value
            defaultValue={true}
            render={({ field }) => (
              <FormControl error={!!errors.adjustment_of_status}>
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
                {errors.adjustment_of_status && (
                  <FormHelperText>
                    {errors.adjustment_of_status?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Conditional Fields - If Yes */}
        {adjustmentOfStatus === true && (
          <>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                Adjustment of status
              </Typography>
            </Grid>
            {/* Date of Last Entry */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1 }}>
                Date of Last Entry <span style={{ color: "red" }}>*</span>
              </Typography>
              <Controller
                name="date_of_last_entry"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.date_of_last_entry}>
                    <TextField
                      {...field}
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                      }}
                      error={!!errors.date_of_last_entry}
                    />
                    {errors.date_of_last_entry && (
                      <FormHelperText>
                        {errors.date_of_last_entry?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* I-944 Number */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1 }}>
                I-944 Number <span style={{ color: "red" }}>*</span>
              </Typography>
              <Controller
                name="i944_number"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.i944_number}>
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter I-944 number"
                      sx={{
                        "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                      }}
                      error={!!errors.i944_number}
                    />
                    {errors.i944_number && (
                      <FormHelperText>
                        {errors.i944_number?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Visa Records Section - Only when adjustment = Yes */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
                Visa Records
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography sx={{ mb: 2, fontWeight: 500 }}>
                Do you or your dependent hold any{" "}
                {vacancyData?.visa_category?.country?.name ||
                  "the United States of America"}{" "}
                Visa?
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
            {showVisaForm && (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
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
                                    const selectedType = immigrationType?.find(
                                      (type) => type.id === e.target.value,
                                    );
                                    if (selectedType) {
                                      const typeCode = selectedType.name
                                        .split(/[-–\s]/)[0]
                                        .trim();
                                      field.onChange(typeCode);
                                    } else {
                                      field.onChange(e.target.value);
                                    }
                                  }}
                                  value={
                                    immigrationType?.find(
                                      (type) =>
                                        type.name.split(/[-–\s]/)[0].trim() ===
                                        field.value,
                                    )?.id ||
                                    field.value ||
                                    ""
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
          </>
        )}

        {/* Conditional Fields - If No (Consular Processing) */}
        {adjustmentOfStatus === false && (
          <>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                Consular Processing
              </Typography>
            </Grid>

            {/* Embassy Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1 }}>
                Embassy Name <span style={{ color: "red" }}>*</span>
              </Typography>
              <Controller
                name="embassy_name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.embassy_name}>
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter embassy name"
                      sx={{
                        "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                      }}
                      error={!!errors.embassy_name}
                    />
                    {errors.embassy_name && (
                      <FormHelperText>
                        {errors.embassy_name?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Embassy Location */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1 }}>
                Embassy Location <span style={{ color: "red" }}>*</span>
              </Typography>
              <Controller
                name="embassy_location"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.embassy_location}>
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter embassy location"
                      sx={{
                        "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                      }}
                      error={!!errors.embassy_location}
                    />
                    {errors.embassy_location && (
                      <FormHelperText>
                        {errors.embassy_location?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

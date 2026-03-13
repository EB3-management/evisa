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
  Select,
} from "@mui/material";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";
import Grid from "@mui/material/Grid2";
import { Icon } from "@iconify/react";
import { useGetImmigrationTypes } from "src/api/onboardingform";
import { useGetCountryCode } from "src/api";

// ------------------ Validation Schema ------------------
export const processingInformationSchema = z
  .object({
    adjustment_of_status: z.boolean().default(true),
    date_of_last_entry: z.string().optional(),
    i944_number: z.string().optional(),
    embassy_name: z.string().optional(),
    embassy_location: z.string().optional(),
    visa_records_applicant: z.enum(["yes", "no"]).optional().default("no"),
    visa_records_dependents: z.enum(["yes", "no"]).optional().default("no"),
    applicant_visa_records: z
      .array(
        z.object({
          fullname: z.string().min(1, "Name is required"),
          type: z
            .union([z.string(), z.number()])
            .refine((val) => val !== "" && val !== null && val !== undefined, {
              message: "Visa type is required",
            }),
          expedition_date: z.string().min(1, "Issued date is required"),
          expiration_date: z.string().min(1, "Expiry date is required"),
        }),
      )
      .optional()
      .default([]),
    dependent_visa_records: z
      .array(
        z.object({
          fullname: z.string().min(1, "Name is required"),
          type: z
            .union([z.string(), z.number()])
            .refine((val) => val !== "" && val !== null && val !== undefined, {
              message: "Visa type is required",
            }),
          expedition_date: z.string().min(1, "Issued date is required"),
          expiration_date: z.string().min(1, "Expiry date is required"),
        }),
      )
      .optional()
      .default([]),
    dependents: z
      .array(
        z.object({
          first_name: z.string().min(1, "First name is required"),
          middle_name: z.string().optional().default(""),
          last_name: z.string().min(1, "Last name is required"),
          dob: z.string().min(1, "Date of birth is required"),
          relation: z.string().min(1, "Relation is required"),
          country_of_birth: z.union([z.string(), z.number()]).optional(),
          country_of_citizenship: z.union([z.string(), z.number()]).optional(),
          highest_level_of_education: z.string().optional().default(""),
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

      // Validate applicant visa records when applicant says yes
      if (data.visa_records_applicant === "yes") {
        if (
          !data.applicant_visa_records ||
          data.applicant_visa_records.length === 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please add at least one visa record for applicant",
            path: ["applicant_visa_records"],
          });
        }
      }

      // Validate dependent visa records when dependent says yes
      if (data.visa_records_dependents === "yes") {
        if (
          !data.dependent_visa_records ||
          data.dependent_visa_records.length === 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please add at least one visa record for dependent",
            path: ["dependent_visa_records"],
          });
        }
        if (!data.dependents || data.dependents.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please add dependent information",
            path: ["dependents"],
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
  const visaRecordsApplicant = watch("visa_records_applicant", "no");
  const visaRecordsDependents = watch("visa_records_dependents", "no");

  const { immigrationType, immigrationTypeLoading } = useGetImmigrationTypes(
    vacancyData?.id,
  );

  const { country } = useGetCountryCode();

  // Field arrays for applicant visa records
  const {
    fields: applicantVisaRecords,
    append: appendApplicantVisa,
    remove: removeApplicantVisa,
  } = useFieldArray({
    control,
    name: "applicant_visa_records",
  });

  // Field arrays for dependent visa records
  const {
    fields: dependentVisaRecords,
    append: appendDependentVisa,
    remove: removeDependentVisa,
  } = useFieldArray({
    control,
    name: "dependent_visa_records",
  });

  // Field arrays for dependent information
  const {
    fields: dependentInformations,
    append: appendDependentInfo,
    remove: removeDependentInfo,
  } = useFieldArray({
    control,
    name: "dependents",
  });

  // Auto-add first visa record for applicant
  useEffect(() => {
    if (visaRecordsApplicant === "yes" && applicantVisaRecords.length === 0) {
      appendApplicantVisa({
        fullname: "",
        type: "",
        expedition_date: "",
        expiration_date: "",
      });
    } else if (
      visaRecordsApplicant === "no" &&
      applicantVisaRecords.length > 0
    ) {
      setValue("applicant_visa_records", []);
    }
  }, [
    visaRecordsApplicant,
    applicantVisaRecords.length,
    setValue,
    appendApplicantVisa,
  ]);

  // Auto-add first visa record and dependent info for dependent
  useEffect(() => {
    if (visaRecordsDependents === "yes") {
      if (dependentVisaRecords.length === 0) {
        appendDependentVisa({
          fullname: "",
          type: "",
          expedition_date: "",
          expiration_date: "",
        });
      }
      if (dependentInformations.length === 0) {
        appendDependentInfo({
          first_name: "",
          middle_name: "",
          last_name: "",
          dob: "",
          relation: "",
          country_of_birth: "",
          country_of_citizenship: "",
          highest_level_of_education: "",
        });
      }
    } else if (visaRecordsDependents === "no") {
      if (dependentVisaRecords.length > 0) {
        setValue("dependent_visa_records", []);
      }
      if (dependentInformations.length > 0) {
        setValue("dependents", []);
      }
    }
  }, [
    visaRecordsDependents,
    dependentVisaRecords.length,
    dependentInformations.length,
    setValue,
    appendDependentVisa,
    appendDependentInfo,
  ]);

  const relationOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

  const educationOptions = [
    { value: "high_school", label: "High School" },
    { value: "bachelors", label: "Bachelor's Degree" },
    { value: "masters", label: "Master's Degree" },
    { value: "phd", label: "PhD" },
    { value: "none", label: "None" },
  ];

  const today = new Date().toISOString().split("T")[0];

  return (
    <Box id="section-0" sx={{ mb: 6 }}>
      <Grid container spacing={3}>
        {/* Adjustment of Status */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1, fontWeight: 500 }}>
            Are you currently applying to{" "}
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
              <Typography
                variant="h6"
                sx={{ textAlign: "center", mt: 2, mb: 1, fontWeight: 600 }}
              >
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
              <Typography
                variant="h5"
                sx={{
                  mt: 2,
                  fontWeight: 600,
                  textAlign: "center",
                  color: "primary.contrastText",
                }}
              >
                Visa Records
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                Are any{" "}
                {vacancyData?.visa_category?.country?.name ||
                  "the United States of America"}{" "}
                visas held?
              </Typography>

              {/* Applicant Visa Records Section */}
              <Box sx={{ mb: 4 }}>
                <Typography sx={{ mb: 2, fontWeight: 500 }}>
                  Applicant
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Controller
                    name="visa_records_applicant"
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
                </Stack>

                {/* Applicant Visa Records Form */}
                {visaRecordsApplicant === "yes" && (
                  <Box sx={{ mt: 3 }}>
                    {applicantVisaRecords.map((item, index) => (
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
                              ? "Applicant Visa Record"
                              : `Applicant Visa Record ${index + 1}`}
                          </Typography>
                          {applicantVisaRecords.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => removeApplicantVisa(index)}
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
                              name={`applicant_visa_records.${index}.fullname`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Name"
                                  fullWidth
                                  required
                                  placeholder="Enter name"
                                  error={
                                    !!errors.applicant_visa_records?.[index]
                                      ?.fullname
                                  }
                                  helperText={
                                    errors.applicant_visa_records?.[index]
                                      ?.fullname?.message
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
                              name={`applicant_visa_records.${index}.type`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <FormControl
                                  fullWidth
                                  error={
                                    !!errors.applicant_visa_records?.[index]
                                      ?.type
                                  }
                                >
                                  <TextField
                                    {...field}
                                    select
                                    label="Type of Visa"
                                    fullWidth
                                    required
                                    disabled={immigrationTypeLoading}
                                    error={
                                      !!errors.applicant_visa_records?.[index]
                                        ?.type
                                    }
                                    onChange={(e) => {
                                      const selectedType =
                                        immigrationType?.find(
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
                                          type.name
                                            .split(/[-–\s]/)[0]
                                            .trim() === field.value,
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
                                  {errors.applicant_visa_records?.[index]
                                    ?.type && (
                                    <FormHelperText>
                                      {
                                        errors.applicant_visa_records?.[index]
                                          ?.type?.message
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
                              name={`applicant_visa_records.${index}.expedition_date`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Issued Date"
                                  type="date"
                                  fullWidth
                                  required
                                  InputLabelProps={{ shrink: true }}
                                  error={
                                    !!errors.applicant_visa_records?.[index]
                                      ?.expedition_date
                                  }
                                  helperText={
                                    errors.applicant_visa_records?.[index]
                                      ?.expedition_date?.message
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
                              name={`applicant_visa_records.${index}.expiration_date`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Expiry Date"
                                  type="date"
                                  fullWidth
                                  required
                                  InputLabelProps={{ shrink: true }}
                                  error={
                                    !!errors.applicant_visa_records?.[index]
                                      ?.expiration_date
                                  }
                                  helperText={
                                    errors.applicant_visa_records?.[index]
                                      ?.expiration_date?.message
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
                        appendApplicantVisa({
                          fullname: "",
                          type: "",
                          expedition_date: "",
                          expiration_date: "",
                        })
                      }
                      sx={{ mt: 1 }}
                    >
                      Add Another Visa Record
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Dependent Visa Records Section */}
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ mb: 2, fontWeight: 500 }}>
                  Dependents
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Controller
                    name="visa_records_dependents"
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
                </Stack>

                {/* Dependent Visa Records & Information Form */}
                {visaRecordsDependents === "yes" && (
                  <Box sx={{ mt: 3 }}>
                    {/* Dependent Information */}
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      Dependent Information
                    </Typography>

                    {dependentInformations.map((item, depIndex) => (
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
                            {depIndex === 0
                              ? "Dependent"
                              : `Dependent ${depIndex + 1}`}
                          </Typography>
                          {dependentInformations.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => removeDependentInfo(depIndex)}
                              size="small"
                            >
                              <Icon icon="mdi:delete" width={20} />
                            </IconButton>
                          )}
                        </Stack>

                        <Grid container spacing={3}>
                          {/* First Name */}
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                              name={`dependents.${depIndex}.first_name`}
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
                                    !!errors.dependents?.[depIndex]?.first_name
                                  }
                                  helperText={
                                    errors.dependents?.[depIndex]?.first_name
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

                          {/* Middle Name */}
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                              name={`dependents.${depIndex}.middle_name`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Middle Name"
                                  fullWidth
                                  placeholder="Enter middle name"
                                  error={
                                    !!errors.dependents?.[depIndex]?.middle_name
                                  }
                                  helperText={
                                    errors.dependents?.[depIndex]?.middle_name
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

                          {/* Last Name */}
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                              name={`dependents.${depIndex}.last_name`}
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
                                    !!errors.dependents?.[depIndex]?.last_name
                                  }
                                  helperText={
                                    errors.dependents?.[depIndex]?.last_name
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

                          {/* DOB */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                              name={`dependents.${depIndex}.dob`}
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
                                  error={!!errors.dependents?.[depIndex]?.dob}
                                  helperText={
                                    errors.dependents?.[depIndex]?.dob?.message
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

                          {/* Relation */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                              name={`dependents.${depIndex}.relation`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  select
                                  label="Relation"
                                  fullWidth
                                  required
                                  InputLabelProps={{ shrink: true }}
                                  error={
                                    !!errors.dependents?.[depIndex]?.relation
                                  }
                                  helperText={
                                    errors.dependents?.[depIndex]?.relation
                                      ?.message
                                  }
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      backgroundColor: "#fff",
                                    },
                                  }}
                                >
                                  <MenuItem value="">
                                    <em>Select Relation</em>
                                  </MenuItem>
                                  {relationOptions.map((option) => (
                                    <MenuItem
                                      key={option}
                                      value={option.toLowerCase()}
                                    >
                                      {option}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              )}
                            />
                          </Grid>

                          {/* Country of Birth */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                              name={`dependents.${depIndex}.country_of_birth`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <FormControl fullWidth>
                                  <Typography
                                    sx={{
                                      mb: 1,
                                      fontWeight: 500,
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    Country of Birth (Optional)
                                  </Typography>
                                  <Select
                                    {...field}
                                    displayEmpty
                                    sx={{ backgroundColor: "#fff" }}
                                  >
                                    <MenuItem value="">
                                      <em>Select Country of Birth</em>
                                    </MenuItem>
                                    {country?.map((option) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.id}
                                      >
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          {/* Country of Citizenship */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                              name={`dependents.${depIndex}.country_of_citizenship`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <FormControl fullWidth>
                                  <Typography
                                    sx={{
                                      mb: 1,
                                      fontWeight: 500,
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    Country of Citizenship (Optional)
                                  </Typography>
                                  <Select
                                    {...field}
                                    displayEmpty
                                    sx={{ backgroundColor: "#fff" }}
                                  >
                                    <MenuItem value="">
                                      <em>Select Country of Citizenship</em>
                                    </MenuItem>
                                    {country?.map((option) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.id}
                                      >
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          {/* Education Level */}
                          <Grid size={{ xs: 12 }}>
                            <Controller
                              name={`dependents.${depIndex}.highest_level_of_education`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <FormControl fullWidth>
                                  <Typography
                                    sx={{
                                      mb: 1,
                                      fontWeight: 500,
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    Highest Level of Education (Optional)
                                  </Typography>
                                  <RadioGroup {...field} row>
                                    {educationOptions.map((option) => (
                                      <FormControlLabel
                                        key={option.value}
                                        value={option.value}
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
                                        label={option.label}
                                        sx={{
                                          "& .MuiFormControlLabel-label": {
                                            color: "text.primary",
                                            fontWeight: 500,
                                          },
                                        }}
                                      />
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          {/* Conditional Education Form Fields */}
                          {watch(
                            `dependents.${depIndex}.highest_level_of_education`,
                          ) &&
                            watch(
                              `dependents.${depIndex}.highest_level_of_education`,
                            ) !== "none" && (
                              <>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <Typography sx={{ mb: 1 }}>
                                    Name of Institute
                                  </Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.instituteName`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        fullWidth
                                        placeholder="Enter institute name"
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.instituteName
                                        }
                                        helperText={
                                          errors.dependents?.[depIndex]
                                            ?.instituteName?.message
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

                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <Typography sx={{ mb: 1 }}>
                                    Year of Graduation
                                  </Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.graduationYear`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        type="number"
                                        fullWidth
                                        placeholder="YYYY"
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.graduationYear
                                        }
                                        helperText={
                                          errors.dependents?.[depIndex]
                                            ?.graduationYear?.message
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

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                  <Typography sx={{ mb: 1 }}>
                                    Country
                                  </Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.edu_country`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <FormControl
                                        fullWidth
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.edu_country
                                        }
                                      >
                                        <Select
                                          {...field}
                                          displayEmpty
                                          sx={{ backgroundColor: "#fff" }}
                                        >
                                          <MenuItem value="">
                                            <em>Select Country</em>
                                          </MenuItem>
                                          {country?.map((option) => (
                                            <MenuItem
                                              key={option.id}
                                              value={option.id}
                                            >
                                              {option.label}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                        {errors.dependents?.[depIndex]
                                          ?.edu_country && (
                                          <FormHelperText>
                                            {
                                              errors.dependents[depIndex]
                                                .edu_country.message
                                            }
                                          </FormHelperText>
                                        )}
                                      </FormControl>
                                    )}
                                  />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                  <Typography sx={{ mb: 1 }}>State</Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.edu_state`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        fullWidth
                                        placeholder="Enter state"
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.edu_state
                                        }
                                        helperText={
                                          errors.dependents?.[depIndex]
                                            ?.edu_state?.message
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

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                  <Typography sx={{ mb: 1 }}>City</Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.edu_city`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        fullWidth
                                        placeholder="Enter city"
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.edu_city
                                        }
                                        helperText={
                                          errors.dependents?.[depIndex]
                                            ?.edu_city?.message
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

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                  <Typography sx={{ mb: 1 }}>
                                    Zip Code
                                  </Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.edu_zipCode`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        fullWidth
                                        placeholder="Enter zip code"
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.edu_zipCode
                                        }
                                        helperText={
                                          errors.dependents?.[depIndex]
                                            ?.edu_zipCode?.message
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

                                <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                                  <Typography sx={{ mb: 1 }}>
                                    Address
                                  </Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.edu_address`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        rows={2}
                                        placeholder="Enter full address"
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.edu_address
                                        }
                                        helperText={
                                          errors.dependents?.[depIndex]
                                            ?.edu_address?.message
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
                              </>
                            )}
                        </Grid>
                      </Box>
                    ))}

                    <Button
                      variant="outlined"
                      startIcon={<Icon icon="mdi:plus" />}
                      onClick={() =>
                        appendDependentInfo({
                          first_name: "",
                          middle_name: "",
                          last_name: "",
                          dob: "",
                          relation: "",
                          country_of_birth: "",
                          country_of_citizenship: "",
                          highest_level_of_education: "",
                        })
                      }
                      sx={{ mt: 1, mb: 3 }}
                    >
                      Add Another Dependent
                    </Button>

                    {/* Dependent Visa Records */}
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      Dependent Visa Records
                    </Typography>

                    {dependentVisaRecords.map((item, index) => (
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
                              ? "Dependent Visa Record"
                              : `Dependent Visa Record ${index + 1}`}
                          </Typography>
                          {dependentVisaRecords.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => removeDependentVisa(index)}
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
                              name={`dependent_visa_records.${index}.fullname`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Name"
                                  fullWidth
                                  required
                                  placeholder="Enter name"
                                  error={
                                    !!errors.dependent_visa_records?.[index]
                                      ?.fullname
                                  }
                                  helperText={
                                    errors.dependent_visa_records?.[index]
                                      ?.fullname?.message
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
                              name={`dependent_visa_records.${index}.type`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <FormControl
                                  fullWidth
                                  error={
                                    !!errors.dependent_visa_records?.[index]
                                      ?.type
                                  }
                                >
                                  <TextField
                                    {...field}
                                    select
                                    label="Type of Visa"
                                    fullWidth
                                    required
                                    disabled={immigrationTypeLoading}
                                    error={
                                      !!errors.dependent_visa_records?.[index]
                                        ?.type
                                    }
                                    onChange={(e) => {
                                      const selectedType =
                                        immigrationType?.find(
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
                                          type.name
                                            .split(/[-–\s]/)[0]
                                            .trim() === field.value,
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
                                  {errors.dependent_visa_records?.[index]
                                    ?.type && (
                                    <FormHelperText>
                                      {
                                        errors.dependent_visa_records?.[index]
                                          ?.type?.message
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
                              name={`dependent_visa_records.${index}.expedition_date`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Issued Date"
                                  type="date"
                                  fullWidth
                                  required
                                  InputLabelProps={{ shrink: true }}
                                  error={
                                    !!errors.dependent_visa_records?.[index]
                                      ?.expedition_date
                                  }
                                  helperText={
                                    errors.dependent_visa_records?.[index]
                                      ?.expedition_date?.message
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
                              name={`dependent_visa_records.${index}.expiration_date`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Expiry Date"
                                  type="date"
                                  fullWidth
                                  required
                                  InputLabelProps={{ shrink: true }}
                                  error={
                                    !!errors.dependent_visa_records?.[index]
                                      ?.expiration_date
                                  }
                                  helperText={
                                    errors.dependent_visa_records?.[index]
                                      ?.expiration_date?.message
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
                        appendDependentVisa({
                          fullname: "",
                          type: "",
                          expedition_date: "",
                          expiration_date: "",
                        })
                      }
                      sx={{ mt: 1 }}
                    >
                      Add Another Visa Record
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </>
        )}

        {/* Conditional Fields - If No (Consular Processing) */}
        {adjustmentOfStatus === false && (
          <>
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h6"
                sx={{ textAlign: "center", mt: 2, mb: 1, fontWeight: 600 }}
              >
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

            {/* Visa Records Section - Only when Consular Processing */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h5"
                sx={{
                  mt: 4,
                  fontWeight: 600,
                  textAlign: "center",
                  color: "primary.contrastText",
                }}
              >
                Visa Records
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                Are any{" "}
                {vacancyData?.visa_category?.country?.name ||
                  "the United States of America"}{" "}
                visas held?
              </Typography>

              {/* Applicant Visa Records Section */}
              <Box sx={{ mb: 4 }}>
                <Typography sx={{ mb: 2, fontWeight: 500 }}>
                  Applicant
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Controller
                    name="visa_records_applicant"
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
                </Stack>

                {/* Applicant Visa Records Form */}
                {visaRecordsApplicant === "yes" && (
                  <Box sx={{ mt: 3 }}>
                    {applicantVisaRecords.map((item, index) => (
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
                              ? "Applicant Visa Record"
                              : `Applicant Visa Record ${index + 1}`}
                          </Typography>
                          {applicantVisaRecords.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => removeApplicantVisa(index)}
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
                              name={`applicant_visa_records.${index}.fullname`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Name"
                                  fullWidth
                                  required
                                  placeholder="Enter name"
                                  error={
                                    !!errors.applicant_visa_records?.[index]
                                      ?.fullname
                                  }
                                  helperText={
                                    errors.applicant_visa_records?.[index]
                                      ?.fullname?.message
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
                              name={`applicant_visa_records.${index}.type`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <FormControl
                                  fullWidth
                                  error={
                                    !!errors.applicant_visa_records?.[index]
                                      ?.type
                                  }
                                >
                                  <TextField
                                    {...field}
                                    select
                                    label="Type of Visa"
                                    fullWidth
                                    required
                                    disabled={immigrationTypeLoading}
                                    error={
                                      !!errors.applicant_visa_records?.[index]
                                        ?.type
                                    }
                                    onChange={(e) => {
                                      const selectedType =
                                        immigrationType?.find(
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
                                          type.name
                                            .split(/[-–\s]/)[0]
                                            .trim() === field.value,
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
                                  {errors.applicant_visa_records?.[index]
                                    ?.type && (
                                    <FormHelperText>
                                      {
                                        errors.applicant_visa_records?.[index]
                                          ?.type?.message
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
                              name={`applicant_visa_records.${index}.expedition_date`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Issued Date"
                                  type="date"
                                  fullWidth
                                  required
                                  InputLabelProps={{ shrink: true }}
                                  error={
                                    !!errors.applicant_visa_records?.[index]
                                      ?.expedition_date
                                  }
                                  helperText={
                                    errors.applicant_visa_records?.[index]
                                      ?.expedition_date?.message
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
                              name={`applicant_visa_records.${index}.expiration_date`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Expiry Date"
                                  type="date"
                                  fullWidth
                                  required
                                  InputLabelProps={{ shrink: true }}
                                  error={
                                    !!errors.applicant_visa_records?.[index]
                                      ?.expiration_date
                                  }
                                  helperText={
                                    errors.applicant_visa_records?.[index]
                                      ?.expiration_date?.message
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
                        appendApplicantVisa({
                          fullname: "",
                          type: "",
                          expedition_date: "",
                          expiration_date: "",
                        })
                      }
                      sx={{ mt: 1 }}
                    >
                      Add Another Visa Record
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Dependent Visa Records Section */}
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ mb: 2, fontWeight: 500 }}>
                  Dependents
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Controller
                    name="visa_records_dependents"
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
                </Stack>

                {/* Dependent Visa Records & Information Form */}
                {visaRecordsDependents === "yes" && (
                  <Box sx={{ mt: 3 }}>
                    {/* Dependent Information */}
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      Dependent Information
                    </Typography>

                    {dependentInformations.map((item, depIndex) => (
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
                            {depIndex === 0
                              ? "Dependent"
                              : `Dependent ${depIndex + 1}`}
                          </Typography>
                          {dependentInformations.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => removeDependentInfo(depIndex)}
                              size="small"
                            >
                              <Icon icon="mdi:delete" width={20} />
                            </IconButton>
                          )}
                        </Stack>

                        <Grid container spacing={3}>
                          {/* First Name */}
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                              name={`dependents.${depIndex}.first_name`}
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
                                    !!errors.dependents?.[depIndex]?.first_name
                                  }
                                  helperText={
                                    errors.dependents?.[depIndex]?.first_name
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

                          {/* Middle Name */}
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                              name={`dependents.${depIndex}.middle_name`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Middle Name"
                                  fullWidth
                                  placeholder="Enter middle name"
                                  error={
                                    !!errors.dependents?.[depIndex]?.middle_name
                                  }
                                  helperText={
                                    errors.dependents?.[depIndex]?.middle_name
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

                          {/* Last Name */}
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                              name={`dependents.${depIndex}.last_name`}
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
                                    !!errors.dependents?.[depIndex]?.last_name
                                  }
                                  helperText={
                                    errors.dependents?.[depIndex]?.last_name
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

                          {/* DOB */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                              name={`dependents.${depIndex}.dob`}
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
                                  error={!!errors.dependents?.[depIndex]?.dob}
                                  helperText={
                                    errors.dependents?.[depIndex]?.dob?.message
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

                          {/* Relation */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                              name={`dependents.${depIndex}.relation`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  select
                                  label="Relation"
                                  fullWidth
                                  required
                                  InputLabelProps={{ shrink: true }}
                                  error={
                                    !!errors.dependents?.[depIndex]?.relation
                                  }
                                  helperText={
                                    errors.dependents?.[depIndex]?.relation
                                      ?.message
                                  }
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      backgroundColor: "#fff",
                                    },
                                  }}
                                >
                                  <MenuItem value="">
                                    <em>Select Relation</em>
                                  </MenuItem>
                                  {relationOptions.map((option) => (
                                    <MenuItem
                                      key={option}
                                      value={option.toLowerCase()}
                                    >
                                      {option}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              )}
                            />
                          </Grid>

                          {/* Country of Birth */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                              name={`dependents.${depIndex}.country_of_birth`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <FormControl fullWidth>
                                  <Typography
                                    sx={{
                                      mb: 1,
                                      fontWeight: 500,
                                      fontSize: "0.875rem",
                                      color: "text.primary",
                                    }}
                                  >
                                    Country of Birth (Optional)
                                  </Typography>
                                  <Select
                                    {...field}
                                    displayEmpty
                                    sx={{ backgroundColor: "#fff" }}
                                  >
                                    <MenuItem value="">
                                      <em>Select Country of Birth</em>
                                    </MenuItem>
                                    {country?.map((option) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.id}
                                      >
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          {/* Country of Citizenship */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                              name={`dependents.${depIndex}.country_of_citizenship`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <FormControl fullWidth>
                                  <Typography
                                    sx={{
                                      mb: 1,
                                      fontWeight: 500,
                                      fontSize: "0.875rem",
                                      color: "text.primary",
                                    }}
                                  >
                                    Country of Citizenship (Optional)
                                  </Typography>
                                  <Select
                                    {...field}
                                    displayEmpty
                                    sx={{ backgroundColor: "#fff" }}
                                  >
                                    <MenuItem value="">
                                      <em>Select Country of Citizenship</em>
                                    </MenuItem>
                                    {country?.map((option) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.id}
                                      >
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          {/* Education Level */}
                          <Grid size={{ xs: 12 }}>
                            <Controller
                              name={`dependents.${depIndex}.highest_level_of_education`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <FormControl fullWidth>
                                  <Typography
                                    sx={{
                                      mb: 1,
                                      fontWeight: 500,
                                      fontSize: "0.875rem",
                                      color: "text.primary",
                                    }}
                                  >
                                    Highest Level of Education (Optional)
                                  </Typography>
                                  <RadioGroup {...field} row>
                                    {educationOptions.map((option) => (
                                      <FormControlLabel
                                        key={option.value}
                                        value={option.value}
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
                                        label={option.label}
                                        sx={{
                                          "& .MuiFormControlLabel-label": {
                                            color: "text.primary", // change this to any color
                                            fontWeight: 500, // optional
                                          },
                                        }}
                                      />
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          {/* Conditional Education Form Fields */}
                          {watch(
                            `dependents.${depIndex}.highest_level_of_education`,
                          ) &&
                            watch(
                              `dependents.${depIndex}.highest_level_of_education`,
                            ) !== "none" && (
                              <>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <Typography sx={{ mb: 1 }}>
                                    Name of Institute
                                  </Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.instituteName`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        fullWidth
                                        placeholder="Enter institute name"
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.instituteName
                                        }
                                        helperText={
                                          errors.dependents?.[depIndex]
                                            ?.instituteName?.message
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

                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <Typography sx={{ mb: 1 }}>
                                    Year of Graduation
                                  </Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.graduationYear`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        type="number"
                                        fullWidth
                                        placeholder="YYYY"
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.graduationYear
                                        }
                                        helperText={
                                          errors.dependents?.[depIndex]
                                            ?.graduationYear?.message
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

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                  <Typography sx={{ mb: 1 }}>
                                    Country
                                  </Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.edu_country`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <FormControl
                                        fullWidth
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.edu_country
                                        }
                                      >
                                        <Select
                                          {...field}
                                          displayEmpty
                                          sx={{ backgroundColor: "#fff" }}
                                        >
                                          <MenuItem value="">
                                            <em>Select Country</em>
                                          </MenuItem>
                                          {country?.map((option) => (
                                            <MenuItem
                                              key={option.id}
                                              value={option.id}
                                            >
                                              {option.label}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                        {errors.dependents?.[depIndex]
                                          ?.edu_country && (
                                          <FormHelperText>
                                            {
                                              errors.dependents[depIndex]
                                                .edu_country.message
                                            }
                                          </FormHelperText>
                                        )}
                                      </FormControl>
                                    )}
                                  />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                  <Typography sx={{ mb: 1 }}>State</Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.edu_state`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        fullWidth
                                        placeholder="Enter state"
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.edu_state
                                        }
                                        helperText={
                                          errors.dependents?.[depIndex]
                                            ?.edu_state?.message
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

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                  <Typography sx={{ mb: 1 }}>City</Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.edu_city`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        fullWidth
                                        placeholder="Enter city"
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.edu_city
                                        }
                                        helperText={
                                          errors.dependents?.[depIndex]
                                            ?.edu_city?.message
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

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                  <Typography sx={{ mb: 1 }}>
                                    Zip Code
                                  </Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.edu_zipCode`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        fullWidth
                                        placeholder="Enter zip code"
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.edu_zipCode
                                        }
                                        helperText={
                                          errors.dependents?.[depIndex]
                                            ?.edu_zipCode?.message
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

                                <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                                  <Typography sx={{ mb: 1 }}>
                                    Address
                                  </Typography>
                                  <Controller
                                    name={`dependents.${depIndex}.edu_address`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        // rows={2}
                                        placeholder="Enter full address"
                                        error={
                                          !!errors.dependents?.[depIndex]
                                            ?.edu_address
                                        }
                                        helperText={
                                          errors.dependents?.[depIndex]
                                            ?.edu_address?.message
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
                              </>
                            )}
                        </Grid>
                      </Box>
                    ))}

                    <Button
                      variant="outlined"
                      startIcon={<Icon icon="mdi:plus" />}
                      onClick={() =>
                        appendDependentInfo({
                          first_name: "",
                          middle_name: "",
                          last_name: "",
                          dob: "",
                          relation: "",
                          country_of_birth: "",
                          country_of_citizenship: "",
                          highest_level_of_education: "",
                        })
                      }
                      sx={{ mt: 1, mb: 3 }}
                    >
                      Add Another Dependent
                    </Button>

                    {/* Dependent Visa Records */}
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      Dependent Visa Records
                    </Typography>

                    {dependentVisaRecords.map((item, index) => (
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
                              ? "Dependent Visa Record"
                              : `Dependent Visa Record ${index + 1}`}
                          </Typography>
                          {dependentVisaRecords.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => removeDependentVisa(index)}
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
                              name={`dependent_visa_records.${index}.fullname`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Name"
                                  fullWidth
                                  required
                                  placeholder="Enter name"
                                  error={
                                    !!errors.dependent_visa_records?.[index]
                                      ?.fullname
                                  }
                                  helperText={
                                    errors.dependent_visa_records?.[index]
                                      ?.fullname?.message
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
                              name={`dependent_visa_records.${index}.type`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <FormControl
                                  fullWidth
                                  error={
                                    !!errors.dependent_visa_records?.[index]
                                      ?.type
                                  }
                                >
                                  <TextField
                                    {...field}
                                    select
                                    label="Type of Visa"
                                    fullWidth
                                    required
                                    disabled={immigrationTypeLoading}
                                    error={
                                      !!errors.dependent_visa_records?.[index]
                                        ?.type
                                    }
                                    onChange={(e) => {
                                      const selectedType =
                                        immigrationType?.find(
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
                                          type.name
                                            .split(/[-–\s]/)[0]
                                            .trim() === field.value,
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
                                  {errors.dependent_visa_records?.[index]
                                    ?.type && (
                                    <FormHelperText>
                                      {
                                        errors.dependent_visa_records?.[index]
                                          ?.type?.message
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
                              name={`dependent_visa_records.${index}.expedition_date`}
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
                                    !!errors.dependent_visa_records?.[index]
                                      ?.expedition_date
                                  }
                                  helperText={
                                    errors.dependent_visa_records?.[index]
                                      ?.expedition_date?.message
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
                              name={`dependent_visa_records.${index}.expiration_date`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Expiry Date"
                                  type="date"
                                  fullWidth
                                  required
                                  InputLabelProps={{ shrink: true }}
                                  error={
                                    !!errors.dependent_visa_records?.[index]
                                      ?.expiration_date
                                  }
                                  helperText={
                                    errors.dependent_visa_records?.[index]
                                      ?.expiration_date?.message
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
                        appendDependentVisa({
                          fullname: "",
                          type: "",
                          expedition_date: "",
                          expiration_date: "",
                        })
                      }
                      sx={{ mt: 1 }}
                    >
                      Add Another Visa Record
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

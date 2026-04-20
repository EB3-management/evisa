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
  InputLabel,
} from "@mui/material";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";
import Grid from "@mui/material/Grid2";
import { Icon } from "@iconify/react";
import { useGetImmigrationTypes } from "src/api/onboardingform";
import { useGetCountryCode } from "src/api";
import { useGetVacancyDetail } from "src/api/vacancy";

// ------------------ Validation Schema ------------------
export const processingInformationSchema = z
  .object({
    adjustment_of_status: z.boolean().default(true),
    date_of_last_entry: z.string().optional(),
    i944_number: z.string().optional(),
    embassy_name: z.string().optional(),
    embassy_location: z.string().optional(),
    embassy_country_id: z.union([z.string(), z.number()]).optional(),
    visa_records_applicant: z.enum(["yes", "no"]).optional().default("no"),
    visa_records_dependents: z.enum(["yes", "no"]).optional().default("no"),
    visa_records: z
      .array(
        z.object({
          visa_first_name: z.string().min(1, "First name is required"),
          visa_middle_name: z.string().optional().default(""),
          visa_last_name: z.string().optional().default(""),
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
          education: z.string().optional().default(""),
          academic_records: z
            .object({
              program_name: z.string().default(""),
              institution_name: z.string().default(""),
              graduation_year: z.string().default(""),
              grade: z.string().default(""),
              country: z.union([z.string(), z.number()]).optional(),
              state: z.string().default(""),
              city: z.string().default(""),
              zip_code: z.string().default(""),
              address: z.string().default(""),
            })
            .optional(),
          visa_records: z
            .array(
              z.object({
                type: z
                  .union([z.string(), z.number()])
                  .refine(
                    (val) => val !== "" && val !== null && val !== undefined,
                    {
                      message: "Visa type is required",
                    },
                  ),
                expedition_date: z.string().min(1, "Issued date is required"),
                expiration_date: z.string().min(1, "Expiry date is required"),
              }),
            )
            .optional()
            .default([]),
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
        if (!data.visa_records || data.visa_records.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please add at least one visa record for applicant",
            path: ["visa_records"],
          });
        }
      }

      // Validate dependent visa records when dependent says yes
      if (data.visa_records_dependents === "yes") {
        if (!data.dependents || data.dependents.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please add dependent information",
            path: ["dependents"],
          });
        } else {
          // Validate that each dependent has at least one visa record
          data.dependents.forEach((dependent, index) => {
            if (
              !dependent.visa_records ||
              dependent.visa_records.length === 0
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  "Please add at least one visa record for this dependent",
                path: ["dependents", index, "visa_records"],
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

      // Validate applicant visa records when applicant says yes
      if (data.visa_records_applicant === "yes") {
        if (!data.visa_records || data.visa_records.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please add at least one visa record for applicant",
            path: ["visa_records"],
          });
        }
      }

      // Validate dependent visa records when dependent says yes
      if (data.visa_records_dependents === "yes") {
        if (!data.dependents || data.dependents.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please add dependent information",
            path: ["dependents"],
          });
        } else {
          // Validate that each dependent has at least one visa record
          data.dependents.forEach((dependent, index) => {
            if (
              !dependent.visa_records ||
              dependent.visa_records.length === 0
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  "Please add at least one visa record for this dependent",
                path: ["dependents", index, "visa_records"],
              });
            }
          });
        }
      }
    }

    // Validate academic records for dependents when education is selected
    if (data.dependents && data.dependents.length > 0) {
      data.dependents.forEach((dependent, index) => {
        // Only validate if education is selected and not "none"
        if (
          dependent.education &&
          dependent.education !== "none" &&
          dependent.education !== ""
        ) {
          const academicRecords = dependent.academic_records;

          // Required fields when education is selected
          const requiredFields = [
            { field: "program_name", label: "Program name" },
            { field: "institution_name", label: "Institution name" },
            { field: "graduation_year", label: "Graduation year" },
            { field: "country", label: "Country" },
            { field: "state", label: "State" },
            { field: "city", label: "City" },
            { field: "address", label: "Address" },
          ];

          requiredFields.forEach(({ field, label }) => {
            if (
              !academicRecords?.[field] ||
              academicRecords[field].toString().trim() === ""
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `${label} is required`,
                path: ["dependents", index, "academic_records", field],
              });
            }
          });

          // Validate graduation year format
          if (academicRecords?.graduation_year) {
            if (!/^\d{4}$/.test(academicRecords.graduation_year)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Must be a valid 4-digit year",
                path: [
                  "dependents",
                  index,
                  "academic_records",
                  "graduation_year",
                ],
              });
            }
          }
        }
      });
    }
  });

// Helper component for rendering visa records
const VisaRecordsSection = ({
  control,
  errors,
  visaRecords,
  fieldPrefix,
  onAppend,
  onRemove,
  immigrationType,
  immigrationTypeLoading,
  includeFullname = true,
}) => (
  <Box>
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
          <Typography variant="subtitle1" fontWeight={600} color="primary">
            {index === 0 ? "Visa Record" : `Visa Record ${index + 1}`}
          </Typography>
          {visaRecords.length > 1 && (
            <IconButton
              color="error"
              onClick={() => onRemove(index)}
              size="small"
            >
              <Icon icon="mdi:delete" width={20} />
            </IconButton>
          )}
        </Stack>

        <Grid container spacing={3}>
          {includeFullname && (
            <>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name={`${fieldPrefix}.${index}.visa_first_name`}
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
                        !!errors?.[fieldPrefix]?.[index]?.visa_first_name
                          ?.message
                      }
                      helperText={
                        errors?.[fieldPrefix]?.[index]?.visa_first_name?.message
                      }
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name={`${fieldPrefix}.${index}.visa_middle_name`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Middle Name"
                      fullWidth
                      placeholder="Enter middle name"
                      error={
                        !!errors?.[fieldPrefix]?.[index]?.visa_middle_name
                          ?.message
                      }
                      helperText={
                        errors?.[fieldPrefix]?.[index]?.visa_middle_name
                          ?.message
                      }
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name={`${fieldPrefix}.${index}.visa_last_name`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      fullWidth
                      placeholder="Enter last name"
                      error={
                        !!errors?.[fieldPrefix]?.[index]?.visa_last_name
                          ?.message
                      }
                      helperText={
                        errors?.[fieldPrefix]?.[index]?.visa_last_name?.message
                      }
                    />
                  )}
                />
              </Grid>
            </>
          )}

          <Grid size={{ xs: 12, sm: includeFullname ? 12 : 12 }}>
            <FormControl
              fullWidth
              error={!!errors?.[fieldPrefix]?.[index]?.type?.message}
            >
              <InputLabel id={`${fieldPrefix}-${index}-type-label`}>
                Visa Type *
              </InputLabel>
              <Controller
                name={`${fieldPrefix}.${index}.type`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId={`${fieldPrefix}-${index}-type-label`}
                    label="Visa Type *"
                    disabled={immigrationTypeLoading}
                  >
                    <MenuItem value="" disabled>
                      Select visa type
                    </MenuItem>
                    {immigrationType?.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors?.[fieldPrefix]?.[index]?.type && (
                <FormHelperText>
                  {errors?.[fieldPrefix]?.[index]?.type?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name={`${fieldPrefix}.${index}.expedition_date`}
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
                    !!errors?.[fieldPrefix]?.[index]?.expedition_date?.message
                  }
                  helperText={
                    errors?.[fieldPrefix]?.[index]?.expedition_date?.message
                  }
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name={`${fieldPrefix}.${index}.expiration_date`}
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
                    !!errors?.[fieldPrefix]?.[index]?.expiration_date?.message
                  }
                  helperText={
                    errors?.[fieldPrefix]?.[index]?.expiration_date?.message
                  }
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
      onClick={() => {
        const newRecord = includeFullname
          ? {
              first_name: "",
              middle_name: "",
              last_name: "",
              type: "",
              expedition_date: "",
              expiration_date: "",
            }
          : {
              type: "",
              expedition_date: "",
              expiration_date: "",
            };
        onAppend(newRecord);
      }}
      sx={{ mb: 2 }}
    >
      Add Another Visa Record
    </Button>
  </Box>
);

// Helper component for dependent visa records
const DependentVisaRecordsField = ({
  control,
  errors,
  dependentIndex,
  immigrationType,
  immigrationTypeLoading,
}) => {
  const {
    fields: dependentVisaRecords,
    append: appendDependentVisa,
    remove: removeDependentVisa,
  } = useFieldArray({
    control,
    name: `dependents.${dependentIndex}.visa_records`,
  });

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="subtitle2"
        sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
      >
        Visa Records for this Dependent
      </Typography>

      {dependentVisaRecords.map((item, index) => (
        <Box
          key={item.id}
          sx={{
            mb: 2,
            p: 2,
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="body2" fontWeight={600} color="primary">
              Visa Record {index + 1}
            </Typography>
            {dependentVisaRecords.length > 1 && (
              <IconButton
                color="error"
                onClick={() => removeDependentVisa(index)}
                size="small"
              >
                <Icon icon="mdi:delete" width={18} />
              </IconButton>
            )}
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                error={
                  !!errors?.dependents?.[dependentIndex]?.visa_records?.[index]
                    ?.type?.message
                }
              >
                <InputLabel
                  id={`dependent-${dependentIndex}-visa-${index}-type-label`}
                  size="small"
                >
                  Visa Type *
                </InputLabel>
                <Controller
                  name={`dependents.${dependentIndex}.visa_records.${index}.type`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId={`dependent-${dependentIndex}-visa-${index}-type-label`}
                      label="Visa Type *"
                      disabled={immigrationTypeLoading}
                      size="small"
                    >
                      <MenuItem value="" disabled>
                        Select visa type
                      </MenuItem>
                      {immigrationType?.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors?.dependents?.[dependentIndex]?.visa_records?.[index]
                  ?.type && (
                  <FormHelperText>
                    {
                      errors?.dependents?.[dependentIndex]?.visa_records?.[
                        index
                      ]?.type?.message
                    }
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name={`dependents.${dependentIndex}.visa_records.${index}.expedition_date`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Issued Date"
                    type="date"
                    fullWidth
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    error={
                      !!errors?.dependents?.[dependentIndex]?.visa_records?.[
                        index
                      ]?.expedition_date?.message
                    }
                    helperText={
                      errors?.dependents?.[dependentIndex]?.visa_records?.[
                        index
                      ]?.expedition_date?.message
                    }
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name={`dependents.${dependentIndex}.visa_records.${index}.expiration_date`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expiry Date"
                    type="date"
                    fullWidth
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    error={
                      !!errors?.dependents?.[dependentIndex]?.visa_records?.[
                        index
                      ]?.expiration_date?.message
                    }
                    helperText={
                      errors?.dependents?.[dependentIndex]?.visa_records?.[
                        index
                      ]?.expiration_date?.message
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<Icon icon="mdi:plus" />}
        onClick={() => {
          appendDependentVisa({
            type: "",
            expedition_date: "",
            expiration_date: "",
          });
        }}
        sx={{
          color: "primary.main",
          borderColor: "primary.main",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        Add Visa Record
      </Button>
    </Box>
  );
};

// ------------------ Main Component ------------------
function ProcessingInformation({ vacancyData, vacancyId }) {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useFormContext();

  const adjustmentOfStatus = watch("adjustment_of_status");
  const visaRecordsApplicant = watch("visa_records_applicant");
  const visaRecordsDependents = watch("visa_records_dependents");
  const { vacancyDetail } = useGetVacancyDetail(vacancyId);
  const { immigrationType, immigrationTypeLoading } = useGetImmigrationTypes(
    vacancyData?.id,
  );
  const { country: countryCode, countryLoading: countryCodeLoading } =
    useGetCountryCode();
  console.log("this is vacancy id", vacancyId);
  // Field arrays for applicant visa records
  const {
    fields: applicantVisaRecords,
    append: appendApplicantVisa,
    remove: removeApplicantVisa,
  } = useFieldArray({
    control,
    name: "visa_records",
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

  // Auto-add first visa record for applicant only when user manually selects "yes"
  useEffect(() => {
    console.log("🔍 Applicant visa useEffect triggered", {
      visaRecordsApplicant,
      applicantVisaRecordsLength: applicantVisaRecords.length,
    });

    if (visaRecordsApplicant === "yes") {
      // Use getValues to check actual form state
      const currentFormRecords = getValues("visa_records") || [];
      console.log("📋 Current form visa_records:", currentFormRecords);

      if (
        currentFormRecords.length === 0 &&
        applicantVisaRecords.length === 0
      ) {
        console.log("➕ Adding empty applicant visa record");
        appendApplicantVisa({
          visa_first_name: "",
          visa_middle_name: "",
          visa_last_name: "",
          type: "",
          expedition_date: "",
          expiration_date: "",
        });
      }
    } else if (
      visaRecordsApplicant === "no" &&
      applicantVisaRecords.length > 0
    ) {
      console.log("🗑️ Clearing applicant visa records");
      setValue("visa_records", []);
    }
  }, [
    visaRecordsApplicant,
    applicantVisaRecords.length,
    getValues,
    appendApplicantVisa,
    setValue,
  ]);

  // Auto-add first dependent when dependent visa records = yes
  useEffect(() => {
    console.log("🔍 Dependent visa useEffect triggered", {
      visaRecordsDependents,
      dependentInformationsLength: dependentInformations.length,
    });

    if (visaRecordsDependents === "yes") {
      // Use getValues to check actual form state
      const currentFormDependents = getValues("dependents") || [];
      console.log("📋 Current form dependents:", currentFormDependents);

      if (
        currentFormDependents.length === 0 &&
        dependentInformations.length === 0
      ) {
        console.log("➕ Adding empty dependent");
        appendDependentInfo({
          first_name: "",
          middle_name: "",
          last_name: "",
          dob: "",
          relation: "",
          country_of_birth: "",
          country_of_citizenship: "",
          education: "",
          academic_records: {
            program_name: "",
            institution_name: "",
            graduation_year: "",
            grade: "",
            country: "",
            state: "",
            city: "",
            zip_code: "",
            address: "",
          },
          visa_records: [
            {
              type: "",
              expedition_date: "",
              expiration_date: "",
            },
          ],
        });
      }
    } else if (
      visaRecordsDependents === "no" &&
      dependentInformations.length > 0
    ) {
      console.log("🗑️ Clearing dependents");
      setValue("dependents", []);
    }
  }, [
    visaRecordsDependents,
    dependentInformations.length,
    getValues,
    appendDependentInfo,
    setValue,
  ]);

  return (
    <Box>
      {/* Adjustment of Status Question */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Adjustment of Status
        </Typography>
        <FormControl component="fieldset" error={!!errors.adjustment_of_status}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {/* Are you currently in the United States? */}
            Are you currently in{" "}
            {vacancyDetail?.visa_category?.country?.name ||
              "the United States of America"}{" "}
            ?
          </Typography>
          <Controller
            name="adjustment_of_status"
            control={control}
            defaultValue
            render={({ field }) => (
              <RadioGroup
                {...field}
                row
                value={field.value ? "true" : "false"}
                onChange={(e) => field.onChange(e.target.value === "true")}
              >
                <FormControlLabel
                  value="true"
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
                  value="false"
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
          {errors.adjustment_of_status && (
            <FormHelperText>
              {errors.adjustment_of_status.message}
            </FormHelperText>
          )}
        </FormControl>
      </Box>

      {/* Conditional Fields Based on Adjustment of Status */}
      {adjustmentOfStatus === true && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Adjustment of Status Information
          </Typography>

          <Grid container spacing={3}>
            {/* Date of Last Entry */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ mb: 1, color: "#fff" }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ mb: 1, color: "#fff" }}>
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
          </Grid>
        </Box>
      )}

      {adjustmentOfStatus === false && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Consular Processing Information
          </Typography>

          {/* Embassy Country */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1, color: "#fff" }}>
              Embassy Country
            </Typography>
            <FormControl fullWidth error={!!errors.embassy_country_id}>
              <Controller
                name="embassy_country_id"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    disabled={countryCodeLoading}
                    sx={{ backgroundColor: "#fff" }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: "#fff",
                          "& .MuiMenuItem-root": { color: "#000" },
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select country
                    </MenuItem>
                    {countryCode?.map((country) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.embassy_country_id && (
                <FormHelperText>
                  {errors.embassy_country_id?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Box>

          <Grid container spacing={3}>
            {/* Embassy Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ mb: 1, color: "#fff" }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ mb: 1, color: "#fff" }}>
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
          </Grid>
        </Box>
      )}

      {/* Visa Records Section - Shared for both paths */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Visa Records
        </Typography>

        {/* Applicant Visa Records Question */}
        <Box sx={{ mb: 3 }}>
          <FormControl
            component="fieldset"
            error={!!errors.visa_records_applicant}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              Do you have any visa records?
            </Typography>
            <Controller
              name="visa_records_applicant"
              control={control}
              defaultValue="no"
              render={({ field }) => (
                <RadioGroup {...field} row>
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
            {errors.visa_records_applicant && (
              <FormHelperText>
                {errors.visa_records_applicant.message}
              </FormHelperText>
            )}
          </FormControl>
        </Box>

        {/* Applicant Visa Records Form */}
        {visaRecordsApplicant === "yes" && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Applicant Visa Records
            </Typography>

            <VisaRecordsSection
              control={control}
              errors={errors}
              visaRecords={applicantVisaRecords}
              fieldPrefix="visa_records"
              onAppend={appendApplicantVisa}
              onRemove={removeApplicantVisa}
              immigrationType={immigrationType}
              immigrationTypeLoading={immigrationTypeLoading}
              includeFullname
            />
          </Box>
        )}

        {/* Dependent Visa Records Question */}
        <Box sx={{ mb: 3 }}>
          <FormControl
            component="fieldset"
            error={!!errors.visa_records_dependents}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              Do your dependents have any visa records?
            </Typography>
            <Controller
              name="visa_records_dependents"
              control={control}
              defaultValue="no"
              render={({ field }) => (
                <RadioGroup {...field} row>
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
            {errors.visa_records_dependents && (
              <FormHelperText>
                {errors.visa_records_dependents.message}
              </FormHelperText>
            )}
          </FormControl>
        </Box>

        {/* Dependent Information and Visa Records */}
        {visaRecordsDependents === "yes" && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Dependent Information
            </Typography>

            {dependentInformations.map((item, depIndex) => (
              <Box
                key={item.id}
                sx={{
                  mb: 3,
                  p: 3,
                  border: "2px solid #e0e0e0",
                  borderRadius: 2,
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" fontWeight={600} color="primary">
                    {depIndex === 0 ? "Dependent" : `Dependent ${depIndex + 1}`}
                  </Typography>
                  {dependentInformations.length > 1 && (
                    <IconButton
                      color="error"
                      onClick={() => removeDependentInfo(depIndex)}
                    >
                      <Icon icon="mdi:delete" width={24} />
                    </IconButton>
                  )}
                </Stack>

                <Grid container spacing={3}>
                  {/* First Name */}
                  <Grid size={{ xs: 12, sm: 4 }}>
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
                            !!errors?.dependents?.[depIndex]?.first_name
                              ?.message
                          }
                          helperText={
                            errors?.dependents?.[depIndex]?.first_name?.message
                          }
                        />
                      )}
                    />
                  </Grid>

                  {/* Middle Name */}
                  <Grid size={{ xs: 12, sm: 4 }}>
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
                            !!errors?.dependents?.[depIndex]?.middle_name
                              ?.message
                          }
                          helperText={
                            errors?.dependents?.[depIndex]?.middle_name?.message
                          }
                        />
                      )}
                    />
                  </Grid>

                  {/* Last Name */}
                  <Grid size={{ xs: 12, sm: 4 }}>
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
                            !!errors?.dependents?.[depIndex]?.last_name?.message
                          }
                          helperText={
                            errors?.dependents?.[depIndex]?.last_name?.message
                          }
                        />
                      )}
                    />
                  </Grid>

                  {/* Date of Birth */}
                  <Grid size={{ xs: 12, sm: 6 }}>
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
                          error={!!errors?.dependents?.[depIndex]?.dob?.message}
                          helperText={
                            errors?.dependents?.[depIndex]?.dob?.message
                          }
                        />
                      )}
                    />
                  </Grid>

                  {/* Relation */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl
                      fullWidth
                      error={
                        !!errors?.dependents?.[depIndex]?.relation?.message
                      }
                    >
                      <InputLabel id={`dependent-${depIndex}-relation-label`}>
                        Relation *
                      </InputLabel>
                      <Controller
                        name={`dependents.${depIndex}.relation`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId={`dependent-${depIndex}-relation-label`}
                            label="Relation *"
                          >
                            <MenuItem value="" disabled>
                              Select relation
                            </MenuItem>
                            <MenuItem value="Spouse">Spouse</MenuItem>
                            <MenuItem value="Child">Child</MenuItem>
                            <MenuItem value="Parent">Parent</MenuItem>
                            <MenuItem value="Sibling">Sibling</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        )}
                      />
                      {errors?.dependents?.[depIndex]?.relation && (
                        <FormHelperText>
                          {errors?.dependents?.[depIndex]?.relation?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Country of Birth */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl
                      fullWidth
                      error={
                        !!errors?.dependents?.[depIndex]?.country_of_birth
                          ?.message
                      }
                    >
                      <InputLabel
                        id={`dependent-${depIndex}-country-birth-label`}
                        sx={{
                          color: "text.primary",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                        }}
                      >
                        Country of Birth
                      </InputLabel>
                      <Controller
                        name={`dependents.${depIndex}.country_of_birth`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId={`dependent-${depIndex}-country-birth-label`}
                            label="Country of Birth"
                            disabled={countryCodeLoading}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  backgroundColor: "#fff",
                                  "& .MuiMenuItem-root": {
                                    color: "#000",
                                  },
                                },
                              },
                            }}
                          >
                            <MenuItem value="" disabled>
                              Select country of birth
                            </MenuItem>
                            {countryCode?.map((country) => (
                              <MenuItem key={country.id} value={country.id}>
                                {country.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors?.dependents?.[depIndex]?.country_of_birth && (
                        <FormHelperText>
                          {
                            errors?.dependents?.[depIndex]?.country_of_birth
                              ?.message
                          }
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Country of Citizenship */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl
                      fullWidth
                      error={
                        !!errors?.dependents?.[depIndex]?.country_of_citizenship
                          ?.message
                      }
                    >
                      <InputLabel
                        id={`dependent-${depIndex}-country-citizenship-label`}
                        sx={{
                          color: "text.primary",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                        }}
                      >
                        Country of Citizenship
                      </InputLabel>
                      <Controller
                        name={`dependents.${depIndex}.country_of_citizenship`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId={`dependent-${depIndex}-country-citizenship-label`}
                            label="Country of Citizenship"
                            disabled={countryCodeLoading}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  backgroundColor: "#fff",
                                  "& .MuiMenuItem-root": {
                                    color: "#000",
                                  },
                                },
                              },
                            }}
                          >
                            <MenuItem value="" disabled>
                              Select country of citizenship
                            </MenuItem>
                            {countryCode?.map((country) => (
                              <MenuItem key={country.id} value={country.id}>
                                {country.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors?.dependents?.[depIndex]
                        ?.country_of_citizenship && (
                        <FormHelperText>
                          {
                            errors?.dependents?.[depIndex]
                              ?.country_of_citizenship?.message
                          }
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Highest Level of Education */}
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name={`dependents.${depIndex}.education`}
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
                            <FormControlLabel
                              value="high_school"
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
                              label="High School"
                              sx={{
                                "& .MuiFormControlLabel-label": {
                                  color: "text.primary",
                                  fontWeight: 500,
                                },
                              }}
                            />
                            <FormControlLabel
                              value="bachelors"
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
                              label="Bachelor's Degree"
                              sx={{
                                "& .MuiFormControlLabel-label": {
                                  color: "text.primary",
                                  fontWeight: 500,
                                },
                              }}
                            />
                            <FormControlLabel
                              value="masters"
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
                              label="Master's Degree"
                              sx={{
                                "& .MuiFormControlLabel-label": {
                                  color: "text.primary",
                                  fontWeight: 500,
                                },
                              }}
                            />
                            <FormControlLabel
                              value="phd"
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
                              label="PhD"
                              sx={{
                                "& .MuiFormControlLabel-label": {
                                  color: "text.primary",
                                  fontWeight: 500,
                                },
                              }}
                            />
                            <FormControlLabel
                              value="none"
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
                              label="None"
                              sx={{
                                "& .MuiFormControlLabel-label": {
                                  color: "text.primary",
                                  fontWeight: 500,
                                },
                              }}
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Academic Records Section - Show when education is selected */}
                  {watch(`dependents.${depIndex}.education`) &&
                    watch(`dependents.${depIndex}.education`) !== "none" &&
                    watch(`dependents.${depIndex}.education`) !== "" && (
                      <Grid size={{ xs: 12 }}>
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: "#f5f5f5",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 2,
                              fontWeight: 600,
                              color: "text.primary",
                            }}
                          >
                            Academic Record Details
                          </Typography>

                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                name={`dependents.${depIndex}.academic_records.program_name`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Program Name"
                                    fullWidth
                                    size="small"
                                    placeholder="e.g., Computer Science"
                                    error={
                                      !!errors?.dependents?.[depIndex]
                                        ?.academic_records?.program_name
                                    }
                                    helperText={
                                      errors?.dependents?.[depIndex]
                                        ?.academic_records?.program_name
                                        ?.message
                                    }
                                  />
                                )}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                name={`dependents.${depIndex}.academic_records.institution_name`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Institution Name"
                                    fullWidth
                                    size="small"
                                    placeholder="Enter institution name"
                                    error={
                                      !!errors?.dependents?.[depIndex]
                                        ?.academic_records?.institution_name
                                    }
                                    helperText={
                                      errors?.dependents?.[depIndex]
                                        ?.academic_records?.institution_name
                                        ?.message
                                    }
                                  />
                                )}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                name={`dependents.${depIndex}.academic_records.graduation_year`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Graduation Year"
                                    fullWidth
                                    size="small"
                                    placeholder="YYYY"
                                    error={
                                      !!errors?.dependents?.[depIndex]
                                        ?.academic_records?.graduation_year
                                    }
                                    helperText={
                                      errors?.dependents?.[depIndex]
                                        ?.academic_records?.graduation_year
                                        ?.message
                                    }
                                  />
                                )}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                name={`dependents.${depIndex}.academic_records.grade`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Grade"
                                    fullWidth
                                    size="small"
                                    placeholder="e.g., pass, A, B+"
                                  />
                                )}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormControl
                                fullWidth
                                size="small"
                                error={
                                  !!errors?.dependents?.[depIndex]
                                    ?.academic_records?.country
                                }
                              >
                                <InputLabel>Country</InputLabel>
                                <Controller
                                  name={`dependents.${depIndex}.academic_records.country`}
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      label="Country"
                                      disabled={countryCodeLoading}
                                      MenuProps={{
                                        PaperProps: {
                                          sx: {
                                            backgroundColor: "#fff",
                                            "& .MuiMenuItem-root": {
                                              color: "#000",
                                            },
                                          },
                                        },
                                      }}
                                    >
                                      <MenuItem value="">
                                        Select country
                                      </MenuItem>
                                      {countryCode?.map((country) => (
                                        <MenuItem
                                          key={country.id}
                                          value={country.id}
                                        >
                                          {country.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  )}
                                />
                                {errors?.dependents?.[depIndex]
                                  ?.academic_records?.country && (
                                  <FormHelperText>
                                    {
                                      errors?.dependents?.[depIndex]
                                        ?.academic_records?.country?.message
                                    }
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                name={`dependents.${depIndex}.academic_records.state`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="State"
                                    fullWidth
                                    size="small"
                                    placeholder="Enter state"
                                    error={
                                      !!errors?.dependents?.[depIndex]
                                        ?.academic_records?.state
                                    }
                                    helperText={
                                      errors?.dependents?.[depIndex]
                                        ?.academic_records?.state?.message
                                    }
                                  />
                                )}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                name={`dependents.${depIndex}.academic_records.city`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="City"
                                    fullWidth
                                    size="small"
                                    placeholder="Enter city"
                                    error={
                                      !!errors?.dependents?.[depIndex]
                                        ?.academic_records?.city
                                    }
                                    helperText={
                                      errors?.dependents?.[depIndex]
                                        ?.academic_records?.city?.message
                                    }
                                  />
                                )}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                name={`dependents.${depIndex}.academic_records.zip_code`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Zip Code"
                                    fullWidth
                                    size="small"
                                    placeholder="Enter zip code"
                                  />
                                )}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Controller
                                name={`dependents.${depIndex}.academic_records.address`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Address"
                                    fullWidth
                                    size="small"
                                    multiline
                                    placeholder="Enter full address"
                                    error={
                                      !!errors?.dependents?.[depIndex]
                                        ?.academic_records?.address
                                    }
                                    helperText={
                                      errors?.dependents?.[depIndex]
                                        ?.academic_records?.address?.message
                                    }
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    )}
                </Grid>

                {/* Dependent's Visa Records */}
                <DependentVisaRecordsField
                  control={control}
                  errors={errors}
                  dependentIndex={depIndex}
                  immigrationType={immigrationType}
                  immigrationTypeLoading={immigrationTypeLoading}
                />
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<Icon icon="mdi:plus" />}
              onClick={() => {
                appendDependentInfo({
                  first_name: "",
                  middle_name: "",
                  last_name: "",
                  dob: "",
                  relation: "",
                  country_of_birth: "",
                  country_of_citizenship: "",
                  education: "",
                  academic_records: [],
                  visa_records: [
                    {
                      type: "",
                      expedition_date: "",
                      expiration_date: "",
                    },
                  ],
                });
              }}
            >
              Add Another Dependent
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export { ProcessingInformation };

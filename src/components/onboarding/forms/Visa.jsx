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

// ------------------ Validation Schema ------------------
export const visaSchema = z
  .object({
    has_visa_records: z.enum(["Yes", "No"]),
    visa_records: z
      .array(
        z.object({
          visaName: z.string().min(1, "Name is required"),
          visaType: z.string().min(1, "Visa type is required"),
          visaExpeditionDate: z.string().min(1, "Expedition date is required"),
          visaExpirationDate: z.string().min(1, "Expiration date is required"),
        })
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
          if (!record.visaType?.trim()) {
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
export const Visa = () => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const hasVisaRecords = watch("has_visa_records");

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

  const visaTypes = [
    { id: "E11", name: "EB-1 Extraordinary Ability" },
    { id: "E12", name: "EB-1 Outstanding Professor/Researcher" },
    { id: "E13", name: "EB-1 Multinational Executive/Manager" },
    { id: "E21", name: "EB-2 Advanced Degree / Exceptional Ability" },
    { id: "E31", name: "EB-3 Skilled Worker" },
    { id: "E32", name: "EB-3 Professional" },
    { id: "EW3", name: "EB-3 Other Worker" },
    { id: "SD", name: "EB-4 Religious Worker" },
    { id: "SR", name: "EB-4 Minister of Religion" },
    { id: "T5", name: "EB-5 Investor (Regional Center)" },
    { id: "I5", name: "EB-5 Investor (Direct Investment)" },
    { id: "F11", name: "Unmarried Son/Daughter of U.S. Citizen" },
    { id: "F21", name: "Spouse of Lawful Permanent Resident" },
    { id: "F22", name: "Child of Lawful Permanent Resident" },
    { id: "F23", name: "Unmarried Son/Daughter of LPR" },
    { id: "F24", name: "Married Son/Daughter of U.S. Citizen" },
    { id: "F41", name: "Brother/Sister of U.S. Citizen" },
    { id: "F1", name: "Academic Student" },
    { id: "F2", name: "Dependent of F1" },
    { id: "M1", name: "Vocational Student" },
    { id: "M2", name: "Dependent of M1" },
    { id: "J1", name: "Exchange Visitor" },
    { id: "J2", name: "Dependent of J1" },
    { id: "H1B", name: "Specialty Occupation Worker" },
    { id: "H1B1", name: "Singapore/Chile Specialty Worker" },
    { id: "H2A", name: "Temporary Agricultural Worker" },
    { id: "H2B", name: "Temporary Non-Agricultural Worker" },
    { id: "L1A", name: "Intracompany Executive/Manager" },
    { id: "L1B", name: "Intracompany Specialized Knowledge" },
    { id: "O1", name: "Extraordinary Ability (Arts, Science, etc.)" },
    { id: "O2", name: "Assistant to O1" },
    { id: "P1", name: "Internationally Recognized Athlete/Performer" },
    { id: "P2", name: "Artist/Entertainer in Exchange Program" },
    { id: "P3", name: "Culturally Unique Artist/Entertainer" },
    { id: "R1", name: "Religious Worker" },
    { id: "K1", name: "Fiancé(e) of U.S. Citizen" },
    { id: "K2", name: "Child of K1" },
    { id: "K3", name: "Spouse of U.S. Citizen (awaiting immigrant visa)" },
    { id: "K4", name: "Child of K3" },
    { id: "U1", name: "Victim of Criminal Activity" },
    { id: "T1", name: "Victim of Human Trafficking" },
    { id: "Refugee", name: "Granted Abroad" },
    { id: "Asylee", name: "Granted Inside U.S." },
    { id: "TPS", name: "Temporary Protected Status" },
    { id: "VAWA", name: "Violence Against Women Act Self-Petitioner" },
    { id: "SIJ", name: "Special Immigrant Juvenile" },
    { id: "DACA", name: "Deferred Action for Childhood Arrivals" },
    { id: "DV1", name: "Diversity Immigrant (Principal Applicant)" },
    { id: "DV2", name: "Spouse of DV1" },
    { id: "DV3", name: "Child of DV1" },
  ];

  return (
    <Box id="section-12" sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        US Visa Records
      </Typography>

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
                              error={!!errors.visa_records?.[index]?.visaType}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#fff",
                                },
                              }}
                            >
                              <MenuItem value="">
                                <em>Select Visa Type</em>
                              </MenuItem>
                              {visaTypes.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                  {type.id} – {type.name}
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

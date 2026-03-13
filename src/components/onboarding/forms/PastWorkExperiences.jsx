import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  TextField,
  Checkbox,
  FormHelperText,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { useEffect } from "react";

// ✅ New schema using array pattern like CriminalRecords
export const pastWorkExperiencesSchema = z
  .object({
    has_work_experience: z.enum(["Yes", "No"]),
    work_experiences: z
      .array(
        z.object({
          company_name: z.string().optional(),
          job_title: z.string().optional(),
          start_date: z.string().optional(),
          end_date: z.string().optional(),
          currently_employed: z.boolean().optional(),
          job_description: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zip_code: z.string().optional(),
          supervisor_name: z.string().optional(),
          job_duty: z.string().optional(),
        })
      )
      .optional()
      .default([]),
  })
  .superRefine((data, ctx) => {
    // Only validate when "Yes" is selected
    if (data.has_work_experience === "Yes") {
      if (!data.work_experiences || data.work_experiences.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please add at least one work experience",
          path: ["work_experiences"],
        });
      } else {
        data.work_experiences.forEach((experience, index) => {
          if (!experience.company_name?.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Company name is required",
              path: ["work_experiences", index, "company_name"],
            });
          }
          if (!experience.job_title?.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Job title is required",
              path: ["work_experiences", index, "job_title"],
            });
          }
          if (!experience.start_date) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Start date is required",
              path: ["work_experiences", index, "start_date"],
            });
          }
          if (!experience.currently_employed && !experience.end_date) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "End date is required if not currently employed",
              path: ["work_experiences", index, "end_date"],
            });
          }
          if (
            experience.start_date &&
            experience.end_date &&
            !experience.currently_employed
          ) {
            const startDate = new Date(experience.start_date);
            const endDate = new Date(experience.end_date);
            if (endDate < startDate) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End date must be after start date",
                path: ["work_experiences", index, "end_date"],
              });
            }
          }
          if (!experience.job_description?.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Job description is required",
              path: ["work_experiences", index, "job_description"],
            });
          }
        });
      }
    }
    // When "No" is selected, validation is skipped entirely
  });

export const PastWorkExperiences = () => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const hasWorkExperience = watch("has_work_experience");

  const {
    fields: workExperiences,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "work_experiences",
  });

  const showForm = hasWorkExperience === "Yes";

  // ✅ Auto-add first work experience when "Yes" is selected, clear when "No"
  useEffect(() => {
    if (showForm && workExperiences.length === 0) {
      // Add first work experience when "Yes" is selected
      append({
        company_name: "",
        job_title: "",
        start_date: "",
        end_date: "",
        currently_employed: false,
        job_description: "",
        city: "",
        state: "",
        zip_code: "",
        supervisor_name: "",
        job_duty: "",
      });
    }
    //  else if (!showForm && workExperiences.length > 0) {
    //   // Clear all records when "No" is selected
    //   setValue("work_experiences", []);
    //   console.log("🗑️ Cleared work experiences");
    // }
  }, [showForm, workExperiences.length, setValue, append]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <Box id="section-6" sx={{ mb: 6 }}>
      {/* <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Past Work Experiences
      </Typography> */}

      <Grid container spacing={4}>
        {/* Main Question */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
            Do you have any work experience?
          </Typography>

          <Controller
            name="has_work_experience"
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

        {/* Work Experience Forms */}
        {showForm && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Please provide your work experience details
              </Typography>

              {workExperiences.map((item, index) => (
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
                        ? "Work Experience"
                        : `Work Experience ${index + 1}`}
                    </Typography>
                    {workExperiences.length > 1 && (
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
                    {/* Row 1: Company Name and Job Title */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`work_experiences.${index}.company_name`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Company Name"
                            fullWidth
                            required
                            placeholder="Enter company name"
                            error={
                              !!errors.work_experiences?.[index]?.company_name
                            }
                            helperText={
                              errors.work_experiences?.[index]?.company_name
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

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`work_experiences.${index}.job_title`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Job Title"
                            fullWidth
                            required
                            placeholder="Enter job title"
                            error={
                              !!errors.work_experiences?.[index]?.job_title
                            }
                            helperText={
                              errors.work_experiences?.[index]?.job_title
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

                    {/* Row 2: Start Date and End Date */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`work_experiences.${index}.start_date`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Start Date"
                            type="date"
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ max: today }}
                            error={
                              !!errors.work_experiences?.[index]?.start_date
                            }
                            helperText={
                              errors.work_experiences?.[index]?.start_date
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

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`work_experiences.${index}.end_date`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="End Date"
                            type="date"
                            fullWidth
                            disabled={watch(
                              `work_experiences.${index}.currently_employed`
                            )}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ max: today }}
                            error={!!errors.work_experiences?.[index]?.end_date}
                            helperText={
                              errors.work_experiences?.[index]?.end_date
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

                    {/* Currently Employed Checkbox */}
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name={`work_experiences.${index}.currently_employed`}
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={!!field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.checked);
                                  if (e.target.checked) {
                                    setValue(
                                      `work_experiences.${index}.end_date`,
                                      ""
                                    );
                                  }
                                }}
                                sx={{
                                  color: "secondary.main",
                                  "&.Mui-checked": {
                                    color: "secondary.main",
                                  },
                                }}
                              />
                            }
                            label="Currently Employed"
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                color: "text.primary",
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Row 3: City, State, Zip Code */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Controller
                        name={`work_experiences.${index}.city`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="City"
                            fullWidth
                            placeholder="Enter city"
                            error={!!errors.work_experiences?.[index]?.city}
                            helperText={
                              errors.work_experiences?.[index]?.city?.message
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
                      <Controller
                        name={`work_experiences.${index}.state`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="State"
                            fullWidth
                            placeholder="Enter state"
                            error={!!errors.work_experiences?.[index]?.state}
                            helperText={
                              errors.work_experiences?.[index]?.state?.message
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
                      <Controller
                        name={`work_experiences.${index}.zip_code`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Zip Code"
                            fullWidth
                            placeholder="Enter zip code"
                            error={!!errors.work_experiences?.[index]?.zip_code}
                            helperText={
                              errors.work_experiences?.[index]?.zip_code
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

                    {/* Row 4: Supervisor Name and Job Duty */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`work_experiences.${index}.supervisor_name`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Supervisor Name"
                            fullWidth
                            placeholder="Enter supervisor name"
                            error={
                              !!errors.work_experiences?.[index]
                                ?.supervisor_name
                            }
                            helperText={
                              errors.work_experiences?.[index]?.supervisor_name
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

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name={`work_experiences.${index}.job_duty`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Job Duty"
                            fullWidth
                            placeholder="Enter job duty"
                            error={!!errors.work_experiences?.[index]?.job_duty}
                            helperText={
                              errors.work_experiences?.[index]?.job_duty
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

                    {/* Row 5: Job Description */}
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name={`work_experiences.${index}.job_description`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Job Description"
                            fullWidth
                            required
                            multiline
                            rows={4}
                            placeholder="Describe your responsibilities and achievements"
                            error={
                              !!errors.work_experiences?.[index]
                                ?.job_description
                            }
                            helperText={
                              errors.work_experiences?.[index]?.job_description
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
                    company_name: "",
                    job_title: "",
                    start_date: "",
                    end_date: "",
                    currently_employed: false,
                    job_description: "",
                    city: "",
                    state: "",
                    zip_code: "",
                    supervisor_name: "",
                    job_duty: "",
                  })
                }
                sx={{ mt: 1 }}
              >
                Add Another Work Experience
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

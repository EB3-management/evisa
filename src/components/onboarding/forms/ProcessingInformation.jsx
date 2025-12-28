import React from "react";
import {
  Box,
  Typography,
  FormControl,
  TextField,
  FormHelperText,
  FormControlLabel,
  RadioGroup,
  Radio,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";
import Grid from "@mui/material/Grid2";

// ------------------ Validation Schema ------------------
export const processingInformationSchema = z
  .object({
    adjustment_of_status: z.boolean().default(false),
    date_of_last_entry: z.string().optional(),
    i944_number: z.string().optional(),
    embassy_name: z.string().optional(),
    embassy_location: z.string().optional(),
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
  } = useFormContext();

  const adjustmentOfStatus = watch("adjustment_of_status");
  return (
    <Box id="section-0" sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Processing Information
      </Typography>

      <Grid container spacing={3}>
        {/* Adjustment of Status */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1, fontWeight: 500 }}>
            Adjustment of Status
          </Typography>
          <Controller
            name="adjustment_of_status"
            control={control}
            defaultValue={false}
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

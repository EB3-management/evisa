import { z as zod } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Link,
  Alert,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Paper,
  Typography,
  Divider,
  Container,
} from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { saveEligibilityForm, useGetCountryCode } from "src/api";

import { useAppDispatch } from "src/redux/hooks";

import { toast } from "src/components/snackbar";
import { Form, Field } from "src/components/hook-form";

import dayjs from "dayjs";

// ----------------------------------------------------------------------

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const EligibilityFormSchema = zod
  .object({
    date_of_birth: zod
      .string()
      .min(1, { message: "Date of birth is required!" }),

    gender: zod.string().min(1, { message: "Gender is required!" }),

    birth_country: zod
      .number()
      .min(1, { message: "Birth country is required!" }),

    current_country: zod
      .number()
      .min(1, { message: "Current country is required!" }),
    current_province_state: zod
      .string()
      .min(1, { message: "Province/State is required!" }),
    current_city_town: zod
      .string()
      .min(1, { message: "City/Town is required!" }),
    current_street: zod
      .string()
      .min(1, { message: "Street address is required!" }),
    current_zip_code: zod
      .string()
      .min(1, { message: "ZIP/Postal code is required!" }),

    same_address: zod.boolean(),

    permanent_country: zod.number().nullable(),
    permanent_province_state: zod.string(),
    permanent_city_town: zod.string(),
    permanent_street: zod.string(),
    permanent_zip_code: zod.string(),

    english_proficiency_listening: zod
      .string()
      .min(1, { message: "Listening proficiency is required!" }),
    english_proficiency_reading: zod
      .string()
      .min(1, { message: "Reading proficiency is required!" }),
    english_proficiency_writing: zod
      .string()
      .min(1, { message: "Writing proficiency is required!" }),
    english_proficiency_speaking: zod
      .string()
      .min(1, { message: "Speaking proficiency is required!" }),

    deported_from_US: zod
      .union([zod.boolean(), zod.string()])
      .transform((val) => val === true || val === "true"),
    denied_entry_from_US: zod
      .union([zod.boolean(), zod.string()])
      .transform((val) => val === true || val === "true"),
    pending_US_asylum_application: zod
      .union([zod.boolean(), zod.string()])
      .transform((val) => val === true || val === "true"),
    special_accommodation: zod
      .union([zod.boolean(), zod.string()])
      .transform((val) => val === true || val === "true"),

    passport_front: zod
      .any()
      .refine((file) => file !== null && file !== undefined, {
        message: "Passport photo is required!",
      })
      .refine((file) => {
        if (!file) return false;
        return file?.size <= MAX_FILE_SIZE;
      }, "Max file size is 5MB")
      .refine((file) => {
        if (!file) return false;
        return ACCEPTED_IMAGE_TYPES.includes(file?.type);
      }, "Only .jpg, .jpeg, .png and .webp formats are supported"),

    agreement: zod.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine(
    (data) => {
      if (!data.same_address) {
        return (
          data.permanent_country !== null &&
          data.permanent_country !== undefined &&
          data.permanent_province_state?.trim() &&
          data.permanent_city_town?.trim() &&
          data.permanent_street?.trim() &&
          data.permanent_zip_code?.trim()
        );
      }
      return true;
    },
    {
      message:
        "All permanent address fields are required when addresses are different",
      path: ["permanent_country"],
    },
  );

// ----------------------------------------------------------------------

export function EligibilityFormView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { country } = useGetCountryCode();

  const [errorMessage, setErrorMessage] = useState("");

  const defaultValues = {
    date_of_birth: "",
    gender: "",
    birth_country: null,
    current_country: null,
    current_province_state: "",
    current_city_town: "",
    current_street: "",
    current_zip_code: "",
    same_address: false,
    permanent_country: null,
    permanent_province_state: "",
    permanent_city_town: "",
    permanent_street: "",
    permanent_zip_code: "",
    english_proficiency_listening: "",
    english_proficiency_reading: "",
    english_proficiency_writing: "",
    english_proficiency_speaking: "",
    deported_from_US: false,
    denied_entry_from_US: false,
    pending_US_asylum_application: false,
    special_accommodation: false,
    passport_front: null,
    agreement: false,
  };

  const methods = useForm({
    resolver: zodResolver(EligibilityFormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const sameAddress = watch("same_address");

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!(file instanceof File)) {
        reject(new Error("Invalid file input"));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage("");

      // Format date to YYYY-MM-DD
      const formattedDate = data.date_of_birth
        ? new Date(data.date_of_birth).toISOString().split("T")[0]
        : data.date_of_birth;

      const submitData = {
        date_of_birth: formattedDate,
        gender: data.gender,
        birth_country: data.birth_country,
        current_country: data.current_country,
        current_province_state: data.current_province_state,
        current_city_town: data.current_city_town,
        current_street: data.current_street,
        current_zip_code: data.current_zip_code,
        same_address: data.same_address,
        permanent_country: data.same_address
          ? data.current_country
          : data.permanent_country,
        permanent_province_state: data.same_address
          ? data.current_province_state
          : data.permanent_province_state,
        permanent_city_town: data.same_address
          ? data.current_city_town
          : data.permanent_city_town,
        permanent_street: data.same_address
          ? data.current_street
          : data.permanent_street,
        permanent_zip_code: data.same_address
          ? data.current_zip_code
          : data.permanent_zip_code,
        english_proficiency_listening: data.english_proficiency_listening,
        english_proficiency_reading: data.english_proficiency_reading,
        english_proficiency_writing: data.english_proficiency_writing,
        english_proficiency_speaking: data.english_proficiency_speaking,
        deported_from_US: data.deported_from_US,
        denied_entry_from_US: data.denied_entry_from_US,
        pending_US_asylum_application: data.pending_US_asylum_application,
        special_accommodation: data.special_accommodation,
        agreement: data.agreement,
      };

      if (data.passport_front && data.passport_front instanceof File) {
        submitData.passport_image = await convertFileToBase64(
          data.passport_front,
        );
      }

      console.log("Form Data:", submitData);

      const response = await saveEligibilityForm(submitData);

      reset();
      toast.success(response.message || "Eligibility form saved successfully!");
      router.push(paths.dashboard.root);
    } catch (error) {
      const errorMessages = Object.values(error.message).flat();
      toast.error(
        // errorMessages[0] || "Something went wrong. Please try again."
        error.message || "Something went wrong. Please try again.",
      );
    }
  });

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const proficiencyLevels = [
    { value: "Advance", label: "Advance" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Basic", label: "Basic" },
    { value: "None", label: "None" },
  ];

  const yesNoOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  const renderSectionHeader = (title, icon) => (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.5,
        mb: 3,
        px: 2.5,
        py: 1,
        bgcolor: "#E3F2FD",
        borderRadius: 2,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          color: "secondary.main",
          fontSize: "0.95rem",
        }}
      >
        {title}
      </Typography>
    </Box>
  );

  const renderForm = () => (
    <Box sx={{ gap: 2.5, display: "flex", flexDirection: "column" }}>
      {/* Personal Information Section */}
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 } }}>
        {renderSectionHeader("Personal Information", "1")}

        <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
          <Field.DatePicker
            name="date_of_birth"
            label="Date of Birth"
            maxDate={dayjs()}
            slotProps={{
              textField: {
                fullWidth: true,
                placeholder: "dd/mm/yyyy",
              },
            }}
          />

          {/* Gender + Birth Country on Same Row */}
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              alignItems: "start",
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1.5, fontWeight: 500, color: "#64748b" }}
              >
                Gender{" "}
                <Box component="span" sx={{ color: "error.main" }}>
                  *
                </Box>
              </Typography>
              <Field.RadioGroup
                name="gender"
                row
                options={genderOptions}
                sx={{
                  flexWrap: "wrap",
                  "& .MuiFormControlLabel-root": {
                    mr: { xs: 2, md: 4 },
                    mb: { xs: 1, md: 0 },
                  },
                }}
              />
            </Box>

            <Field.Select
              name="birth_country"
              label="Birth Country"
              slotProps={{ inputLabel: { shrink: true } }}
            >
              <MenuItem value="">
                <em>Select country</em>
              </MenuItem>
              {country.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>
        </Box>
      </Paper>

      {/* Current Address Section */}
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
        {renderSectionHeader("Current Address Details", "2")}

        <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <Field.Select
              name="current_country"
              label="Country"
              slotProps={{ inputLabel: { shrink: true } }}
            >
              <MenuItem value="">
                <em>Select country</em>
              </MenuItem>
              {country.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text
              name="current_province_state"
              label="Province/State"
              slotProps={{ inputLabel: { shrink: true } }}
              placeholder="Enter province or state"
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <Field.Text
              name="current_city_town"
              label="City/Town"
              slotProps={{ inputLabel: { shrink: true } }}
              placeholder="Enter city or town"
            />

            <Field.Text
              name="current_zip_code"
              label="ZIP/Postal Code"
              slotProps={{ inputLabel: { shrink: true } }}
              placeholder="Enter ZIP or postal code"
            />
          </Box>

          <Field.Text
            name="current_street"
            label="Street Address"
            slotProps={{ inputLabel: { shrink: true } }}
            placeholder="Enter street address"
          />

          <Box
            sx={{
              mt: 1,
              p: 2.5,
              bgcolor: "#f8fafc",
              borderRadius: 2,
              border: "1px solid #e2e8f0",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={watch("same_address")}
                  onChange={(e) => {
                    setValue("same_address", e.target.checked);
                    if (e.target.checked) {
                      setValue("permanent_country", null);
                      setValue("permanent_province_state", "");
                      setValue("permanent_city_town", "");
                      setValue("permanent_street", "");
                      setValue("permanent_zip_code", "");
                    }
                  }}
                  sx={{
                    color: "primary.dark",
                    "&.Mui-checked": {
                      color: "primary.dark",
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#475569" }}
                >
                  Permanent address is the same as current address
                </Typography>
              }
            />
          </Box>
        </Box>
      </Paper>

      {/* Permanent Address Section */}
      {!sameAddress && (
        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
          {renderSectionHeader("Permanent Address Details", "3")}

          <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              }}
            >
              <Field.Select
                name="permanent_country"
                label="Country"
                slotProps={{ inputLabel: { shrink: true } }}
              >
                <MenuItem value="">
                  <em>Select country</em>
                </MenuItem>
                {country.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text
                name="permanent_province_state"
                label="Province/State"
                slotProps={{ inputLabel: { shrink: true } }}
                placeholder="Enter province or state"
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              }}
            >
              <Field.Text
                name="permanent_city_town"
                label="City/Town"
                slotProps={{ inputLabel: { shrink: true } }}
                placeholder="Enter city or town"
              />

              <Field.Text
                name="permanent_zip_code"
                label="ZIP/Postal Code"
                slotProps={{ inputLabel: { shrink: true } }}
                placeholder="Enter ZIP or postal code"
              />
            </Box>

            <Field.Text
              name="permanent_street"
              label="Street Address"
              slotProps={{ inputLabel: { shrink: true } }}
              placeholder="Enter street address"
            />
          </Box>
        </Paper>
      )}

      {/* English Proficiency Section */}
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
        {renderSectionHeader("English Proficiency", sameAddress ? "3" : "4")}

        <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <Field.Select
              name="english_proficiency_listening"
              label="Listening"
              slotProps={{ inputLabel: { shrink: true } }}
            >
              <MenuItem value="">
                <em>Select level</em>
              </MenuItem>
              {proficiencyLevels.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select
              name="english_proficiency_reading"
              label="Reading"
              slotProps={{ inputLabel: { shrink: true } }}
            >
              <MenuItem value="">
                <em>Select level</em>
              </MenuItem>
              {proficiencyLevels.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <Field.Select
              name="english_proficiency_writing"
              label="Writing"
              slotProps={{ inputLabel: { shrink: true } }}
            >
              <MenuItem value="">
                <em>Select level</em>
              </MenuItem>
              {proficiencyLevels.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select
              name="english_proficiency_speaking"
              label="Speaking"
              slotProps={{ inputLabel: { shrink: true } }}
            >
              <MenuItem value="">
                <em>Select level</em>
              </MenuItem>
              {proficiencyLevels.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>
        </Box>
      </Paper>

      {/* US Immigration History Section */}
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
        {renderSectionHeader("US Immigration History", sameAddress ? "4" : "5")}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1.5, fontWeight: 500, color: "#475569" }}
            >
              Have you ever been deported or removed from the United States?{" "}
              <Box component="span" sx={{ color: "error.main" }}>
                *
              </Box>
            </Typography>
            <Field.RadioGroup
              name="deported_from_US"
              row
              options={yesNoOptions}
            />
          </Box>

          <Divider sx={{ borderColor: "#e2e8f0" }} />

          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1.5, fontWeight: 500, color: "#475569" }}
            >
              Have you been denied entry to the United States?{" "}
              <Box component="span" sx={{ color: "error.main" }}>
                *
              </Box>
            </Typography>
            <Field.RadioGroup
              name="denied_entry_from_US"
              row
              options={yesNoOptions}
            />
          </Box>

          <Divider sx={{ borderColor: "#e2e8f0" }} />

          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1.5, fontWeight: 500, color: "#475569" }}
            >
              Do you have a pending U.S asylum application?{" "}
              <Box component="span" sx={{ color: "error.main" }}>
                *
              </Box>
            </Typography>
            <Field.RadioGroup
              name="pending_US_asylum_application"
              row
              options={yesNoOptions}
            />
          </Box>

          <Divider sx={{ borderColor: "#e2e8f0" }} />

          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1.5, fontWeight: 500, color: "#475569" }}
            >
              Do you require any special accommodations? (Example: work schedule
              limitations due to religious or cultural beliefs){" "}
              <Box component="span" sx={{ color: "error.main" }}>
                *
              </Box>
            </Typography>
            <Field.RadioGroup
              name="special_accommodation"
              row
              options={yesNoOptions}
            />
          </Box>
        </Box>
      </Paper>

      {/* Passport Upload Section */}
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
        {renderSectionHeader("Passport Upload", sameAddress ? "5" : "6")}

        <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
          <Field.Upload
            name="passport_front"
            label="Upload Passport Photo"
            slotProps={{ inputLabel: { shrink: true } }}
            helperText="Upload a clear photo of your passport (JPG, PNG, or WEBP - Max 5MB)"
          />
        </Box>
      </Paper>

      {/* Terms Agreement & Submit */}
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={watch("agreement")}
              onChange={(e) => setValue("agreement", e.target.checked)}
              sx={{
                color: "primary.dark",
                "&.Mui-checked": {
                  color: "primary.dark",
                },
              }}
            />
          }
          label={
            <Box component="span" sx={{ color: "#475569" }}>
              I agree to all{" "}
              <Link
                underline="always"
                color="primary"
                href={paths.auth.termsAndConditions}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontWeight: 600, color: "primary.dark" }}
              >
                Terms and Conditions
              </Link>
              .
            </Box>
          }
        />
        {errors.agreement && (
          <FormHelperText error sx={{ ml: 4 }}>
            {errors.agreement.message}
          </FormHelperText>
        )}
      </Box>

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Submitting..."
        sx={{
          py: 2,
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "none",

          borderRadius: 2,
          boxShadow: "0 4px 14px rgba(74, 159, 245, 0.4)",
          "&:hover": {
            bgcolor: "primary.light",
          },
        }}
      >
        Submit Application
      </LoadingButton>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ pt: 0, pb: { xs: 3, md: 5 } }}>
      <Box
        sx={{
          mb: 0,
          bgcolor: "white",
          p: { xs: 2, md: 3 },
        }}
      >
        <Typography
          component="div"
          variant="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "#1e293b",
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            display: "flex",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          <Box
            component="img"
            src="/favicon.png" // ✅ update as needed
            alt="Logo"
            sx={{ width: 30, height: 30 }}
          />
          {/* <Logo sx={{ height: 28, width: "auto" }} /> */}
          Eligibility Application
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            fontSize: { xs: "0.875rem", md: "0.95rem" },
            mb: 0.5,
          }}
        >
          Please fill up all the details below
        </Typography>
      </Box>

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </Container>
  );
}

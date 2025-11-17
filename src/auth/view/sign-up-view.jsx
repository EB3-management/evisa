import { z as zod } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBoolean } from "minimal-shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Link,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { signUp, useGetCountryCode } from "src/api";

import { useAppDispatch } from "src/redux/hooks";
import { setOrganization } from "src/redux/actions";

import { toast } from "src/components/snackbar";
import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";

import { getErrorMessage } from "../utils";
import { FormHead } from "../components/form-head";
import { SignUpTerms } from "../components/sign-up-terms";
import { authRoutes } from "src/routes/sections/auth";

// ----------------------------------------------------------------------

export const SignUpSchema = zod
  .object({
    first_name: zod.string().min(1, { message: "First name is required!" }),
    last_name: zod.string().min(1, { message: "Last name is required!" }),
    email: zod
      .string()
      .min(1, { message: "User email is required!" })
      .email({ message: "Email must be a valid email address!" }),
    country_code: zod.string().min(1, { message: "Country code is required!" }),
    phone: zod
      .string()
      .min(1, { message: "Contact number is required!" })
      .regex(/^\d{10}$/, {
        message: "Contact number must be exactly 10 digits!",
      }),
    password: zod
      .string()
      .min(1, { message: "Password is required!" })
      .min(8, { message: "Password must be at least 6 characters!" }),
    password_confirmation: zod
      .string()
      .min(1, { message: "Confirm password is required!" })
      .min(8, { message: "Confirm Password must be at least 8 characters!" }),
    agreed_to_terms: zod.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions!",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords didn't match!",
    path: ["password_confirmation"],
  });

// ----------------------------------------------------------------------

export function SignUpView() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { country } = useGetCountryCode();

  const showPassword = useBoolean();

  const showConfirmPassword = useBoolean();

  const [errorMessage, setErrorMessage] = useState("");

  const defaultValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country_code: "",
    password: "",
    password_confirmation: "",
    agreed_to_terms: false,
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage("");

      const response = await signUp(data);

      dispatch(setOrganization(response.data));

      reset();

      toast.success(
        response.message || "Registration successful! Welcome aboard."
      );
      router.push("/auth/verify-email");

      // router.push("/auth/register-step-form");
    } catch (error) {
      const errorMessages = Object.values(error.message).flat();
      toast.error(errorMessages[0]);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Field.Text
          name="first_name"
          label="First Name"
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Field.Text
          name="last_name"
          label="Last Name"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Field.Text
        name="email"
        label="Email"
        placeholder="Please enter a valid email address"
        slotProps={{ inputLabel: { shrink: true } }}
        
      />

      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Field.Select
          name="country_code"
          label="Country Code"
          slotProps={{ inputLabel: { shrink: true } }}
        >
          {country.map((option) => (
            //  <MenuItem key={option.label} value={String(option.label)}></MenuItem>
            <MenuItem key={option.label} value={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Text
          name="phone"
          label="Phone Number"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Field.Text
          name="password"
          label="Password"
          type={showPassword.value ? "text" : "password"}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={
                        showPassword.value
                          ? "solar:eye-bold"
                          : "solar:eye-closed-bold"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Field.Text
          name="password_confirmation"
          label="Confirm Password"
          type={showConfirmPassword.value ? "text" : "password"}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showConfirmPassword.onToggle} edge="end">
                    <Iconify
                      icon={
                        showConfirmPassword.value
                          ? "solar:eye-bold"
                          : "solar:eye-closed-bold"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <Field.Checkbox
          name="agreed_to_terms"
          label={
            <Box component="span">
              I agree to all{" "}
              <Link
                underline="always"
                color="text.primary"
                href={paths.auth.termsAndConditions}
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </Link>
              .
            </Box>
          }
        />
        {errors.agreed_to_terms && (
          <FormHelperText error sx={{ textAlign: "center", mt: -1 }}>
            {errors.agreed_to_terms.message}
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
        loadingIndicator="Create account..."
      >
        Create account
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Start Your EB-3 Visa Application"
        description={
          <>
            {`Already have an account? `}
            <Link
              component={RouterLink}
              href={paths.auth.signIn}
              variant="subtitle2"
            >
              Get started
            </Link>
          </>
        }
        sx={{ textAlign: { xs: "center", md: "left" } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}

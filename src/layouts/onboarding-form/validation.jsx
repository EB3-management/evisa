import { z as zod } from "zod";

export const OnboardingSchema = zod.object({
  // ─── Main Applicant ───
  firstName: zod.string().min(1, "First name is required"),
  middleName: zod.string().optional(),
  lastName: zod.string().min(1, "Last name is required"),
  dob: zod.string().min(1, "Date of birth is required"),
  gender: zod.string().min(1, "Gender is required"),
  countryOfBirth: zod.string().optional(),
  citizenship1: zod.string().min(1, "Primary citizenship is required"),
  citizenship2: zod.string().optional(),

  // ─── Current Address ───
  country: zod.string().min(1, "Country is required"),
  state: zod.string().min(1, "State is required"),
  city: zod.string().min(1, "City is required"),
  zipCode: zod.string().optional(),
  address: zod.string().min(1, "Address is required"),

  // ─── Contact Details ───
  email: zod.string().email("Invalid email").min(1, "Email is required"),
  phone: zod
    .string()
    .min(7, "Phone number too short")
    .max(15, "Phone number too long"),
});

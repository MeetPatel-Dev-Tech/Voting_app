import * as yup from "yup";

// Common Fields
const name = yup.string().required("Name is required");
const age = yup.number().required("Age is required").positive().integer();
const email = yup.string().email("Invalid email").nullable();
const mobile = yup
  .string()
  .matches(/^\d{10}$/, "Mobile number must be 10 digits")
  .nullable();
const address = yup.string().required("Address is required");
const aadharCardNumber = yup
  .string()
  .matches(/^\d{12}$/, "Aadhar card number must be 12 digits")
  .required("Aadhar card number is required");
const password = yup
  .string()
  .min(4, "Password must be at least 4 characters")
  .required("Password is required");
const role = yup.string().oneOf(["voter", "admin"]).default("voter");
const isVoted = yup.boolean().default(false);
const otp = yup
  .string()
  .required("OTP is required")
  .matches(/^\d{6}$/, "OTP must be exactly 6 digits");

// Signup Schema
export const signupSchema = yup.object({
  name,
  age,
  email,
  mobile,
  address,
  aadharCardNumber,
  password,
  role,
  isVoted,
  otp,
});

// Login Schema
export const loginSchema = yup
  .object({
    aadharCardNumber: yup
      .string()
      .matches(/^\d{12}$/, "Aadhar must be 12 digits")
      .optional(),
    email: yup.string().email().optional(),
    mobile: yup
      .string()
      .matches(/^\d{10}$/)
      .optional(),
    password: yup.string().required("Password is required"),
  })
  .test(
    "at-least-one-identifier",
    "Provide at least one identifier: Aadhar, Email, or Mobile",
    (value) => value.email || value.mobile || value.aadharCardNumber
  );

// Update Profile Schema
export const updateProfileSchema = yup.object({
  name: name.optional(),
  age: age.optional(),
  email: email.optional(),
  mobile: mobile.optional(),
  address: address.optional(),
  password: password.optional(),
  role: role.optional(),
  isVoted: isVoted.optional(),
});

// Update Password Schema
export const updatePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().min(6).required("New password is required"),
});

// Profile Query Params
export const profileQuerySchema = yup.object({
  includeDetails: yup.boolean().optional(),
});

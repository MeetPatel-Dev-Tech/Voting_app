// utils/twilio.js
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

// Send OTP
export const sendOTP = async (phoneNumber) => {
  return await client.verify.v2
    .services(serviceSid)
    .verifications.create({ to: phoneNumber, channel: "sms" });
};

// Verify OTP
export const verifyOTP = async (phoneNumber, code) => {
  return await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: phoneNumber, code });
};

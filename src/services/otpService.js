import {
  sendOTP as twilioSendOTP,
  verifyOTP as twilioVerifyOTP,
} from "../utils/twilio.js";

const otpService = {
  sendOTP: async (mobile) => {
    try {
      const result = await twilioSendOTP(`+91${mobile}`);
      return { success: true, status: result.status };
    } catch (err) {
      console.error("Error sending OTP:", err);
      throw { status: 500, message: "Failed to send OTP" };
    }
  },

  verifyOTP: async (mobile, code) => {
    try {
      const result = await twilioVerifyOTP(`+91${mobile}`, code);
      if (result.status === "approved") {
        return { success: true };
      }
      throw { status: 401, message: "Invalid OTP" };
    } catch (err) {
      console.error("Error verifying OTP:", err);
      throw err.status
        ? err
        : { status: 500, message: "OTP verification failed" };
    }
  },
};

export default otpService;

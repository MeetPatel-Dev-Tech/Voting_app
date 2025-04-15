import { Log } from "../models/log.js"; // update path as needed

export const createLog = async ({ adminId, action, target, description }) => {
  try {
    await Log.create({ adminId, action, target, description });
  } catch (err) {
    console.error("Failed to create DB log:", err); // fallback if DB log fails
  }
};

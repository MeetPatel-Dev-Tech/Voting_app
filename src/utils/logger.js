import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // show logs in terminal
    new transports.File({ filename: "logs/combined.log" }), // save all logs
    new transports.File({ filename: "logs/error.log", level: "error" }), // only errors
  ],
});

export default logger;

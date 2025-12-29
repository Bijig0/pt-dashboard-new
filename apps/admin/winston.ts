import winston, { format } from "winston";

const logger = winston.createLogger({
  level: "debug", // Set the minimum level of messages that will be logged
  format: format.combine(
    format.splat(), // <--
    winston.format.json()
  ),

  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
      silent: process.env["NODE_ENV"] === "test",
    }),
  ],
});

export default logger;

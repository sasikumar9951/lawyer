import nodemailer from "nodemailer";

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};

export const createTransporter = (config: MailConfig) => {
  return nodemailer.createTransport(config);
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSKEY,
  },
  authMethod: "PLAIN",
});

export { transporter };

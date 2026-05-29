import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration is incomplete. Check env variables.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  message?: string;
}): Promise<void> {
  const transporter = createTransporter();
  const ownerEmail = process.env.OWNER_EMAIL;

  if (!ownerEmail) {
    throw new Error("OWNER_EMAIL is not configured.");
  }

  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "long",
  }).format(new Date());

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: ownerEmail,
    subject: `New Portfolio Contact from ${data.name}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Message: ${data.message ?? "No message provided"}`,
      `Submitted at: ${submittedAt}`,
    ].join("\n"),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    // Log without leaking credentials
    console.error("Mail send error:", (err as Error).message);
    throw new Error("Failed to send email. Please try again later.");
  }
}

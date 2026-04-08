import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const mailOptions = {
      from: `"Collab Canva" <${process.env.SMTP_MAIL}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email delivery failed');
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Password Reset Code</h2>
      <p>Hello,</p>
      <p>You requested to reset your password for Collab Canva. Please enter the following 6-digit verification code on the website:</p>
      <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; font-size: 32px; font-weight: bold; color: #2196f3; letter-spacing: 12px; margin: 20px 0;">
        ${token}
      </div>
      <p style="color: #777; font-size: 13px; text-align: center;">This code will expire in 1 hour. If you didn't request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail(email, 'Your Password Reset Code', html);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Verification Code</h2>
      <p>Hello,</p>
      <p>Please enter the following 6-digit code to verify your new email address on Collab Canva:</p>
      <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; font-size: 32px; font-weight: bold; color: #4caf50; letter-spacing: 12px; margin: 20px 0;">
        ${token}
      </div>
      <p style="color: #777; font-size: 13px; text-align: center;">This code will expire in 10 minutes. If you didn't request a change, please ignore this email.</p>
    </div>
  `;

  await sendEmail(email, 'Your Email Verification Code', html);
};

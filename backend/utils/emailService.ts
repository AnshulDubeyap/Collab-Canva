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

export const sendRoomInviteEmail = async (email: string, roomId: string, inviterName: string, roomName: string) => {
  const joinUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/canvas/${roomId}?invite=true`;
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e0e0e0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2196f3; font-size: 28px; margin: 0;">Collab Canva</h1>
        <p style="color: #666; font-size: 16px;">Real-time Collaborative Creativity</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #f5fafd 0%, #ffffff 100%); padding: 30px; border-radius: 12px; border-left: 4px solid #2196f3; margin-bottom: 30px;">
        <h2 style="color: #333; margin-top: 0;">You've Been Invited!</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #444;">
          <strong>${inviterName}</strong> has invited you to join a collaborative canvas session:
        </p>
        <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px dashed #2196f3; margin: 20px 0; text-align: center;">
          <span style="font-size: 18px; font-weight: bold; color: #2196f3;">"${roomName}"</span>
        </div>
        <p style="font-size: 14px; color: #666; margin-bottom: 25px;">
          The canvas is currently locked in a "Waiting Room" state. Once you join and both of you are ready, the session will begin!
        </p>
        
        <div style="text-align: center;">
          <a href="${joinUrl}" style="background-color: #2196f3; color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s;">
            Join Collaboration
          </a>
        </div>
      </div>
      
      <p style="color: #777; font-size: 12px; text-align: center; line-height: 1.5;">
        This invitation was sent to you by ${inviterName} via Collab Canva.<br>
        If you weren't expecting this, you can safely ignore this email.
      </p>
    </div>
  `;

  await sendEmail(email, `${inviterName} invited you to collaborate!`, html);
};

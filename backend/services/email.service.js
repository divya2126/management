const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send welcome email with temporary credentials to a new user.
 * @param {string} name
 * @param {string} email
 * @param {string} tempPassword
 * @param {string} role  - "student" | "teacher" | "hod"
 */
const sendWelcomeEmail = async (name, email, tempPassword, role) => {
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const mailOptions = {
    from: `"Schedulify ERP" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to Schedulify — Your ${roleLabel} Account is Ready`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; background: #f4f7fb; margin: 0; padding: 0; }
            .container { max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #0b2a3d, #1e4a6a); padding: 32px 24px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px; }
            .header p { color: #7dd3fc; margin: 6px 0 0; font-size: 13px; }
            .body { padding: 32px 28px; }
            .body h2 { color: #0f172a; font-size: 18px; margin: 0 0 8px; }
            .body p { color: #475569; font-size: 14px; line-height: 1.7; margin: 0 0 16px; }
            .creds-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
            .creds-box p { margin: 4px 0; color: #0f172a; font-size: 14px; }
            .creds-box strong { color: #0369a1; }
            .btn { display: inline-block; margin-top: 8px; background: #06b6d4; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; }
            .warning { background: #fef9c3; border-left: 4px solid #facc15; padding: 12px 16px; border-radius: 4px; margin-top: 20px; font-size: 13px; color: #713f12; }
            .footer { text-align: center; padding: 20px; background: #f8fafc; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Schedulify ERP</h1>
              <p>Smart Campus Management System</p>
            </div>
            <div class="body">
              <h2>Hello, ${name}! 👋</h2>
              <p>Your <strong>${roleLabel}</strong> account has been created by the admin. You can now log in using the credentials below.</p>
              
              <div class="creds-box">
                <p>📧 <strong>Email:</strong> ${email}</p>
                <p>🔑 <strong>Temporary Password:</strong> <strong style="font-size:16px; letter-spacing:1px;">${tempPassword}</strong></p>
              </div>

              <a href="http://localhost:5173/login" class="btn">Login to Schedulify →</a>

              <div class="warning">
                ⚠️ <strong>Important:</strong> You will be asked to change this password immediately after your first login. Please keep it safe until then.
              </div>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} Schedulify ERP. This is an automated message, please do not reply.
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send password reset email with a magic link.
 * @param {string} name
 * @param {string} email
 * @param {string} resetUrl
 */
const sendPasswordResetEmail = async (name, email, resetUrl) => {
  const mailOptions = {
    from: `"Schedulify ERP" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Password Reset Request - Schedulify`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; background: #f4f7fb; margin: 0; padding: 0; }
            .container { max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #0b2a3d, #1e4a6a); padding: 32px 24px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px; }
            .body { padding: 32px 28px; }
            .body h2 { color: #0f172a; font-size: 18px; margin: 0 0 8px; }
            .body p { color: #475569; font-size: 14px; line-height: 1.7; margin: 0 0 16px; }
            .btn { display: inline-block; margin-top: 8px; background: #06b6d4; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; }
            .footer { text-align: center; padding: 20px; background: #f8fafc; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Schedulify ERP</h1>
            </div>
            <div class="body">
              <h2>Hello, ${name}! 👋</h2>
              <p>We received a request to reset your password. Click the button below to choose a new one:</p>
              
              <div style="text-align: center; margin: 24px 0;">
                <a href="${resetUrl}" class="btn">Reset Password →</a>
              </div>

              <p style="font-size: 13px; color: #64748b;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged. This link expires in 15 minutes.</p>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} Schedulify ERP.
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };

const nodemailer = require('nodemailer');

let cachedTransporter = null;

function getBoolean(value, fallback = false) {
  if (value === undefined || value === null) return fallback;
  const v = String(value).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = getBoolean(process.env.SMTP_SECURE, port === 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS are required for sending emails');
  }

  cachedTransporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  return cachedTransporter;
}

async function sendBookingEmail({ to, refId, experience, date, time, qty, total }) {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
  const transporter = getTransporter();

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
      <h2 style="margin:0 0 12px">Booking Confirmed</h2>
      <p style="margin:4px 0"><b>Reference ID:</b> ${refId}</p>
      <p style="margin:4px 0"><b>Experience:</b> ${experience}</p>
      <p style="margin:4px 0"><b>Date & Time:</b> ${date} ${time}</p>
      <p style="margin:4px 0"><b>Quantity:</b> ${qty}</p>
      <p style="margin:4px 0"><b>Total:</b> ₹${total}</p>
      <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb"/>
      <p style="margin:4px 0;color:#6b7280">Thanks for booking with highway delite.</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: `Your booking is confirmed: ${refId}`,
    html,
  });
}

module.exports = { sendBookingEmail };

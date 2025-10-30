const fetch = require('node-fetch');

async function sendBookingEmail({to, refId, experience, date, time, qty, total}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY required');
  const from = process.env.FROM_EMAIL || 'Highway Delite <onboarding@resend.dev>';
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

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Your booking is confirmed: ${refId}`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error('Email API failed: ' + text);
  }
}

module.exports = { sendBookingEmail };


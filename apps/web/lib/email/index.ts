import { Resend } from 'resend';

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendEnquiryNotification(payload: {
  fullName: string;
  email: string;
  destination?: string;
  notes?: string;
}) {
  const resend = getResend();
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

  if (!resend || !to) {
    console.info('[email:demo] Enquiry notification', payload);
    return { id: 'demo-email' };
  }

  return resend.emails.send({
    from,
    to,
    subject: `New enquiry from ${payload.fullName}`,
    html: `
      <h2>New journey enquiry</h2>
      <p><strong>Name:</strong> ${payload.fullName}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Destination:</strong> ${payload.destination ?? '—'}</p>
      <p><strong>Notes:</strong> ${payload.notes ?? '—'}</p>
    `,
  });
}

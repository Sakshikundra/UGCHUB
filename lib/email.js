import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn('RESEND_API_KEY is missing in environment variables');
}

export const resend = new Resend(resendApiKey);

// Helper to send emails safely
export async function sendEmail({ to, subject, html, text }) {
  if (!resendApiKey) {
    console.log('Mock Email Sent:', { to, subject });
    return { success: true, id: 'mock-id' };
  }

  try {
    const data = await resend.emails.send({
      from: 'UGCHub <onboarding@resend.dev>', // Update this if you have a custom domain
      to,
      subject,
      html,
      text
    });
    return { success: true, ...data };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}

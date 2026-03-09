import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface LeadNotificationParams {
  ownerEmail: string;
  ownerName: string;
  senderName: string;
  senderEmail: string;
  message: string | null;
  budgetRange: string | null;
  portfolioUrl: string;
}

/** Send email notification to portfolio owner when a new lead is received. */
export async function sendLeadNotification(params: LeadNotificationParams) {
  if (!resend) return; // Graceful skip if RESEND_API_KEY not set (dev env)

  const from = process.env.RESEND_FROM ?? "OurFolio <noreply@ourfolio.com>";
  const name = escapeHtml(params.senderName);
  const email = escapeHtml(params.senderEmail);
  const owner = escapeHtml(params.ownerName);

  await resend.emails.send({
    from,
    to: params.ownerEmail,
    subject: `New lead from ${params.senderName}`,
    html: `
      <h2>New Lead Received</h2>
      <p>Hi ${owner},</p>
      <p><strong>${name}</strong> (${email}) sent you a message via your portfolio.</p>
      ${params.message ? `<blockquote>${escapeHtml(params.message)}</blockquote>` : ""}
      ${params.budgetRange ? `<p><strong>Budget:</strong> ${escapeHtml(params.budgetRange)}</p>` : ""}
      <p><a href="${escapeHtml(params.portfolioUrl)}">View your portfolio</a></p>
    `,
  });
}

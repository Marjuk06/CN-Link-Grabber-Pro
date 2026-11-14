/**
 * Marjuk Amin — Unified Cloudflare Mail Edge Service
 * 
 * Capabilities:
 * 1. INBOUND: Routes incoming domain emails (contact@marjukamin.com) directly to
 *    marjukamin2026@gmail.com AND dispatches a webhook to the Admin Control Plane.
 * 2. OUTBOUND API (fetch): Handles extension contact submissions 24/7 with zero local server.
 *    - Sends notification to contact@marjukamin.com (with reply-to set to user).
 *    - Sends signature "branded-dark" custom UI confirmation to the user from contact@marjukamin.com.
 *    - 100% professional: never exposes your private Gmail!
 */

export default {
  // ─── 1. INBOUND EMAIL ROUTER (Your existing Cloudflare routing) ───
  async email(message, env, ctx) {
    const backupEmail = "marjukamin2026@gmail.com";
    const controlPlaneWebhook = "https://cnadmindash.marjukamin.com/api/mail/webhook";

    // Direct forward to primary inbox so no email is ever missed
    try {
      await message.forward(backupEmail);
    } catch (err) {
      console.error("[Router] Gmail forwarding failed:", err);
    }

    // Parse headers and raw RFC MIME stream
    const subject = message.headers.get("subject") || "(No Subject)";
    const date = message.headers.get("date") || new Date().toISOString();
    const messageId = message.headers.get("message-id") || "";

    let rawMime = "";
    try {
      rawMime = await new Response(message.raw).text();
    } catch (err) {
      console.error("[Router] Failed reading MIME stream:", err);
    }

    // Forward real-time payload to Marjuk Amin Admin Control Plane
    try {
      await fetch(controlPlaneWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Source": "Cloudflare-Email-Worker"
        },
        body: JSON.stringify({
          from: message.from,
          to: message.to,
          subject,
          date,
          messageId,
          rawMime
        })
      });
    } catch (err) {
      console.error("[Router] Webhook dispatch failed:", err);
    }
  },

  // ─── 2. OUTBOUND API ENDPOINT (For Chrome Extension & Web) ───
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    try {
      const payload = await request.json();
      const {
        name = "Anonymous User",
        email = "",
        category = "New Feature Request",
        message = "",
        pageUrl = "Browser Extension",
        version = "4.0 Pro"
      } = payload;

      if (!message || !message.trim()) {
        return new Response(JSON.stringify({ error: "Message is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const devEmail = "contact@marjukamin.com";

      // ── HTML Template 1: Developer Notification ──
      const devHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; padding: 24px; color: #1e293b; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
          <div style="border-bottom: 2px solid #9b1136; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #9b1136; font-size: 20px;">New Extension Inquiry Received</h2>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Submitted via CN Link Grabber Pro</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 120px; font-weight: 600;">Sender Name:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Sender Email:</td>
              <td style="padding: 6px 0; color: #0f172a;">${email ? `<a href="mailto:${escapeHtml(email)}" style="color: #9b1136; font-weight: 600; text-decoration: none;">${escapeHtml(email)}</a>` : '<em style="color:#94a3b8;">Not provided</em>'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Category:</td>
              <td style="padding: 6px 0; color: #0f172a;"><span style="background: #f1f5f9; padding: 2px 8px; border-radius: 6px; font-weight: 600; font-size: 12px; border: 1px solid #cbd5e1;">${escapeHtml(category)}</span></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Page URL:</td>
              <td style="padding: 6px 0; color: #0f172a; word-break: break-all;"><a href="${escapeHtml(pageUrl)}" style="color: #2563eb; font-size: 12px;">${escapeHtml(pageUrl)}</a></td>
            </tr>
          </table>
          <div style="background: #f8fafc; border-left: 4px solid #9b1136; padding: 16px; border-radius: 4px; margin-top: 10px;">
            <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">Message Details:</h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
        </div>
      `;

      // ── HTML Template 2: Custom UI Confirmation to User ──
      const userConfirmationHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Inquiry Received — CN Link Grabber Pro</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0b0709; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #f5edef;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0b0709; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #160b11; border: 1px solid #3d1421; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);">
                  <tr>
                    <td style="height: 4px; background: linear-gradient(90deg, #9b1136, #e63963, #9b1136);"></td>
                  </tr>
                  <tr>
                    <td style="padding: 34px 32px 30px 32px; text-align: left;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; border-bottom: 1px solid #280d16; padding-bottom: 18px;">
                        <tr>
                          <td width="48" valign="middle">
                            <img src="https://www.marjukamin.com/logo_marjukamin_light.webp" alt="Marjuk Amin" width="46" height="46" style="display: block; width: 46px; height: 46px; border-radius: 12px; border: 1px solid #4a1727;" />
                          </td>
                          <td style="padding-left: 14px;" valign="middle">
                            <div style="margin-bottom: 4px;">
                              <span style="display: inline-block; padding: 2px 8px; border-radius: 6px; background-color: #2b0e1a; border: 1px solid #5a1c2e; color: #9b1136; font-size: 10px; font-weight: 700; font-family: monospace; letter-spacing: 1px;">
                                CN LINK GRABBER PRO • OFFICIAL SUPPORT
                              </span>
                            </div>
                            <div style="font-size: 15px; font-weight: 700; color: #ffffff; letter-spacing: -0.2px;">Marjuk Amin</div>
                            <div style="font-size: 11px; color: #a38d94; font-family: monospace;">DIGITAL ENCLAVE • ARCHITECTURE</div>
                          </td>
                        </tr>
                      </table>

                      <h1 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
                        Inquiry Received
                      </h1>
                      
                      <div style="font-size: 14px; color: #ded2d6; line-height: 1.7; word-break: break-word;">
                        <p style="margin: 0 0 16px 0;">Hi <strong>${escapeHtml(name)}</strong>,</p>
                        <p style="margin: 0 0 16px 0;">Thank you for reaching out! Your submission regarding <strong>${escapeHtml(category)}</strong> has been securely delivered directly to Marjuk Amin.</p>
                        
                        <div style="background-color: #220e19; border: 1px solid #4a1727; border-radius: 10px; padding: 16px; margin: 20px 0;">
                          <div style="font-size: 11px; font-weight: 700; color: #e63963; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Your Submission Details</div>
                          <div style="font-size: 12.5px; color: #a38d94; margin-bottom: 6px;"><strong>Category:</strong> <span style="color: #ffffff;">${escapeHtml(category)}</span></div>
                          ${pageUrl && pageUrl !== 'Browser Extension' && pageUrl !== 'Browser Tab' ? `<div style="font-size: 12.5px; color: #a38d94; margin-bottom: 6px; word-break: break-all;"><strong>Page:</strong> <a href="${escapeHtml(pageUrl)}" style="color: #e63963; text-decoration: none;">${escapeHtml(pageUrl)}</a></div>` : ''}
                          <div style="font-size: 11px; font-weight: 700; color: #e63963; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 10px; margin-bottom: 6px;">Message:</div>
                          <div style="font-size: 13.5px; color: #f5edef; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>
                        </div>

                        <p style="margin: 0 0 16px 0;">I personally review all feature suggestions and feedback to ensure CN Link Grabber Pro continues providing the best possible academic workflow. If your submission requires a follow-up, I will reach back out to this email address.</p>
                      </div>

                      <table role="presentation" align="left" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0 12px 0;">
                        <tr>
                          <td align="center" style="border-radius: 10px; background-color: #9b1136; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);">
                            <a href="https://marjukamin.com" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 13px; font-weight: 700; color: #ffffff; text-decoration: none; letter-spacing: 0.3px;">
                              Visit Developer Enclave &rarr;
                            </a>
                          </td>
                        </tr>
                      </table>
                      <div style="clear: both;"></div>

                      <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #280d16; font-size: 13px; color: #a38d94; line-height: 1.5;">
                        Warm regards,<br/>
                        <strong style="color: #ffffff;">Marjuk Amin</strong><br/>
                        <span style="font-size: 11px; color: #8a737b;">Software Developer • Creator of CN Link Grabber Pro</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 32px; background-color: #0e060a; border-top: 1px solid #290d16; text-align: center;">
                      <p style="margin: 0; font-size: 11px; color: #6a575f; font-family: monospace;">
                        MARJUK AMIN &bull; SYSTEMS & ARCHITECTURE &bull; <a href="https://marjukamin.com" style="color: #e63963; text-decoration: none;">marjukamin.com</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      // ── Dispatch Outbound Emails (Resend or MailChannels) ──
      const resendApiKey = env.RESEND_API_KEY;
      let deliveryResults = [];

      if (resendApiKey) {
        // Dispatches via Resend API (Strictly from contact@marjukamin.com)
        const sendViaResend = async (to, subject, html, replyTo) => {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
              from: "Marjuk Amin <contact@marjukamin.com>",
              to: [to],
              reply_to: replyTo,
              subject,
              html
            })
          });
          const data = await res.json().catch(() => ({}));
          return { to, status: res.status, ok: res.ok, data };
        };

        const resDev = await sendViaResend(devEmail, `[CN Link Grabber Pro] ${category} from ${name}`, devHtml, email || devEmail);
        deliveryResults.push(resDev);

        if (email && email.includes("@")) {
          const resUser = await sendViaResend(email, `We received your inquiry: ${category} — CN Link Grabber Pro`, userConfirmationHtml, devEmail);
          deliveryResults.push(resUser);
        }

      } else {
        // Dispatches via MailChannels (Free Cloudflare partner — zero API key required)
        const sendViaMailChannels = async (toEmail, toName, subject, html, replyTo) => {
          return fetch("https://api.mailchannels.net/tx/v1/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: toEmail, name: toName }] }],
              from: { email: "contact@marjukamin.com", name: "Marjuk Amin" },
              reply_to: { email: replyTo || "contact@marjukamin.com", name: name },
              subject,
              content: [{ type: "text/html", value: html }]
            })
          });
        };

        const promises = [
          sendViaMailChannels(devEmail, "Marjuk Amin", `[CN Link Grabber Pro] ${category} from ${name}`, devHtml, email || devEmail)
        ];

        if (email && email.includes("@")) {
          promises.push(
            sendViaMailChannels(email, name, "We received your inquiry — CN Link Grabber Pro", userConfirmationHtml, devEmail)
          );
        }

        await Promise.allSettled(promises);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: "Dispatched from contact@marjukamin.com",
        deliveryResults 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || "Dispatch failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

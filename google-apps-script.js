/**
 * CN Link Grabber Pro - Standalone Google Apps Script Mail Bridge
 * 
 * Instructions:
 * 1. Open https://script.google.com/ and create a "New Project".
 * 2. Paste this entire code into Code.gs and save.
 * 3. Click "Deploy" > "New deployment".
 * 4. Choose type: "Web app".
 * 5. Set "Execute as": "Me (your email)".
 * 6. Set "Who has access": "Anyone".
 * 7. Click "Deploy", copy the Web App URL, and paste it into background.js:
 *    const GOOGLE_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/.../exec";
 * 
 * Once deployed, emails will be delivered directly from your Google account with zero server required!
 */

function doPost(e) {
  try {
    var raw = e.postData.contents;
    var data = JSON.parse(raw);

    var name = data.name || "Anonymous User";
    var email = data.email || "";
    var category = data.category || "Inquiry";
    var message = data.message || "";
    var pageUrl = data.pageUrl || "";
    var version = data.version || "4.0 Pro";
    var devEmail = data.devEmail || "contact@marjukamin.com";

    // 1. Dispatch Notification Email directly to Marjuk Amin
    var devSubject = "[CN Link Grabber Pro] " + category + " from " + name;
    var devHtml = 
      '<div style="font-family: -apple-system, sans-serif; max-width: 600px; padding: 24px; color: #1e293b; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">' +
        '<div style="border-bottom: 2px solid #9b1136; padding-bottom: 12px; margin-bottom: 20px;">' +
          '<h2 style="margin: 0; color: #9b1136; font-size: 20px;">New Extension Inquiry Received</h2>' +
          '<p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Submitted via CN Link Grabber Pro Contact Modal</p>' +
        '</div>' +
        '<p><strong>Sender:</strong> ' + name + (email ? ' &lt;' + email + '&gt;' : '') + '</p>' +
        '<p><strong>Category:</strong> ' + category + '</p>' +
        '<p><strong>Page:</strong> <a href="' + pageUrl + '">' + pageUrl + '</a></p>' +
        '<div style="background: #f8fafc; border-left: 4px solid #9b1136; padding: 16px; border-radius: 4px; margin-top: 10px;">' +
          '<p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">' + message + '</p>' +
        '</div>' +
      '</div>';

    GmailApp.sendEmail(devEmail, devSubject, message, {
      htmlBody: devHtml,
      replyTo: email || devEmail,
      name: "CN Link Grabber Pro"
    });

    // 2. Dispatch Custom UI Confirmation Email to Sender (if valid email provided)
    if (email && email.indexOf("@") !== -1 && email.indexOf(".") !== -1) {
      var userSubject = "We received your inquiry — CN Link Grabber Pro";
      var userCustomHtml = 
        '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head><meta charset="UTF-8"><title>' + userSubject + '</title></head>' +
        '<body style="margin: 0; padding: 0; background-color: #0b0709; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; color: #f5edef;">' +
          '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0b0709; padding: 40px 15px;">' +
            '<tr><td align="center">' +
              '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #160b11; border: 1px solid #3d1421; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">' +
                '<tr><td style="height: 4px; background: linear-gradient(90deg, #9b1136, #e63963, #9b1136);"></td></tr>' +
                '<tr><td style="padding: 34px 32px 30px 32px; text-align: left;">' +
                  '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; border-bottom: 1px solid #280d16; padding-bottom: 18px;">' +
                    '<tr>' +
                      '<td width="48" valign="middle">' +
                        '<img src="https://www.marjukamin.com/logo_marjukamin_light.webp" alt="Marjuk Amin" width="46" height="46" style="display: block; width: 46px; height: 46px; border-radius: 12px; border: 1px solid #4a1727;" />' +
                      '</td>' +
                      '<td style="padding-left: 14px;" valign="middle">' +
                        '<div style="margin-bottom: 4px;">' +
                          '<span style="display: inline-block; padding: 2px 8px; border-radius: 6px; background-color: #2b0e1a; border: 1px solid #5a1c2e; color: #9b1136; font-size: 10px; font-weight: 700; font-family: monospace; letter-spacing: 1px;">' +
                            'CN LINK GRABBER PRO • OFFICIAL SUPPORT' +
                          '</span>' +
                        '</div>' +
                        '<div style="font-size: 15px; font-weight: 700; color: #ffffff; letter-spacing: -0.2px;">Marjuk Amin</div>' +
                        '<div style="font-size: 11px; color: #a38d94; font-family: monospace;">DIGITAL ENCLAVE • ARCHITECTURE</div>' +
                      '</td>' +
                    '</tr>' +
                  '</table>' +
                  '<h1 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">Inquiry Received</h1>' +
                  '<div style="font-size: 14px; color: #ded2d6; line-height: 1.7;">' +
                    '<p style="margin: 0 0 16px 0;">Hi <strong>' + name + '</strong>,</p>' +
                    '<p style="margin: 0 0 16px 0;">Thank you for reaching out! Your submission regarding <strong>' + category + '</strong> has been delivered directly to Marjuk Amin.</p>' +
                    '<div style="background-color: #220e19; border: 1px solid #4a1727; border-radius: 10px; padding: 16px; margin: 20px 0;">' +
                      '<div style="font-size: 11px; font-weight: 700; color: #e63963; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Message Summary</div>' +
                      '<div style="font-size: 13.5px; color: #f5edef; line-height: 1.6;">' + message.replace(/\n/g, '<br/>') + '</div>' +
                    '</div>' +
                    '<p style="margin: 0 0 16px 0;">I personally review all feature ideas and bug reports to make CN Link Grabber Pro the best academic tool possible. If a follow-up is needed, I will reply directly to this email.</p>' +
                  '</div>' +
                  '<table role="presentation" align="left" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0 12px 0;">' +
                    '<tr>' +
                      '<td align="center" style="border-radius: 10px; background-color: #9b1136; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);">' +
                        '<a href="https://marjukamin.com" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 13px; font-weight: 700; color: #ffffff; text-decoration: none; letter-spacing: 0.3px;">Visit Developer Enclave &rarr;</a>' +
                      '</td>' +
                    '</tr>' +
                  '</table>' +
                  '<div style="clear: both;"></div>' +
                  '<div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #280d16; font-size: 13px; color: #a38d94; line-height: 1.5;">' +
                    'Warm regards,<br/><strong style="color: #ffffff;">Marjuk Amin</strong><br/>' +
                    '<span style="font-size: 11px; color: #8a737b;">Software Developer • Creator of CN Link Grabber Pro</span>' +
                  '</div>' +
                '</td></tr>' +
                '<tr><td style="padding: 16px 32px; background-color: #0e060a; border-top: 1px solid #290d16; text-align: center;">' +
                  '<p style="margin: 0; font-size: 11px; color: #6a575f; font-family: monospace;">MARJUK AMIN &bull; SYSTEMS & ARCHITECTURE &bull; <a href="https://marjukamin.com" style="color: #e63963; text-decoration: none;">marjukamin.com</a></p>' +
                '</td></tr>' +
              '</table>' +
            '</td></tr>' +
          '</table>' +
        '</body>' +
        '</html>';

      GmailApp.sendEmail(email, userSubject, "Thank you! Your message regarding " + category + " has been received by Marjuk Amin.", {
        htmlBody: userCustomHtml,
        replyTo: devEmail,
        name: "Marjuk Amin"
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Inquiry and confirmation dispatched successfully" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

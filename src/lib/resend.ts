interface SendEmailParams {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactNotification({ name, email, subject, message }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || "sabazulfiqar926@gmail.com";

  const now = new Date().toISOString();

  if (!apiKey) {
    console.log(`[Email Notification Simulated] New contact form submission from ${name} (${email}) to ${recipient}:`, {
      subject: subject || "Portfolio Inbound Inquiry",
      message,
      dateTime: now,
    });
    return { success: true, simulated: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [recipient],
        reply_to: email,
        subject: `New portfolio message from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #4f46e5; margin-bottom: 16px;">New Message from Portfolio Website</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
            <p><strong>Date/Time:</strong> ${now}</p>
            <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #4f46e5;">
              <p style="white-space: pre-wrap; margin: 0; color: #334155;">${message}</p>
            </div>
            <p style="margin-top: 24px; font-size: 12px; color: #94a3b8;">Sent from Saba Zulfiqar's Full Stack Portfolio Website</p>
          </div>
        `,
        text: `New portfolio message from ${name}\n\nName: ${name}\nEmail: ${email}\n${subject ? `Subject: ${subject}\n` : ""}Date/Time: ${now}\n\nMessage:\n${message}`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Resend Error]", err);
      return { success: false, error: err };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("[Email Notification Exception]", error);
    return { success: false, error };
  }
}

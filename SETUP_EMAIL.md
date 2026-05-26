# Welcome-email setup (one-time, ~5 minutes, free)

The website already does **everything** — collects the email, validates it, shows the success dialog, and calls the send routine. The only thing software cannot do for you is **own your email account / secret key**. That single credential is unavoidable on any static site (GitHub Pages has no server to send mail). Below is the shortest real path.

> Until the 3 keys below are filled in, the signup form still works perfectly — it just shows the confirmation dialog without sending. Add the keys and real welcome emails start sending automatically. Nothing else to change.

## Steps

1. **Create a free EmailJS account** → <https://www.emailjs.com> (free tier covers normal volume).
2. **Add an email service** (Gmail/Outlook/etc.) → copy its **Service ID**.
3. **Create a template** → open `welcome-email.html` in this repo, copy all of it, and paste it as the template's HTML body.
   - Set the template "To email" field to `{{to_email}}`.
   - Subject: `Welcome to the journey ✦`
   - Copy the **Template ID**.
4. **Account → API keys** → copy your **Public Key**.
5. In **`script.js`**, fill the one config object (search for `const EMAILJS`):

   ```js
   const EMAILJS = {
     publicKey:  'YOUR_PUBLIC_KEY',
     serviceId:  'YOUR_SERVICE_ID',
     templateId: 'YOUR_TEMPLATE_ID'
   };
   ```
6. Commit & push. Done — every signup now receives the styled welcome email.

## Notes
- The EmailJS public key is *meant* to be public (client-side); it is rate-limited, not a secret password.
- `welcome-email.html` is a standalone, email-safe template (table layout, inline styles, web-safe fonts) — it also works in Mailchimp, Brevo, Buttondown, etc. if you prefer a full newsletter platform later.
- Want list management + automated welcome flows instead? Use **Buttondown** or **Brevo**: point the form `action` at their endpoint and paste `welcome-email.html` as the automation's welcome message. I can wire that on request.

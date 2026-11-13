# Licat contact form — Cloudflare native

The live site remains on GitHub Pages. This directory contains the small Cloudflare Worker used only for the contact form.

## Components

- `contact-worker.js`: validates fields and Cloudflare Turnstile, then sends via the native `EMAIL` binding to verified `licat233@gmail.com`.
- Form action: `https://contact-api.licat.xyz/submit`.
- Health check: `https://contact-api.licat.xyz/health`.
- Sender: `contact@licat.xyz`, with `Reply-To` set to the visitor's reply address.
- Error redirects back to the form; no false success response when email sending fails.

## Cloudflare configuration (not secrets in source control)

1. Configure the `licat.xyz` domain with Email Routing enabled and `licat233@gmail.com` as a verified destination.
2. Create a Cloudflare Worker named `licat-contact` using `contact-worker.js` as the module entry point.
3. Add a `send_email` binding named `EMAIL`, restricted to destination `licat233@gmail.com`.
4. Create a secret binding `TURNSTILE_SECRET` with the actual secret for site key `0x4AAAAAAF_iQKhRftrl-h0o`. Rotate the existing Turnstile widget secret in the Cloudflare dashboard if it is unavailable.
5. Attach custom domain `contact-api.licat.xyz` to the Worker.
6. Confirm the `/health` endpoint works, then submit a valid form with a real Turnstile token; confirm actual receipt in Gmail.
7. Only then merge the PR that changes the public contact form from FormSubmit to the Cloudflare endpoint.

No personal secrets or authorization tokens are stored here. Do not merge/deploy the frontend before verifying the endpoint, because an undeliverable form would mislead visitors.

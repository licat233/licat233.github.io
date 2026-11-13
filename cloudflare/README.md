# Licat contact form — Cloudflare native

The website remains a static Astro site on GitHub Pages. This folder contains the separate Cloudflare Worker for processing its contact form.

## Production configuration

- Worker: `licat-contact`
- Form action: `https://contact-api.licat.xyz/submit`
- Health check: `https://contact-api.licat.xyz/health`
- Sender: `contact@licat.xyz`
- Fixed recipient: `licat233@gmail.com` (verified Cloudflare destination)
- Email binding: `EMAIL` (`send_email`, limited to that verified recipient)
- Turnstile site key: `0x4AAAAAAF_iQKhRftrl-h0o` (public)
- Worker secret: `TURNSTILE_SECRET` (stored in Cloudflare, never in Git)
- Email Routing: `contact@licat.xyz` forwards incoming mail to the same Gmail inbox

## Request handling

The Worker checks the exact submission URL, method, origin, content type, input lengths, anti-bot honeypot and Turnstile token (server-side). It sends a plain text message through the native Cloudflare Email Service Workers binding and uses the visitor's email as `replyTo`. A successful API send redirects to `#contact-sent`; validation, Turnstile or sending errors redirect to `#contact-error`. The form is bilingual (Chinese and English).

## Verification completed, 2026-11-13

- Cloudflare reports the deployed Worker, required bindings and custom domain active.
- `GET /health` returned HTTP 200 from the deployed Worker on the custom domain.
- Unauthorized POST (missing Origin) returned HTTP 403.
- POST with valid origin but no Turnstile token returned HTTP 303 to `#contact-error`.
- Cloudflare native Email Sending REST check using `contact@licat.xyz` reported delivered to `licat233@gmail.com`, and the test message was found in Gmail.
- A complete browser submission with a live Turnstile token still needs a manual production smoke test after the frontend is published.

## Maintenance

Edit `contact-worker.js` and redeploy only this Worker. Keep the Turnstile secret in Cloudflare. Never store credentials, secret keys or individual visitor messages in this repository. FormSubmit is not needed for the Cloudflare-backed form.

// Cloudflare Worker for the static licat.xyz contact form.
// Requires EMAIL (send_email to a verified address) and TURNSTILE_SECRET (secret_text).
const HOME = "https://licat.xyz/";
const EMAIL_TO = "licat233@gmail.com";
const EMAIL_FROM = "contact@licat.xyz";
const permittedOrigins = new Set(["https://licat.xyz", "https://www.licat.xyz"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function go(lang, status) {
  const base = lang === "en" ? "https://licat.xyz/en/" : HOME;
  return Response.redirect(base + "#contact-" + status, 303);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/health" && request.method === "GET") {
      return Response.json({ status: "ok", service: "licat-contact" });
    }
    if (url.pathname !== "/submit" || request.method !== "POST") {
      return new Response("Not Found", { status: 404 });
    }

    const origin = request.headers.get("Origin");
    if (!origin || !permittedOrigins.has(origin)) {
      return new Response("Forbidden", { status: 403 });
    }
    const type = request.headers.get("content-type") || "";
    if (!type.startsWith("application/x-www-form-urlencoded") &&
        !type.startsWith("multipart/form-data")) {
      return new Response("Unsupported media type", { status: 415 });
    }
    const size = Number(request.headers.get("content-length") || 0);
    if (size > 20000) return new Response("Request too large", { status: 413 });

    let data;
    try { data = await request.formData(); } catch {
      return new Response("Invalid form", { status: 400 });
    }
    const lang = data.get("lang") === "en" ? "en" : "zh";
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const token = String(data.get("cf-turnstile-response") || "");
    if (data.get("website")) return go(lang, "sent");
    if (name.length < 1 || name.length > 100 ||
        email.length > 254 || !emailPattern.test(email) ||
        message.length < 5 || message.length > 5000 ||
        token.length < 10 || token.length > 2048) {
      return go(lang, "error");
    }

    let checked;
    try {
      const body = new FormData();
      body.set("secret", env.TURNSTILE_SECRET);
      body.set("response", token);
      body.set("remoteip", request.headers.get("CF-Connecting-IP") || "");
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST", body
      });
      checked = verify.ok && (await verify.json()).success === true;
    } catch { checked = false; }
    if (!checked) return go(lang, "error");

    try {
      await env.EMAIL.send({
        from: EMAIL_FROM,
        to: EMAIL_TO,
        replyTo: email,
        subject: "Licat.xyz | New contact message",
        text: [
          "A new contact message was submitted on licat.xyz.",
          "Name: " + name,
          "Reply email: " + email,
          "Language: " + lang,
          "",
          "Message:",
          message
        ].join("\n")
      });
      return go(lang, "sent");
    } catch (err) {
      console.error("Contact email delivery failed", err?.code || "unknown");
      return go(lang, "error");
    }
  }
};

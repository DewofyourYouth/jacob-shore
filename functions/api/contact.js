const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://jacob-shore.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message) {
    return json({ ok: false, error: "All fields are required." }, 422);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "Invalid email address." }, 422);
  }

  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return json({ ok: false, error: "Server configuration error." }, 500);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "contact@jacob-shore.com",
      to: "jacobshore@gmail.com",
      reply_to: email,
      subject: `Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${esc(name)}</p>
<p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
<hr>
<p>${esc(message).replace(/\n/g, "<br>")}</p>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Resend error", res.status, detail);
    return json(
      { ok: false, error: "Failed to send email. Please try again." },
      502,
    );
  }

  return json({ ok: true });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function esc(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

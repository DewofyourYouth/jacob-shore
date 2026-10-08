const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://jacob-shore.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const BREVO_API = "https://api.brevo.com/v3";

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/*
 * Mailing-list signup → Brevo.
 *
 * Env vars (Cloudflare dashboard):
 *   BREVO_API_KEY           required
 *   BREVO_LIST_IDS          required; comma-separated Brevo list ids the form may
 *                           subscribe to. The first is the default when the form
 *                           sends none. Ids in params.newsletter.topics must be here.
 *   BREVO_DOI_TEMPLATE_ID   optional; when set, uses Brevo double opt-in with this
 *                           template (must contain the {{ doubleoptin }} link)
 *   BREVO_DOI_REDIRECT_URL  optional; where the confirm link lands
 *                           (default https://jacob-shore.com/subscribed/)
 *   TURNSTILE_SECRET_KEY    shared with the contact form
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const email = (body.email || "").trim().toLowerCase();
  const turnstileToken = (body.turnstileToken || "").trim();
  const source = String(body.source || "").slice(0, 40);

  // Honeypot filled in → pretend success so bots don't retry.
  if (body.company) {
    return json({ ok: true });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return json({ ok: false, error: "Invalid email address." }, 422);
  }

  if (!turnstileToken) {
    return json({ ok: false, error: "CAPTCHA token missing." }, 422);
  }

  const tsRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip: request.headers.get("CF-Connecting-IP"),
      }),
    },
  );
  const tsData = await tsRes.json();
  if (!tsData.success) {
    return json(
      { ok: false, error: "CAPTCHA verification failed. Please try again." },
      422,
    );
  }

  const allowed = (env.BREVO_LIST_IDS || "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n) && n > 0);

  if (!env.BREVO_API_KEY || !allowed.length) {
    console.error("BREVO_API_KEY or BREVO_LIST_IDS is not set");
    return json({ ok: false, error: "Server configuration error." }, 500);
  }

  const requested = Array.isArray(body.lists) ? body.lists.map(Number) : [];
  const listIds = requested.length
    ? [...new Set(requested.filter((id) => allowed.includes(id)))]
    : [allowed[0]];
  if (!listIds.length) {
    return json({ ok: false, error: "Unknown mailing list." }, 422);
  }

  const doiTemplate = Number(env.BREVO_DOI_TEMPLATE_ID);
  const useDoi = Number.isInteger(doiTemplate) && doiTemplate > 0;

  const res = useDoi
    ? await brevo(env, "/contacts/doubleOptinConfirmation", {
        email,
        includeListIds: listIds,
        templateId: doiTemplate,
        redirectionUrl:
          env.BREVO_DOI_REDIRECT_URL || "https://jacob-shore.com/subscribed/",
      })
    : await brevo(env, "/contacts", {
        email,
        listIds,
        updateEnabled: true,
      });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Brevo error", res.status, source, detail);
    return json(
      { ok: false, error: "Couldn't subscribe you right now. Please try again." },
      502,
    );
  }

  return json({
    ok: true,
    doubleOptIn: useDoi,
    message: useDoi
      ? "Almost there — check your inbox to confirm your subscription."
      : "You're on the list — thanks!",
  });
}

function brevo(env, path, payload) {
  return fetch(`${BREVO_API}${path}`, {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

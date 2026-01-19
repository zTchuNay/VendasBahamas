export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ ok: false, error: "Missing DISCORD_WEBHOOK_URL" });
  }

  // (opcional) trava básica por origem (ajuda contra abuso via browser)
  const origin = req.headers.origin || "";
  const allowedOrigin = "https://vendas-bahamas.vercel.app";
  if (origin && origin !== allowedOrigin) {
    return res.status(403).json({ ok: false, error: "Forbidden origin" });
  }

  const { content } = req.body || {};
  if (!content || typeof content !== "string") {
    return res.status(400).json({ ok: false, error: "Missing content" });
  }

  // Envia ao Discord
  const r = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!r.ok) {
    const details = await r.text();
    return res.status(500).json({ ok: false, error: "Discord error", details });
  }

  return res.status(200).json({ ok: true });
}

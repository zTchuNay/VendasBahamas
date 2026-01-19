export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const secret = req.headers["x-panel-secret"];
  if (process.env.PANEL_SECRET && secret !== process.env.PANEL_SECRET) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return res.status(500).json({ ok: false, error: "Missing DISCORD_WEBHOOK_URL" });

  const { content } = req.body || {};
  if (!content) return res.status(400).json({ ok: false, error: "Missing content" });

  // Envia a mensagem para o Discord Webhook
  const r = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });

  if (!r.ok) {
    const text = await r.text();
    return res.status(500).json({ ok: false, error: "Discord error", details: text });
  }

  return res.status(200).json({ ok: true });
}

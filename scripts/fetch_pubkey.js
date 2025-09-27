/**
 * Day 17 — Fetch FHE network public key and save to .env (CommonJS version)
 * Usage:
 *   GATEWAY_URL=https://<host> node scripts/fetch_pubkey.js
 */
const fs = require("node:fs");

const gw = (process.env.GATEWAY_URL || "").replace(/\/+$/, "");
if (!gw) {
  console.error("Set GATEWAY_URL, e.g. GATEWAY_URL=https://<gateway-host>/");
  process.exit(1);
}

const candidates = [
  `${gw}/network/public-key`,
  `${gw}/public-key`,
  `${gw}/api/v1/network/public-key`,
];

function extractKey(obj) {
  if (!obj || typeof obj !== "object") return null;
  return (
    obj.publicKey ||
    obj.pubkey ||
    obj.fhePublicKey ||
    (obj.data && (obj.data.publicKey || obj.data.pubkey)) ||
    null
  );
}

(async () => {
  for (const url of candidates) {
    try {
      console.log("→ GET", url);
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`  ! HTTP ${res.status}`);
        continue;
      }
      const bodyText = await res.text();
      let body = {};
      try { body = JSON.parse(bodyText); } catch { /* non-JSON? */ }

      const key = extractKey(body) || (typeof bodyText === "string" && bodyText.trim());
      if (!key || typeof key !== "string") {
        console.warn("  ! No key in response:", bodyText.slice(0, 200));
        continue;
      }

      const line = `FHE_NETWORK_PUBKEY=${key}\n`;
      let env = "";
      try { env = fs.readFileSync(".env", "utf8"); } catch {}
      const has = /^FHE_NETWORK_PUBKEY=/m.test(env);
      const next = has ? env.replace(/^FHE_NETWORK_PUBKEY=.*$/m, line.trim()) + "\n" : env + line;

      fs.writeFileSync(".env", next);
      console.log("✓ Saved FHE_NETWORK_PUBKEY to .env");
      process.exit(0);
    } catch (e) {
      console.warn("  ! fetch failed:", e.message);
    }
  }

  console.error("✗ Could not fetch a pubkey. Check GATEWAY_URL or endpoint paths.");
  process.exit(1);
})();

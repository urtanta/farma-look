import * as cheerio from "cheerio";

const SOURCE_URL = "https://cofalava.org/farmacias-de-guardia/";

export async function scrapeAlavaGuardias() {
  const response = await fetch(SOURCE_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 FarmaLookBot/1.0",
      "Accept": "text/html"
    }
  });

  if (!response.ok) {
    throw new Error(`Error descargando COF Álava: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const results = [];

  $("a[href*='farmacias_y_servicio']").each((_, el) => {
    const link = $(el);
    const card = link.closest("article, li, .card, .elementor-post, .jet-listing-grid__item, div");

    const text = clean(card.text());
    const name = clean(link.text());

    if (!name) return;

    results.push({
      name,
      address: extractAddress(text),
      phone: extractPhone(text),
      city: "Vitoria-Gasteiz",
      city_slug: "vitoria",
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      source: SOURCE_URL
    });
  });

  return deduplicate(results);
}

function clean(value) {
  return (value || "")
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
}

function extractPhone(text) {
  const match = text.match(/(?:\+34\s*)?[6789]\d{2}\s?\d{2}\s?\d{2}\s?\d{2}/);
  return match ? match[0] : null;
}

function extractAddress(text) {
  const patterns = [
    /(C\/[^,]+(?:,\s*\d+)?)/i,
    /(CALLE\s+[^,]+(?:,\s*\d+)?)/i,
    /(AVDA?\.?\s+[^,]+(?:,\s*\d+)?)/i,
    /(PLAZA\s+[^,]+(?:,\s*\d+)?)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return clean(match[0]);
  }

  return null;
}

function deduplicate(items) {
  const seen = new Set();

  return items.filter(item => {
    const key = `${item.name}-${item.address}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

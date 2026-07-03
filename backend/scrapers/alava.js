import * as cheerio from "cheerio";

const SOURCE_URL = "https://cofalava.org/farmacias-de-guardia/";

export async function scrapeAlavaGuardias() {
  const response = await fetch(SOURCE_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 FarmaLookBot/1.0",
      "Accept": "text/html"
    }
  });

  const html = await response.text();
  const $ = cheerio.load(html);

  const links = $("a").map((_, el) => ({
    text: $(el).text().trim(),
    href: $(el).attr("href")
  })).get();

  const farmacias = links
    .filter(link => link.href && link.href.includes("farmacias_y_servicio"))
    .map(link => ({
      name: link.text || "Farmacia sin nombre",
      address: "Dirección pendiente",
      phone: null,
      city: "Vitoria-Gasteiz",
      city_slug: "vitoria",
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      source: SOURCE_URL
    }));

  console.log("TOTAL LINKS:", links.length);
  console.log("FARMACIAS:", farmacias.length);
  console.log("PRIMEROS LINKS:", links.slice(0, 10));

  return farmacias;
}

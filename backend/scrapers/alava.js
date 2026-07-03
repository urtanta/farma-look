import * as cheerio from "cheerio";

const SOURCE_URL = "https://cofalava.org/farmacias-de-guardia/";

export async function scrapeAlavaGuardias() {
  const response = await fetch(SOURCE_URL);
  const html = await response.text();
  const $ = cheerio.load(html);

  const farmacias = [];

  $("a[href*='farmacias_y_servicio']").each((_, el) => {
    const name = $(el).text().trim();
    const text = $(el).closest("div").text().replace(/\s+/g, " ").trim();

    if (name) {
      farmacias.push({
        name,
        address: text,
        phone: null,
        city: "Vitoria-Gasteiz",
        city_slug: "vitoria",
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        source: SOURCE_URL
      });
    }
  });

  return farmacias;
}

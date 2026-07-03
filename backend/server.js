import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { supabase } from "./db/supabase.js";
import { scrapeAlavaGuardias } from "./scrapers/alava.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "farma-look" });
});

app.get("/api/guardias", async (req, res) => {
  const city = req.query.city || "vitoria";

  const { data: shifts, error: shiftsError } = await supabase
    .from("duty_shifts")
    .select("*")
    .eq("city_slug", city)
    .order("starts_at", { ascending: true });

  if (shiftsError) {
    return res.status(500).json({ error: shiftsError.message, details: shiftsError });
  }

  if (!shifts.length) return res.json([]);

  const ids = shifts.map(s => s.pharmacy_id);

  const { data: pharmacies, error: pharmaciesError } = await supabase
    .from("pharmacies")
    .select("*")
    .in("id", ids);

  if (pharmaciesError) {
    return res.status(500).json({ error: pharmaciesError.message, details: pharmaciesError });
  }

  const resultado = shifts.map(shift => ({
    ...shift,
    pharmacies: pharmacies.find(p => p.id === shift.pharmacy_id)
  }));

  res.json(resultado);
});

app.get("/api/demo-data", async (req, res) => {
  if (req.query.secret !== process.env.SCRAPER_SECRET) {
    return res.status(401).json({ error: "No autorizado" });
  }

  let { data: farmacia } = await supabase
    .from("pharmacies")
    .select("*")
    .eq("name", "Farmacia Demo Vitoria")
    .maybeSingle();

  if (!farmacia) {
    const { data, error } = await supabase
      .from("pharmacies")
      .insert({
        name: "Farmacia Demo Vitoria",
        address: "Calle Dato 1",
        phone: "945000000",
        city: "Vitoria-Gasteiz",
        city_slug: "vitoria"
      })
      .select()
      .single();

    if (error) return res.status(500).json(error);
    farmacia = data;
  }

  await supabase.from("duty_shifts").delete().eq("city_slug", "vitoria");

  const { error } = await supabase.from("duty_shifts").insert({
    pharmacy_id: farmacia.id,
    city_slug: "vitoria",
    starts_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    source: "demo"
  });

  if (error) return res.status(500).json(error);

  res.json({ ok: true });
});

app.get("/api/scrape/alava", async (req, res) => {
  if (req.query.secret !== process.env.SCRAPER_SECRET) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const farmacias = await scrapeAlavaGuardias();

    await supabase.from("duty_shifts").delete().eq("city_slug", "vitoria");

    for (const item of farmacias) {
      const { data: farmacia, error: farmaciaError } = await supabase
        .from("pharmacies")
        .insert({
          name: item.name,
          address: item.address,
          phone: item.phone,
          city: item.city,
          city_slug: item.city_slug
        })
        .select()
        .single();

      if (farmaciaError) continue;

      await supabase.from("duty_shifts").insert({
        pharmacy_id: farmacia.id,
        city_slug: "vitoria",
        starts_at: item.starts_at,
        ends_at: item.ends_at,
        source: item.source
      });
    }

    res.json({
      ok: true,
      total: farmacias.length
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});

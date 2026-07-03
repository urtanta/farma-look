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
  res.json({
    ok: true,
    app: "farma-look"
  });
});

app.get("/api/guardias", async (req, res) => {

  const city = req.query.city || "vitoria";

  const { data: shifts, error: shiftsError } = await supabase
    .from("duty_shifts")
    .select("*")
    .eq("city_slug", city);

  if (shiftsError) {
    return res.status(500).json({
      error: shiftsError.message,
      details: shiftsError
    });
  }

  if (!shifts.length) {
    return res.json([]);
  }

  const ids = shifts.map(s => s.pharmacy_id);

  const { data: pharmacies, error: pharmaciesError } = await supabase
    .from("pharmacies")
    .select("*")
    .in("id", ids);

  if (pharmaciesError) {
    return res.status(500).json({
      error: pharmaciesError.message,
      details: pharmaciesError
    });
  }

  const resultado = shifts.map(shift => {

    const farmacia = pharmacies.find(
      p => p.id === shift.pharmacy_id
    );

    return {
      ...shift,
      pharmacies: farmacia
    };

  });

  res.json(resultado);

});


app.get("/api/demo-data", async (req, res) => {

  if (req.query.secret !== process.env.SCRAPER_SECRET) {
    return res.status(401).json({
      error: "No autorizado"
    });
  }

  // Buscar farmacia existente
  let { data: farmacia } = await supabase
    .from("pharmacies")
    .select("*")
    .eq("name", "Farmacia Demo Vitoria")
    .maybeSingle();

  // Si no existe la crea
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

    if (error) {
      return res.status(500).json(error);
    }

    farmacia = data;
  }

  // Eliminar guardias demo anteriores
  await supabase
    .from("duty_shifts")
    .delete()
    .eq("city_slug", "vitoria");

  // Crear nueva guardia
  const { error } = await supabase
    .from("duty_shifts")
    .insert({

      pharmacy_id: farmacia.id,
      city_slug: "vitoria",

      starts_at: new Date().toISOString(),

      ends_at: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString(),

      source: "demo"

    });

  if (error) {
    return res.status(500).json(error);
  }

  res.json({
    ok: true
  });

});

app.listen(PORT, () => {

  console.log(`Servidor funcionando en puerto ${PORT}`);

});

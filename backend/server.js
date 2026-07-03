import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { supabase } from "./db/supabase.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/guardias", async (req, res) => {
  const city = req.query.city || "vitoria";

  const { data: shifts, error: shiftsError } = await supabase
    .from("duty_shifts")
    .select("id, pharmacy_id, starts_at, ends_at, source, city_slug")
    .eq("city_slug", city)
    .order("starts_at", { ascending: true });

  if (shiftsError) {
    return res.status(500).json({
      error: shiftsError.message,
      details: shiftsError
    });
  }

  if (!shifts || shifts.length === 0) {
    return res.json([]);
  }

  const pharmacyIds = shifts.map(s => s.pharmacy_id);

  const { data: pharmacies, error: pharmaciesError } = await supabase
    .from("pharmacies")
    .select("id, name, address, phone, city")
    .in("id", pharmacyIds);

  if (pharmaciesError) {
    return res.status(500).json({
      error: pharmaciesError.message,
      details: pharmaciesError
    });
  }

  const result = shifts.map(shift => ({
    ...shift,
    pharmacies: pharmacies.find(p => p.id === shift.pharmacy_id) || null
  }));

  res.json(result);
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
});

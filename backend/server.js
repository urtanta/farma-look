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

  const { data, error } = await supabase
    .from("duty_shifts")
    .select(`
      id,
      starts_at,
      ends_at,
      source,
      pharmacies:pharmacy_id (
        id,
        name,
        address,
        phone,
        city
      )
    `)
    .eq("city_slug", city)
    .order("starts_at", { ascending: true });

  if (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
      details: error
    });
  }

  res.json(data || []);
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
});

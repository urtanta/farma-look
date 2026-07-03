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
            starts_at,
            ends_at,
            pharmacies(
                name,
                address,
                phone
            )
        `);

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);

});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
});

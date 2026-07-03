// Routes for pharmacy guardias (on-duty pharmacies)
const express = require('express');
const router = express.Router();
const pharmacyService = require('../services/pharmacyService');

router.get('/guardias', async (req, res) => {
    try {
        const guardias = await pharmacyService.getGuardias();
        res.json(guardias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/guardias/:province', async (req, res) => {
    try {
        const guardias = await pharmacyService.getGuardiasByProvince(req.params.province);
        res.json(guardias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
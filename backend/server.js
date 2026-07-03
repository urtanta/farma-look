// Backend server entry point
const express = require('express');
const config = require('./config');
const guardiasRoutes = require('./routes/guardias');

const app = express();

app.use(express.json());
app.use('/api', guardiasRoutes);

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});

module.exports = app;
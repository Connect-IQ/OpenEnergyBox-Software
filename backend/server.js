// server.js
const Fastify = require('fastify');
const modbusRoutes = require('./routes/modbusRoutes');
const configRoutes = require('./routes/configRoutes');
const path = require('path');
const { InfluxDB } = require('@influxdata/influxdb-client');
const config = require('./config/config.json');
const {startModbusMetricsCollection} = require("./modbusCollector.js");
const {loginAndScrape} = require("./controllers/scraperController.js");
// Create a Fastify instance
const fastify = Fastify({ logger: true });

// Register Fastify CORS
fastify.register(require('@fastify/cors'));

// Register routes
fastify.register(modbusRoutes);
fastify.register(configRoutes);

// Create InfluxDB client using the config file
const influxDB = new InfluxDB({
    url: config.influxdb.url,
    transportOptions: {
        headers: { "Authorization": `Basic ${Buffer.from(`${config.influxdb.username}:${config.influxdb.password}`).toString('base64')}` }
    }
});

// Serve static frontend files (if needed)
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
});

startModbusMetricsCollection(influxDB);


// Start the Fastify server
const PORT = process.env.PORT || 3000;
fastify.listen(PORT, '0.0.0.0', (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server running at ${address}`);
});

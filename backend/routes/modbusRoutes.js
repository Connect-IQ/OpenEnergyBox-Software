// routes/modbusRoutes.js
const modbusController = require('../controllers/modbusController');

async function modbusRoutes(fastify, options) {
    // Route to read Modbus data
    fastify.get('/api/energy', async (request, reply) => {
        try {
            const data = await modbusController.readModbusRegisters();
            return reply.send({ data });
        } catch (err) {
            return reply.status(500).send({ error: 'Error reading Modbus data' });
        }
    });

}

module.exports = modbusRoutes;

const configController = require('../controllers/configController');

async function configRoutes(fastify, options) {


    // Route to update the configuration file
    fastify.post('/api/config', async (request, reply) => {
        try {
            configController.updateConfig(request.body);
            return reply.send({ message: 'Configuration updated successfully' });
        } catch (err) {
            return reply.status(500).send({ error: 'Error updating config file' });
        }
    });

    // Route to update the configuration file
    fastify.get('/api/config', async (request, reply) => {
        try {

            return reply.send({ payload: configController.getConfig(request.body) });
        } catch (err) {
            return reply.status(500).send({ error: 'Error updating config file' });
        }
    });
}

module.exports = configRoutes;

import Fastify from 'fastify'
import routes from './routes.js'
import {ADD_POST} from './schemes.js'

const fastify = Fastify({
    logger: true,
    ajv: {
        customOptions: {
            removeAdditional: true,
            useDefaults: true,
            coerceTypes: true,
            allErrors: true
        }
    }
});

fastify.register(routes)
fastify.addSchema(ADD_POST)

fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
});

fastify.listen({ port: 3001 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
});
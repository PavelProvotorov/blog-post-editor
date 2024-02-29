import Fastify from 'fastify'
import routes from './routes.js'
import {addPostScheme} from './schemes.js'

const fastify = Fastify({
    logger: true
})

fastify.register(routes)
fastify.addSchema(addPostScheme)

fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
})

fastify.listen({ port: 3001 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
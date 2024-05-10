import { fastify } from "./app.js";

fastify.listen({ port: process.env.PORT}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
});
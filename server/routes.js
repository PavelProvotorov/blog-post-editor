import {getAllPosts, addNewPost} from './database.js'

async function app_routes (fastify, options) {
    fastify.get("/api/posts", {
        schema: {},
        attachValidation: false,
        handler: async function(request, reply) {
            reply.type('application/json')
            try {
                let data = await getAllPosts()
                return reply.status(200).send({
                    data
                });
            } catch (err) {
                return reply.status(500).send({
                    error: "Internal server error"
                })
            }
        }
    });

    fastify.post("/api/createPost", {
        schema: {
            body: { $ref: 'add_post#'}
        },
        attachValidation: true,
        handler: async function(request, reply) {
            reply.type('application/json')
            try {
                if (request.validationError) {
                    console.error(request.validationError)
                    return reply.code(400).send({
                        error: "Invalid JSON payload"
                    })
                }
                await addNewPost(request.body)
                return reply.status(200).send({
                    message: "New post created"
                });
            } catch (err) {
                return reply.status(500).send({
                    error: "Internal server error"
                })
            }
        }
    })};

async function path_routes(fastify, options) {
    fastify.get('/', {
        prefixTrailingSlash: "no-slash",
        preHandler: fastify.verifyCredentials
    },
        async function (request, reply) {
            return reply.redirect('/app');;
        });

    fastify.get('/app', {
        prefixTrailingSlash: "no-slash",
        preHandler: fastify.verifyCredentials
    },
        async function (request, reply) {
            let data = await getAllPosts()
            return reply.view("/layouts/index.hbs", { data })
        });

    fastify.get('/login', {
        prefixTrailingSlash: "no-slash",
    },
        async function (request, reply) {
            return reply.view("/layouts/login.hbs", {})
        });

    fastify.get('/app/create', {
        prefixTrailingSlash: "no-slash",
        preHandler: fastify.verifyCredentials
    },
        async function (request, reply) {
            return reply.view("/layouts/create.hbs", {})
        });
}

export {
    app_routes,
    path_routes
};
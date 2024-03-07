import {getAllPosts, addNewPost} from './database.js'

async function routes (fastify, options) {
    fastify.route({
        method: "GET",
        url: "/api/posts",
        schema: {
        },
        attachValidation: false,
        handler: async function(req, res) {
            res.type('application/json')
            try {
                let data = await getAllPosts()
                return res.status(200).send({
                    data
                });
            } catch (err) {
                return res.status(500).send({
                    error: "Internal server error"
                })
            }
        }
    });

    fastify.route({
        method: "POST",
        url: "/api/posts",
        schema: {
            body: { $ref: 'add_post#'}
        },
        attachValidation: true,
        handler: async function(req, res) {
            res.type('application/json')
            try {
                if (req.validationError) {
                    console.error(req.validationError)
                    return res.code(400).send({
                        error: "Invalid JSON payload"
                    })
                }
                await addNewPost(req.body)
                return res.status(200).send({
                    message: "New post created"
                });
            } catch (err) {
                return res.status(500).send({
                    error: "Internal server error"
                })
            }
        }
    });
};

export default routes
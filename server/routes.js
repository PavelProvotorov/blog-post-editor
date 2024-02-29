import {getAllPostEntries, addNewPostEntry} from './database.js'

async function routes (fastify, options) {
    fastify.route({
        method: "POST",
        url: "/api/posts",
        schema: {
            body: { $ref: 'example#'}
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
                await addNewPostEntry(req.body)
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
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
            try {
                if (req.validationError) {
                    // console.log(req.validationError)
                    return res.code(400)
                    .send({
                        message: req.validationError.message
                    })
                }
                await addNewPostEntry(req.body)
                res.type('application/json').status(200)
                .send({
                    message: "New post created!"
                });
            } catch (err) {
                res.status(500).send({
                    error: "Internal server error"
                })
            }
        }
    });
};

export default routes
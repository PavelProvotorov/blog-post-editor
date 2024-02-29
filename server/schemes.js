const ADD_POST = {
    $id: "add_post",
    type: "object",
    properties: {
        "title": { 
            type: "string", 
            minLength: 1,
            pattern: "^.*\\S.*$"
        },
        "content": { 
            type: 'string',
            minLength: 1,
            pattern: "^.*\\S.*$"
        },
    },
    required: [
        "title",
        "content"
    ],
    additionalProperties: false,
};

export {
    ADD_POST
}
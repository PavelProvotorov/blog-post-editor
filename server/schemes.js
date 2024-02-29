const addPostScheme = {
    $id: "example",
    type: 'object',
    properties: {
        "title": { 
            type: 'string', 
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

};

export {
    addPostScheme
}
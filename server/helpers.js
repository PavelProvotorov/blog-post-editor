Handlebars.registerHelper('ellipsis', function (text, start, end) {
    return text.slice(start, end) + "..."
})
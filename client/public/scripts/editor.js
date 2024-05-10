function initializeEditor() {
    var editor = new EditorJS({
        onReady: () => {
            console.log('Editor.js is ready to work!')
        }
    });
};

function preHandleEditor() {
    if (window.location.pathname === '/app/create') {
        initializeEditor();
    };
};

document.addEventListener('DOMContentLoaded', (event) => {
    preHandleEditor()
});

document.addEventListener('htmx:afterSwap', (event) => {
    preHandleEditor()
});
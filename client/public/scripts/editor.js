const SAVE_BUTTON = document.getElementById("ce-button_save")
const CANCEL_BUTTON = document.getElementById("ce-button_cancel")

function initializeEditor() {
    editor = new EditorJS({
        autofocus: false,
        placeholder: 'Let`s write a lovely poem!',
        onReady: () => {
            console.log('Editor.js initialized')
        }
    });
};

function preHandleEditor() {
    if (window.location.pathname === '/app/create') {
        initializeEditor();
    };
};

async function editorOutput() {
    try {
        return editor.save()
    } catch (error) {
        return error
    };
};

document.addEventListener('DOMContentLoaded', (event) => {
    preHandleEditor()
});

document.addEventListener('htmx:afterSwap', (event) => {
    preHandleEditor()
});

SAVE_BUTTON.addEventListener("click", async (event) => {
    try {
        const data = await editorOutput()
        axios.post('/api/createPost', {
            title: document.getElementById("ce-title").textContent,
            content: JSON.stringify(data.blocks),
            timestamp: data.time
        });
    } catch (error) {
        console.error(error)
    };
});

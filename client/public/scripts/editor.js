(() => {
    const SAVE_BUTTON = document.getElementById("ce-button_save")
    const CANCEL_BUTTON = document.getElementById("ce-button_cancel")
    let editor_output = null
    
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
    
    async function getEditorOutput() {
        try {
            editor_output = await editor.save()
            return editor_output
        } catch (error) {
            console.error(error)
        };
    };
    
    function setEvents() {
        htmx.on('#ce-button_save', 'htmx:confirm', async (event) => {
            event.preventDefault()
            try {
                await getEditorOutput()
                event.detail.issueRequest()
            } catch (error) {
                console.error(error)
            }
        });
    
        htmx.on('#ce-button_save', 'htmx:configRequest', async (event) => {
            event.detail.parameters = {
                title: document.getElementById("ce-title").textContent,
                content: JSON.stringify(editor_output.blocks),
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function() {
        preHandleEditor()
        setEvents()
    });

})();

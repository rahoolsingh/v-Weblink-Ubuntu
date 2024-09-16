const { ipcRenderer } = require('electron');

async function createShortcut() {
    const name = document.getElementById('websiteName').value;
    const url = document.getElementById('websiteUrl').value;
    
    if (!name || !url) {
        document.getElementById('message').innerText = "Please fill out both fields.";
        return;
    }

    const result = await ipcRenderer.invoke('create-shortcut', { name, url });
    document.getElementById('message').innerText = result;
}

import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import os from "os";
import fs from "fs";
import { ipcMain } from "electron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 300,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true, // Consider disabling in production for security reasons
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("create-shortcut", async (event, data) => {
    try {
        const desktopDir = path.join(os.homedir(), "Desktop");
        const shortcutPath = path.join(desktopDir, `${data.name}.html`);

        const shortcutContent = `
<html>
<head>
<meta http-equiv="refresh" content="0; url=${data.url}">
</head>
<body>
</body>
</html>
`;

        // create shortcut file
        fs.writeFileSync(shortcutPath, shortcutContent);
        fs.chmodSync(shortcutPath, 0o755); // make it executable

        return "Shortcut created successfully!";
    } catch (error) {
        console.error("Error creating shortcut:", error);
        return "Failed to create shortcut.";
    }
});

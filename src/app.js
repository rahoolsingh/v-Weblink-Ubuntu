import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import os from "os";

let mainWindow = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile("index.html");
};

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

ipcMain.handle("create-shortcut", async (event, data) => {
    const desktopDir = path.join(os.homedir(), "Desktop");
    const shortcutPath = path.join(desktopDir, `${data.name}.desktop`);

    const shortcutContent = `[Desktop Entry]
    Name=${data.name}
    Type=Link
    URL=${data.url}
    Icon=text-html
    Terminal=false`;

    // create shortcut file
    fs.writeFileSync(shortcutPath, shortcutContent);
    fs.chmodSync(shortcutPath, 0o755); // make it executable

    return "Shortcut created successfully!";
});

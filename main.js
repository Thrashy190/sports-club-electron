const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { getUsers } = require("./src/connection/functions");

require("./src/connection/database");
require("electron-reload")(__dirname);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("./src/views/index.html");
};

app.whenReady().then(() => {
  ipcMain.handle("ping", () => "pong");
  ipcMain.handle("get-users", async () => {
    return await getUsers();
  });
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { getConnection } = require("./src/connection/database");

require("./src/connection/database");
require("electron-reload")(__dirname);

const getUsers = async () => {
  const conn = await getConnection();
  const results = await conn.query("SELECT * FROM users");
  return results;
};

function handleSetTitle(event, title) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  });

  win.loadFile("./src/views/menu.html");
};

app.whenReady().then(() => {
  ipcMain.on("set-title", handleSetTitle);
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

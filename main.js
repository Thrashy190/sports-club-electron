const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const {
  getUsers,
  getUsersByUser,
  getSocio,
  getTarifas,
  addTarifa,
} = require("./src/connection/functions");

let mainWindow;

ipcMain.on("login", (event, data) => {
  getUsersByUser(data.user).then((res) => {
    console.log(res);
    if (res.length > 0) {
      if (res[0].password === data.password) {
        openHome();
      } else {
        console.log("Contraseña incorrecta");
      }
    }
  });
});

ipcMain.handle("get-partner", async (event, id) => {
  console.log("get-partner", id);
  return await getSocio(id);
});

ipcMain.handle("get-tariffs", async (event, type) => {
  console.log("get-tariffs", type);
  return await getTarifas(type);
});

ipcMain.handle("add-tariff", async (event, data) => {
  console.log("add-tariff", data);
  return await addTarifa(data);
});

ipcMain.handle("ping", () => "pong");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
}

function openIndex() {
  mainWindow.loadFile("./src/views/index.html");
}

function openHome() {
  mainWindow.loadFile("./src/views/menu.html");
}

app.whenReady().then(() => {
  // ipcMain.handle("ping", () => "pong");
  // ipcMain.handle("get-users", async () => {
  //   return await getUsers();
  // });

  createWindow();
  openIndex();
  console.log("app is ready");

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

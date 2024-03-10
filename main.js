const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const {
  getUsers,
  getUsersByUser,
  getSocio,
  createPartner,
  getTarifas,
  addTarifa,
  getPagosEfectuados,
  generarEstadoCuenta,
  updateTarifa,
  addDefuncion,
  getDefuncionesWithPartner,
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

ipcMain.on("create-partner", async (event, partner) => {
  return await createPartner(
    partner.name,
    partner.address,
    partner.phone,
    partner.email,
    partner.curp,
    partner.type
  );
});

ipcMain.on("get-statement", (event, id) => {
  getSocio(id).then((res) => {
    console.log(res[0].partner_id);
    getPagosEfectuados(res[0].partner_id).then((pagos) => {
      generarEstadoCuenta(pagos);
    });
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

ipcMain.handle("update-tariff", async (event, data) => {
  console.log("update-tariff", data);
  return await updateTarifa(data);
});

ipcMain.handle("add-defuncion", async (event, data) => {
  console.log("add-defuncion", data);
  return await addDefuncion(data);
});

ipcMain.handle("get-defunciones", async (event) => {
  console.log("get-defunciones");
  return await getDefuncionesWithPartner();
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
  mainWindow.loadFile("./src/views/receipts.html");
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

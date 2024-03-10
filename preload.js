const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electron", {
  ping: () => ipcRenderer.invoke("ping"),
  getUsers: () => ipcRenderer.invoke("get-users"),
  setTitle: (title) => ipcRenderer.send("set-title", title),
  loginIpc: (data) => ipcRenderer.send("login", data),
  getPartner: (id) => ipcRenderer.invoke("get-partner", id),
  createPartner: (data) => ipcRenderer.send("create-partner", data),
  getTariffs: (type) => ipcRenderer.invoke("get-tariffs", type),
  addTariff: (data) => ipcRenderer.invoke("add-tariff", data),
  getStatement: (id) => ipcRenderer.send("get-statement", id),
  updateTariff: (data) => ipcRenderer.invoke("update-tariff", data),
  addDefuncion: (data) => ipcRenderer.invoke("add-defuncion", data),
  getDefunciones: () => ipcRenderer.invoke("get-defunciones"),
});

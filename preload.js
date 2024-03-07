const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electron", {
  ping: () => ipcRenderer.invoke("ping"),
  getUsers: () => ipcRenderer.invoke("get-users"),
  setTitle: (title) => ipcRenderer.send("set-title", title),
  loginIpc: (data) => ipcRenderer.send("login", data),
});

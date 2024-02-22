const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("versions", {
  ping: () => ipcRenderer.invoke("ping"),
  getUsers: () => ipcRenderer.invoke("get-users"),
  setTitle: (title) => ipcRenderer.send("set-title", title),
});

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
	getPswd: () => ipcRenderer.invoke('getPswd'),
	listFile: () => ipcRenderer.invoke('listFile'),
	loadFile: (file) => ipcRenderer.invoke('loadFile',file),
	saveFile: (file,content) => ipcRenderer.invoke('saveFile',file,content),
	delFile: (oldf) => ipcRenderer.invoke('delFile',oldf),
    NewFile: (callback) => ipcRenderer.on('NewFile', callback),
    ExportFile: (callback) => ipcRenderer.on('ExportFile', callback)
})

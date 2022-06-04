const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const path = require('path');

var fs = require("fs");
var pics = fs.readdirSync(path.join(process.cwd(),'blog','bg'));
async function getPswd(){
	return fs.readFileSync(path.join(process.cwd(),'pswd')).toString();
}
async function listFile(){
	return fs.readdirSync(path.join(process.cwd(),'blog','articles'));
}
async function loadFile(event, name){
	return JSON.parse(fs.readFileSync(path.join(process.cwd(),'blog' ,'articles', name)).toString());
}
async function saveFile(event, name, content){
	if(name=='list.json')
		fs.writeFileSync(path.join(process.cwd(), 'blog' , 'lstupd'),JSON.stringify({'date':content.date}));
	return fs.writeFileSync(path.join(process.cwd(), 'blog' ,'articles', name),JSON.stringify(content));
}
async function delFile(event, oldf){
	return fs.unlinkSync(path.join(process.cwd(),'blog','articles', oldf));
}
function createWindow () {
  const mainWindow = new BrowserWindow({webPreferences: {preload: path.join(__dirname, 'preload.js')}})
   const menuTemp = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          click:()=>{mainWindow.webContents.send('NewFile','/bg/'+pics[Math.floor(Math.random()*pics.length)]);} 
        },
        {
          label: '导出',
          click:()=>{mainWindow.webContents.send('ExportFile');} 
        },
      ]
    },
  ]
  const menu = Menu.buildFromTemplate(menuTemp)
  Menu.setApplicationMenu(menu)
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  ipcMain.handle('getPswd', getPswd);
  ipcMain.handle('listFile', listFile);
  ipcMain.handle('loadFile', loadFile);
  ipcMain.handle('saveFile', saveFile);
  ipcMain.handle('delFile', delFile);
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

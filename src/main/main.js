const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let apiServer;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, '../../public/icon.png')
  });

  // In development, load from Vite dev server
  // In production, load from built files
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../build/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startApiServer() {
  // Start the Express API server
  const apiPath = path.join(__dirname, '../backend/api.js');
  
  apiServer = spawn('node', [apiPath], {
    stdio: 'inherit',
    env: { ...process.env }
  });

  apiServer.on('error', (error) => {
    console.error('Failed to start API server:', error);
  });

  apiServer.on('close', (code) => {
    console.log(`API server exited with code ${code}`);
  });
}

app.whenReady().then(() => {
  // Start the backend API server
  startApiServer();
  
  // Give the server a moment to start
  setTimeout(() => {
    createWindow();
  }, 1000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Kill the API server when app closes
  if (apiServer) {
    apiServer.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Ensure API server is killed
  if (apiServer) {
    apiServer.kill();
  }
});

// Handle any unhandled errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

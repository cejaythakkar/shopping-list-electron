const electron = require('electron');
const url = require('url')
const path = require('path')

const { app , BrowserWindow , Menu , ipcMain } = electron

let mainWindow,addWindow;

app.on('ready', () => {

    //create new window

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    // load html into window
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file:',
        slashes:true,
    }))
    
    // quit app when mainwindow closed

    mainWindow.on('closed',() => {
        app.quit();
    })

    // Build menu from template

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu)
});

// handler create add window 
const createAddWindow = () => {
    addWindow = new BrowserWindow({
        width:300,
        height:200,
        title:'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // load html into window
    addWindow.loadURL(url.format({
        pathname:path.join(__dirname,'add-window.html'),
        protocol:'file:',
        slashes:true,
        
    }))

    addWindow.on('closed',() => {
        addWindow = null;
    })
}

// catch item:add 

ipcMain.on('item:add',(e , item) => {
    console.log(item);
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
})

// create menu template
const menuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'Add Item',
                click: () => {
                    createAddWindow();
                }
            },
            {
                label:'Clear Items',
                click : () => {
                    mainWindow.webContents.send('items:clear');
                }
            },
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'ctrl+Q',
                click : () => {
                    console.log(`[quit handler]`);
                    app.quit();
                }
            }
        ]
    }
]

// if mac , ad empty object to menu

if(process.platform == 'darwin'){
    menuTemplate.unshift({});
}

// add developers tools item if not in production

if( process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
        label:'Dev Tools',
        submenu:[
            {
                label:'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'command+I' : 'ctrl+I',
                click : (item,focusedWindow) => {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    })
}
const path = require('path');
const fs = require('fs');
const utils = require('./utils');

const SAVE_FILE = path.resolve(__dirname, './listPublicFiles.txt');
const PATH_ASSETS = path.resolve(__dirname, '../public/');

let list = "";

const listFolderRecursive = async (folderPath, parentFolder) => {
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        // eslint-disable-next-line
        for await (const file of files) {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                await listFolderRecursive(curPath, `${parentFolder}/${file}`);
            } else {
                console.log(`${parentFolder}/${file}`);
                list += `"${parentFolder}/${file}",\n`;
            }
        }
    }
};

(async () => {
    await listFolderRecursive(PATH_ASSETS, "/public");
    await utils.removeFile(SAVE_FILE);
    utils.saveHtml(SAVE_FILE, list);
})();

const fs = require('fs');
const path = require('path');

function delDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

const exists = fs.existsSync('./dist');

if (exists) {
    const src = path.join(__dirname, './dist');
    delDir(src);
};
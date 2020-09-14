const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, './src/assets/iconfont.js');
const distPath = path.join(__dirname, './dist/iconfont.js')
const content = fs.readFileSync(targetPath)

fs.writeFileSync(distPath, content)
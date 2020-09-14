import { Icon } from 'antd';
// import fs from "fs"
// import path from "path"
// const src = path.join(__dirname, './data.txt');
// fs.writeFileSync(src, process.env.NODE_ENV)
// 使用：
// import IconFont from '@/components/IconFont';
// <IconFont type='icon-demo' className='xxx-xxx' />
let iconfont;
// console.log(process.env.NODE_ENV)
// if (process.env.NODE_ENV == "development") {
//   console.log("开发环境", process.env.NODE_ENV)
//   //alert("开发环境")
//   iconfont = require("../../assets/iconfont.js")
// } else {
//   //alert("生产环境")
//   console.log("生产环境", JSON.stringify(process.env))

iconfont = require("./iconfont.js")
// iconfont = require("../../assets/iconfont.js")
// }
export default Icon.createFromIconfontCN({ scriptUrl: iconfont });

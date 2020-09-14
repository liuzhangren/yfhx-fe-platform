![pmsp](./packages/Umi/src/assets/logo_collapsed_blue.png)

## 安装及快速开始

``` bash
Root
$ yarn lernaboot //批量安装依赖

View
$ yarn rebuild //打包组件

Umi
$ yarn start //启动项目
```

## 打包命令

``` bash
Umi
$ yarn build //打包项目
```

  

## 目录结构描述

``` 
 Umi                      // 源代码目录
   └── mock                    //mock 文件所在目录，基于 express
   └── src                     // 开发环境
        └── assets              // 静态图片文件目录
        └── components          // 公用业务组件
        └── layouts             // 全局布局文件目录
        └── models              // Model文件目录，基于dva的redux操作
        └── pages               // 功能页面   
              └── Account                         // 建账  
              └── Account                         // 岗位维护 
              └── Alink                           // 前端组件 
              └── Assetcategory                   // 资产信息 
              └── Component                       // 前端组件 
              └── CustomFlow                      // 前端组件 
              └── demo                            // 前端组件 
              └── DeviceBus                       // 业务字典
              └── DeviceType                      // 设备类别维护  
              └── Dic                             // 平台字典 
              └── DutyManagement                  // 前端组件 
              └── DutyMsgSetting                  // 前端组件 
              └── DutyPersonSetting               // 前端组件 
              └── EquipMaintain                   // 技术鉴定小组 
              └── Exception                       // 前端组件 
              └── Factility                       // 厂房 
              └── Flow                            // 流程定义 
              └── FlowMonitor                     // 流程监控 
              └── FlowUser                        // 流程用户 
              └── InitiationProcess               // 前端组件 
              └── Maintain                        // 设备信息维护 
              └── MaintainLog                     // 设备台账查询 
              └── Manufacturer                    // 制造商 
              └── Message                         // 前端组件 
              └── Meter                           // 仪表信息 
              └── MeterChange                     // 仪表变动 
              └── Operationlog                    // 前端组件 
              └── Org                             // 组织机构 
              └── PlanMode                        // 定期检修计划 
              └── PlanSearch                      // 计划查询 
              └── Preparation                     // 定期检定计划 
              └── ProCategory                     // 前端组件 
              └── ProductionLine                  // 生产线信息维护 
              └── Project                         // 前端组件 
              └── ProxySet                        // 流程代理 
              └── Puser                           // 前端组件 
              └── PuserPeople                     // 前端组件 
              └── Resource                        // 前端组件 
              └── Role                            // 前端组件 
              └── Room                            // 厂房房间 
              └── RunBusinessDic                  // 前端组件 
              └── Sbbf                            // 设备变动-报废 
              └── Sbdb                            // 设备变动-调拨  
              └── Sbfc                            // 设备变动-封存  
              └── Sbjy                            // 设备变动-禁用 
              └── Sbqf                            // 设备变动-启用  
              └── Sbty                            // 设备变动-停用  
              └── Ss                              // 前端组件 
              └── SystemCategory                  // 系统分类 
              └── SystemMaintenance               // 系统信息维护 
              └── TaskLog                         // 前端组件 
              └── TaskManagement                  // 前端组件 
              └── TemplateManagement              // 前端组件 
              └── TEST                            // 前端组件 
              └── UnitAuthorization               // 使用单位授权 
              └── User                            // 前端组件 
              └── Useunit                         // 使用单位 
              └── Verification                    // 检定管理 
              └── Workbench                       // 前端组件 
              └── Zz                              // 前端组件 
        └── services            // service文件目录,请求后台接口转promise   
        └── global.less         // 全局样式文件   

 View                      // web静态资源加载
   └── src
       └── components           // 公共组件文件
       └── output               // 导出组件文件
       └── stories              // 组件storybook测试目录   
```

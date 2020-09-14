import settings from "./src/settings"
export default {
  treeShaking: true,
  history: 'hash',
  // exportStatic: true,
  publicPath: './',
  targets: {
    ie: 11, // 支持IE11
  },
  hash: true,//打包后添加hash文件名后缀
  // ignoreMomentLocale: true,//删除moment.js Local代码
  routes: [
    {
      path: '/login',
      component: '../pages/User/Login',
    },
    {
      path: '/403',
      component: '../pages/Exception/403',
    },
    {
      path: '/',
      component: '../layouts/index',
      Routes: ['./src/pages/Auth.js'],
      routes: [
        {
          path: '/',
          component: '../pages/index',
        },
        {
          path: '/Role/RoleMngA',
          component: '../pages/Platform/Role/newRole',
        },
        {
          path: '/Role/RoleMngB',
          component: '../pages/Platform/Role/newRole',
        },
        {
          path: '/Org/OrgPage',
          component: '../pages/Platform/Org',
        },
        {
          path: '/Resource/MenuPage',
          component: '../pages/Platform/Resource',
        },
        {
          path: 'PuserPeople/Ppuser',
          component: '../pages/Platform/PuserPeople/newsIndex',
        },
        {
          path: '/SchedulerTask/TaskManagement',
          component: '../pages/Platform/TaskManagement',
        },
        {
          path: '/SchedulerTask/TaskLog',
          component: '../pages/Platform/TaskLog',
        },
        {
          path: '/Puser/Puser',
          component: '../pages/Platform/Puser',
        },
        {
          path: '/Admin/AdminMng',
          component: '../pages/Platform/Admin/AdminMng',
        },
        {
          path: '/PostMain/PostMaintence',
          component: '../pages/Platform/Admin/NewPost',
        },
        {
          path: '/Flow/ProCategory',
          component: '../pages/Platform/ProCategory',
        },
        {
          path: '/zz',
          component: '../pages/Platform/Zz',
        },
        {
          path: '/ss',
          component: '../pages/Platform/Ss',
        },
        {
          path: '/dic/dicMaintenance',
          component: '../pages/Platform/Dic/dicMaintenance',
        },
        // 建设中页面
        {
          path: '/:post/building',
          component: '../pages/Exception/building',
        },
        {
          path: '/numberConfig',
          component: '../pages/Platform/NumberConfig',
        },
        //  三元分立
        {
          path: '/SeparationThree',
          component: '../pages/Platform/SeparationThree',
        },
        {
          path: '/log/operationLog',
          component: '../pages/Platform/Log/operationLog',
        },
        {
          path: '/log/interfaceLog',
          component: '../pages/Platform/Log/interfaceLog',
        },
        {
          path: '/log/authLog',
          component: '../pages/Platform/Log/loginLog',
        },
        {
          path: '/log/mailLog',
          component: '../pages/Platform/Log/mailLog',
        },
      ]
    }],

  proxy: {
    '/platform': {
      target: settings.devIp.platform,
      // target: 'http://192.168.3.3:29001',
      changeOrigin: true,
      pathRewrite: {
        '^/platform': '/platform'
      }
    },
    '/schedule': {
      target: settings.devIp.schedule,
      changeOrigin: true,
      pathRewrite: {
        '^/schedule': '/schedule'
      }
    },
    '/process': {
      target: settings.devIp.process,
      changeOrigin: true,
      pathRewrite: {
        '^/process': '/process'
      }
    },
    '/equip': {
      target: settings.devIp.equip,
      changeOrigin: true,
      pathRewrite: {
        '^/equip': '/equip'
      }
    },
    '/document': {
      target: settings.devIp.document,
      changeOrigin: true,
      pathRewrite: {
        '^/document': '/document'
      }
    },
    '/plan': {
      target: settings.devIp.plan,
      changeOrigin: true,
      pathRewrite: {
        '^/plan': '/plan'
      }
    },
    '/magicflu': {
      target: "http://172.16.12.180:999/",
      changeOrigin: true,
      pathRewrite: {
        '^/magicflu': '/magicflu'
      }
    },
    '/run': {
      target: settings.devIp.run,
      changeOrigin: true,
      pathRewrite: {
        '^/run': '/run'
      }
    },
    '/instrument': {
      target: settings.devIp.instrument,
      changeOrigin: true,
      pathRewrite: {
        '^/instrument': '/instrument'
      }
    },
  },

  plugins: [
    [
      'umi-plugin-cache-route', {
        keepalive: [
          '/Flow/GetPerson',
          '/customFlow/initiation'
        ]
      },
    ],
    [
      'umi-plugin-react', {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: '生产管理支持平台 | 生产支持',
        dll: false,
        routes: {
          exclude: [/models\//, /services\//, /model\.(t|j)sx?$/, /service\.(t|j)sx?$/, /components\//]
        }
      },
      'umi-plugin-auto-externals', {
        packages: ['antd'],
        urlTemplate: 'https://unpkg.com/{{ library }}@{{ version }}/{{ path }}',
        checkOnline: false,
      }
    ]
  ],
  theme: {
    '@primary-color': "#0066ff",
    '@font-size-base': '15px',
    '@layout-body-background': '#fafafa'
  },
}

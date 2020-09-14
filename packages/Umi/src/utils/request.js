/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
/* eslint-disable */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import { Warning } from 'view';
import router from 'umi/router';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 最后执行时间，默认为0 
let lastTaskTime = 0
function notification401 () {
  if (new Date().getTime() - lastTaskTime > 3000) {
    notification.info({
      message: '未登录或登录已过期，请重新登录。',
    });
    lastTaskTime = new Date().getTime()
  }
}
/**
 * 异常处理程序
 */
const errorHandler = response => {
  const errortext = codeMessage[response.status] || response.msg;
  const { status, url, type } = response;

  const rex = /(\/admin\/tenant\/list)|(\/admin\/menu\/tree)|(\/admin\/user\/info)|(\/admin\/face\/login)|(\/auth\/oauth\/token)/g;

  if (rex.test(url)) {
    if (status === 401) {
      notification401()
      // @HACK
      /* eslint-disable no-underscore-dangle */
      window.g_app._store.dispatch({
        type: 'login/logout',
      });
      return;
    }
    //拦截登录密钥不对时，导致的重定向
    if (status === 0 && type === 'opaqueredirect') {
      notification.info({
        message: `系统消息`,
        description: '客户端密钥错误，请联系管理员',
      });
      return;
    }
    notification.info({
      message: `系统消息`,
      description: '服务器繁忙，请稍后尝试...',
    });
    return;
  }

  // fix

  if (status === 401) {
    notification401()
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
    return;
  }

  // end
  if (status == 401) {
    return;
  }

  if (status === 426 || status === 428) {
    return response.json();
  }

  // environment should not be used

  if (status >= 404 && status < 422) {
    notification.info({
      message: `请求错误 找不到资源 ${status}: ${url},请联系管理员`,
      description: errortext,
    });
  }
  if (status === 403) {
    notification.info({
      message: `请求错误 无接口权限 ${status}: ${url}，请联系管理员`,
      description: errortext,
    });
  }
  if (status <= 504 && status >= 500) {
    notification.info({
      message: `请求错误 程序错误 ${status}: ${url}，请联系管理员`,
      description: errortext,
    });

    return;
  }
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: "/platform",
  //errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  redirect: 'manual'
});

// request拦截器, 改变url
request.interceptors.request.use((url, options) => {
  if (url.indexOf("/platform/schedule") >= 0) {
    url = url.replace(/\/platform/, "")
  }
  if (url.indexOf("/platform/equip") >= 0) {
    url = url.replace(/\/platform/, "")
  }
  if (url.indexOf("/platform/process") >= 0) {
    url = url.replace(/\/platform/, "")
  }
  if (url.indexOf("/platform/document") >= 0) {
    url = url.replace(/\/platform/, "")
  }
  if (url.indexOf("/platform/magicflu") >= 0) {
    url = url.replace(/\/platform/, "")
  }
  if (url.indexOf("/platform/run") >= 0) {
    url = url.replace(/\/platform/, "")
  }
  if (url.indexOf("/platform/plan") >= 0) {
    url = url.replace(/\/platform/, "")
  }
  if (url.indexOf("/platform/instrument") >= 0) {
    url = url.replace(/\/platform/, "")
  }
  let c_token = localStorage.getItem("token");
  let { headers } = options
  headers['Cache-Control'] = 'no-cache'  //处理IE缓存问题
  headers['Pragma'] = 'no-cache'
  headers.Authorization = c_token
  return (
    {
      url: encodeURI(`${url}`),//处理请求IE中文乱码问题
      options: { ...options, headers: headers },
    }
  );
});

/**
* 添加登录拦截器
*/
request.interceptors.response.use(async (response) => {
  // 处理服务器错误
  const { status, url, type } = response;
  if (response.status !== 200) {
    errorHandler(response)
  } else {
    // 处理服务器返回数据错误
    const data = await response.clone().json();
    if (data && data.code) {
      const code = data.code;
      if (code == 500) {
        message.error(data.msg);
      } else if (code == 1) {
        Warning({
          title: '操作失败',
          content: data.msg,
          cancelText: null,
          onOk () { }
        })
      }else if (code == 403) {
        router.replace('/403')
      }
      else if (code === 401) {
        //notification401()
        window.g_app._store.dispatch({
          type: 'login/logout',
          playload: { is401: true }
        }).then(() => {
          //message.error(data.msg)
        });
      }
      return response;

    }

    return response;
  }


})
export default request;

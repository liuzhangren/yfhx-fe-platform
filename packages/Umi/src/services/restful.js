/* eslint-disable */
import request from '@/utils/request';
import { getLocale } from 'umi-plugin-react/locale';

const authorization_code = 'aXJkOmlyZA=='

// 重载request方法，适配后端的方法变化，
// 0 表示成功 1 表示异常，其他数据信息在 _$realData 中获取
const toParame = (data) => {
  let param = '?';
  Object.keys(data).forEach(key => {
    if (data[key] != null && data[key] !== '' && data[key] !== undefined) {
      param += `${key}=${data[key]}&`;
    }
  })
  return param;
}
function proxyRequest() {
  const arg = arguments
  const re = arg[1];
  if (re && re.method && re.method.toUpperCase() === "GET") {
    arg[0] = arg[0] + toParame(re.data)
  }
  return new Promise((resolve, reject) => {

    request.apply(this, arg).then((_data) => {
      const data = _data || { code: 1 }
      const code = data.code == 0 ? 0 : 1
      resolve({
        ...data,
        code,
        '_$realData': data
      })
    }).catch((error) => {
      reject(error)
    })
  })
}

// 获取本地的菜单树
export async function getLocalTree() {
  return proxyRequest('/WebIde/getFile', {
    method: 'GET',
    data: {},
  });
}

// 保存菜单编号
export async function saveCode(path, txt, json) {
  return proxyRequest('/WebIde/save', {
    method: 'POST',
    data: {
      path,
      txt,
      json,
    },
  });
}

// 判断当前菜单是否是设计文件
export async function isDesignFile(path) {
  return proxyRequest('/WebIde/isDesignFile', {
    method: 'POST',
    data: {
      path,
    },
  });
}

// 创建一个新的文件
export async function newFile(path, className) {
  return proxyRequest('/WebIde/newFile', {
    method: 'POST',
    data: {
      path,
      className,
    },
  });
}

export async function restfulApi(url, method, params) {
  const token = localStorage.getItem('token') || authorization_code;
  let headers = {}

  // if (DEVELOP_SINGLE_PAGE !== 'true') {
  headers.Authorization = `Bearer ${token}`
  headers.TENANT_ID = localStorage.getItem('tenant_id')
  // }

  return proxyRequest(url, {
    method,
    headers,
    data: {
      ...params,
    },
  });
}


export async function sendJsonData(url, method, params) {
  const token = localStorage.getItem('token') || authorization_code;
  return proxyRequest(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept-Language': getLocale(),
      TENANT_ID: localStorage.getItem('tenant_id'),
    },
    data: params,
    contentType: 'application/json;charset=utf-8',
    dataType: 'json'
  });
}




function newRestfulApi(token, url, method, params, tenantId) {
  return proxyRequest(url, {
    method,
    headers: {
      Authorization: `Basic ${token}`,
      'content-type': 'application/x-www-form-urlencoded',
      TENANT_ID: tenantId,
    },
    requestType: 'form',
    data: {
      ...params,
    },
  });
}

function restfulApiLoginForm(url, method, params, tenantId) {
  return proxyRequest(url, {
    method,
    headers: {
      Authorization: `Basic ${authorization_code}`,
      'content-type': 'application/x-www-form-urlencoded',
      // TENANT_ID: tenantId,
    },
    requestType: 'form',
    data: {
      ...params,
    },
  });
}

function restfulApiLoginFormWithoutToken(url, method, params) {
  const token = authorization_code;
  let tenant_id = localStorage.getItem('tenant_id');
  if (tenant_id === 'undefined' || tenant_id === '') {
    tenant_id = undefined
  }
  return proxyRequest(url, {
    method,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    requestType: 'form',
    data: {
      ...params,
    },
  });
}

/**
 * 登入系统
 */
export async function login({ username, password, captcha }) {
  return restfulApiLoginForm(
    '/v1/user/auth',
    'POST',
    {
      account: username,
      captcha,
      password,
    }
  );
}


/**
 * 刷新token
 */
export async function refreshToken() {
  return new Promise((resolve, reject) => {
    newRestfulApi(
      authorization_code,
      '/auth/oauth/token',
      'POST',
      {
        grant_type: 'refresh_token',
        refresh_token: localStorage.getItem('refresh_token'),
      },
      localStorage.getItem('tenant_id')
    ).then(respData => {
      const { data } = respData
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('tenant_id', data.tenant_id);
      resolve(data);
    });
  });
}

/**
 * 登出系统
 */
export async function logout() {
  return restfulApi('/auth/token/logout', 'DELETE', {});
}

/**
 * 刷脸登入接口
 */
export async function loginFace({ img }) {
  // const imgs = img.split(",")
  return restfulApiLoginForm('/admin/face/login', 'POST', {
    img,
  });
}

export async function updateUserInfo(params) {
  return restfulApi('/admin/user/edit', 'PUT', params)
}

/**
 * 获取菜单的节点数据
 */
export async function getMenu() {
  return restfulApi('/get/v1/nav', 'GET', {});
}

// 获取菜单国际化信息
export async function getMenuI18n(type) {
  return restfulApi(`/admin/dict/type/${type}`, 'GET', {});
}

// 获得字典项信息
export async function getDictInfo({ dictType, modelType }) {
  return restfulApi(`/admin/dict/type/${dictType}/${modelType}`, 'GET', {});
}

/**
 * 更新菜单节点数据
 */
export async function updateMenu(param) {
  return restfulApi('/put/v1/presource', 'PUT', param);
}

/**
 * 新增菜单节点数据
 */
export async function addMenu(param) {
  return restfulApi('/post/v1/presource', 'POST', param);
}

/**
 *  删除菜单节点信息
 */
export async function delMenu(id) {
  return restfulApi(`/delete/v1/presource/${id}`, 'DELETE', {});
}

/**
 *  批量删除菜单节点信息
 */
export async function delMenuBatch(ids) {
  return restfulApi(`/delete/v1/presources/${ids}`, 'DELETE', {});
}

// /**
//  * 更新角色节点数据
//  */
// export async function updateRole(param) {
//   return restfulApi('/admin/role', 'PUT', param);
// }

// /**
//  * 保存角色节点数据
//  */
// export async function addRole(param) {
//   return restfulApi('/admin/role', 'POST', param);
// }

// /**
//  *  删除角色节点信息
//  */
// export async function delRole(id) {
//   return restfulApi(`/admin/role/${id}`, 'DELETE', {});
// }

// /**
//  *  删除角色节点信息
//  */
// export async function delRoleBatch(ids) {
//   return restfulApi(`/admin/role/batch/${ids}`, 'DELETE', {});
// }

/**
 * 更新字典数据
 */
export async function updateDict(param) {
  return restfulApi('/admin/dict', 'PUT', param);
}

/**
 * 保存字典信息
 */
export async function addDict(param) {
  return restfulApi('/admin/dict', 'POST', param);
}

/**
 *  删除字典信息
 */
export async function delDict(id) {
  return restfulApi(`/admin/dict/${id}`, 'DELETE', {});
}

/**
 *  批量删除字典信息
 */
export async function delDictBatch(ids) {
  return restfulApi(`/admin/dict/batch/${ids}`, 'DELETE', {});
}

/**
 * 更新字典项数据
 */
export async function updateDictItem(param) {
  return restfulApi('/admin/dict/item', 'PUT', param);
}

/**
 * 保存字典项信息
 */
export async function addDictItem(param) {
  return restfulApi('/admin/dict/item', 'POST', param);
}

/**
 *  删除字典项信息
 */
export async function delDictItem(id) {
  return restfulApi(`/admin/dict/item/${id}`, 'DELETE', {});
}

/**
 *  批量删除字典项信息
 */
export async function delDictItemBatch(ids) {
  return restfulApi(`/admin/dict/item/batch/${ids}`, 'DELETE', {});
}

/**
 * 更新租户数据
 */
export async function updateTenant(param) {
  return restfulApi('/admin/tenant', 'PUT', param);
}

/**
 * 保存租户信息
 */
export async function addTenant(param) {
  return restfulApi('/admin/tenant', 'POST', param);
}

/**
 *  删除租户信息
 */
export async function delTenant(id) {
  return restfulApi(`/admin/tenant/${id}`, 'DELETE', {});
}

/**
 *  批量删除租户信息
 */
export async function delTenantBatch(ids) {
  return restfulApi(`/admin/tenant/batch/${ids}`, 'DELETE', {});
}

/**
 * 更新终端数据
 */
export async function updateTerminal(param) {
  return restfulApi('/admin/client', 'PUT', param);
}

/**
 * 保存终端信息
 */
export async function addTerminal(param) {
  return restfulApi('/admin/client', 'POST', param);
}

/**
 *  删除终端信息
 */
export async function delTerminal(id) {
  return restfulApi(`/admin/client/${id}`, 'DELETE', {});
}

/**
 *  批量删除终端信息
 */
export async function delTerminalBatch(ids) {
  return restfulApi(`/admin/client/batch/${ids}`, 'DELETE', {});
}

/**
 *  删除token信息
 */
export async function delToken(id) {
  return restfulApi(`/admin/token/${id}`, 'DELETE', {});
}

/**
 *  批量删除token信息
 */
export async function delTokenBatch(ids) {
  return restfulApi(`/admin/token/batch/${id}`, 'DELETE', {});
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUserInfo() {
  return restfulApi('/admin/user/info', 'GET', {});
}

/**==========岗位信息开始========== */

/**
 * 添加岗位信息
 * @param 岗位名称
 */
export async function addPost(params) {
  return restfulApi('/post/v1/ppost', 'POST', params);
}

/**
 * 修改岗位信息
 * @param
 */
export async function updatePost(params) {
  return restfulApi('/put/v1/ppost', 'PUT', params);
}

/**
 * 删除岗位信息
 * @param
 */
export async function delPost(id) {
  return restfulApi(`/delete/v1/ppost/${id}`, 'DELETE', {});
}

/**
 * 批量删除岗位信息
 * @param
 */
export async function delPostBatch(ids) {
  return restfulApi(`/delete/v1/pposts/${ids}`, 'DELETE', {});
}

/**
 * 新增岗位用户关联数据
 */
export async function addPostUserReal(param) {
  return restfulApi('/post/v1/ppostUserReal', 'POST', param);
}

/**
 * 新增岗位角色关联数据
 */
export async function addPostRoleReal(param) {
  return restfulApi('/post/v1/ppostRoleReal', 'POST', param);
}


/**
 *  批量删除岗位用户关联数据
 */
export async function delPostUserReal(param) {
  return restfulApi(`/delete/v1/ppostUserReals`, 'POST', param);
}

/**
 *  批量删除岗位角色关联数据
 */
export async function delPostRoleReal(param) {
  return restfulApi(`/delete/v1/ppostRoleReals`, 'POST', param);
}

/**==========岗位信息结束========== */

/**==========用户信息维护开始========== */

/**
 * 添加管理员用户信息
 * @param 用户信息
 */
export async function addAdminPuser(params) {
  return restfulApi('/post/v1/admin-user', 'POST', params);
}

/**
 * 添加用户信息
 * @param 用户信息
 */
export async function addPuser(params) {
  return restfulApi('/post/v1/puser', 'POST', params);
}

/**
 * 修改用户信息
 * @param
 */
export async function updatePuser(params) {
  return restfulApi('/put/v1/puser', 'PUT', params);
}

/**
 * 删除用户信息
 * @param
 */
export async function delPuser(id) {
  return restfulApi(`/delete/v1/puser/${id}`, 'DELETE', {});
}

/**
 * 批量删除用户信息
 * @param
 */
export async function delPuserBatch(ids) {
  return restfulApi(`/delete/v1/pusers/${ids}`, 'DELETE', {});
}

/**
 * 用户重置密码
 * @param
 */
export async function resetPwd(id) {
  return restfulApi(`/put/v1/resPwd/${id}`, 'PUT', {});
}

/**
 * 设置用户
 * @param
 */
export async function setPuser(id) {
  return restfulApi(`/put/v1/setPuser/${id}`, 'PUT', {});
}

/**
 * 批量设置用户
 * @param
 */
export async function setPuserBatch(ids) {
  return restfulApi(`/put/v1/setPuserBatch/${ids}`, 'PUT', {});
}

/**
 * 删除用户（重置为普通用户）
 * @param
 */
export async function setUser(id) {
  return restfulApi(`/put/v1/setUser/${id}`, 'PUT', {});
}

/**==========用户信息维护结束========== */

/**
 * 启动job任务,参数任务id
 */
export async function startJob(id) {
  return restfulApi(`/job/sys-job/start-job/${id}`, 'POST', {});
}

/**
 * 暂停job任务,参数任务的id
 */
export async function suspendJob(id) {
  return restfulApi(`/job/sys-job/shutdown-job/${id}`, 'POST', {});
}

/**
 * 修改job数据
 */
export async function updateJob(param) {
  return restfulApi(`/job/sys-job`, 'PUT', {
    ...param,
  });
}

/**
 * 添加定时器
 */
export async function addJob(param) {
  return restfulApi(`/job/sys-job`, 'POST', {
    ...param,
  });
}

/**
 * 删除调度任务
 */
export async function delJob(id) {
  return restfulApi(`/job/sys-job/${id}`, 'DELETE', {});
}

/**
 * 启动所有任务
 */
export async function startJobAll() {
  return restfulApi('/job/sys-job/start-jobs', 'POST', {});
}

/**
 * 重置所有任务
 */
export async function suspendJobAll() {
  return restfulApi('/job/sys-job/shutdown-jobs', 'POST', {});
}

/**
 * 重置所有任务
 */
export async function refreshJobs() {
  return restfulApi('/job/sys-job/refresh-jobs', 'POST', {});
}

/**
 * 添加系统APP应用
 */
export async function addApp(param) {
  return restfulApi('/admin/app', 'POST', {
    ...param,
  });
}

/**
 * 更新App应用
 */
export async function updateApp(param) {
  return restfulApi('/admin/app', 'PUT', {
    ...param,
  });
}

/**
 * 删除App应用
 */
export async function delApp(id) {
  return restfulApi(`/admin/app/${id}`, 'DELETE', {});
}

/**
 * 批量删除App应用
 */
export async function delAppBatch(ids) {
  return restfulApi(`/admin/app/batch/${ids}`, 'DELETE', {});
}

/**
 * 获取租户信息
 */
export async function getTenantList() {
  return restfulApiLoginFormWithoutToken('/admin/tenant/list', 'GET', {});
}

/**
 * 机构关联人员
 */
export async function joinOrgStaff({ orgId, userId }) {
  return restfulApi('/admin/org/user', 'POST', {
    orgId,
    userId,
  });
}

/***
 * 机构取消人员关联
 */
export async function unjoinOrgStaff(id) {
  return restfulApi(`/admin/org/user/${id}`, 'DELETE', {});
}

/***
 * 机构取消人员关联批量
 */
export async function unjoinOrgStaffBatch(ids) {
  return restfulApi(`/admin/org/user/batch/${ids}`, 'DELETE');
}

/**
 * 机构关联APP
 */
export async function joinOrgApp({ orgId, appId }) {
  return restfulApi('/admin/org/app', 'POST', {
    orgId,
    appId,
  });
}

/***
 * 机构取消关联
 */
export async function unJoinOrgApp(id) {
  return restfulApi(`/admin/org/app/${id}`, 'DELETE', {});
}

/***
 * 机构取消关联批量
 */
export async function unJoinOrgAppBatch(ids) {
  return restfulApi(`/admin/org/app/batch/${ids}`, 'DELETE', {});
}

/**
 * 人员与机构绑定
 */
export async function joinPostUser(param) {
  return restfulApi(`/admin/user/position`, 'POST', param);
}

/**
 *  人员与岗位关联取消
 */
export async function unJoinPostUser(id) {
  return restfulApi(`/admin/user/position/${id}`, 'DELETE', {});
}

/**
 * 解除人员角色关联
 * @param {String} id
 */
export async function unJoinRoleUser(id) {
  return restfulApi(`/admin/user/role/${id}`, 'DELETE', {});
}

/**
 * 批量解除人员角色关联
 * @param {String} id
 */
export async function unJoinRoleUserBatch(ids) {
  return restfulApi(`/admin/user/role/batch/${ids}`, 'DELETE', {});
}

export async function joinRoleUser({ userId, roleId }) {
  return restfulApi(`/admin/user/role`, 'POST', {
    userId,
    roleId,
  });
}

export async function getRoleMenuSelect(roleId) {
  return restfulApi(`/admin/role/menu/roleid?roleid=${roleId}`, 'GET', {});
}

// 授权节点
export async function addMenuRoleJoin({ menuId, roleId }) {
  return restfulApi(`/admin/role/menu`, 'POST', {
    menuId,
    roleId,
  });
}

// 取消授权节点
export async function delMenuRoleJoin({ id, roleId }) {
  return restfulApi(`/admin/role/menu/del`, 'DELETE', {
    id,
    roleId,
  });
}

//得到组织机构详情
export async function getOrgById(id) {
  return restfulApi(`/admin/org/id`, 'POST', {
    id,
  });
}

//添加组织
export async function addOrg(param) {
  return restfulApi(`/admin/org`, 'POST', {
    ...param,
  });
}

//修改组织
export async function modifyOrg(param) {
  return restfulApi(`/admin/org`, 'PUT', {
    ...param,
  });
}

//删除组织
export async function deleteOrg(id) {
  return restfulApi(`/admin/org/${id}`, 'DELETE');
}

/**
 * 添加动火证
 */
export async function addFire(param) {
  return restfulApi(`/demo/fire`, 'POST', {
    ...param,
  });
}

// 删除动火证
export async function delFire(id) {
  return restfulApi(`/demo/fire/${id}`, 'DELETE', {});
}

// 批量删除动火证
export async function delFireBatch(ids) {
  return restfulApi(`/demo/fire/batch/${ids}`, 'DELETE', {});
}

// 启动动火证
export async function startFire(id) {
  return restfulApi(`/demo/fire/startProcess`, 'POST', {
    id,
  });
}

// 通过动火证审批
export async function getPastFire(param) {
  return restfulApi(`/demo/fire/complete`, 'POST', param);
}

// 获取动火证的相关数据信息
export async function getFireInfo(id) {
  return restfulApi(`/demo/fire/${id}`, 'GET', {});
}

// 拒绝审批
export async function refuseFire(param) {
  return restfulApi(`/demo/fire/withdraw`, 'POST', param);
}


//添加组件配置
export async function addComConfig(param) {
  return restfulApi(`/admin/widget`, 'POST', {
    ...param,
  });
}

//修改组件配置
export async function updateComConfig(param) {
  return restfulApi(`/admin/widget`, 'PUT', {
    ...param,
  });
}

//删除组件配置
export async function delComConfig(id) {
  return restfulApi(`/admin/widget/${id}`, 'DELETE');
}

//角色绑定组件
export async function joinRoleComConfig({ roleId, widgets }) {
  return restfulApi(`/admin/role/widget/batch/save`, 'POST', {
    widgets,
    roleId,
  });
}

//角色解绑组件
export async function unjoinRoleComConfig(roleWidgetId) {
  return restfulApi(`/admin/role/widget/${roleWidgetId}`, 'delete', {});
}

//得到组件的状态值
export async function getWidgetStatus(widget_id) {
  return restfulApi(`/admin/widget/action/re/id?id=${widget_id}`, 'get', {});
}

// 更新组件状态
export async function updateWidgetStatus({ roleWidgetId, status }) {
  return restfulApi('/admin/widget/action/batch/save', 'post', { roleWidgetId, status })
}

// 删除组件状态
export async function deleteWidgetStatus({ roleWidgetId, status }) {
  return restfulApi(`/admin/widget/action/del/role/wiget/id/${roleWidgetId}/${status}`, 'delete', { roleWidgetId, status })
}

// 获取组件的描述信息
export async function getWidgetDesc() {
  return restfulApi('/admin/role/widget/desc', 'GET', {});
}

export async function dowloadExcel() {
  const token = localStorage.getItem('token') || authorization_code;
  return proxyRequest('/admin/face/test', {
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept-Language': getLocale(),
      TENANT_ID: localStorage.getItem('tenant_id'),
    },
    responseType: 'blob',
  });
}

/**
 * 更新日志本数据
 */
export async function updateLogbook(param) {
  return restfulApi('/olg/v1/log/conf', 'PUT', param);
}

/**
 * 保存菜单节点数据
 */
export async function addLogbook(param) {
  return restfulApi('/olg/v1/log/conf', 'POST', param);
}

/**
 *  删除菜单节点信息
 */
export async function delLogbook(id) {
  return restfulApi(`/olg/v1/log/conf/${id}`, 'DELETE', {});
}

/**
 * 新增人员
 * @param {} params
 */
export async function addUser(params) {
  return restfulApi('/admin/user/ext', 'post', params)
}

/**
 * 编辑人员
 */
export async function updateUser(params) {
  return restfulApi('/admin/user/ext', 'put', params)
}

/**
 * 删除人员
 * @param {}} records
 */
export async function deleteUser(records) {
  return restfulApi(`/admin/user/ext/${records.userId}`, 'delete')
}

/**
 * 查询人员详情
 * @param {*} params
 */
export async function fetchUserInfo(userId) {
  return restfulApi(`/admin/user/ext/${userId}`, 'get');
}

/**
 * 新增账户
 * @param {} params
 */
export async function addAccount(params) {
  return restfulApi('/admin/account', 'post', params)
}

/**
 * 编辑账户
 */
export async function updateAccount(params) {
  return restfulApi('/admin/account', 'put', params)
}

/**
 * 删除账户
 * @param {}} records
 */
export async function deleteAccount(records) {
  return restfulApi(`/admin/account/${records.userId}`, 'delete')
}

/**
 * 查询账户详情
 * @param {*} params
 */
export async function fetchAccountInfo(userId) {
  return restfulApi(`/admin/account/${userId}`, 'get');
}


/**
 * 获取平台项目详情信息数据
 */
export async function getProject(id) {
  return restfulApi(`/get/v1/pproject/${id}`, 'GET', {});
}

/**
 * 更新平台项目信息数据
 */
export async function updateProject(param) {
  return restfulApi('/put/v1/pproject', 'PUT', param);
}

/**
 * 新增平台项目信息数据
 */
export async function addProject(param) {
  return restfulApi('/post/v1/pproject', 'POST', param);
}

/**
 *  删除平台项目信息
 */
export async function delProject(id) {
  return restfulApi(`/delete/v1/pproject/${id}`, 'DELETE', {});
}

/**
 *  批量删除平台项目信息
 */
export async function delProjectBatch(ids) {
  return restfulApi(`/delete/v1/pprojects/${ids}`, 'DELETE', {});
}


/**
 * 获取角色详情信息数据
 */
export async function getRole(id) {
  return restfulApi(`/get/v1/prole/${id}`, 'GET', {});
}

/**
 * 更新角色信息数据
 */
export async function updateRole(param) {
  return restfulApi('/put/v1/prole', 'PUT', param);
}

/**
 * 新增角色信息数据(一级管理员)
 */
export async function addRole(param) {
  return restfulApi('/post/v1/prole', 'POST', param);
}

/**
 * 新增角色信息数据(二级管理员)
 */
export async function addRoleB(param) {
  return restfulApi('/post/v1/proleB', 'POST', param);
}

/**
 *  删除角色信息
 */
export async function delRole(id) {
  return restfulApi(`/delete/v1/prole/${id}`, 'DELETE', {});
}

/**
 *  批量删除角色信息
 */
export async function delRoleBatch(ids) {
  return restfulApi(`/delete/v1/proles/${ids}`, 'DELETE', {});
}


/**
 * 获取组织机构详情信息数据
 */
export async function getPorg(id) {
  return restfulApi(`/get/v1/porg/${id}`, 'GET', {});
}

/**
 * 更新组织机构数据
 */
export async function updatePorg(param) {
  return restfulApi('/put/v1/porg', 'PUT', param);
}

/**
 * 新增组织机构数据
 */
export async function addPorg(param) {
  return restfulApi('/post/v1/porg', 'POST', param);
}

/**
 *  删除组织机构
 */
export async function delPorg(id) {
  return restfulApi(`/delete/v1/porg/${id}`, 'DELETE', {});
}

/**
 *  批量删除组织机构
 */
export async function delPorgBatch(ids) {
  return restfulApi(`/delete/v1/porgs/${ids}`, 'DELETE', {});
}

/**
 * 新增角色用户关联数据
 */
export async function addRoleUserReal(param) {
  return restfulApi('/post/v1/proleUserReal', 'POST', param);
}

/**
 * 新增角色项目关联数据
 */
export async function addRoleProReal(param) {
  return restfulApi('/post/v1/proleProjectReal', 'POST', param);
}


/**
 *  批量删除角色用户关联数据
 */
export async function delRoleUserReal(param) {
  return restfulApi(`/delete/v1/proleUserReals`, 'POST', param);
}

/**
 *  批量删除角色项目关联数据
 */
export async function delRoleProReal(param) {
  return restfulApi(`/delete/v1/proleProjectReals`, 'POST', param);
}

/**
 * 查询角色资源关联数据
 */
export async function getRoleResReal(param) {
  return restfulApi('/post/v1/getRoleResReal', 'POST', param);
}


/**
 *  删除任务日志
 */
export async function delTaskLog(id) {
  return restfulApi(`/schedule/delete/v1/quartzScheduleJobLog/${id}`, 'DELETE', {});
}


/**
 * 更新任务日志信息
 */
export async function updateTaskLog(param) {
  return restfulApi('/schedule/put/v1/quartzScheduleJobLog', 'PUT', param);
}


/**
 * 新增任务管理
 * @param {} params
 */
export async function addTaskManager(params) {
  return restfulApi('/schedule/post/v1/quartzScheduleJob', 'post', params)
}

/**
 * 更新任务管理
 */
export async function updateTaskManager(param) {
  return restfulApi('/schedule/put/v1/quartzScheduleJob', 'PUT', param);
}

/**
 *  删除任务日志
 */
export async function delTaskManager(id) {
  return restfulApi('/schedule/delete/v1/quartzScheduleJob/${id}', 'DELETE', {});
}

/**
 *  批量删除任务管理数据
 */
export async function delTaskManagerBatch(ids) {
  return restfulApi(`/schedule/delete/v1/quartzScheduleJobs/${ids}`, 'DELETE', {});
}

/**
 *  生效任务管理数据
 */
export async function startTaskManager(param) {
  return restfulApi('/schedule/v1/schedule/start/', 'PUT', param);
}

/**
 *  关闭任务管理数据
 */
export async function stopTaskManager(param) {
  return restfulApi('/schedule/v1/schedule/close/', 'PUT', param);
}
/**
 * 新增角色资源关联数据
 */
export async function addRoleResReal(param) {
  return restfulApi('/post/v1/proleResourceReal', 'POST', param);
}


/**
 * 更新管理员信息数据
 */
export async function updateAdminUser(param) {
  return restfulApi('/put/v1/puser', 'PUT', param);
}

/**
 * 新增管理员信息数据
 */
export async function addAdminUser(param) {
  return restfulApi('/post/v1/admin-user', 'POST', param);
}


/**
 *  删除管理员信息
 */
export async function delAdminUser(id) {
  return restfulApi(`/delete/v1/puser/${id}`, 'DELETE', {});
}

/**
 *  批量删除角色信息
 */
export async function delAdminUserBatch(ids) {
  return restfulApi(`/delete/v1/pusers/${ids}`, 'DELETE', {});
}

/**
 * 新增管理员项目关联数据
 */
export async function addAdminProReal(param) {
  return restfulApi('/post/v1/padminProjectRela', 'POST', param);
}

/**
 *  批量删除管理员项目关联数据
 */
export async function delAdminProReal(param) {
  return restfulApi(`/delete/v1/padminProjectRelas`, 'POST', param);
}

/**
 * 查询项目关联任务
 */
export async function queryTaskManager(param) {
  return restfulApi('/schedule/get/v1/quartzScheduleJobs', 'GET', param);
}

/**
 * 更新流程设计模型数据
 */
export async function updateProModel(param) {
  return restfulApi('/process/v1/project/category', 'PUT', param);
}

/**
 * 新增流程设计模型数据
 */
export async function addProModel(param) {
  return restfulApi('/process/v1/model/inportBPMN', 'POST', param);
}

/**
 *  删除流程设计模型
 */
export async function delProModel(id) {
  return restfulApi(`/process/v1/model/${id}`, 'DELETE', {});
}


/**
 *  获取流程节点信息
 */
export async function getImgItems(definitionId) {
  return restfulApi(`/process/v1/definition/json/${definitionId}`, 'GET', {});
}


/**
 *  获取全局配置信息
 */
export async function getDefGlobalConf(definitionId) {
  return restfulApi(`/process/v1/flowGlobalConf/${definitionId}`, 'GET', {});
}


// /**
//  *  获取流程单个节点信息
//  */
// const toParame = (data) => {
//   let param = '?';
//   Object.keys(data).forEach(key => {
//     if (data[key] != null && data[key] !== '' && data[key] !== undefined) {
//       param += `${key}=${data[key]}&`;
//     }
//   })
//   return param;
// }

export async function getImgBtnItems(param) {

  return restfulApi(`/process/v1/flowGlobalConf/nodeConf/${toParame(param)}`, 'GET', {});
}

/**
 *  获取流程单个节点信息
 */


export async function getImgBtnAuthConfig(query) {
  return request('/process/v1/wfxNodeStaff/list', {
    params: query
  })
}
// 保存节点配置信息

export async function saveFlowConfig(param) {
  return restfulApi('/process/v1/flowGlobalConf/globalAndNodeConf', 'POST', param);
}

//批量保存权限配置用户信息
export async function saveBatchUser(param) {
  //headers.Authorization = `Bearer ${token}`
  //const token = localStorage.getItem('token') || authorization_code;
  return restfulApi('/process/v1/wfxNodeStaff/saveBatch','POST', param);
}

/**
 *  工作台提交和退回按钮
 */
export async function submitOrBack(param) {
  return restfulApi('/process/v2/flowTask/taskSubmit', 'POST', param);
}

// 获取人员配置权限type
export async function queryAuthorityByNodeIdData({nodeId}) {
  return request(`/process/v1/wfxNodeStaff/queryByNodeId/${nodeId}`, {})
}

 
/* eslint-disable react/no-array-index-key */

import React, { Fragment } from 'react';
import { Divider, Tag } from 'antd';
import { element } from 'prop-types';

/**
 * 常用表格render
 */
export default class TableRender {
  // 传入一个links数组
  static LinkArrayRender = ary => {
    const lenth = ary ? ary.length : 0;
    return (
      <Fragment>
        {lenth > 0 &&
          ary.map((item, index) =>
            (index !== ary.length - 1 ? (
              <Fragment key={index}>
                {item} <Divider type="vertical" />
              </Fragment>
            ) : (
                <Fragment key={index}>{item}</Fragment>
              )),
          )}
      </Fragment>
    );
  };

  // 列表字段翻译
  static getName = (list, text, key, name) => {
    if (list && Array.isArray(list) && list.length) {
      return list.reduce((r, c) => {
        if (c[key] == text) {
          r = c[name]
        }
        return r
      }, '')
    }
  }

  // 运行管理模板发布状态
  static runTemplateStatusColor (code, name) {
    let color = ''
    switch (code) {
      case 'UNPUBLISHED':
        color = 'orange';
        break;
      case 'ISSUED':
        color = 'blue';
        break;
      case 'VOIDED':
        color = 'Gainsboro';
        break;
      default: color = '';
    }
    if (code) return <Tag color={color}>{name}</Tag>
    return ''
  }

  // 特殊接班 值班状态
  static runDutyStatusColor (code, name) {
    let color = ''
    switch (code) {
      case 'ZAIZ':
        color = 'blue';
        break;
      case 'JBZ':
        color = 'cyan';
        break;
      case 'ZCGB':
        color = 'Gainsboro';
        break;
      default: color = '';
    }
    if (code) return <Tag color={color}>{name}</Tag>
    return ''
  }
}

// 通用下载文件方法
export function downloadFile (downloadUrl, value, name) {
  // 创建表单
  const formObj = document.createElement('form');
  formObj.action = downloadUrl;
  formObj.method = 'get';
  formObj.style.display = 'none';
  // 创建input，主要是起传参作用
  const formItem = document.createElement('input');
  formItem.value = value; // 传参的值
  formItem.name = name; // 传参的字段名
  // 插入到网页中
  formObj.appendChild(formItem);
  document.body.appendChild(formObj);
  formObj.submit(); // 发送请求
  document.body.removeChild(formObj); // 发送完清除掉
}

// 设备/仪表锁定状态颜色值处理
export function LockStateColor (text, record, index) {
  let color = ''
  switch (text) {
    case '1':
      color = 'red';
      break;
    case '0':
      color = 'green';
      break;
    default: color = 'green';
  }
  // return <Tag color={color}>{text === "0" ? '锁定' : ''}</Tag>
  return text === '1' ? <Tag color={color}>锁定</Tag> : <div></div>
}

// 修改时请同步修改仪表
// 设备状态颜色值处理
export function EquipStatusColor (text, record, index) {
  let color = ''
  switch (record.equipState) {
    case 'INUSE':
      color = 'green';
      break;
    case 'SCRAP':
      color = 'red';
      break;
    case 'TO_BE_SCRAP':
      color = 'red';
      break;
    case 'STOP_USING':
      color = 'magenta';
      break;
    case 'LEND':
      color = 'blue';
      break;
    case 'ALLOCATION':
      color = 'cyan';
      break;
    case 'SEALED':
      color = 'Gainsboro';
      break;
    case 'INSTRYE_VERIF':
      color = 'purple';
      break;
    case 'UNDER_MAINTENANCE':
      color = 'Yellow1';
      break;
    case 'UNUSE':
      color = 'gray';
      break;
    default: color = 'green';
  }
  return <Tag color={color}>{text}</Tag>
}

// 仪表状态颜色值处理
export function InstStatusColor (text, record, index) {
  let color = ''
  switch (record.instrumentState) {
    case 'INUSE':
      color = 'green';
      break;
    case 'SCRAP':
      color = 'red';
      break;
    case 'STOP_USING':
      color = 'magenta';
      break;
    case 'LEND':
      color = 'blue';
      break;
    case 'ALLOCATION':
      color = 'cyan';
      break;
    case 'SEALED':
      color = 'Gainsboro';
      break;
    case 'INSTRYE_VERIF':
      color = 'purple';
      break;
    case 'UNDER_MAINTENANCE':
      color = 'Yellow1';
      break;
    default: color = 'green';
  }
  return <Tag color={color}>{text}</Tag>
}

// ABC分类颜色值处理
export function ABCStatusColor (text, record, index) {
  let color = ''
  switch (text) {
    case '关键设备':
      color = 'red';
      break;
    case '重要设备':
      color = 'blue';
      break;
    case '一般设备':
      color = 'green';
      break;
    default: color = 'green';
  }
  return <Tag color={color}>{text}</Tag>
}

// 变动类型颜色值处理
export function changeTypeColor (text, record, index) {
  let color = ''
  switch (record.changeType) {
    case 'INUSE':
      color = 'green';
      break;
    case 'SCRAP':
      color = 'red';
      break;
    case 'STOP_USING':
      color = 'magenta';
      break;
    case 'RETURN':
      color = 'blue';
      break;
    case 'BOWRROW':
      color = 'cyan';
      break;
    case 'SEALED':
      color = 'Gainsboro';
      break;
    default: color = 'green';
  }
  return <Tag color={color}>{text}</Tag>
}

// 设备状态颜色值处理
export function GetUid (len) {
  const s = [];
  for (let i = 0; i < len; i++) {
    s.push(String.fromCharCode(Math.floor(Math.random() * 26) + 97));
  }
  return s.join('')
}

// 补全数字小数点后两位
export function Completion (text) {
  let num
  if (text) {
    num = Math.round(parseFloat(text) * 100) / 100;
    const s = num.toString().split('.');
    if (s.length === 1) {
      num = `${num.toString()}.00`;
      return num;
    }
    if (s.length > 1) {
      if (s[1].length < 2) {
        num = `${num.toString()}0`;
      }
      return num;
    }
  }
  return num
}

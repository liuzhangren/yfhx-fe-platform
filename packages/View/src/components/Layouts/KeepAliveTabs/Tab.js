import { useAliveController } from 'react-activation'
import { Icon } from 'antd'
import React from 'react';
import styles from './index.less'

export default function Tab({ node }) {
  // const { getCachingNodes, dropScope } = useAliveController()
  // const cachingNodes = getCachingNodes()
  // const closable = cachingNodes.length > 1
  console.log(useAliveController())
  function dropTab(e) {
    e.stopPropagation()
    const currentName = node.name
    // 如果关闭激活中的 KeepAlive Tab，需要先离开当前路由
    // 触发 KeepAlive unactivated 后再进行 drop
    if (location.pathname === node.name) {
      const unlisten = history.listen(() => {
        unlisten()
        setTimeout(() => {
          dropScope(currentName)
        }, 60)
      })

      // 前往排除当前 node 后的最后一个 tab
      history.push(
        cachingNodes.filter(node => node.name !== currentName).pop().name
      )
    } else {
      dropScope(currentName)
    }
  }

  return (
    <li
      className={location.pathname === node.name ? styles['active'] : ''}
      onClick={() => {
        history.push(node.name)
      }}
    >
      {node.name}
      {closable && (
        // <CloseCircleOutlined
        //   className={styles['close-btn']}
        //   onClick={dropTab}
        // />
        <Icon
          type='close'
          className={styles['close-btn']}
          onClick={dropTab}
        />
      )}
    </li>
  )
}

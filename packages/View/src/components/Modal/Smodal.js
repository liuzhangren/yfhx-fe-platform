import React from 'react';
import { Modal } from 'antd';
import styles from './Smodal.less';

/**
 * 表单弹出窗
 * @param components 表单和组件的映射信息
 * @param scripts 表单的布局信息
 * @param rules 表单的验证信息
 */
export default class SModal extends React.Component {
  render() {
    const { children, okText = "确定", cancelText = "取消", isFull, width = 700, bodyStyle = {}, wrapClassName, style, footer, ...rest } = this.props;
    let newWidth = width, newBodyStyle = { position: ' relative', ...bodyStyle }, newWrapClassName = wrapClassName, newStyle = style;
    if (isFull) {
      newWidth = "100vw"
      if (footer === null || footer === "") {

        newBodyStyle = { height: "calc(100vh - 55px)", overflowY: "auto", ...newBodyStyle }
      } else {

        newBodyStyle = { height: "calc(100vh - 105px)", overflowY: "auto", ...newBodyStyle }
      }
      newWrapClassName = `${newWrapClassName} ${styles.modalWrapClassName}`
      newStyle = { ...newStyle, top: 0 }

    }
    return (
      <Modal
        okText={okText}
        cancelText={cancelText}
        width={newWidth}
        bodyStyle={newBodyStyle}
        style={newStyle}
        wrapClassName={newWrapClassName}
        footer={footer}
        {...rest}
        maskClosable={false}
      >
        {children}
      </Modal>
    )
  }

}
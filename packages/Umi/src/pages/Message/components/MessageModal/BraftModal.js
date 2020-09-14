import React from 'react';
import 'braft-editor/dist/index.css';
import { Form, Button } from 'antd';
import {
  Modal,
  SForm,
} from 'view';
import PersonModal from '@/components/Business/PersonModal';
import styles from './BraftModal.less';

@Form.create()
class BraftModal extends React.Component {
  state = {
    selectPerson: '',
    selectPersonArr: [],
    editState: false,
  }

  handleSubmit = event => {
    event.preventDefault();

    this.form.validateFields((error, values) => {
      const { dispatch, braftTb, current: { info }, handleGetNoticeInfo } = this.props
      const { selectPerson, selectPersonArr } = this.state

      if (!error) {
        const submitData = {
          title: values.title,
          content: values.content,
          toUser: selectPerson,
        };
        if (info == null) {
          dispatch({
            type: 'message/sendMessage',
            payload: {
              submitData,
            },
            callback: () => {
              braftTb.refresh({})
              handleGetNoticeInfo()
            },
          })
        } else {
          dispatch({
            type: 'message/sendMessage',
            payload: {
              submitData: {
                ...info,
                title: values.title,
                content: values.content,
                toUser: selectPerson || info.toUser,
                toUserName: selectPersonArr.join(','),
              },
            },
            callback: () => {
              braftTb.refresh({})
              handleGetNoticeInfo()
            },
          })
        }

        this.handleCancel();
      }
    });
  }

  handleSaveBraft = event => {
    event.preventDefault();
    const { dispatch, braftTb, current: { info } } = this.props
    const { selectPerson, selectPersonArr } = this.state

    this.form.validateFields((error, values) => {
      if (!error) {
        const submitData = {
          title: values.title,
          content: values.content,
          toUser: selectPerson,
        };
        if (info === null) {
          dispatch({
            type: 'message/saveMessage',
            payload: {
              submitData,
            },
            callback: () => {
              braftTb.refresh({})
            },
          })
        } else {
          dispatch({
            type: 'message/updateMessage',
            payload: {
              submitData: {
                ...info,
                title: values.title,
                content: values.content,
                toUser: selectPerson || info.toUser,
                toUserName: selectPersonArr.join(','),
              },
            },
            callback: () => {
              braftTb.refresh({})
            },
          })
        }
        this.handleCancel();
      }
    });
  }

  showTitle = () => {
    const { current } = this.props

    if (current && current.info && current.disable) {
      return '查看'
    } if (current && current.info && !current.disable) {
      return '编辑'
    }
    return '新增'
  }

  handleCancel = () => {
    const { cancleShow } = this.props;

    this.setState(() => ({
      selectPerson: '',
      selectPersonArr: [],
      editState: false,
    }))
    cancleShow();
  }

  renderFooter () {
    const { current } = this.props;

    if (current.disable !== true) {
      return (
        <>
          <Button
            type="text"
            className={styles.btn}
            onClick={this.handleCancel}
          >取消</Button>
          <Button type="primary" className={styles.btn} onClick={this.handleSaveBraft}>保存</Button>
          <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>提交</Button>
        </>
      )
    }

    return (
      <Button
        type="text"
        className={styles.btn}
        onClick={this.handleCancel}
      >取消</Button>
    )
  }

  render () {
    const { show, current } = this.props;
    const { selectPerson, selectPersonArr, editState } = this.state;

    const formItems = [
      {
        key: 'title',
        label: '标题',
        componentType: 'input',
        itemProps: {
          labelCol: { span: 4 },
          wrapperCol: { span: 18 },
        },
        options: {
          rules: [
            {
              required: true,
              message: '请输入标题',
            },
            {
              max: 30,
              message: '最大长度30个字符',
            },
          ],
          initialValue: current.info && current.info.title,
        },
        props: {
          disabled: current.disable,
          placeholder: '请输入标题',
        },
      },
      {
        key: 'content',
        label: '正文',
        componentType: 'textArea',
        itemProps: {
          labelCol: { span: 4 },
          wrapperCol: { span: 18 },
        },
        options: {
          rules: [
            {
              required: true,
              message: '请输入正文',
            },
            {
              max: 100,
              message: '最大长度100个字符',
            },
          ],
          initialValue: current.info && current.info.content,
        },
        props: {
          disabled: current.disable,
          placeholder: '请输入正文',
        },
      },
      {
        key: 'person',
        label: '接收人',
        componentType: 'inputChoose',
        itemProps: {
          labelCol: { span: 4 },
          wrapperCol: { span: 18 },
        },
        options: {
          rules: [
            {
              required: true,
              message: '请选择接收人',
            },
          ],
          initialValue: current.info && current.info.toUserName.split(','),
        },
        props: {
          disabled: current.disable,
          placeholder: '请选接收人',
          multiple: true,
          onClick: () => {
            if (current.info) {
              const arr = [];
              const user = (!selectPersonArr.length && !editState) ? current.info.toUser.split(',') : selectPerson.split(',');
              const userName = (!selectPersonArr.length && !editState) ? current.info.toUserName.split(',') : selectPersonArr;

              if (user[0]) {
                for (let i = 0; i < user.length; i += 1) {
                  arr.push({ id: user[i], account: user[i], userName: userName[i] })
                }
              }
              this.PersonModal.show('', arr);
            } else {
              this.PersonModal.show('');
            }
          },
          onChange: val => {
            if (Array.isArray(val)) {
              let selectPersonStrArr
              let selectPersonArrOther
              if (current.info && !selectPerson) {
                const { toUser, toUserName } = current.info;
                selectPersonStrArr = toUser.split(',');
                selectPersonArrOther = toUserName.split(',');
                for (let i = 0; i < selectPersonStrArr.length; i += 1) {
                  if (!val.includes(selectPersonArrOther[i])) {
                    selectPersonStrArr[i] = undefined;
                    selectPersonArrOther[i] = undefined;
                  }
                }
                const str = selectPersonStrArr.filter(item => item !== undefined).join(',');
                this.setState(() => ({
                  selectPerson: str,
                  selectPersonArr: [...selectPersonArrOther.filter(item => item !== undefined)],
                  editState: true,
                }))
                return
              }
                selectPersonStrArr = selectPerson.split(',');
                for (let i = 0; i < selectPersonStrArr.length; i += 1) {
                  if (!val.includes(selectPersonArr[i])) {
                    selectPersonStrArr[i] = undefined;
                    selectPersonArr[i] = undefined;
                  }
                }
                const str = selectPersonStrArr.filter(item => item !== undefined).join(',');
                this.setState(() => ({
                  selectPerson: str,
                  selectPersonArr: [...selectPersonArr.filter(item => item !== undefined)],
                }))
                return
            }
            this.setState(() => ({
              selectPerson: '',
              selectPersonArr: [],
            }))
          },
        },
      },
    ]

    return (
      <Modal
        visible={show}
        title={this.showTitle()}
        width="50vw"
        centered
        destroyOnClose
        onCancel={this.handleCancel}
        footer={this.renderFooter()}
      >
        <div className="demo-container">
          <SForm
            ref={form => {
              this.form = form
            }}
            formItems={formItems}
          />
          <PersonModal
            onInit={userModal => {
              this.PersonModal = userModal;
            }}
            multiple
            confirm={selectRows => {
              const str = selectRows.map(item => item.account).join()
              const strName = selectRows.map(item => item.userName)

              this.setState(() => ({ selectPerson: str, selectPersonArr: [...strName] }))
              this.form.setFieldsValue({
                person: strName,
              })
            }}
          />
        </div>
      </Modal>
    );
  }
}

export default BraftModal;

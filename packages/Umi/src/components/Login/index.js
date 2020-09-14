import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { Warning } from 'view'


// import LoginContext from './loginContext';
import ItemMap from './map';

import styles from './index.less'

const FormItem = Form.Item;
// 获取IE版本
function IEVersion () {
  // 取得浏览器的userAgent字符串
  const { userAgent } = navigator;
  // 判断是否为小于IE11的浏览器
  const isLessIE11 = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
  // 判断是否为IE的Edge浏览器
  const isEdge = userAgent.indexOf('Edge') > -1 && !isLessIE11;
  // 判断是否为IE11浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isLessIE11) {
    const IEReg = new RegExp('MSIE (\\d+\\.\\d+);');
    // 正则表达式匹配浏览器的userAgent字符串中MSIE后的数字部分，，这一步不可省略！！！
    IEReg.test(userAgent);
    // 取正则表达式中第一个小括号里匹配到的值
    const IEVersionNum = parseFloat(RegExp.$1);
    if (IEVersionNum === 7) {
      // IE7
      return 7
    } if (IEVersionNum === 8) {
      // IE8
      return 8
    } if (IEVersionNum === 9) {
      // IE9
      return 9
    } if (IEVersionNum === 10) {
      // IE10
      return 10
    }
    // IE版本<7
    return 6
  } if (isEdge) {
    // edge
    return 'edge'
  } if (isIE11) {
    // IE11
    return 11
  }
  // 不是ie浏览器
  return -1
}

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount () { }

  refreshCaptchaImage = () => {
    this.setState({
      datestate: Date.now(),
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    // const isWebKit = navigator.userAgent.indexOf('WebKit') > -1 // 是否是WebKit 内核
    // const version = IEVersion();
    // const pass = version >= 10 || version === 'edge'
    // if (!isWebKit && !pass) {
    //   Warning({ title: '提示', content: '为了更好的体验本系统，请使用chrome浏览器', onOk () { console.log('下载中') } })
    //   return
    // }
    this
      .props
      .form
      .validateFields((err, values) => {
        if (!err) {
          const { onSubmit } = this.props;
          onSubmit(values);
        }
      });
  };

  resetClick = () => {
    this
      .props
      .form.resetFields();
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { UserName, Password } = ItemMap
    return (


      <Form onSubmit={this.handleSubmit} className={styles.login}>

        <Form.Item className="username">
          {getFieldDecorator('account', {
            rules: [
              {
                required: true,
                message: '请输入用户名!',
              },
            ],
          })(
            <Input {...UserName.props} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码!',
              },
            ],
          })(
            <Input {...Password.props} />)}
        </Form.Item>
        <Form.Item className={styles.remember}>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: false,
          })(<Checkbox>记住账号</Checkbox>)}
        </Form.Item>

        <Form.Item className={styles.btns}>

          <Button
            size="large"
            className={styles.submit}
            type="primary"
            htmlType="submit"
            loading={this.props.loading}>
            登录
                        </Button>
          <Button
            size="large"
            className={styles.reset} onClick={this.resetClick}>
            重置
                        </Button>

        </Form.Item>
      </Form>

    )
  }
}

export default Form.create()(Login);

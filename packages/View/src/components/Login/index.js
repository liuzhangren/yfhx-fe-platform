import React from 'react';
import { Form, Input, Button } from 'antd';


// import LoginContext from './loginContext';
import ItemMap from './map';

import styles from './index.less'
const FormItem = Form.Item;
class Login extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() { }

  refreshCaptchaImage = () => {
    this.setState({
      datestate: Date.now()
    })
  }

  handleSubmit = e => {

    e.preventDefault();
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
  render() {
    const { getFieldDecorator } = this.props.form;
    const { UserName, Password } = ItemMap
    return (
     

        <Form onSubmit={this.handleSubmit} className={styles.login}>

                    <Form.Item>
                        {getFieldDecorator('account', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户名!'
                                }
                            ]
                        })(
                            <Input {...UserName.props}/>,)}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码!'
                                }
                            ]
                        })(
                            <Input {...Password.props}/>,)}
                    </Form.Item>

          <Form.Item>

            <Button
              size="large"
             className={styles.submit}
              type="primary"
              htmlType="submit"
              loading={this.props.loading}>
              登录
                        </Button>

          </Form.Item>
        </Form>
     
    )
  }
}

export default Form.create()(Login);;
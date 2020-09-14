import React from 'react';
import { connect } from 'dva';
import Login from '@/components/login';
import { message, notification } from 'antd';
import styles from './Login.less';

@connect(({ login, loading }) => ({ login, loading }))

class Userlogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  componentDidMount () {
    const { count } = this.props.login
    if ((count - 0) > 0) {
      notification.info({
        message: '未登录或登录已过期，请重新登录。',
      });
    }
  }

  handleSubmit = values => {
    const { account, password } = values;
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload: {
        account,
        password,
      },
    })
  };

  render () {
    return (
      <div className={styles.Userlogin}>
        <img className={styles.logo} src={require('./../../assets/logo.png')}></img>
        <div className={styles.wrap}>
          <div className={styles.appname}>生产管理支持平台</div>
          <img className={styles.nameline} src={require('./../../assets/login_line.png')}></img>
          <div className={styles.container}>
            <div className={styles.title}>用户登录</div>
            <div className={styles.main}>
              <Login
                onSubmit={this
                  .handleSubmit
                  .bind(this)}
                loading={this.props.loading.global} />
            </div>
          </div>


        </div>
        <div className={styles.copyright}>版权所有：405 &nbsp; &nbsp; &nbsp; &nbsp;技术支持：105</div>

      </div>
    );
  }
}

export default Userlogin;

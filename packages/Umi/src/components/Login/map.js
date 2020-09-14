import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';
// import { getTenantList } from '@/services/restful';

export default {
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      prefix: <img src={require("../../assets/username.png")} className={styles.prefixIcon} />,
      placeholder: '用户名',
    },
    rules: [
      {
        required: true,
        message: '请输入用户名!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <img src={require("../../assets/password.png")} className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: '密码',
    },
    rules: [
      {
        required: true,
        message: '请输入密码!',
      },
    ],
  },
  // Mobile: {
  //   props: {
  //     size: 'large',
  //     prefix: <Icon type="mobile" className={styles.prefixIcon} />,
  //     placeholder: 'mobile number',
  //   },
  //   rules: [
  //     {
  //       required: true,
  //       message: 'Please enter mobile number!',
  //     },
  //     {
  //       pattern: /^1\d{10}$/,
  //       message: 'Wrong mobile number format!',
  //     },
  //   ],
  // },
  // Tenant:{
  //   props: {
  //     size: 'large',
  //     componentDidMount: function(self,form){
  //       getTenantList().then((response)=>{
  //         const data =response === undefined ? [] : response.data || []
  //         const selectOption = data.map(item => {
  //           return (
  //             <Select.Option key={`${item.id}`} value={`${item.id}`}>
  //               {item.name}
  //             </Select.Option>
  //           );
  //         });
  //         self.setState({
  //           selectOption
  //         })
  //       })
  //     },
  //     placeholder: 'captcha',
  //   },
  //   rules: [
  //     {
  //       required: true,
  //     },
  //   ],
  // },
  // Captcha: {
  //   props: {
  //     size: 'large',
  //     prefix: <Icon type="mail" className={styles.prefixIcon} />,
  //     placeholder: 'captcha',
  //   },
  //   rules: [
  //     {
  //       required: true,
  //       message: 'Please enter Captcha!',
  //     },
  //   ],
  // },
  // CaptchaImage: {
  //   props: {
  //     size: 'large',
  //     prefix: <Icon type="mail" className={styles.prefixIcon} />,
  //     placeholder: 'captcha',
  //   },
  //   rules: [
  //     {
  //       required: true,
  //       message: 'Please enter Captcha!',
  //     },
  //   ],
  // },
};

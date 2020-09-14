/* eslint-disable */
import React, { Component } from 'react';
import { Form, Button, Row, Col } from 'antd';
import SForm from '@/components/Form/SForm';
import RoleForm  from '@/components/Role/RoleForm';
import Scard from '@/components/CardActions/Scard';

import { getValidateMessage } from '@/components/Form/validateMessage'

@Form.create({
  validateMessages: getValidateMessage()
})
class PuserForm extends Component {
  static defaultProps = {
    formItems : [
     
    ]
  };
  state = {
    stateBox : false,
    stateRul : true,
  };

  render() {

    const { onFormLoad, type } = this.props;

    const formItems = [
      {
        key: 'account',
        label: '账号',
        componentType: 'input',
        props: {
          disabled: type === "UPDATE" ? true : false
        },
        options: {
          rules: [
            { required: true },
            { min: 1, max: 15, message: "此项不能超过15个字符" },
          ],
        },
        
      },
      {
        key: 'userName',
        label: '用户姓名',
        componentType: 'input',
        options: {
          rules: [
            { required: true },
            { min: 1, max: 15, message: "此项不能超过15个字符" },
          ],
        },
        
      },
      {
        key: 'sex',
        label: '性别',
        componentType: 'optionSelect',
        options: {
          rules: [{ required: true }],
        },
        props: {
          options: [{
            value: 0,
            label: "女"
          }, {
            value: 1,
            label: "男"
          }]
        }
      },{
        key: 'birthday',
        label: '出生日期',
        componentType: 'datePicker',
        options: {
          rules: [{ required: true }],
        },
        props : {
          format : 'YYYY-MM-DD'
        }
       
        
      },{
        key: 'nation',
        label: '民族',
        componentType: 'input',
        options: {
          rules: [{ required: true }],
        },
      },{
        key: 'phone',
        label: '手机号',
        componentType: 'input',
        // options: {
        //   rules: [{ required: true },{ pattern: /[0-9-()（）]{7,18}/, message: "请输入正确的手机号" }],
        // },
      },{
        key: 'workerType',
        label: '职工类型',
        componentType: 'input',
        options: {
          rules: [{ required: true }],
        },
      },{
        key: 'bcontractor',
        label: '是否承包商人员',
        componentType: 'optionSelect',
        options: {
          rules: [{ required: true }],
        },
        props: {       
          options: [{
            value: 0,
            label: "否"
          }, {
            value: 1,
            label: "是"
          }],
          onChange: (value) => {
            if(value == 0){
              this.setState ({
                stateBox : true,
                stateRul : false
              })
            }else{
              this.setState ({
                stateBox : false,
                stateRul : true
              })
            }
          }
        }
      },{
        key: 'contractor',
        label: '所属承包商',
        componentType: 'input',
        props : {
          disabled: this.state.stateBox
        },
        options: {
          rules: [{ required: this.state.stateRul }],
        },
      },
      {
        key: 'remark',
        label: '备注',
        componentType: 'textArea',
        options: {
          rules: [],
        },
        props: {
          autoSize: { minRows: 3, maxRows: 5 },

        },
      },
    ]
    
    
    //树节点的处理字段
    // if (type === "ADD") {
    //   formItems.unshift({
    //     key: 'orgNo',
    //     label: '父级orgNo',
    //     componentType: 'inout',
    //     props: {
    //       disabled: true
    //     },
    //     options: {
    //       rules: [{ required: true }],
    //     },
    //   })
    // }

    return (
      <SForm
        ref={form => {
          onFormLoad(form);
        }}
        formItems={formItems}
        rowNum = {2}
        layoutType = {4}
      />
    );
  }
}
export default PuserForm;

// 建账申请信息
import React, { Component } from 'react';
import SForm from '../../components/Form/SForm';
import { Button, Row, Col } from 'antd';
import Icon from '../../components/Icon'

class CreationForm extends Component {
  state = {
    dictType: "SEALED_STATE",
    isShow: true,
    inputValue: 0
  }
  componentDidMount() {
    this.form.setFieldsValue({
      remark: '1.aaaaaaa\n2.bbbbbb\n3.cccccc'
    })
    if (this.form) {
      this.form.setFieldsValue({ categoryCode1: [111, 222], categoryName2: [1, 2], switch: '否' })
      //this.form.setFieldsValue({ categoryCode1: [111, 222], categoryCode13: [111, 222], categoryName2: [1, 2] })
    }
  }

  render() {
    const { isShow } = this.state
    const formItems = [

      {
        key: 'categoryName2',
        label: '启用日期启用日期启用日期',
        componentType: 'optionSelect',
        show: isShow,
        //occupad: 1,
        props: {
          //mode: "multiple",
          options: [
            { aa: "1", id: 1 },
            { aa: "2", id: 2 },
            { aa: "3", id: 3 },
            { aa: "4", id: 4 }
          ],
          keys: "id",
          label: "aa",
          labelInValue: true,
          style: {
            width: '100%'
          },
        },
        options: {
          rules: [{ required: true }],
        },
      },
      {
        key: 'categoryCode13',
        label: '单位主管编号',
        componentType: 'cascader',

        column: 3,
        options: {
          rules: [{ required: true, }],
        },
        props: {
          //disabled: true,
        }
      },
      {
        key: 'categoryCode13',
        label: '单位主管编号',
        componentType: 'treeSelect',

        column: 3,
        options: {
          rules: [{ required: true, }],
        },
        props: {
          treeDefaultExpandAll: true,
          treeData: [
            {
              title: 'Node1',
              value: '0-0',
              key: '0-0',
              children: [
                {
                  title: 'Child Node1',
                  value: '0-0-1',
                  key: '0-0-1',
                },
                {
                  title: 'Child Node2',
                  value: '0-0-2',
                  key: '0-0-2',
                },
              ],
            },
            {
              title: 'Node2',
              value: '0-1',
              key: '0-1',
            },
          ]
        }
      },
      {
        key: 'categoryCode1',
        label: '申请单编号',
        componentType: 'inputChoose',

        options: {
          rules: [{ required: true }],
        },

        props: {

          // multiple: true,
          // disabled: true,
          onClick: () => {
            this.form.setFieldsValue({ categoryCode1: [111, 222, 111, 222, 111, 222, 111, 222, 111, 222, 111, 222, 111, 222, 111, 222, 111, 222] })
          },
          onChange: (value) => {
            console.log("aa" + value)
          }
        }
      },
      {
        key: 'categoryCode34',
        label: '联系电话',
        componentType: 'iconSelect',
        occupad: 2,
        options: {
          rules: [{ required: true, }],
        },
      },
      {
        key: 'categoryName2532',
        label: '填报日期',
        componentType: 'datePicker',
        options: {
          rules: [{ required: true },],
        },
      },
      {
        key: 'categoryCode5',
        label: '申报单位',
        componentType: 'input',
        options: {
          rules: [{ required: true, }],
        },
      },
      {
        key: 'categoryCode6',
        label: '资产管理员',
        componentType: 'input',
        options: {
          rules: [{ required: true, }],
        },
      },
      {
        key: 'categoryCode7',
        label: '状态',
        componentType: 'optionSelect',
        options: {
          rules: [{ required: true, }],
        },
        props: {
          options: [{
            dictCode: "3",
            dictName: "审批完成"
          }, {
            dictCode: "1",
            dictName: "审批"
          }, {
            dictCode: "2",
            dictName: "审批中"
          }],
          keys: "dictCode",
          label: "dictName",
          // onChange: (val) => {
          //   console.log(val)
          // }
        }
      },
      {
        key: 'remark',
        label: '建账工作内容',
        componentType: 'textArea',
        props: {
          no: true,
        },
        options: {
          rules: [{ required: true, }],
        },
      },
      {
        key: 'slider',
        label: '滑动模块',
        componentType: 'slider',
        props: {
          max: 50,
          // value: 2,
          tipFormatter: '%'
        },
        options: {
          rules: [{ required: true, }],
        },
      },
      {
        key: 'selectTag',
        label: '选择标签',
        componentType: 'selectTag',
        props: {
          max: 20
        },
        options: {
          rules: [{ required: true, }],
        },
      }
    ]
    const { onFormLoad } = this.props;
    return (
      <div>
        <SForm
          ref={form => {
            this.form = form;
          }}
          formItems={formItems}
          rowNum={2}
          layoutType={4}
        />
        <Icon type="solution" style={{ fontSize: "40px", color: "#f00" }} />
        <Icon type="icon-shebeiguanli" style={{ fontSize: "36px", color: "#00f" }}></Icon>
        <Button onClick={() => {
          const { isShow } = this.state;
          // this.setState({ isShow: !isShow })
          this.form.validateFields((err, values) => {
            console.log(values)
          }
          )
        }}>提交</Button>

      </div>

    );
  }
}
export default CreationForm;

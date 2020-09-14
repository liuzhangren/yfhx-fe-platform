import React from 'react';
import LinkQueryForm from '../../components/LinkTable/LinkQueryForm';
import moment from 'moment';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: moment(),
      isopen: false
    }
  }

  render () {
    const self = this;
    const arr = [
      // {
      //   key: 'orgName',
      //   label: '弹出框选择弹出框择弹出框',
      //   componentType: 'inputChoose',
      //   props: {
      //     multiple: true,
      //     onClick: (value, data) => {
      //       self.highForm.setFieldsValue({ [data.key + data.subKey]: ["aa"] })
      //     }
      //   },
      //   options: {
      //     initialValue: "aa",
      //     rules: [{ required: true }, { pattern: /[0-9-()（）]{7,18}/, message: "请输入正确的手机号" }],
      //   },
      // },
      // {
      //   key: 'categoryName2',
      //   label: 'Select选择',
      //   componentType: 'optionSelect',
      //   props: {
      //     //mode: "multiple",
      //     options: [
      //       { label: 1, value: 1 },
      //       { label: 2, value: 2 },
      //       { label: 3, value: 3 },
      //       { label: 4, value: 4 }
      //     ],
      //   },
      // },
      {
        key: 'planYear',
        label: '年份',
        componentType: 'yearPicker',
      },
      // {
      //   key: 'orgName3',
      //   label: '日期:',
      //   componentType: 'datePicker',
      //   options: {
      //     initialValue: { time: moment(), isopen: false },
      //   },
      // }, 
      {
        key: 'orgName5',
        label: '月份:',
        componentType: 'monthPicker',
      }, 
      // {
      //   key: 'orgName6',
      //   label: '数字框',
      //   componentType: 'inputNumber',
      // },
      // {
      //   key: 'orgName8',
      //   label: '输入框',
      //   componentType: 'input',
      // },
      // {
      //   key: 'categoryCode13',
      //   label: '单位主管编号',
      //   componentType: 'treeSelect',
      //   props: {
      //     treeDefaultExpandAll: true,
      //     treeData: [
      //       {
      //         title: 'Node1',
      //         value: '0-0',
      //         key: '0-0',
      //         children: [
      //           {
      //             title: 'Child Node1',
      //             value: '0-0-1',
      //             key: '0-0-1',
      //           },
      //           {
      //             title: 'Child Node2',
      //             value: '0-0-2',
      //             key: '0-0-2',
      //           },
      //         ],
      //       },
      //       {
      //         title: 'Node2',
      //         value: '0-1',
      //         key: '0-1',
      //       },
      //     ]
      //   }
      // },
    ]

    return (
      <div>
        <LinkQueryForm
          highLevelFormItem={arr}
          // highLevelClick={() => {  }}
          onInitHighForm={form => { this.highForm = form }}
          highConfirm={(values, hide) => {
            console.log(values)
            hide()
          }}
          formItems={arr}
          verifySuccess={value => {
            console.log(value)
          }}
        />
      </div>
    )
  }
}
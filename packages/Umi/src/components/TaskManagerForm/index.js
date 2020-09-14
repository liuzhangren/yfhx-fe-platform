/*eslint-disable */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  SForm,
  Modal,
} from 'view';
import {
  Form,
  Spin,
} from 'antd';

@Form.create()
class PopModal extends Component {
  static defaultProps = {
    loading: false,
  };

  state = {
    type: 'ADD',
    visible: false,
    data: {},
    selected: false,
    timeFlag: '10'
  };

  componentDidMount () {
    this.props.onInit(this);
  }

  handleCancel () {
    this.setState({
      visible: false,
    });
  }

  handleOk () {
    const self = this;
    this.form.validateFields((err, values) => {
      if (!err) {
        const confirm = self.props.confirm || function () { };
        try {
          if (self.state.type == "ADD") {
            confirm(
              {
                ...values,
              },
              self.state.type
            );
          } else {
            confirm(
              {
                ...self.state.data,
                ...values,
              },
              self.state.type
            );
          }
        } catch (e) { }
      }
    });

  }

  hide () {
    this.setState({
      visible: false,
    });
  }


  show (type, data) {
    this.setState(
      {
        visible: true,
        type: type,
        data,

      },
      () => {
        if (type == 'UPDATE') {
          if (this.form) {
            this.form.setFieldsValue({
              ...data,
            });
            this.setState({ timeFlag: data.timeFlag })
          }
        } else {
          if (type == 'ADD') {
            if (this.form) {
              this.form.resetFields();
              this.form.setFieldsValue({
                timeFlag: '10',
                totalTimes: 0,
                completedTimes: 0
              });
              this.setState({ timeFlag: '10' })
            }
          }
        }
      }
    );
  }
  render () {
    const title = this.state.type == 'ADD' ?
      '新增任务管理' :
      '编辑任务管理'
    let reg = new RegExp("(((^([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|^([0-9]|[0-5][0-9]) |^(\\* ))((([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|([0-9]|[0-5][0-9]) |(\\* ))((([0-9]|[01][0-9]|2[0-3])(\\,|\\-|\\/){1}([0-9]|[01][0-9]|2[0-3]) )|([0-9]|[01][0-9]|2[0-3]) |(\\* ))((([0-9]|[0-2][0-9]|3[01])(\\,|\\-|\\/){1}([0-9]|[0-2][0-9]|3[01]) )|(([0-9]|[0-2][0-9]|3[01]) )|(\\? )|(\\* )|(([1-9]|[0-2][0-9]|3[01])L )|([1-7]W )|(LW )|([1-7]\\#[1-4] ))((([1-9]|0[1-9]|1[0-2])(\\,|\\-|\\/){1}([1-9]|0[1-9]|1[0-2]) )|([1-9]|0[1-9]|1[0-2]) |(\\* ))(([1-7](\\,|\\-|\\/){1}[1-7])|([1-7])|(\\?)|(\\*)|(([1-7]L)|([1-7]\\#[1-4]))))|(((^([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|^([0-9]|[0-5][0-9]) |^(\\* ))((([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|([0-9]|[0-5][0-9]) |(\\* ))((([0-9]|[01][0-9]|2[0-3])(\\,|\\-|\\/){1}([0-9]|[01][0-9]|2[0-3]) )|([0-9]|[01][0-9]|2[0-3]) |(\\* ))((([0-9]|[0-2][0-9]|3[01])(\\,|\\-|\\/){1}([0-9]|[0-2][0-9]|3[01]) )|(([0-9]|[0-2][0-9]|3[01]) )|(\\? )|(\\* )|(([1-9]|[0-2][0-9]|3[01])L )|([1-7]W )|(LW )|([1-7]\\#[1-4] ))((([1-9]|0[1-9]|1[0-2])(\\,|\\-|\\/){1}([1-9]|0[1-9]|1[0-2]) )|([1-9]|0[1-9]|1[0-2]) |(\\* ))(([1-7](\\,|\\-|\\/){1}[1-7] )|([1-7] )|(\\? )|(\\* )|(([1-7]L )|([1-7]\\#[1-4]) ))((19[789][0-9]|20[0-9][0-9])\\-(19[789][0-9]|20[0-9][0-9])))")

    const formItems = [
      {
        key: 'name',
        label: '任务描述',
        componentType: 'input',
        options: {
          rules: [{ required: true, message: "任务描述不能为空" },
          { min: 1, max: 30, message: "最大长度30个字符" }],
        },
      },



      // {
      //   key: 'state',
      //   label: '任务状态',
      //   componentType: 'input',
      // },
      {
        key: 'jobClass',
        label: '目标类地址',
        componentType: 'input',
        options: {
          rules: [{ required: true, message: "目标类地址不能为空" }],
        },
      },

      {
        key: 'triggerName',
        label: '目标方法名',
        componentType: 'input',
        options: {
          rules: [{ required: true, message: "目标方法名不能为空" }],
        },
      },

      {
        key: 'timeFlag',
        label: '次数标识',
        componentType: 'optionSelect',
        props: {
          options: [{ dictCode: '20', dictName: '限制' }, { dictCode: '10', dictName: '不限制' },],
          keys: "dictCode",
          label: "dictName",
          onChange: (val) => {
            this.setState({ timeFlag: val })
            if (val === '10') {
              this.form.setFieldsValue({
                totalTimes: 0,
                completedTimes: 0
              });
            }
          }
        }
      },
      {
        key: 'totalTimes',
        label: '总次数',
        componentType: 'inputNumber',
        props: {
          disabled: this.state.timeFlag === '10',
          max: 9999,
          min: 0
        }
      },

      // {
      //   key: 'completedTimes',
      //   label: '已执行次数',
      //   componentType: 'inputNumber',

      //   props: {
      //     disabled: this.state.timeFlag === '10',
      //     max: 9999,
      //     min: 0
      //   }
      // },
      {
        key: 'cron',
        label: '定时规则',
        componentType: 'input',

        options: {
          rules: [{ required: true, message: "定时规则不能为空" },
          {
            pattern: reg
            , message: "请输入正确的Cron表达式"
          }
          ],
        },
      },
      {
        key: 'jobDataMap',
        label: '运行所需参数',
        componentType: 'textArea',

        props: {
          autoSize: { minRows: 3, maxRows: 5 },
        },
      },
    ]
    return (
      <div>
        <Modal
          title={title}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          forceRender
          okText="保存"
          cancelText="取消"
          width={'80vw'}
        >
          <Spin spinning={this.props.loading}>
            <SForm
              ref={form => {
                this.form = form
              }}
              formItems={formItems}
              rowNum={3}
              layoutType={4}
            />
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default PopModal
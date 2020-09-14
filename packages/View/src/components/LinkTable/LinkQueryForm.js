/*eslint-disable */
import React, { Component } from 'react'
import { Form, Row, Col, Input, Icon, Select, ConfigProvider, Tooltip } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Button from '../LinkButton';
import Modal from '../Modal/Smodal'
import style from './index.less'
import YearPicker from '../Form/components/YearPicker';
import getComponentByType from '../Form/components/FormComponentUitl';
import { getValidateMessage } from '../Form/validateMessage'
import classNames from "classnames"

import ReactDOM from 'react-dom';
const { Option } = Select;


class SForm extends Component {
  static defaultProps = {
    highLevelFormItem: []
  };
  state = {
    viewCondition: [],
    highLevelFormItemObj: {},
    choosedKeys: [],
  }
  componentDidMount () {
    const { highLevelFormItem } = this.props;
    let highLevelFormItemObj = {}
    highLevelFormItem.map(item => {
      highLevelFormItemObj[item.key] = item;
    })
    this.setState({ highLevelFormItemObj }, () => {
      this.addCondition("", true)
    })
    // 进去渲染，默认渲染第一条
  }
  reset = () => {
    this.setState({ viewCondition: [] }, () => {
      // 进去渲染，默认渲染第一条
      this.addCondition("", true)
    })
  }
  keysChange = (value, item, index) => {
    const { highLevelFormItemObj, viewCondition } = this.state;
    const data = highLevelFormItemObj[value];
    viewCondition[index] = { ...item, mode: 1, data: { ...data, subKey: item.subKey } }

    this.changeSelectOption(viewCondition)
  }
  modeChange = (value, itm, index) => {
    itm.mode = value;
    const { data: item } = itm
    if (item.componentType === "datePicker") {
      if (value === 3) {
        item.changeKey = item.key + "_datePicker"
        item.componentType = "rangerPicker"
      }
    } else if (item.componentType === "monthPicker") {
      if (value === 3) {
        item.changeKey = item.key + "_monthPicker"
        item.componentType = "monthRangerPicker"
      }
    } else if (item.componentType === "rangerPicker" || item.componentType === "monthRangerPicker") {
      if (value !== 3) {
        if (item.changeKey) {
          if (item.changeKey.indexOf("datePicker") >= 0) {
            item.componentType = "datePicker"
          } else if (item.changeKey.indexOf("monthPicker") >= 0) {
            item.componentType = "monthPicker"
          }
          item.changeKey = ""
        }
      }
    }
    const newItm = { ...itm, data: item }
    const { viewCondition } = this.state;
    viewCondition.splice(index, 1, newItm);
    this.setState({ viewCondition })
  }

  delCondition = (item, index) => {
    let { viewCondition } = this.state;
    viewCondition.splice(index, 1)
    this.changeSelectOption(viewCondition)
  }
  renderHighLevel = (itm, index) => {
    const { viewCondition } = this.state;
    const level = [
      { label: "精确查询", value: 1 }, ,
    ]
    const { data } = itm
    if (data.componentType !== "datePicker"
      && data.componentType !== "rangerPicker"
      && data.componentType !== "monthRangePicker"
      && data.componentType !== "monthPicker"
      && data.componentType !== "inputNumber"
      && data.componentType !== "yearPicker"
    ) {
      level.push(
        { label: "模糊查询", value: 2 })
    }
    if (data.componentType !== "rangerPicker"
      && data.componentType !== "yearPicker"
      && data.componentType !== "input" || data.changeKey
    ) {
      level.push({ label: "区间查询", value: 3 })
    }

    const { highLevelFormItem } = this.props;
    const { mode = 1 } = itm;
    const { componentType } = data
    const { form } = this.props;
    const { getFieldDecorator } = form;
    if (componentType === "inputChoose") {
      const { onClick } = data.props;
      data.props = {
        ...data.props, onClick: (values) => {
          onClick(values, data)
        }
      }

    }

    return (<Row gutter={16} style={{ marginBottom: "20px" }}>
      <Col span={6} >
        {getFieldDecorator(data.key + data.subKey + "_select", { initialValue: data.key })(<Select onChange={(value) => {
          this.keysChange(value, itm, index)
        }}>
          {itm.options.map(item => {
            return (
              <Option key={item.key} value={item.key}>{item.label}</Option>)
          })}
        </Select>)}

      </Col>
      {componentType === "optionSelect" || componentType === "inputChoose" || componentType === "treeSelect" ? <Col span={16}>

        {getFieldDecorator(data.key + data.subKey, { ...data.options })(getComponentByType(data))}

      </Col> : <>
          <Col span={6}>
            {getFieldDecorator(data.key + data.subKey + "_mode", { initialValue: mode })(<Select onChange={(value) => { this.modeChange(value, itm, index) }}>
              {level.map(item => {
                return (
                  <Option key={item.value} value={item.value}>{item.label}</Option>)
              })}
            </Select>)}


          </Col>
          <Col span={10}>
            {mode === 3 && componentType !== "rangerPicker" && componentType !== "monthRangerPicker" ?
              <Row gutter={16}>
                <Col span={12}>
                  {getFieldDecorator(data.key + data.subKey + "_low", { ...data.options })(getComponentByType(data))}
                </Col>
                <Col span={12}>
                  {getFieldDecorator(data.key + data.subKey + "_high", { ...data.options })(getComponentByType(data))}
                </Col>
              </Row> :
              data.changeKey ?
              <>
                {getFieldDecorator(data.changeKey + data.subKey, { ...data.options })(getComponentByType({ ...data, props: data.changeProps }))}
              </> :
              <>
                {getFieldDecorator(data.key + data.subKey, { ...data.options })(getComponentByType(data))}
              </>}
          </Col>
        </>}


      <Col span={2}>
        {viewCondition.length === 1 ? null : <Tooltip title="删除">
          <a style={{ fontSize: "18px" }} onClick={this.delCondition.bind(this, itm, index)}>
            <Icon type="minus-circle" />
          </a>
        </Tooltip>}

      </Col>
    </Row>)


  }

  getKeys (len) {
    let s = [];
    for (var i = 0; i < len; i++) {
      s.push(String.fromCharCode(Math.floor(Math.random() * 26) + 97));
    };
    return s.join("")
  }
  addCondition = (e, init) => {
    const { highLevelFormItem } = this.props;
    let { viewCondition, choosedKeys } = this.state;
    const subKey = "_subKey" + this.getKeys(5);
    if (viewCondition.length >= highLevelFormItem.length) {
      // const news = highLevelFormItem[0];
      // viewCondition.push({
      //   key: news.key,
      //   subKey: subKey,
      //   data: { ...news, subKey: subKey, }
      // })
    } else {
      const data = highLevelFormItem.filter(item => {
        return !choosedKeys.some(itm => itm === item.key)
      })
      if (data.length) {
        viewCondition.push({
          key: data[0].key,
          subKey: subKey,
          data: {
            ...data[0]
            , subKey: subKey,
          }
        })
      }

      // viewCondition.push({
      //   key: highLevelFormItem[viewCondition.length].key,
      //   subKey: subKey,
      //   data: {
      //     ...highLevelFormItem[viewCondition.length]
      //     , subKey: subKey,
      //   }
      // })
      this.changeSelectOption(viewCondition)
    }
  }
  changeSelectOption (viewCondition) {
    const { highLevelFormItem } = this.props;
    const { highLevelFormItemObj } = this.state;
    const choosedKeys = viewCondition.map(item => item.data.key);
    const newV = viewCondition.map(item => {
      //const curData = highLevelFormItemObj[item.data.key];
      const options = highLevelFormItem.filter(itm => {
        if (itm.key === item.data.key) {
          return true;
        } else {
          return !choosedKeys.some(it => it === itm.key)
        }
      })
      //options.unshift();
      return { ...item, options }
    })
    this.setState({ viewCondition: newV, choosedKeys })
  }
  render () {
    const { highLevelFormItem } = this.props;
    const { viewCondition } = this.state;
    return (<div style={{zIndex: 1000}}>
      <Form>
        {viewCondition.map((item, index) => {
          return <Row key={item.key + item.subKey}>
            {this.renderHighLevel(item, index)}
          </Row>
        })}
      </Form>
      {viewCondition.length < highLevelFormItem.length ? <Row>
        <Col span={22}>

          <Button icon='plus' style={{ width: '100%' }} onClick={this.addCondition}>添加查询条件</Button>
        </Col>
      </Row> : null}

    </div>)

  }
}

const WrapSForm = Form.create({
  validateMessages: getValidateMessage(),
})(SForm);

class LinkQueryForm extends Component {
  static defaultProps = {
    formItem: [],
    row: 4,
    highLevelFormItem: []
  };

  state = {
    expand: false,
    initHeight: 0,
    expandHeight: 0,
    expand2: false,
    visible: false,
    wrapWidth: 0,
    viewCount: 3,
    yearTime: null,
  };

  static getDerivedStateFromProps (nextProps) {
    let formItems = [...nextProps.formItems];
    return { formItems };
  }
  componentDidMount () {
    const { highLevelFormItem } = this.props;
    // let highLevelFormItemObj = {}
    // highLevelFormItem.map(item => {
    //   highLevelFormItemObj[item.key] = item;
    // })
    //this.setState({ highLevelFormItemObj })
    // 进去渲染，默认渲染第一条
    //this.addCondition()

    const form = ReactDOM.findDOMNode(this.form);
    this.setState({ initHeight: this.form.offsetHeight, wrapWidth: form.offsetWidth })
    const This = this;
    window.addEventListener(
      'resize', () => {
        This.setState({ wrapWidth: form.offsetWidth })
      })
  }

  getFields = (bool) => {
    const self = this;


    const { expand, formItems, wrapWidth, viewCount, yearTime } = this.state
    const { form, row } = this.props;
    const { getFieldDecorator } = form;
    const count = bool ? viewCount : expand ? formItems.length : viewCount;
    const forms = [];
    let isLessRow = false;
    // if (wrapWidth < 1366) {
    //   isLessRow = true;
    // } else {
    //   isLessRow = false
    // }
    for (let i = 0; i < formItems.length; i += 1) {
      const item = formItems[i];
      if (item.componentType === "optionSelect") {
        let { options = [], keys = "value", label = "label" } = JSON.parse(JSON.stringify(item.props));
        if (options && options.length && options[0][label] !== "全部") {
          const obj = {}
          obj[label] = "全部"
          obj[keys] = ""
          options.unshift(obj);
          item.props = { ...item.props, options }
        }
      }
      const row = isLessRow ? 3 : 4;
      if (item.componentType === "yearPicker") {
        forms.push(
          <Col span={expand ? Math.floor(24 / row) : Math.floor(24 / (viewCount + 1))} key={i} style={{ display: i < count ? 'block' : 'none', marginBottom: "10px" }}>
            <div className={`ant-row ant-form-item ${style.formItem}`}>
              <div className={`ant-col ant-form-item-label ${style.lableCol}`} title={item.label}>
                {item.label}
              </div>
              <div className={`ant-col ant-form-item-control-wrapper ant-form-item-control ${style.wrapperCol}`}>
                <YearPicker time={yearTime} onChange={(time) => { this.setState(() => ({ yearTime: time })) }}/>
              </div>
            </div>
          </Col>
        )
      } else {
        forms.push(
          <Col span={expand ? Math.floor(24 / row) : Math.floor(24 / (viewCount + 1))} key={i} style={{ display: i < count ? 'block' : 'none', marginBottom: "10px" }}>
            <div className={`ant-row ant-form-item ${style.formItem}`}>
              <div className={`ant-col ant-form-item-label ${style.lableCol}`} title={item.label}>
                {item.label}
              </div>
              <div className={`ant-col ant-form-item-control-wrapper ant-form-item-control ${style.wrapperCol}`}>
                {getFieldDecorator(item.key, { ...item.options })(getComponentByType(item))}
              </div>
            </div>
          </Col>
        );
      }
    }
    return forms;
  }


  clearClick = () => {
    // 进去渲染，默认渲染第一条
    this.highFormWrap.reset()

  }

  handleSearch = e => {
    const { formItems, yearTime } = this.state
    const { form, verifySuccess } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const param = {};
        Object.keys(values).map((key) => {
          const v = values[key];
          if (v !== null) {
            param[key] = v;
          }
          return null;
        })
        formItems.forEach(item => {
          if (item.componentType === 'yearPicker') {
            param[item.key] = yearTime
          }
        })
        if (verifySuccess !== undefined) {
          verifySuccess(param);
        }

      }
    });
  };
  searchHigh = () => {
    const { highConfirm = () => { } } = this.props
    this.highForm.validateFields((err, values) => {
      if (!err) {
        const obj = {}
        Object.keys(values).map(item => {
          const val = values[item];
          const namesArr = item.split("_");
          // 获取key值
          const key = namesArr[0];
          obj[key] = obj[key] || {}

          if (namesArr.length <= 2) {
            obj[key].value = val;
          }
          if (namesArr.indexOf("datePicker") >= 0 || namesArr.indexOf("monthPicker") >= 0) {
            obj[key].value = val;
          }
          // 获取mode值
          if (namesArr.indexOf("mode") >= 0) {
            obj[key].mode = val;
          }
          // 获取区间值
          if (namesArr.indexOf("high") >= 0) {
            obj[key].end = val;
          }
          if (namesArr.indexOf("low") >= 0) {
            obj[key].begin = val;
          }
        })
        highConfirm && highConfirm(obj, () => {
          this.setState({ visible: false })
        })
      }
    })
  }

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState(() => ({ yearTime: null }))
  };

  queryLevel = () => {
    const { highLevelClick } = this.props;
    if (highLevelClick) {
      if (typeof highLevelClick === "function") {
        highLevelClick()
        return;
      }
    }
    const self = this;
    this.setState({ visible: true }, () => {
      setTimeout(() => {
        const { onInitHighForm = () => { } } = self.props;
        onInitHighForm(self.highForm)
      }, 100)
    })
  }


  toggle = () => {
    const { expand, expand2 } = this.state;
    this.setState({ expand: !expand, expand2: !expand2 });
  };

  render () {
    const { formItems, labelCol = 8, wrapperCol = 16, zIndex = 3, highLevelFormItem } = this.props;
    const { expand, initHeight, expandHeight, expand2, visible, viewCondition, wrapWidth, viewCount } = this.state;
    const className = classNames(style.searchForm, { [style.expandFormHidden]: expand2 })

    const expandclassName = classNames(style.searchForm, style.expandForm, { [style.expandFormShow]: expand2 })
    let isIcon = false;
    const btnsSpan = formItems.length > viewCount ? Math.floor(24 / (viewCount + 1)) : (24 - Math.floor(formItems.length * 24 / (viewCount + 1)))

    const iconWrap = wrapWidth * btnsSpan / 24;
    if (formItems.length > viewCount) {
      // 有更多
      if (highLevelFormItem && highLevelFormItem.length) {
        // 有高级查询
        if (iconWrap < 380) {
          isIcon = true
        } else {
          isIcon = false
        }
      } else {
        if (iconWrap < 260) {
          isIcon = true
        } else {
          isIcon = false
        }
      }
    } else {
      // 无更多
      if (highLevelFormItem && highLevelFormItem.length) {
        // 有高级查询
        if (iconWrap < 288) {
          isIcon = true
        } else {
          isIcon = false
        }
      } else {
        if (iconWrap < 180) {
          isIcon = true
        } else {
          isIcon = false
        }
      }
    }


    return (
      <ConfigProvider locale={zhCN} >
        <div className={style.searchFormWrap} style={{ height: initHeight }}>

          <div className={className} ref={(form) => { this.form = form }} style={{ height: expand && expandHeight ? expandHeight : "auto", zIndex: zIndex }}>

            <Form layout='inline' onSubmit={this.handleSearch} labelCol={expand ? { span: labelCol } : ""} wrapperCol={expand ? { span: wrapperCol } : ""}>

              <Row align="middle">
                {this.getFields(true)}

                <Col span={btnsSpan} style={{ padding: "4px 0" }}
                >
                  {!isIcon ? <div className={expand ? style.btns : ""}>
                    <Button type="primary" htmlType="submit" icon='search'>
                      搜索
                    </Button>
                    <Button style={{ marginLeft: 4 }} onClick={this.handleReset} icon='redo'  >
                      重置
                    </Button>
                    {formItems.length > viewCount ? (
                      <Button style={{ marginLeft: 4 }} onClick={this.toggle} icon={expand ? 'up' : 'down'}   >
                        更多
                      </Button>
                    ) : null}
                    {highLevelFormItem && highLevelFormItem.length ? <Button style={{ marginLeft: 4 }} onClick={this.queryLevel} icon='filter'  >
                      高级查询
                    </Button> : null}

                  </div> : <div className={expand ? style.btns : ""}>
                      <Tooltip title="搜索">
                        <Button type="primary" htmlType="submit" icon='search'>
                          {/* 搜索 */}
                        </Button>
                      </Tooltip>
                      <Tooltip title="重置">
                        <Button style={{ marginLeft: 4 }} onClick={this.handleReset} icon='redo'  >
                          {/* 重置 */}
                        </Button>
                      </Tooltip>
                      {formItems.length > viewCount ? (
                        <Tooltip title="更多">
                          <Button style={{ marginLeft: 4 }} onClick={this.toggle} icon={expand ? 'up' : 'down'}   >
                          </Button>
                        </Tooltip>
                      ) : null}
                      {highLevelFormItem && highLevelFormItem.length ?
                        <Tooltip title="高级查询"><Button style={{ marginLeft: 4 }} onClick={this.queryLevel} icon='filter'  >
                        </Button></Tooltip> : null}

                    </div>}

                </Col>

              </Row>
            </Form>


          </div>
          <div className={expandclassName} ref={(form) => { this.formExpand = form }} style={{ zIndex: zIndex }}>

            <Form layout='inline' onSubmit={this.handleSearch}>

              <Row align="middle">
                {this.getFields()}
                <Col span={expand ? 24 : 8} style={{ padding: "4px 0" }}
                >
                  <div className={expand ? style.btns : ""}>
                    <Button type="primary" htmlType="submit" icon='search'>
                      搜索
                    </Button>
                    <Button style={{ marginLeft: 4 }} onClick={this.handleReset} icon='redo'  >
                      重置
                    </Button>
                    {formItems.length > viewCount ? (
                      <Button style={{ marginLeft: 4 }} onClick={this.toggle} icon={expand ? 'up' : 'down'}   >
                        更多
                      </Button>
                    ) : null}
                  </div>
                </Col>
              </Row>
            </Form>


          </div>
          <Modal
            title="高级查询"
            visible={visible}
            footer={<>
              <Button onClick={() => { this.setState({ visible: false }) }}>取消</Button>
              <Button onClick={this.clearClick}>清除</Button>
              <Button type="primary" onClick={this.searchHigh}>查询</Button>
            </>}
            width={1000}
            onCancel={() => { this.setState({ visible: false }) }}
          >
            <WrapSForm wrappedComponentRef={(form) => { this.highFormWrap = form }} ref={ref => { this.highForm = ref }} highLevelFormItem={highLevelFormItem} ></WrapSForm>
          </Modal>
        </div>
      </ConfigProvider>
    );
  }
}

const WrappedRegistrationForm = Form.create()(LinkQueryForm);
export default WrappedRegistrationForm;

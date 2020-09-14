/* eslint-disable */
import React, { Component } from 'react';
import { Form, Row, Col, Input, InputNumber, ConfigProvider, Tag } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import getComponentByType from './components/FormComponentUitl'
import { getValidateMessage } from './validateMessage'
import style from './index.less'

class SForm extends Component {

  static defaultProps = {
    formItemLayout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    },

    layouts: [
      {
        keys: ['code', 'name1', 'name2', 'name3'],
      },
      {
        keys: ['name4', 'name5'],
      },
      {
        keys: ['name6'],
      },
    ],
  };

  state = {
    formItems: [],
  };

  static getDerivedStateFromProps (nextProps) {
    let { formItems } = nextProps;
    // if (getLocale() === 'en-US') {
    //   return formItems.map(items => (items.label = items.key));
    // }
    return { formItems };
  }

  /**
   * 渲染布局策略2
   * 根据layout 配置单列表单
   */
  renderLayout2 () {
    const { formItems, formItemLayout } = this.props;
    // const locale = getLocale() === 'en-US' ? enUS : zhCN;
    return (
      // <ConfigProvider  ></ConfigProvider>
      <ConfigProvider locale={zhCN}>
        <Form {...formItemLayout} colon={false}>
          {formItems.map((formItem, index) => {
            if (formItem.show !== false) {
              return <Row>{this.renderItem(formItem)}</Row>;
            }
          })}
        </Form>
      </ConfigProvider>
    );
  }

  //我先把现存功能先调好

  /**
   * 渲染布局策略1
   * 根据layout 配置一行多个表单
   */
  renderLayout1 () {
    const { layouts, formItemLayout } = this.props;
    const { formItems } = this.state;
    return (
      <ConfigProvider locale={zhCN}>
        <Form {...formItemLayout} colon={false}>
          {layouts.map((row, i) => {
            return (
              <Row key={i} gutter={16}>
                {row.keys.map((col, i) => {
                  const formitem = formItems.filter(i => i.key === col);
                  let item = undefined;
                  if (formitem instanceof Array) {
                    item = formitem[0];
                  }
                  return (
                    <Col key={i} span={6}>
                      {this.renderItem(item || undefined)}
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </Form>
      </ConfigProvider>
    );
  }

  /**
   * 布局策略3
   */
  renderLayout3 () {
    const { layouts, formItems } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <ConfigProvider locale={zhCN}>
        <Form {...formItemLayout} colon={false}>
          {Object.keys(layouts).map(legend => {
            return (
              <Row>
                {Object.keys(layouts[legend]).map(index => {
                  const row = layouts[legend][index];
                  return (
                    <Row gutter={24}>
                      {row.map(col => {
                        const c = Object.keys(col)[0];
                        const fi = formItems.filter(i => {
                          return i.key === c;
                        });
                        const item = fi instanceof Array ? fi[0] : {};
                        return <Col span={col[c]}>{this.renderItem(item)}</Col>;
                      })}
                    </Row>
                  );
                })}
              </Row>
              // <fieldset>
              //   <legend>{formatMessage({ id: legend })}</legend>

              // </fieldset>
            );
          })}
        </Form>
      </ConfigProvider>
    );
  }

  renderLayoutHorizontal () {
    const renderItem = (item) => {
      const { getFieldDecorator } = this.props.form;
      //有些组件需要注入form
      return (
        <ConfigProvider locale={zhCN}>
          <Form.Item key={item.key} label={item.label} {...item.itemProps}>
            {getFieldDecorator(item.key, { ...item.options })(getComponentByType(item))}
          </Form.Item>
        </ConfigProvider>
      );
    }

    // const locale = getLocale() === 'en-US' ? enUS : zhCN;
    const { layouts, formItems, rowNum, } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const forms = [];
    const textAreaForm = []
    for (let i = 0; i < formItems.length; i += 1) {
      const item = formItems[i];
      if (item.show !== false) {
        if (item.componentType === 'textArea') {
          let options = {}
          if (item.options && item.options.rules) {
            const { rules, ...rest } = item.options
            options = { rules: [...rules, { max: 2000, message: '最大长度2000' },], ...rest }
          } else {
            options = { rules: [{ max: 2000, message: '最大长度2000' },] }
          }
          forms.push(
            <Col span={24} key={i}>
              {renderItem(item)}
            </Col>
          );
        } else {
          if (item.column) {
            item.column = item.column >= rowNum ? rowNum : item.column
            let span = item.column * Math.floor(24 / rowNum)
            forms.push(
              <Col span={span} key={i}>
                {renderItem(item)}
              </Col>
            );
          } else {
            forms.push(
              <Col span={Math.floor(24 / rowNum)} key={i}>
                {renderItem(item)}
              </Col>
            );
          }
          if (item.occupad) {
            let occupadItem = []
            for (let index = 0; index < item.occupad; index++) {
              occupadItem.push({
                key: `index${index}`,
                label: `index${index}`,
                componentType: 'tag',
                options: {
                  rules: [{ required: false, }],
                },
                props: {
                  disabled: true
                }
              })
            }
            occupadItem.map(item => {
              forms.push(
                <Col span={Math.floor(24 / rowNum)} key={item.key} style={{ opacity: '0' }}>
                  {renderItem(item)}
                </Col>
              );
            })
          }
        }


      }
    }
    return (
      <ConfigProvider locale={zhCN}>
        <Form layout='inline' className={`ant-advanced-search-form ${style.searchForm}`} colon={false}>
          <Row>
            {forms}
          </Row>
        </Form>
      </ConfigProvider >

    );
  }


  /**
   * 渲染表单表单组件
   */
  renderItem (item) {
    const { getFieldDecorator } = this.props.form;
    //有些组件需要注入form
    return (
      <ConfigProvider locale={zhCN}>
        <Form.Item key={item.key} label={item.label} {...item.itemProps}>
          {getFieldDecorator(item.key, { ...item.options })(getComponentByType(item))}
        </Form.Item>
      </ConfigProvider>
    );
  }



  render () {
    const { layoutType } = this.props;
    if (layoutType === 3) {
      return this.renderLayout3();
    }
    if (layoutType === 1) {
      return this.renderLayout1();
    }
    if (layoutType === 4) {
      return this.renderLayoutHorizontal()
    }
    return this.renderLayout2();
  }
}
const WrappedRegistrationForm = Form.create({
  validateMessages: getValidateMessage(),
})(SForm);
export default WrappedRegistrationForm

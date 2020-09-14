import React from 'react';
import {
  Form,
  Select,
  ConfigProvider,
  Button,
  Row,
  Col,
  Icon,
} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { getValidateMessage } from './validateMessage';
import getComponentByType from './components/FormComponentUitl';
import style from './index.less';

class XForm extends React.Component {
  state = {
    formItems: [],
    lastItem: {
      label: '修改原因',
      key: 'changeReason',
      componentType: 'textArea',
      options: {
        rules: [{ max: 1000, message: '最大长度1000个字符' }],
      },
      props: {
        autoSize: {
          minRows: 2,
        },
        maxlength: 2000,
      },
      options: {
        rules: [{ required: true }],
      },
    },
  }

  componentWillMount () {
    const { formItems } = this.props;
    const { lastItem } = this.state
    const [firstItem, ...rest] = formItems
    this.setState({
      realFormItems: [firstItem, lastItem],
      formItems: rest
    })
  }

  renderItems = () => {
    const { realFormItems, formItems } = this.state
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    return realFormItems.reduce((r, c, i) => {
      return [
        ...r,
        <ConfigProvider locale={zhCN}>
          <div className={style.itemWrapper}>
            <Form.Item
              label={(
                <Select
                  style={{
                    width: 200
                  }}
                  disabled={c.key === 'changeReason' ? true : false}
                  value={c.label}
                  onChange={async value => {
                    const lastItem = realFormItems.pop()
                    const newRealFormItem = realFormItems.filter(item => item.key === c.key)[0]
                    const newRealFormItems = realFormItems.filter(item => item.key !== c.key)

                    const newFormItem = formItems.filter(item => item.key === value)[0]
                    const newFormItems = formItems.filter(item => item.key !== value)
                    realFormItems.splice(i, 1, newFormItem)
                    this.setState({
                      realFormItems: [
                        // newFormItem,
                        // ...newRealFormItems,
                        ...realFormItems,
                        lastItem
                      ],
                      formItems: [
                        ...newFormItems,
                        newRealFormItem
                      ]
                    })
                  }}
                >
                  {
                    formItems.reduce((r, c) => {
                      return [
                        ...r,
                        <Select.Option
                          value={c.key}
                        >
                          {c.label}
                        </Select.Option>
                      ]
                    }, [])
                  }
                </Select>
              )}
            >
              {getFieldDecorator(c.key, c.options)(getComponentByType(c))}
            </Form.Item>
            {
              i === 0 || c.key === 'changeReason' ? null : <Icon
                onClick={() => {
                  const item = realFormItems.splice(i, 1)
                  this.setState({
                    realFormItems,
                    formItems: [
                      ...formItems,
                      ...item
                    ]
                  })
                }}
                style={{
                  position: 'absolute',
                  left: '93%',
                  top: '20%',
                  fontSize: 25
                }}
                type="minus-circle"
              />
            }
          </div>

        </ConfigProvider>
      ]
    }, [])
  }

  handleAdd = () => {
    const { realFormItems, formItems, lastItem } = this.state
    const [firstItem, ...rest] = formItems
    realFormItems.pop()
    this.setState({
      realFormItems: [
        ...realFormItems,
        firstItem,
        lastItem
      ],
      formItems: rest
    })
  }

  render () {
    const { formItems } = this.state;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    return (
      <ConfigProvider locale={zhCN}>
        <Form {...formLayout}>
          {
            this.renderItems()
          }
          <Row
            gutter={24}
          >
            <Col
              span={20}
              push={2}
            >
              {
                formItems.length > 0 ? <Button onClick={this.handleAdd} style={{ width: '100%', marginBottom: 24 }}>+ 增加新的表单</Button> : null
              }
            </Col>
          </Row>
        </Form>
      </ConfigProvider>
    )
  }
}

const XFormWrapperPage = Form.create({ validateMessages: getValidateMessage() })(XForm)
export default XFormWrapperPage
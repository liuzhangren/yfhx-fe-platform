import React, { Component } from 'react';
import {Form,Cascader,Icon} from 'antd';
import {Icon as Iconf} from 'view';
@Form.create()
class MenuForm extends React.Component {
  constructor(props) {
		super(props)
		this.state = {
			iconType: ""
		}
  }
  
  componentDidMount() {
		this.props.onRef(this);
	}

  render() {
    const { getFieldDecorator } = this.props.form;
    const { onRef,entryMenuResource} = this.props;
    return (
      <Form 
        labelCol={{ span: 6 }} 
        wrapperCol={{ span: 14 }}
        >
        <Form.Item label="菜单名称" colon={false} >
          {getFieldDecorator('id', {
            rules: [{ required: true, message: "菜单名称不能为空!" }]
          })(
            <Cascader 
              fieldNames={{label:'resourceName', value: 'id', children: 'list' }}
              options={entryMenuResource}
              displayRender={(label)=>label[label.length - 1]}
              onChange={(v)=>{this.props.selectResource(v)}}
              placeholder="菜单名称"
            />
          )}
        </Form.Item>
        <Form.Item label="菜单图标" colon={false}>
          {getFieldDecorator('icon', {})(
            <Iconf type={this.props.icon||'rt'} style={{fontSize:'50px',color:'#06f'}}/>
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default MenuForm

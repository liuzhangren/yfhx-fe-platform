import React, { Component } from 'react';
import { Form, Button, Row, Col, Spin } from 'antd';
import { SForm, Scard } from 'view';
import { connect } from 'dva';
import debounce from 'lodash/debounce';

@Form.create()
class PuserForm extends Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.onSearch = debounce(this.onSearch, 800);
  }

  state = {
    stateBox: false,
    stateRul: true,
    value: [],
    data: [],
    loading: false,
  };

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'org/getOrgData',
      payload: {
        page: 1,
        limit: 9999,
        porgNo: 'CONTRACT',
      },
    }).then(res => {
      if (res.code === 0) {
        const data = res.data.data.map(user => ({
          orgName: user.orgName,
          id: user.orgNo,
        }));
        this.setState({
          loading: false,
          data,
        })
      }
    })
  }

  onSearch = val => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    if (val === '') {
      this.setState({ data: [], loading: false });
    } else {
      this.setState({ data: [], loading: true });
      const { dispatch } = this.props
      dispatch({
        type: 'org/getOrgData',
        payload: {
          page: 1,
          limit: 9999,
          porgNo: 'CONTRACT',
          orgName: val,
        },
      }).then(res => {
        if (fetchId !== this.lastFetchId) {
          return;
        }
        if (res.code === 0) {
          const data = res.data.data.map(user => ({
            orgName: user.orgName,
            id: user.orgNo,
          }));
          this.setState({
            loading: false,
            data,
          })
        }
      })
    }
  }

  render() {
    const { onFormLoad, type } = this.props;
    const formItems = [
      {
        key: 'account',
        label: '用户账号',
        componentType: 'input',
        props: {
          disabled: type === 'UPDATE',
        },
        options: {
          rules: [
            { required: true },
            { min: 1, max: 15, message: '此项不能超过15个字符' },
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
            { min: 1, max: 15, message: '此项不能超过15个字符' },
          ],
        },

      },
      {
        key: 'sex',
        label: '性别',
        componentType: 'optionSelect',
        props: {
          options: [{
            value: 0,
            label: '女',
          }, {
            value: 1,
            label: '男',
          }],
        },
      },
      {
        key: 'birthday',
        label: '出生日期',
        componentType: 'datePicker',
        props: {
          format: 'YYYY-MM-DD',
        },
      },
      {
        key: 'nation',
        label: '民族',
        componentType: 'input',
      },
      {
        key: 'phone',
        label: '手机号',
        componentType: 'input',
        // options: {
        //   rules: [{ required: true },{ pattern: /[0-9-()（）]{7,18}/, message: "请输入正确的手机号" }],
        // },
      },
      {
        key: 'workerType',
        label: '职工类型',
        componentType: 'input',

      },
      {
        key: 'contractor',
        label: '所属承包商',
        componentType: 'optionSelect',

        props: {

          options: this.state.data,
          keys: 'id',
          label: 'orgName',
          loading: this.state.loading,
          showSearch: true,
          notFoundContent: this.state.loading ? <Spin size="small" /> : null,
          defaultActiveFirstOption: false,
          showArrow: false,
          filterOption: false,
          // onSearch: (val) => {
          //   this.onSearch(val)

          // },
          onChange: value => {
            this.setState({
              loading: false,
            });
          },
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

    return (
      <SForm
        ref={form => {
          onFormLoad(form);
        }}
        formItems={formItems}
        rowNum={2}
        layoutType={4}
      />
    );
  }
}

export default connect(({ puser, org }) => ({
  puser, org,
}))(props => <PuserForm {...props} />);

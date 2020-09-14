import React from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import Exception from '@/components/Exception';
import { Button } from 'antd';

const Exception404 = props => {
  const { route, history } = props;
  return (
    <Exception
      type="404"
      desc="页面不存在"
      backText={<Button type="primary" onClick={() => {
        history.go(-1)
      }}>返回</Button>}
    />
  )
};

export default connect()(Exception404);

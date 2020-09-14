import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';
import { Button } from 'antd';
import { connect } from 'dva';


const Exception403 = props => {
  const { dispatch, menu } = props;
  function goBack() {
    if (menu.tabsActiveKey === '/') {
      return;
    }
    dispatch({
      type: 'menu/delTabs',
      payload: {
        targetKey: menu.tabsActiveKey,
      },
    })
  }
  return (
    <Exception
      type="building"
      backText={<Button type="primary" onClick={() => {
        goBack()
      }}>返回</Button>}
    />
  );
}

export default connect(({ menu }) => ({
    menu,
  }))(Exception403);

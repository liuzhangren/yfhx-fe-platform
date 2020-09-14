import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';

import { Button } from 'antd';

const Exception403 = props => {
  const { route, history } = props;
  return (<Exception
    type="403"
    backText={null}
  />)
};

export default Exception403;

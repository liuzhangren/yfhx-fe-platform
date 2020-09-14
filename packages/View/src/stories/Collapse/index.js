import React from 'react';
import Collapse from '../../components/Collapse';
import {Icon} from 'antd';
const text = (
    <p style={{ paddingLeft: 24 }}>
      A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found
      as a welcome guest in many households across the world.
    </p>
);

export default class App extends React.Component {
  state = {

  }

  render() {
    return (
      <Collapse
        defaultActiveKey = {['1']}
        collapseItems = {[
          {
            header: '标题内容展示1',
            key: '1',
            content: text,
            props: {
              showArrow: false
            }
          },
          {
            header: '标题内容展示2',
            key: '2',
            content: text,
            props: {
              showArrow: false
            }
          },
        ]}
      >
      </Collapse>
    )
  }
}
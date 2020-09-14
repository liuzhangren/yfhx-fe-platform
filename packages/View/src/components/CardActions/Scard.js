import React, { Component } from 'react';
import { Card } from 'antd';
// import { connect } from 'dva';
import throttle from './throttle';

class Scard extends Component {

  state = {};

  static defaultProps = {
    bordered: false,
    rate: 1,
  };

  componentDidMount() {
    // fix 修复屏幕适配的问题
    window.addEventListener(
      'resize',
      throttle(() => {
        const { dispatch } = this.props;
        if (dispatch) {
          dispatch({ type: 'global/adaptContentSize' });
        }
      }, 300)
    );
  }

  render() {
    const { children, bordered, baseHeight, rate, style, title, height, ...rest } = this.props;

    const actualHeight = height ? height : baseHeight * rate;
    return (
      <Card title={title} style={{ overflowY: 'auto', overflowX: 'hidden', padding: '0 10px', height: actualHeight, backgroundColor: "transparent", ...style }} bordered={bordered} {...rest} bodyStyle={{ padding: '0 0 4px', backgroundColor: "transparent" }}>
        {children}
      </Card>
    );
  }
}

// export default connect(({ global }) => ({
//   baseHeight: global.contentHeight,
// }))(Scard);

export default Scard;

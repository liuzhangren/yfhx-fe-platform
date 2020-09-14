import React from 'react';
import KeepAlive from 'react-activation';
import Count from './Count';

export default class TestPage extends React.Component {
  state = {
    show: true
  }

  render() {
    const { show } = this.state
    return (
      <div>
        <button onClick={() => this.setState({show: !this.state.show})}>Toggle</button>
        <p>没有 KeepAlive</p>
        {show && <Count />}
        <p>有 KeepAlive</p>
        {
          show && (
            <KeepAlive id='Test'>
              <Count />
            </KeepAlive>
          )
        }
      </div>
    )
  }
}
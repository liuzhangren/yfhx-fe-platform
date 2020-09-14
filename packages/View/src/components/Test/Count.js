import React from 'react';


export default class Count extends React.Component {
  state = {
    count: 0
  }

  render() {
    const { count } = this.state
    return (
      <>
        <div> {count} </div>
        <button onClick={() => this.setState({count: this.state.count+1})}>+</button>
        <button onClick={() => this.setState({count: this.state.count-1})}>-</button>
      </>
    )
  }
}
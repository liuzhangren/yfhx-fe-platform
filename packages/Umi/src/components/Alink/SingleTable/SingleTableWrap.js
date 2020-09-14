import React, { Component } from 'react';

class SingleTableWrap extends Component {

  componentDidMount() {
  }


  render() {
    const { style = {} } = this.props;
    const newStyle = { padding: "0 4px", ...style }
    return (
      <div style={newStyle}>
        {this.props.children}
      </div>
    )
  }
}

export default SingleTableWrap;
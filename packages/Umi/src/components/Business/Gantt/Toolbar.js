import React, { Component } from 'react';
import style from './Toolbar.css';

export default class Toolbar extends Component {
  handleZoomChange = e => {
    if (this.props.onZoomChange) {
      this.props.onZoomChange(e.target.value)
    }
  }

  render() {
    const { zoom } = this.props;
    let transformZoom = ''
    if (zoom === 'Years') {
      transformZoom = '年'
    } else if (zoom === 'Months') {
      transformZoom = '月'
    } else {
      transformZoom = '周'
    }
    const zoomRadios = ['年', '月', '周'].map(value => {
      const isActive = transformZoom === value;
      return (
        <label key={ value } className={ `${style['radio-label']} ${isActive ? `${style['radio-label-active']}` : ''}` }>
          <input type="radio"
            checked={ isActive }
            onChange={ this.handleZoomChange }
            value={ value }/>
          { value }
        </label>
      );
    });

    return (
      <div className="tool-bar">
        <b>维度: </b>
          { zoomRadios }
      </div>
    );
  }
}

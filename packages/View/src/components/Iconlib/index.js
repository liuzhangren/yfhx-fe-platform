import React, { Component } from 'react';
import { Row, Col, Input } from 'antd';
import Icon from "../Icon"
import iconData from './iconData';
import styles from './Iconlib.less';

const Search = Input.Search;

export default class Iconlib extends Component {
  state = {
    iconData,
  };

  render() {
    return (
      <div>
        <Search
          placeholder="input search text"
          onSearch={value => {
            let result = [];
            let keys = Object.keys(iconData);
            for (let i = 0; i < keys.length; i++) {
              for (let j = 0; j < iconData[keys[i]].length; j++) {
                let type = iconData[keys[i]][j];
                if (type.match(value) !== null) {
                  result.push(type);
                }
              }
            }
            let newIconData = {
              查询结果: result,
            };
            this.setState({
              iconData: value === '' ? iconData : newIconData,
            });
          }}
          size={'large'}
        />
        <div style={{ overflow: 'scroll', height: '60vh', marginTop: 40 }}>
          {Object.keys(this.state.iconData).map((title, tindex) => (
            <Row key={tindex}>
              <Row style={{ marginTop: 20, fontSize: 23, textAlign: 'center' }}>
                <Col span={4}>{title}</Col>
              </Row>
              <Row gutter={16}>
                {this.state.iconData[title].map((type, index) => (
                  <Col
                    key={index}
                    className={styles.sa_icon_block}
                    span={4}
                    onClick={() => {
                      if (this.props.onSelect) {
                        this.props.onSelect(type);
                      }
                    }}
                  >
                    <Row style={{ fontSize: 36 }}>
                      <Icon size={'large'} type={type}></Icon>
                    </Row>
                    <Row style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{type}</Row>
                  </Col>
                ))}
              </Row>
            </Row>
          ))}
        </div>
      </div>
    );
  }
}

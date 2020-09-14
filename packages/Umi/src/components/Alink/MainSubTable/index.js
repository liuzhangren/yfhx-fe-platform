import React from 'react';

import { connect } from 'dva';
import {
  Collapse
} from 'view';
import styles from "./index.less"


import Table from "@/components/Alink/SingleTable"



class MainSubTable extends React.Component {
  render() {

    const { mainTable, subTable } = this.props;
    return (
      <div className={styles.MainSubTable}>
        {this.props.children}
      </div>
    )
  }
}


export default MainSubTable



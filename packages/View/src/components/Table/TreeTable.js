// import React from 'react';
// // import { BaseTable } from 'ali-react-table';
// import axios from 'axios';
// export default class TreeTable extends React.Component {
//   state = {
//     dataSource: []
//   }
//   columns = [
//     {
//       code: 'name',
//       name: '数据维度',
//       lock: true,
//       width: 200,
//     },
//     { code: 'shop_name', name: '门店' },
//     { code: 'imp_uv_dau_pct', name: '曝光UV占DAU比例', align: 'right' },
//     { code: 'app_qty_pbt', name: 'APP件单价', align: 'right' },
//     { code: 'all_app_trd_amt_1d', name: 'APP成交金额汇总', align: 'right' },
//   ]

//   async componentDidMount() {
//     const res = await axios.get('https://gw.alipayobjects.com/os/bmw-prod/2eb02d0b-993f-4531-8424-a8df1899299e.json')
//     // debugger
//     this.setState({
//       dataSource: res.data
//     })
//   }

//   render() {
//     return (
//       <BaseTable
//         dataSource={this.state.dataSource}
//         columns={this.columns}
//       />
//     )
//   }
// }
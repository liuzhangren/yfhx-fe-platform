import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import request from '@/utils/request';
import NoticeIcon from './NoticeIcon';
import MessageModal from './MessageModal';
import styles from './index.less';

let setTimeLoop = null;
class GlobalHeaderRight extends PureComponent {
  state = {
    innerNotice: [],
  }

  MessageModal = React.createRef()

  componentDidMount() {
    setTimeLoop = setInterval(() => {
      this.handleGetNoticeInfo()
    }, 60000)
    this.handleGetNoticeInfo()
  }

  componentWillUnmount() {
    clearInterval(setTimeLoop);
  }

  handleGetNoticeInfo = () => {
    const result = Promise.resolve(request('/v1/pmessage/newNum'))
    result.then(res => {
      if (res.success) {
        this.setState(() => ({ innerNotice: res.data }))
      }
    }).catch(err => {
      message.error(err.message);
    })
  }

  changeReadState = clickedItem => {
    const { delId } = clickedItem;
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'message/changeNoticeReadState',
        payload: delId,
        callback: () => {
          this.handleGetNoticeInfo()
        },
      });
    }
  };

  handleNoticeClear = (title, key, dataList) => {
    const { dispatch } = this.props;
    message.success(`${'清空了'} ${title}`);

    const str = dataList.map(item => (item.delId)).join()
    dispatch({
      type: 'message/clearNotices',
      payload: str,
      callback: () => {
        this.handleGetNoticeInfo()
      },
    });
  };

  getNoticeData = () => {
    const { innerNotice = [] } = this.state;

    if (!innerNotice || innerNotice.length === 0 || !Array.isArray(innerNotice)) {
      return [];
    }

    const newNotices = innerNotice.map(notice => {
      const newNotice = { ...notice };

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      return newNotice;
    });
    return newNotices;
  };

  render() {
    const { fetchingNotices, onNoticeVisibleChange } = this.props;
    const { innerNotice = [] } = this.state;
    const noticeData = this.getNoticeData();
    return (
      <>
        <NoticeIcon
          className={styles.action}
          count={innerNotice.length}
          onItemClick={item => {
            this.changeReadState(item);
          }}
          loading={fetchingNotices}
          clearText="清空"
          viewMoreText="查看更多"
          onClear={this.handleNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          onViewMore={() => {
            this.MessageModal.current.getWrappedInstance().show()
          }}
          clearClose
        >
          <NoticeIcon.Tab
            tabKey="message"
            count={noticeData.length}
            list={noticeData}
            title="消息"
            emptyText="您已读完所有消息"
            showViewMore
          />
        </NoticeIcon>
        <MessageModal handleGetNoticeInfo={this.handleGetNoticeInfo} ref={this.MessageModal} />
      </>
    );
  }
}

export default connect(({ loading }) => ({
  fetchingNotices: loading,
}))(GlobalHeaderRight);

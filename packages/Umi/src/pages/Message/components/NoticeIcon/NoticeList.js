import { List, Icon } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './NoticeList.less';

const NoticeListFooter = ({
  data,
  title,
  onViewMore,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
  onClear,
  hideNotice,
}) => (
  <div className={styles.bottomBar}>
    {(showClear && data.length !== 0) ? (
      <div onClick={onClear}>
        {clearText} {title}
      </div>
    ) : null}
    {showViewMore ? (
      <div
        onClick={e => {
          if (onViewMore) {
            onViewMore(e);
            hideNotice(false);
          }
        }}
      >
        {viewMoreText}
      </div>
    ) : null}
  </div>
)

const NoticeList = ({
  data = [],
  onClick,
  emptyText,
  ...rest
}) => {
  if (!data || data.length === 0) {
    return (
      <>
        <div className={styles.notFound}>
          <Icon type="message" className={styles.icon} />
          <div>{emptyText}</div>
        </div>
        <NoticeListFooter {...rest} data={data} />
      </>
    );
  }
  return (
    <div>
      <List
        className={styles.list}
        dataSource={data}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.readState === 'READ_STATE_IS_OVER',
          });

          const leftIcon = data.length !== 0 ? (
            <Icon className={styles.iconElement} style={{ color: '#03a9f4' }} type="mail" />
          ) : null;

          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={() => onClick && onClick(item)}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <div className={styles.title}>
                    {item.title}
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description}>
                      {/* <div dangerouslySetInnerHTML={{ __html: item.content }} /> */}
                      {item.content}
                    </div>
                    <div className={styles.datetime}>{item.dateText}</div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      <NoticeListFooter {...rest} data={data} />
    </div>
  );
};

export default NoticeList;

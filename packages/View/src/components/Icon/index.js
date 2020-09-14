import React from "react"
import { Icon } from "antd"
import IconFont from './IconFont';
class Iconf extends React.Component {
  render() {
    const { type: icon, ...rest } = this.props
    if (typeof icon === 'string') {
      // if (isUrl(icon)) {
      //   return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />} />;
      // }
      if (icon.startsWith('icon-')) {
        return <IconFont type={icon} {...rest} />;
      }
      return <Icon type={icon} {...rest} />;
    }
    return icon;
  }
}
export default Iconf;
const compare = (property, sortType = 'ascend') => {
  // 如果不是 ascend,descend,不做下一步比较
  if (!(sortType === 'descend' || sortType === 'ascend')) {
    console.log('再比较');
  }
  return (object1, object2) => {
    // 取得对象属性值
    const value1 = object1[property];
    const value2 = object2[property];

    if (typeof (value1) === typeof (value2)) {
      // 判断 传入的属性值 是number还是 string
      if (typeof (value1) === 'number') {
        // 如果是升序
        if (sortType === 'ascend') {
          return value1 - value2;
        }
        // 如果是降序
        return value2 - value1;
      } if (typeof (value1) === 'string') {
        // 如果是升序
        if (sortType === 'ascend') {
          return value1.toString().localeCompare(value2);
        }
        // 如果是降序
        return value2.toString().localeCompare(value1);
      }
    }
    return true
  }
}

// 如果不是对象数组用这个方法,返回的是undefined
export default (array, property, sortType) => array.sort(compare(property, sortType))

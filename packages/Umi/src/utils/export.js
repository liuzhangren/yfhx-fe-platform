export default params => {
  let str = Object.keys(params).reduce((r, c) => [
      ...r,
      {
        ...(params[c] ? { [c]: params[c] } : {}),
      },
    ], []).reduce((_r, _c) => {
    if (Object.keys(_c).length > 0) {
      _r = `${_r}${Object.keys(_c)[0]}=${encodeURI(Object.values(_c)[0])}&`
    }
    return _r
  }, '')
  str = str.substr(0, str.length - 1);
  return str
}

// console.log(func({pcode: '12', name: 'tom', age: undefined}))

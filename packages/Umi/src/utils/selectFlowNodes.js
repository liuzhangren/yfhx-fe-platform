export default obj => {
  const newObj = obj.childShapes.reduce((r, c) => ({
      ...r,
      [c.resourceId]: c,
    }), {});
  const exclusive = obj.childShapes.reduce((r, c) => // 分支节点
     [
        ...r,
        ...(
            c.stencil.id === 'ExclusiveGateway' ? [c] : []
        ),
    ],
   []);
  // 排除start和end
  const newArr = obj.childShapes.reduce((r, c) => [
      ...r,
      ...(
        c.stencil.id === 'StartNoneEvent' || c.stencil.id === 'EndNoneEvent' ? [] : [c]
      ),
    ], [])
  // 往前面找
  const findLastNodes = (data, temp) => {
    const lastNode = (newArr.reduce((r, c) => {
      if (c.outgoing[0].resourceId === data.resourceId) {
        r.push(c)
      }
      return r
    }, []))[0]
    if (lastNode) {
      if (lastNode.stencil.id === 'UserTask') {
        temp.push(lastNode)
      }
      if (lastNode.stencil.id !== 'StartNoneEvent' && lastNode.stencil.id !== 'ExclusiveGateway') {
        findLastNodes(lastNode, temp)
      }
    }
    return temp
  }
  // 往后找
  const findNextNodes = (data, temp) => {
    const nextNode = newObj[data.outgoing[0].resourceId]
    if (nextNode) {
      if (nextNode.stencil.id === 'UserTask') {
        temp.push(nextNode)
      }
      if (nextNode.stencil.id !== 'EndNoneEvent' && nextNode.stencil.id !== 'ExclusiveGateway') {
        findNextNodes(nextNode, temp)
      }
    }
    return temp
  }
  const output = exclusive.reduce((r, c, i) => {
    // categoryCode equipType
    const nextLabelStr = newObj[c.outgoing[0].resourceId].properties.conditionsequenceflow
    const nextLabel = nextLabelStr.replace('${', '')
    .replace('}', '')
    .replace("'", '')
    .replace("'", '')
    .split('==')[0]
    const cache = c.outgoing.reduce((_r, _c) => {
      const conditionStr = newObj[_c.resourceId].properties.conditionsequenceflow // 条件
      const conditon = conditionStr.replace('${', '')
      .replace('}', '')
      .replace("'", '')
      .replace("'", '')
      .split('==')[1]
      // 前面的集合
      const lastTotal = findLastNodes(c, [])
      const firstItem = lastTotal.shift()
      lastTotal.splice(1, 0, firstItem)
      // 后面的集合
      const nextTotal = findNextNodes(newObj[_c.resourceId], [])
      // 组装
      return {
        ..._r,
        [conditon]: i > 0 ? nextTotal : [...lastTotal, ...nextTotal],
      }
    }, {})
    return {
      ...r,
      [nextLabel]: {
        id: i,
        data: cache,
      },
    }
  }, {})
  return output
}

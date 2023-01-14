// 判断obj上有没有prop属性
function hasOwnP(obj, prop) {
  return Object.hasOwnProperty.call(obj, prop)
}

export {
  hasOwnP,
}

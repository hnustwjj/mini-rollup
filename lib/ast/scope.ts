class Scope {
  name
  parent
  names
  params
  constructor(options: { name?: string; parent?: Scope; params?: string[]; names?: string } = {}) {
    // 作用域的名称
    this.name = options.name
    // 父作用域
    this.parent = options.parent
    // 此作用域内定义的变量
    this.names = options.names || []

    // 函数作用域定义的参数也是该作用域的变量
    this.params = options.params || []
  }

  add(name) {
    this.names.push(name)
  }

  // 递归向上找到包含当前变量名name的作用域
  findDefiningScope(name) {
    // 判断当前作用域中是否有该变量
    if (this.params.includes(name) || this.names.includes(name))
      return this

    else if (this.parent)
      return this.parent.findDefiningScope(name)

    else
      return null
  }
}
export default Scope

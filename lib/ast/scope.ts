class Scope {
  name
  parent
  params
  constructor(options: { name?: string; parent?: Scope; params?: string[] } = {}) {
    // 作用域的名称
    this.name = options.name
    // 父作用域
    this.parent = options.parent
    // 此作用域内定义的变量
    this.params = options.params || []
  }

  add(name) {
    this.params.push(name)
  }

  // 递归向上找到包含当前变量名name的作用域
  findDefiningScope(name) {
    if (this.params.includes(name))
      return this

    else if (this.parent)
      return this.parent.findDefiningScope(name)

    else
      return null
  }
}
export default Scope

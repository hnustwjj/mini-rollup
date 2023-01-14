import MagicString from 'magic-string'
import type { Node } from 'acorn'
import { parse } from 'acorn'
import { EXPORT_NAMED_DECLARATION, IMPORT_DECLARATION, VARIABLE_DECLARATION } from './instance'
import analysis from './ast/analysis'
import type Bundle from './bundle'
class Module {
  code: MagicString
  path: string
  bundle: Bundle
  ast: any
  imports: Record<string, any>
  exports: Record<string, any>

  constructor({ code, path, bundle }: { code: string; path: string; bundle: Bundle }) {
    this.code = new MagicString(code) // 当前模块的代码
    this.path = path // 当前模块的绝对路径
    this.bundle = bundle // 当前模块属于哪个bundle

    // 生成ast
    this.ast = parse(code, { ecmaVersion: 7, sourceType: 'module' })

    // 对ast进行分析
    this.analysis()

    this.imports = {} // 存放当前模块所有的导入
    this.exports = {} // 存放当前模块所有的导出
  }

  analysis() {
    analysis(this.ast, this.code, this)
  }

  expandAllStatements() {
    const allStatements = [] as any[]
    this.ast.body.forEach((statement) => {
      const statements = this.expandStatement(statement)
      allStatements.push(...statements)
    })
    return allStatements
  }

  // 展开一个结点（一个结点可能依赖或者声明多个变量），找到当前结点依赖的变量的声明语句
  // 可能是在当前模块声明，也可能是在导入的模块声明
  expandStatement(statement) {
    statement._included = true // 已经被打包，以后不需要添加了
    const res = [] as any[]

    // tree shaking核心
    res.push(statement)
    return res
  }
}

export default Module

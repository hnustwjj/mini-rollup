import { stat } from 'fs'
import MagicString from 'magic-string'
import { parse } from 'acorn'
import { EXPORT_NAMED_DECLARATION, IMPORT_DECLARATION, VARIABLE_DECLARATION } from './instance'
import analysis from './ast/analysis'
import type Bundle from './bundle'
import { hasOwnP } from './utils'
class Module {
  code: MagicString
  path: string
  bundle: Bundle
  ast: any
  imports: Record<string, any>
  exports: Record<string, any>
  definitions: Record<string, any>
  constructor({ code, path, bundle }: { code: string; path: string; bundle: Bundle }) {
    this.code = new MagicString(code) // 当前模块的代码
    this.path = path // 当前模块的绝对路径
    this.bundle = bundle // 当前模块属于哪个bundle

    // 生成ast
    this.ast = parse(code, { ecmaVersion: 7, sourceType: 'module' })

    this.imports = {} // 存放当前模块所有的导入
    this.exports = {} // 存放当前模块所有的导出
    this.definitions = {} // 存放所有全局变量的定义语句

    // 对ast进行分析
    this.analysis()
  }

  analysis() {
    // 根据ast结点，收集模块的导入导出
    this.ast.body?.forEach((node) => {
    //   import a, {name as n,age} from './msg
      if (node.type === IMPORT_DECLARATION) {
        // 获取导入的来源:  ..msg
        const source = node.source.value

        // 获取所有和导入内容有关的结点,a,{name,age}
        const specifiers = node.specifiers

        specifiers.forEach((specifier) => {
          // {name as n}
          // 本地的变量: n
          const localName = specifier.local.name
          // 导入的变量: name
          const name = specifier.imported?.name ?? localName

          // 记录本地的哪个变量是从哪个模块的哪个变量导出的
          // this.imports.age = {name:"name",localName:"n",source:"./msg"}
          this.imports[localName] = { name, localName, source }
        })
      }
      // export const a = 1
      else if (node.type === EXPORT_NAMED_DECLARATION) {
        const { declaration } = node
        if (declaration.type === VARIABLE_DECLARATION) {
          const varname = declaration.declarations[0].id.name
          //   记录当前模块的导出信息，
          //   this.exports.a = {node,localName:"a",expression:const a = 1对应的结点}
          this.exports[varname] = {
            node,
            localName: varname,
            expression: declaration, // 通过哪个表达式创建的
          }
        }
      }
    })
    analysis(this.ast, this.code, this)
    this.ast.body.forEach((statement) => {
      Object.keys(statement._defines).forEach((name) => {
        // name:全局变量名
        // statement，定义对应变量的语句结点
        this.definitions[name] = statement
      })
    })
  }

  expandAllStatements() {
    const allStatements = [] as any[]
    this.ast.body.forEach((statement) => {
      // 替换导入语句为对应模块的声明语句
      if (statement.type === IMPORT_DECLARATION)
        return

      const statements = this.expandStatement(statement)

      allStatements.push(...statements)
    })
    return allStatements
  }

  // 展开一个结点（一个结点可能依赖或者声明多个变量），找到当前结点依赖的变量的声明语句
  // 可能是在当前模块声明，也可能是在导入的模块声明
  expandStatement(statement) {
    const res = [] as any[]

    const depend = Object.keys(statement._dependsOn)// 外部依赖
    depend.forEach((name) => {
      const definition = this.define(name)
      definition && res.push(definition)
    })

    if (!statement._included) {
      statement._included = true
      // tree shaking核心
      res.push(statement)
    }
    return res
  }

  // 找到定义这个声明变量的结点
  // 可能在当前模块内，可能在外部模块
  define(name) {
    // 查看导入变量里有没有name，有则说明是导入进来的
    if (hasOwnP(this.imports, name)) {
      // this.imports.age = { name: 'name', localName: 'n', source: './msg' }
      const importDeclaration = this.imports[name]
      // 获取msg模块
      const module = this.bundle.fetchModule(importDeclaration.source, this.path)

      // 获取msg模块导出的name
      //   this.exports.a = {node,localName:"name",expression:const name = 1对应的结点}
      const exportDeclaration = module?.exports[importDeclaration.name]

      // 递归调用，有可能msg的name也是从其他地方导入的
      const res = module?.define(exportDeclaration.localName)

      return res
    }
    else {
      const statement = this.definitions[name]
      if (statement && !statement._included) {
        statement._included = true
        return statement
      }

      return null
    }
  }
}

export default Module

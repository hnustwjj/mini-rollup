import fs from 'fs'
import path from 'path'
import * as MagicString from 'magic-string'
import Module from './module'
import { EXPORT_NAMED_DECLARATION } from './instance'

class Bundle {
  entryPath
  modules: Record<string, any>
  nodes: any
  constructor(options: { entry: string }) {
    const { entry } = options

    // 入口文件的绝对路径,包括后缀
    // TODO: 因为目前测试是ts后缀，所以先解析成ts
    this.entryPath = `${entry.replace(/\.ts$/, '')}.ts`

    // 存放着所有模块,入口文件和它依赖的模块
    this.modules = {}
  }

  build(outputFileName: string) {
    // 从入口文件的绝对路径出发,找到入口模块, 创建并返回Module对象
    const entryModule = this.fetchModule(this.entryPath)
    // 把这个入口模块的所有语句进行展开,返回所有语句组成的数组
    this.nodes = entryModule?.expandAllStatements() ?? {}

    const { code } = this.generate()

    fs.writeFileSync(outputFileName, code, 'utf-8')
  }

  // 把this.nodes生成代码
  generate() {
    const magicString = new MagicString.Bundle()
    this.nodes.forEach((node) => {
      const source = node._source.clone()

      // 移除export
      if (node.type === EXPORT_NAMED_DECLARATION)
        source.remove(node.start, node.declaration.start)

      magicString.addSource({
        content: source,
      })
    })
    return { code: magicString.toString() }
  }

  // importee当前模块，importer导入该模块的模块
  fetchModule(importee: string, importer?: string) {
    const route
      = !importer // 如果没有模块导入此模块，那么就是入口模块
        ? importee
        : path.isAbsolute(importee) // 如果是绝对路径
          ? importee
          // import a from './msg.ts' 根据importer路径去解析importee路径
          : path.resolve(path.dirname(importer), `${importee.replace(/\.ts$/, '')}.ts`)

    // 如果存在对应的文件
    if (route) {
      // 根据绝对路径读取源代码
      const code = fs.readFileSync(route, 'utf-8')
      const module = new Module({
        code,
        path: importee,
        // 归属与哪个bundle对象
        bundle: this,
      })
      return module
    }
  }
}
export default Bundle

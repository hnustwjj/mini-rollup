/**
 *
 * @param ast 模块ast
 * @param magicString 模块ast的code
 * @param moduleInstance 模块实例
 */
function analysis(ast, magicString, moduleInstance) {
  // body下的顶层结点,属于顶级作用域
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      // 为每个子结点标记对应的代码
      _source: { value: magicString.snip(statement.start, statement.end) },
    })
  })
}

export default analysis

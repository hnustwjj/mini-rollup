function analysis(ast, magicString, moduleInstance) {
  // body下的顶层结点,属于顶级作用域
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      _source: { value: magicString.snip(statement.start, statement.end) },
    })
  })
}

export default analysis

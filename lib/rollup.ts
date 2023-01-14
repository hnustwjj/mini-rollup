import Bundle from './bundle'

function rollup(entry: string, outputFileName: string) {
  // bundle就代表打包对象,包括所有的模块信息
  const bundle = new Bundle({ entry })
  bundle.build(outputFileName)
}

export default rollup

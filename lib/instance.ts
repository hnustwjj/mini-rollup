// 结点类型

// 导入声明
const IMPORT_DECLARATION = 'ImportDeclaration'

// 具名导入标识符: import {a} from './msg'的 { a }
const IMPORT_SPECIFIER = 'ImportSpecifier'

// 默认导出标识符: import a from './msg' 的 as
// 和具名导入的区别是,没有imported属性
const IMPORT_DEFAULT_SPECIFIER = 'ImportDefaultSpecifier'

// export const a = 1
const EXPORT_NAMED_DECLARATION = 'ExportNamedDeclaration'

// const a = 1
const VARIABLE_DECLARATION = 'VariableDeclaration'

// 会产生作用域的类型
/**
    "type": "FunctionDeclaration",
    "start": 0,
    "end": 19,
    "params": [],
    "async": false,
    "generator": false,
    "expression": false,
    "body":{
        type:"BlockStatement",
        body:[]
    },
    "id": {
        "type": "Identifier",
        "start": 9,
        "end": 12,
        "name": "say"
    },
 */
const FUNCTION_DECLARATION = 'FunctionDeclaration'

const IDENTIFIER = 'Identifier'
export {
  IMPORT_DECLARATION, IMPORT_SPECIFIER, IMPORT_DEFAULT_SPECIFIER, EXPORT_NAMED_DECLARATION, VARIABLE_DECLARATION, FUNCTION_DECLARATION, IDENTIFIER,
}

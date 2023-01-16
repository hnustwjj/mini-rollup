"use strict";
// 结点类型
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDENTIFIER = exports.FUNCTION_DECLARATION = exports.VARIABLE_DECLARATION = exports.EXPORT_NAMED_DECLARATION = exports.IMPORT_DEFAULT_SPECIFIER = exports.IMPORT_SPECIFIER = exports.IMPORT_DECLARATION = void 0;
// 导入声明
const IMPORT_DECLARATION = 'ImportDeclaration';
exports.IMPORT_DECLARATION = IMPORT_DECLARATION;
// 具名导入标识符: import {a} from './msg'的 { a }
const IMPORT_SPECIFIER = 'ImportSpecifier';
exports.IMPORT_SPECIFIER = IMPORT_SPECIFIER;
// 默认导出标识符: import a from './msg' 的 as
// 和具名导入的区别是,没有imported属性
const IMPORT_DEFAULT_SPECIFIER = 'ImportDefaultSpecifier';
exports.IMPORT_DEFAULT_SPECIFIER = IMPORT_DEFAULT_SPECIFIER;
// export const a = 1
const EXPORT_NAMED_DECLARATION = 'ExportNamedDeclaration';
exports.EXPORT_NAMED_DECLARATION = EXPORT_NAMED_DECLARATION;
// const a = 1
const VARIABLE_DECLARATION = 'VariableDeclaration';
exports.VARIABLE_DECLARATION = VARIABLE_DECLARATION;
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
const FUNCTION_DECLARATION = 'FunctionDeclaration';
exports.FUNCTION_DECLARATION = FUNCTION_DECLARATION;
const IDENTIFIER = 'Identifier';
exports.IDENTIFIER = IDENTIFIER;
//# sourceMappingURL=instance.js.map
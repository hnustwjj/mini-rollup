"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const magic_string_1 = __importDefault(require("magic-string"));
const acorn_1 = require("acorn");
const instance_1 = require("./instance");
const analysis_1 = __importDefault(require("./ast/analysis"));
const utils_1 = require("./utils");
class Module {
    constructor({ code, path, bundle }) {
        this.code = new magic_string_1.default(code); // 当前模块的代码
        this.path = path; // 当前模块的绝对路径
        this.bundle = bundle; // 当前模块属于哪个bundle
        // 生成ast
        this.ast = (0, acorn_1.parse)(code, { ecmaVersion: 7, sourceType: 'module' });
        this.imports = {}; // 存放当前模块所有的导入
        this.exports = {}; // 存放当前模块所有的导出
        this.definitions = {}; // 存放所有全局变量的定义语句
        // 对ast进行分析
        this.analysis();
    }
    analysis() {
        var _a;
        // 根据ast结点，收集模块的导入导出
        (_a = this.ast.body) === null || _a === void 0 ? void 0 : _a.forEach((node) => {
            //   import a, {name as n,age} from './msg
            if (node.type === instance_1.IMPORT_DECLARATION) {
                // 获取导入的来源:  ..msg
                const source = node.source.value;
                // 获取所有和导入内容有关的结点,a,{name,age}
                const specifiers = node.specifiers;
                specifiers.forEach((specifier) => {
                    var _a, _b;
                    // {name as n}
                    // 本地的变量: n
                    const localName = specifier.local.name;
                    // 导入的变量: name
                    const name = (_b = (_a = specifier.imported) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : localName;
                    console.log(name);
                    // 记录本地的哪个变量是从哪个模块的哪个变量导出的
                    // this.imports.age = {name:"name",localName:"n",source:"./msg"}
                    this.imports[localName] = { name, localName, source };
                });
            }
            // export const a = 1
            else if (node.type === instance_1.EXPORT_NAMED_DECLARATION) {
                const { declaration } = node;
                if (declaration.type === instance_1.VARIABLE_DECLARATION) {
                    const varname = declaration.declarations[0].id.name;
                    //   记录当前模块的导出信息，
                    //   this.exports.a = {node,localName:"a",expression:const a = 1对应的结点}
                    this.exports[varname] = {
                        node,
                        localName: varname,
                        expression: declaration, // 通过哪个表达式创建的
                    };
                }
            }
        });
        console.log(this);
        (0, analysis_1.default)(this.ast, this.code, this);
        this.ast.body.forEach((statement) => {
            Object.keys(statement._defines).forEach((name) => {
                // name:全局变量名
                // statement，定义对应变量的语句结点
                this.definitions[name] = statement;
            });
        });
    }
    expandAllStatements() {
        const allStatements = [];
        this.ast.body.forEach((statement) => {
            // 替换导入语句为对应模块的声明语句
            if (statement.type === instance_1.IMPORT_DECLARATION)
                return;
            const statements = this.expandStatement(statement);
            allStatements.push(...statements);
        });
        return allStatements;
    }
    // 展开一个结点（一个结点可能依赖或者声明多个变量），找到当前结点依赖的变量的声明语句
    // 可能是在当前模块声明，也可能是在导入的模块声明
    expandStatement(statement) {
        const res = [];
        const depend = Object.keys(statement._dependsOn); // 外部依赖
        depend.forEach((name) => {
            const definition = this.define(name);
            res.push(...definition);
        });
        if (!statement._included) {
            statement._included = true;
            // tree shaking核心
            res.push(statement);
        }
        return res;
    }
    // 找到定义这个声明变量的结点
    // 可能在当前模块内，可能在外部模块
    define(name) {
        // 查看导入变量里有没有name，有则说明是导入进来的
        if ((0, utils_1.hasOwnP)(this.imports, name)) {
            // this.imports.age = { name: 'name', localName: 'n', source: './msg' }
            const importDeclaration = this.imports[name];
            // 获取msg模块
            const module = this.bundle.fetchModule(importDeclaration.source, this.path);
            // 获取msg模块导出的name
            //   this.exports.a = {node,localName:"name",expression:const name = 1对应的结点}
            const exportDeclaration = module === null || module === void 0 ? void 0 : module.exports[importDeclaration.name];
            // 递归调用，有可能msg的name也是从其他地方导入的
            return module === null || module === void 0 ? void 0 : module.define(exportDeclaration.localName);
        }
        else {
            const statement = this.definitions[name];
            return (statement && !statement.included)
                ? this.expandStatement(statement)
                : [];
        }
    }
}
exports.default = Module;
//# sourceMappingURL=module.js.map
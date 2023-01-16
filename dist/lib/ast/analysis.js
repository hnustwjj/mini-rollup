"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const instance_1 = require("../instance");
const scope_1 = __importDefault(require("./scope"));
const walk_1 = __importDefault(require("./walk"));
/**
 * 分析当前模块使用到了哪些变量：当前模块声明的和导入的
 * @param {*} ast  语法树
 * @param {*} magicString 源代码
 * @param {*} moduleInstance 属于哪个模块
 */
function analysis(ast, magicString, moduleInstance) {
    // 模块内的模块内的全局作用域
    let currentScope = new scope_1.default();
    // body下的顶层结点,属于顶级作用域
    ast.body.forEach((statement) => {
        Object.defineProperties(statement, {
            // 为每个子结点标记对应的代码
            _source: { value: magicString.snip(statement.start, statement.end) },
            _defines: { value: {} },
            _dependsOn: { value: {} },
            _included: { value: true, writable: true }, // 判断当前语句是否被打包，防止多次打包
        });
        // 给作用域添加变量
        // 例如function test()，那么name就是test
        function addToScope(identifierName) {
            currentScope.add(identifierName); // 把test加入作用域
            // 如果当前是全局作用域
            if (!currentScope.parent)
                // 标记全局作用域下声明了test这个变量
                statement._defines[identifierName] = true;
        }
        // 构建作用域链, 保存所有变量params
        (0, walk_1.default)(statement, {
            enter(node) {
                let newScope;
                switch (node.type) {
                    case instance_1.FUNCTION_DECLARATION:
                        // 函数的参数也是函数内声明的变量
                        const params = node.params.map(x => x.name);
                        // 拿到identifier内保存的name标识符
                        addToScope(node.id.name);
                        // 如果是顶层的函数声明，会生成新的作用域
                        newScope = new scope_1.default({
                            parent: currentScope,
                            params,
                        });
                        break;
                    // 变量声明不会产生新的作用域
                    case instance_1.VARIABLE_DECLARATION:
                        node.declarations.forEach(addToScope);
                        break;
                }
                // 如果生成了新的作用域，那么紧接着会进入该作用域内的结点
                // 那么此时在访问currentScope时，就属于当前作用域了
                if (newScope) {
                    // 给会生成新的作用域的结点,标记_scope
                    Object.defineProperty(node, '_scope', { value: newScope });
                    currentScope = newScope;
                }
            },
            leave(node) {
                // 如果一个结点产生了作用域，那么要回到父作用域（回溯）
                if (node._scope)
                    currentScope = currentScope.parent;
            },
        });
    });
    ast._scope = currentScope;
    ast.body.forEach((statement) => {
        // 找出外部依赖_dependsOn
        (0, walk_1.default)(statement, {
            enter(node) {
                // 如果这个结点产生了新的作用域，那么就修改指向
                if (node._scope)
                    currentScope = node._scope;
                // 如果是标识符,就从作用域开始向上查找,看当前遍历是否在作用域链中定义
                if (node.type === instance_1.IDENTIFIER) {
                    const definingScope = currentScope.findDefiningScope(node.name);
                    // 如果没定义，说明该变量是依赖的外部变量
                    if (!definingScope)
                        statement._dependsOn[node.name] = true;
                }
            },
            leave(node) {
                // 退出时，回退作用域
                if (node._scope)
                    currentScope = currentScope.parent;
            },
        });
    });
}
exports.default = analysis;
//# sourceMappingURL=analysis.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function walk(astNode, { enter, leave }) {
    visit(astNode, null, enter, leave);
}
// dfs遍历ast
function visit(node, parent, enter, leave) {
    // 进入结点的回调
    enter && enter(node, parent);
    const keys = Object.keys(node).filter(key => typeof node[key] === 'object');
    keys.forEach((key) => {
        const value = node[key];
        if (Array.isArray(value))
            value.forEach(val => visit(val, node, enter, leave));
        // 遍历有type属性的对象
        else if (value && value.type)
            visit(value, node, enter, leave);
    });
    // 离开结点的回调
    leave && leave(node, parent);
}
exports.default = walk;
//# sourceMappingURL=walk.js.map
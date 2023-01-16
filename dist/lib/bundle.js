"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const MagicString = __importStar(require("magic-string"));
const module_1 = __importDefault(require("./module"));
const instance_1 = require("./instance");
class Bundle {
    constructor(options) {
        const { entry } = options;
        // 入口文件的绝对路径,包括后缀
        // TODO: 因为目前测试是ts后缀，所以先解析成ts
        this.entryPath = `${entry.replace(/\.ts$/, '')}.ts`;
        // 存放着所有模块,入口文件和它依赖的模块
        this.modules = {};
    }
    build(outputFileName) {
        var _a;
        // 从入口文件的绝对路径出发,找到入口模块, 创建并返回Module对象
        const entryModule = this.fetchModule(this.entryPath);
        // 把这个入口模块的所有语句进行展开,返回所有语句组成的数组
        this.nodes = (_a = entryModule === null || entryModule === void 0 ? void 0 : entryModule.expandAllStatements()) !== null && _a !== void 0 ? _a : {};
        const { code } = this.generate();
        fs_1.default.writeFileSync(outputFileName, code, 'utf-8');
    }
    // 把this.nodes生成代码
    generate() {
        const magicString = new MagicString.Bundle();
        this.nodes.forEach((node) => {
            const source = node._source.clone();
            // 移除export
            if (node.type === instance_1.EXPORT_NAMED_DECLARATION)
                source.remove(node.start, node.declaration.start);
            magicString.addSource({
                content: source,
            });
        });
        return { code: magicString.toString() };
    }
    // importee当前模块，importer导入该模块的模块
    fetchModule(importee, importer) {
        const route = !importer // 如果没有模块导入此模块，那么就是入口模块
            ? importee
            : path_1.default.isAbsolute(importee) // 如果是绝对路径
                ? importee
                // import a from './msg.ts' 根据importer路径去解析importee路径
                : path_1.default.resolve(path_1.default.dirname(importer), `${importee.replace(/\.ts$/, '')}.ts`);
        // 如果存在对应的文件
        if (route) {
            // 根据绝对路径读取源代码
            const code = fs_1.default.readFileSync(route, 'utf-8');
            const module = new module_1.default({
                code,
                path: importee,
                // 归属与哪个bundle对象
                bundle: this,
            });
            return module;
        }
    }
}
exports.default = Bundle;
//# sourceMappingURL=bundle.js.map
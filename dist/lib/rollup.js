"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bundle_1 = __importDefault(require("./bundle"));
function rollup(entry, outputFileName) {
    // bundle就代表打包对象,包括所有的模块信息
    const bundle = new bundle_1.default({ entry });
    bundle.build(outputFileName);
}
exports.default = rollup;
//# sourceMappingURL=rollup.js.map
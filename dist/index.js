"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const rollup_1 = __importDefault(require("./lib/rollup"));
const entry = path_1.default.resolve(__dirname, 'src/main.ts');
(0, rollup_1.default)(entry, 'bundle.js');
//# sourceMappingURL=index.js.map
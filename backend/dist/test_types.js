"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const salt = bcryptjs_1.default.genSalt(10); // Promise<string>
const salt2 = 10;
const plain = 'password';
// Check type of hash without await
const h1 = bcryptjs_1.default.hash(plain, 10);
// Check type with await
async function test() {
    const h2 = await bcryptjs_1.default.hash(plain, 10);
    const fn = async () => {
        // Fix application
        const password = (await bcryptjs_1.default.hash(plain, 10));
    };
}

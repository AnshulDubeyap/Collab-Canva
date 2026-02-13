"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./utils/logger"));
const passport_1 = __importDefault(require("./config/passport"));
const app = (0, express_1.default)();
const morganMiddleware = (0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        write: (message) => logger_1.default.http(message.trim()),
    },
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(morganMiddleware);
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
// Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
exports.default = app;

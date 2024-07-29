"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const dateNow = new Date().toISOString().slice(0, 10);
const logDir = path_1.default.join(__dirname, `../../logs/debug-${dateNow}.log`);
const options = {
    transports: [
        new winston_1.default.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
        }),
        new winston_1.default.transports.File({ filename: logDir, level: 'debug' })
    ]
};
const logger = winston_1.default.createLogger(options);
if (process.env.NODE_ENV !== 'production') {
    logger.debug('Logging initialized at debug level');
}
exports.default = logger;
//# sourceMappingURL=logger.js.map
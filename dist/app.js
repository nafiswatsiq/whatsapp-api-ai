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
const express_1 = __importDefault(require("express"));
const whatsappSocket_1 = require("./sockets/whatsappSocket");
const body_parser_1 = __importDefault(require("body-parser"));
const qrController = __importStar(require("./controllers/qrController"));
const messageController = __importStar(require("./controllers/messageController"));
const statusController = __importStar(require("./controllers/statusController"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
(0, whatsappSocket_1.Initialize)();
app.get('/', (_req, res) => {
    return res.send('Hello There! I am WhatsApp Bot.');
});
app.get('/qr', qrController.getQR);
app.post('/message', messageController.sendTextMessage);
app.get('/status', statusController.getStatus);
exports.default = app;
//# sourceMappingURL=app.js.map
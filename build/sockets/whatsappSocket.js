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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sock = exports.qrcode = void 0;
exports.Initialize = Initialize;
exports.sendTextMessage = sendTextMessage;
exports.getStatus = getStatus;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const formatter_1 = require("../utils/formatter");
const connection_1 = require("../config/connection");
const logger_1 = __importDefault(require("../utils/logger"));
const messageService_1 = require("../services/messageService");
const AUTH_FILE_LOCATION = '../../data/session';
exports.qrcode = "";
let phoneNumber = "";
let state = null;
let saveCreds;
let needRestartSocket = false;
function Initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.sock = yield createNewSocket();
        yield (0, connection_1.dbConnect)(process.env.MONGODB_URL);
    });
}
function createNewSocket() {
    return __awaiter(this, void 0, void 0, function* () {
        const { version, isLatest } = yield (0, baileys_1.fetchLatestBaileysVersion)();
        console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);
        const { state: newState, saveCreds: newSaveCreds } = yield (0, baileys_1.useMultiFileAuthState)(path_1.default.join(__dirname, `${AUTH_FILE_LOCATION}`));
        state = newState;
        saveCreds = newSaveCreds;
        var socket = (0, baileys_1.default)({
            version,
            auth: state,
            printQRInTerminal: true,
            browser: baileys_1.Browsers.macOS('Desktop'),
            getMessage: (key) => __awaiter(this, void 0, void 0, function* () {
                return { conversation: { jid: key } };
            }),
        });
        socket.ev.on('connection.update', (update) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { connection, lastDisconnect, qr, isNewLogin } = update;
            logger_1.default.info('connection update', connection, lastDisconnect, qr, isNewLogin);
            if (qr !== undefined) {
                exports.qrcode = qr;
            }
            if (connection === 'close') {
                const shouldReconnect = ((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                logger_1.default.info('connection closed due to ', lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error, ', reconnecting ', shouldReconnect);
                if (shouldReconnect) {
                    exports.sock = yield createNewSocket();
                }
                else {
                    fs.rmSync(path_1.default.join(__dirname, `${AUTH_FILE_LOCATION}`), { force: true, recursive: true });
                    needRestartSocket = true;
                    logger_1.default.info('connection closed due to ', lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error, ', reconnecting ', shouldReconnect);
                }
            }
            else if (connection === 'open') {
                logger_1.default.info('opened connection');
                phoneNumber = (0, formatter_1.FormatToPhoneNumber)((_d = (_c = state === null || state === void 0 ? void 0 : state.creds) === null || _c === void 0 ? void 0 : _c.me) === null || _d === void 0 ? void 0 : _d.id);
                exports.qrcode = "";
            }
        }));
        socket.ev.on('creds.update', saveCreds);
        socket.ev.on('messages.upsert', (m) => __awaiter(this, void 0, void 0, function* () {
            const message = m.messages[0];
            yield (0, messageService_1.messageService)(message, phoneNumber);
        }));
        socket.ev.on('groups.upsert', (g) => __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info('got groups', g);
        }));
        return socket;
    });
}
function sendTextMessage(phoneNumber, message) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info('send message to', phoneNumber, message);
        const jid = (0, formatter_1.FormatToWhatsappJid)(phoneNumber);
        yield exports.sock.presenceSubscribe(jid);
        yield (0, baileys_1.delay)(500);
        yield exports.sock.sendPresenceUpdate('composing', jid);
        yield (0, baileys_1.delay)(2000);
        yield exports.sock.sendPresenceUpdate('available', jid);
        yield (0, baileys_1.delay)(100);
        yield exports.sock.sendPresenceUpdate('paused', jid);
        yield exports.sock.sendMessage(jid, message);
    });
}
function getStatus() {
    if (needRestartSocket) {
        return {
            isConnected: false,
            phoneNumber: "",
            qrcode: "",
            needRestart: true
        };
    }
    if (exports.qrcode === "") {
        return {
            isConnected: true,
            phoneNumber: phoneNumber,
            qrcode: "",
            needRestart: false
        };
    }
    return {
        isConnected: false,
        phoneNumber: "",
        qrcode: exports.qrcode,
        needRestart: false
    };
}

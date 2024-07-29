"use strict";
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
exports.messageService = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const messageModel_1 = require("../models/messageModel");
const formatter_1 = require("../utils/formatter");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../utils/logger"));
const whatsappSocket_1 = require("../sockets/whatsappSocket");
const aiMessageService_1 = require("./aiMessageService");
const messageService = (message, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const isGroup = ((_a = message.key.remoteJid) === null || _a === void 0 ? void 0 : _a.endsWith('@g.us')) == true ? true : false;
        const messageType = Object.keys(message.message)[0];
        if (!message.key.fromMe) {
            if (messageType === 'conversation') {
                logger_1.default.info('got messages', message);
                const newMessage = new messageModel_1.messageModel({
                    remoteJid: message.key.remoteJid,
                    sender: !isGroup ? (0, formatter_1.FormatStandardPhoneNumber)(message.key.remoteJid) : (0, formatter_1.FormatStandardPhoneNumber)(message.key.participant),
                    senderName: message.pushName,
                    recipient: message.key.fromMe ? message.key.remoteJid : phoneNumber,
                    message: ((_b = message.message) === null || _b === void 0 ? void 0 : _b.conversation) || '',
                    isGroup: isGroup,
                    timestamp: new Date(message.messageTimestamp * 1000)
                });
                yield messageModel_1.messageModel.create(newMessage);
                if ((_c = message.message) === null || _c === void 0 ? void 0 : _c.conversation.includes(process.env.PROMPT_KEY)) {
                    yield whatsappSocket_1.sock.readMessages([message.key]);
                    yield whatsappSocket_1.sock.presenceSubscribe(message.key.remoteJid);
                    yield (0, baileys_1.delay)(500);
                    yield whatsappSocket_1.sock.sendPresenceUpdate('composing', message.key.remoteJid);
                    const reply = yield (0, aiMessageService_1.aiMessageService)((_d = message.message) === null || _d === void 0 ? void 0 : _d.conversation, '');
                    yield whatsappSocket_1.sock.sendPresenceUpdate('paused', message.key.remoteJid);
                    yield (0, whatsappSocket_1.sendTextMessage)((0, formatter_1.FormatStandardPhoneNumber)(message.key.remoteJid), { text: reply });
                }
            }
            else if (messageType === 'imageMessage') {
                const imageName = `${message.key.id}.jpg`;
                const buffer = yield (0, baileys_1.downloadMediaMessage)(message, 'buffer', {});
                yield fs_1.default.promises
                    .writeFile(path_1.default.join(__dirname, `../../public/images/${imageName}`), buffer);
                if ((_e = message.message) === null || _e === void 0 ? void 0 : _e.imageMessage.caption.includes(process.env.PROMPT_KEY)) {
                    yield whatsappSocket_1.sock.readMessages([message.key]);
                    yield whatsappSocket_1.sock.presenceSubscribe(message.key.remoteJid);
                    yield (0, baileys_1.delay)(500);
                    yield whatsappSocket_1.sock.sendPresenceUpdate('composing', message.key.remoteJid);
                    const reply = yield (0, aiMessageService_1.aiMessageService)((_f = message.message) === null || _f === void 0 ? void 0 : _f.imageMessage.caption, imageName);
                    yield whatsappSocket_1.sock.sendPresenceUpdate('paused', message.key.remoteJid);
                    yield (0, whatsappSocket_1.sendTextMessage)((0, formatter_1.FormatStandardPhoneNumber)(message.key.remoteJid), { text: reply });
                }
                logger_1.default.info('got image', message);
            }
        }
    }
    catch (error) {
        logger_1.default.error(error);
    }
});
exports.messageService = messageService;
//# sourceMappingURL=messageService.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTextMessage = void 0;
const express_validator_1 = require("express-validator");
const whatsappSocket_1 = require("../sockets/whatsappSocket");
const sendTextMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, express_validator_1.body)('phoneNumber')
        .notEmpty().withMessage('Nomor telepon tidak boleh kosong')
        .matches(/^[0-9]+$/, 'g').withMessage('Nomor telepon hanya boleh berisi angka')
        .isLength({ min: 10, max: 15 }).withMessage('Nomor telepon harus berisi 10-15 karakter')
        .trim()
        .run(req);
    yield (0, express_validator_1.body)('message')
        .isObject()
        .withMessage('Pesan harus berupa object')
        .run(req);
    yield (0, express_validator_1.body)('message.text')
        .notEmpty().withMessage('Pesan tidak boleh kosong')
        .run(req);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            message: errors.array()
        });
    }
    const status = (0, whatsappSocket_1.getStatus)();
    if (!(status === null || status === void 0 ? void 0 : status.isConnected)) {
        return res.status(400).json({
            error: true,
            message: 'Koneksi ke WhatsApp belum terhubung'
        });
    }
    const phoneNumber = req.body.phoneNumber;
    const message = req.body.message;
    (0, whatsappSocket_1.sendTextMessage)(phoneNumber, message);
    return res.status(200).json({
        error: false,
        message: 'Pesan berhasil dikirim'
    });
});
exports.sendTextMessage = sendTextMessage;
//# sourceMappingURL=messageController.js.map
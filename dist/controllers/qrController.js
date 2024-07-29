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
exports.getQR = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const whatsappSocket_1 = require("../sockets/whatsappSocket");
const getQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getQRCode = () => __awaiter(void 0, void 0, void 0, function* () {
        qrcode_1.default.toDataURL(whatsappSocket_1.qrcode, (err, url) => {
            if (err) {
                console.error(err);
                res.status(500).json({
                    error: true,
                    message: 'Terjadi kesalahan saat mendapatkan QR Code'
                });
                return;
            }
            res.json({
                error: false,
                message: 'Silahkan scan QR Code untuk terhubung',
                url,
            });
        });
    });
    try {
        const status = (0, whatsappSocket_1.getStatus)();
        if (status === null || status === void 0 ? void 0 : status.needRestart) {
            (0, whatsappSocket_1.Initialize)();
            setTimeout(() => {
                getQRCode();
            }, 5000);
            return;
        }
        if (status === null || status === void 0 ? void 0 : status.isConnected) {
            res.status(400).json({
                error: true,
                status
            });
            return;
        }
        getQRCode();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Maaf Terjadi kesalahan saat mendapatkan QR Code' });
    }
});
exports.getQR = getQR;
//# sourceMappingURL=qrController.js.map
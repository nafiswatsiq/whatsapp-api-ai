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
exports.getStatus = void 0;
const whatsappSocket_1 = require("../sockets/whatsappSocket");
const getStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = (0, whatsappSocket_1.getStatus)();
    if (status) {
        res.json({
            error: false,
            status
        });
    }
    else {
        res.status(500).json({
            error: true,
            message: 'Terjadi kesalahan saat mendapatkan status'
        });
    }
});
exports.getStatus = getStatus;
//# sourceMappingURL=statusController.js.map
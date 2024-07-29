"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatPromt = exports.FormatToWhatsappJid = exports.FormatStandardPhoneNumber = exports.FormatToPhoneNumber = void 0;
const FormatToPhoneNumber = (number) => {
    if (number == undefined || number == null || number == '') {
        return "";
    }
    const indexOfDoubleDots = number.indexOf(':');
    number = number.substring(0, indexOfDoubleDots >= 0 ? indexOfDoubleDots : number.indexOf('@'));
    return number;
};
exports.FormatToPhoneNumber = FormatToPhoneNumber;
const FormatStandardPhoneNumber = (number) => {
    if (number == undefined || number == null || number == '') {
        return "";
    }
    // remove all character except digit
    number = number.replace(/\D/g, '');
    // replace 08 with 62
    if (number.startsWith('08')) {
        number = '62' + number.substring(1);
    }
    return number;
};
exports.FormatStandardPhoneNumber = FormatStandardPhoneNumber;
const FormatToWhatsappJid = (number) => {
    // format to standard number with country code first
    number = (0, exports.FormatStandardPhoneNumber)(number);
    // add whatsapp jid
    if (!number.endsWith('@s.whatsapp.net')) {
        number = number + '@s.whatsapp.net';
    }
    return number;
};
exports.FormatToWhatsappJid = FormatToWhatsappJid;
const FormatPromt = (message) => {
    if (message == undefined || message == null || message == '') {
        return "";
    }
    return message.replace(process.env.PROMPT_KEY, '');
};
exports.FormatPromt = FormatPromt;
//# sourceMappingURL=formatter.js.map
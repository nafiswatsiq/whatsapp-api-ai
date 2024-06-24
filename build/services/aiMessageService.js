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
exports.aiMessageService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const formatter_1 = require("../utils/formatter");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../utils/logger"));
const aiMessageService = (message, imageName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = (0, formatter_1.FormatPromt)(message);
        if (imageName !== '') {
            function fileToGenerativePart(path, mimeType) {
                return {
                    inlineData: {
                        data: Buffer.from(fs_1.default.readFileSync(path)).toString("base64"),
                        mimeType
                    },
                };
            }
            const imageParts = [
                fileToGenerativePart(path_1.default.join(__dirname, `../../public/images/${imageName}`), "image/jpg"),
            ];
            const result = yield model.generateContent([prompt, ...imageParts]);
            return result.response.text();
        }
        const result = yield model.generateContent(prompt);
        const res = result.response.text();
        logger_1.default.info(prompt, res);
        return res;
    }
    catch (error) {
        logger_1.default.error("Error fetching completion:", error);
        return "Maaf, saat ini saya tidak bisa memproses permintaan Anda. Silakan coba lagi nanti.";
    }
});
exports.aiMessageService = aiMessageService;

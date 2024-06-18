import { GoogleGenerativeAI } from "@google/generative-ai";
import { FormatPromt } from "../utils/formatter";
import fs from 'fs'
import path from 'path'
import logger from "../utils/logger";

export const aiMessageService = async (message: string, imageName: any) => {
  try {
    const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`)
    
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})
    
    const prompt = FormatPromt(message)

    if(imageName !== '') {
      function fileToGenerativePart(path: string, mimeType: string) {
        return {
          inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
          },
        };
      }

      const imageParts = [
        fileToGenerativePart(path.join(__dirname,`../../public/images/${imageName}`), "image/jpg"),
      ]

      const result = await model.generateContent([prompt, ...imageParts])
      return result.response.text()
    }

    const result = await model.generateContent(prompt)
    const res = result.response.text()
    logger.info(prompt, res)

    return res
  } catch (error) {
    logger.error("Error fetching completion:", error)

    return "Maaf, saat ini saya tidak bisa memproses permintaan Anda. Silakan coba lagi nanti."
  }
}
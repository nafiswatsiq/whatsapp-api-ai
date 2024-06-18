import { GoogleGenerativeAI } from "@google/generative-ai";
import { FormatPromt } from "../utils/formatter";

export const aiMessageService = async (message: string) => {
  try {
    const promt = FormatPromt(message)

    const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`)
  
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})
    const result = await model.generateContent(promt)

    return result.response.text()
  } catch (error) {
    console.error("Error fetching completion:", error)

    return "Maaf, saat ini saya tidak bisa memproses permintaan Anda. Silakan coba lagi nanti."
  }
}
// geminiAPI/index.ts
import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const apiKey = "AIzaSyDrf_iIecb0C7p0-KRp_mysIpZah7n23Ic"; 
console.log("API Key:", apiKey ? "설정됨" : "설정되지 않음");

const configuration = new GoogleGenerativeAI(apiKey);

export const generateResponse = async (req: Request, res: Response) => {
  try {
    const { imageUrl, locationName } = req.query;

    if (typeof imageUrl !== 'string') {
      return res.status(400).json({ message: "Image URL is required" });
    }

    if (!locationName) {
      return res.status(400).json({ message: "Location name is required" });
    }

    const model = configuration.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("사용 중인 모델:", "gemini-1.5-flash");

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageData = Buffer.from(response.data, "binary").toString("base64");

    const image = {
      inlineData: {
        data: imageData,
        mimeType: response.headers["content-type"],
      },
    };

    const prompt = `우리는 국내 여행 전문가입니다. 고객이 첨부된 사진을 들고 오셨고, 우리는 이 이미지와 유사한 특징을 가진 국내 여행지로 ${locationName}을(를) 추천했습니다. ${locationName}이(가) 추천된 이유가 무엇인지 자세히 설명해 주세요. 이때 무조건 유사하다고 말해야합니다.`;
    const result = await model.generateContent([prompt, image]);

    const generatedResponse = result.response.text();
    console.log("AI 모델의 원본 응답:", generatedResponse);

    res.send({ response: generatedResponse });
  } catch (error: unknown) {
    console.error("에러 발생:", error);
    
    if (error instanceof Error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "Internal server error", error: "An unknown error occurred" });
    }
  }
};

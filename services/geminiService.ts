import { GoogleGenerativeAI } from "@google/generative-ai";

// ここが大事！ "process.env" ではなく "import.meta.env" を使います
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// もし鍵が見つからなかったときのための保険
if (!apiKey) {
  console.error("APIキーが見つかりません。VercelのEnvironment Variablesを確認してください。");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiResponse = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "すみません、エラーが発生しました。もう一度試してください。";
  }
};
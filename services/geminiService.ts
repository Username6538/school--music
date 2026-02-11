import { GoogleGenerativeAI } from "@google/generative-ai";

// 鍵の設定
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// 関数名を "searchSongs" に戻しました！
export const searchSongs = async (query: string) => {
  // 検索文字がないときは何もしない
  if (!query) return [];

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // AIへの命令文（JSON形式で曲のリストをください、という命令）
    const prompt = `
      ユーザーが学校の放送でリクエストしたい曲を検索しています。
      検索ワード: "${query}"
      
      このワードに関連する曲を最大5曲、以下のJSON形式のリストで教えてください。
      [
        { "title": "曲名", "artist": "アーティスト名", "genre": "ジャンル" }
      ]
      JSON以外の余計な文字は含めないでください。
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // JSON以外の文字（\`\`\`json とか）が入っていたら削除するおまじない
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // 文字をプログラムが使えるデータ(JSON)に変換して返す
    return JSON.parse(text);

  } catch (error) {
    console.error("検索エラー:", error);
    return [];
  }
};
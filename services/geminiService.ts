
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function searchSongs(query: string): Promise<Song[]> {
  if (!query) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `ユーザーが学校の放送でリクエストしたい曲を検索しています。検索クエリ: "${query}" に関連する実在する日本の人気曲や定番曲を5つ提案してください。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "曲のタイトル" },
              artist: { type: Type.STRING, description: "アーティスト名" },
              genre: { type: Type.STRING, description: "ジャンル（J-POP, アニメ, ボカロ等）" },
            },
            required: ["title", "artist", "genre"],
          },
        },
      },
    });

    const results = JSON.parse(response.text || "[]");
    return results.map((item: any) => ({
      ...item,
      id: `${item.artist} - ${item.title}`.toLowerCase(),
    }));
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
}

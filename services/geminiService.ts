import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

// APIクライアントの初期化。APIキーはシステムから提供される process.env.API_KEY を使用します。
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * ユーザーの検索クエリに基づいて、放送リクエスト候補となる曲をAIで検索・提案します。
 */
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

    const jsonText = response.text;
    if (!jsonText) return [];

    const results = JSON.parse(jsonText);
    
    // アプリケーションで使用するSongオブジェクトの形式に整形
    return results.map((item: any) => ({
      title: item.title,
      artist: item.artist,
      genre: item.genre,
      // アーティスト名と曲名を組み合わせてユニークなIDを作成（小文字化・トリム処理）
      id: `${item.artist}_${item.title}`.toLowerCase().replace(/\s+/g, '_'),
    }));
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
}
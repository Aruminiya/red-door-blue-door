import axios from "axios";
import { NextResponse } from "next/server";

const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemini-flash-latest";

function buildGeminiUrl(apiKey: string) {
  const baseUrl = process.env.GEMINI_API_BASE ?? DEFAULT_BASE_URL;
  const model = process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
  return `${baseUrl}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
}

// POST /api/gemini
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY in environment variables." },
      { status: 500 }
    );
  }

  let body: { prompt?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  try {
    const { data } = await axios.post(
      buildGeminiUrl(apiKey),
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text)
        .filter(Boolean)
        .join("") ?? "";

    return NextResponse.json({ text, raw: data });
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? error.response?.status ?? 500
      : 500;
    const details = axios.isAxiosError(error) ? error.response?.data : null;
    const message = axios.isAxiosError(error)
      ? error.response?.data?.error?.message ?? error.message
      : "Gemini API error.";

    return NextResponse.json({ error: message, details }, { status });
  }
}

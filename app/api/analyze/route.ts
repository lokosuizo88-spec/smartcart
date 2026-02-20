// app/api/analyze/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Eres un asistente de compra inteligente en España.
Analiza esta lista de la compra y responde SOLO en JSON válido (sin backticks, sin markdown):

Lista:
${items
  .map(
    (i: any) =>
      `- ${i.name} x${i.quantity} (${i.price}€ en ${i.supermarket})`
  )
  .join("\n")}

Formato de respuesta:
{
  "insights": [
    {"icon": "emoji", "text": "observación útil", "type": "savings"}
  ],
  "suggestions": [
    {"original": "producto", "alternative": "alternativa", "reason": "motivo", "savings": "ahorro"}
  ],
  "tips": ["consejo práctico"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    return NextResponse.json(JSON.parse(cleaned));
  } catch (error) {
    return NextResponse.json(
      { insights: [], suggestions: [], tips: ["No se pudo analizar la lista en este momento."] },
      { status: 200 }
    );
  }
}
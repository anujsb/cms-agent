// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { users } from "@/lib/data";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { message, userId } = await req.json();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a customer care bot for Odido, a telecom company. Your goal is to assist users based on their data and escalate complex issues to a human agent when needed. Here's the user's data:
      - Name: ${user.name}
      - Phone: ${user.phoneNumber}
      - Orders: ${JSON.stringify(user.orders)}
      - Incidents: ${JSON.stringify(user.incidents)}
      
      User query: "${message}"
      
      Guidelines:
      - Respond naturally, concisely, and professionally.
      - If the query is about an order or incident, reference specific details (e.g., order ID, incident status).
      - If the issue cannot be resolved via chat (e.g., hardware issues, complex billing disputes, or urgent requests), suggest contacting a human agent with: "I recommend speaking to a customer service agent. Would you like to call now?"
      - Avoid technical jargon unless necessary, and keep the tone friendly.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return NextResponse.json({ reply: response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
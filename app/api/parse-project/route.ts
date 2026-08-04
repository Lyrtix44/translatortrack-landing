// app/api/parse-project/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ParsedProjectSchema } from "@/lib/ai/schemas"
import { buildSystemPrompt } from "@/lib/ai/prompts"
import { checkAndLogAiUsage } from "@/lib/ai/rate-limit"

// Gemini Structured Output Schema
const GEMINI_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    source_language: { type: "STRING" },
    target_language: { type: "STRING" },
    word_count: { type: "INTEGER", nullable: true },
    deadline: { type: "STRING", nullable: true },
    rate_hint: { type: "NUMBER", nullable: true },
    client_name_guess: { type: "STRING", nullable: true },
    confidence_notes: { type: "STRING" },
  },
  required: [
    "title",
    "source_language",
    "target_language",
    "word_count",
    "deadline",
    "rate_hint",
    "client_name_guess",
    "confidence_notes",
  ],
}

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check — never let an unauthenticated request spend your AI budget
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Rate limit check — enforce daily quota per plan tier
    const { allowed } = await checkAndLogAiUsage(user.id, "parse_project")
    if (!allowed) {
      return NextResponse.json(
        { error: "You've reached today's AI parsing limit. Try again tomorrow, or upgrade for more." },
        { status: 429 }
      )
    }

    // 3. Validate the incoming request payload
    const { message } = await request.json()
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please paste a bit more detail from the client's message." },
        { status: 400 }
      )
    }
    if (message.length > 4000) {
      return NextResponse.json(
        { error: "That message is a little long — try trimming it to the key details." },
        { status: 400 }
      )
    }

    // 4. Call the Gemini API
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY environment variable")
      return NextResponse.json({ error: "AI service configuration error." }, { status: 500 })
    }

    const today = new Date().toISOString().split("T")[0]
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const aiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: buildSystemPrompt(today) }],
        },
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
          response_schema: GEMINI_RESPONSE_SCHEMA,
          temperature: 0.1, // low temperature: consistent extraction, not creativity
          maxOutputTokens: 500,
        },
      }),
    })

    if (!aiResponse.ok) {
      console.error("Gemini API error:", await aiResponse.text())
      return NextResponse.json(
        { error: "AI parsing failed. You can still fill in the form manually below." },
        { status: 502 }
      )
    }

    const aiData = await aiResponse.json()
    const rawContent = aiData.candidates[0].content.parts[0].text
    console.log("RAW GEMINI RESPONSE:", rawContent)

    // 5. Validate the AI's output with Zod before trusting it
        const aiData = await aiResponse.json()
    const rawContent = aiData.candidates[0].content.parts[0].text

    // 5. Validate the AI's output with Zod before trusting it
    let parsedJson;
    try {
      parsedJson = JSON.parse(rawContent)
    } catch (parseError) {
      console.error("JSON Parse Failed. Raw content:", rawContent)
      console.error("Parse error:", parseError)
      return NextResponse.json(
        { error: "AI returned invalid format. Please fill in manually." },
        { status: 502 }
      )
    }

    const parsed = ParsedProjectSchema.safeParse(parsedJson)
    if (!parsed.success) {
    if (!parsed.success) {
      console.error("AI returned data that failed validation:", parsed.error)
      return NextResponse.json(
        { error: "AI returned unexpected data. Please fill in manually." },
        { status: 502 }
      )
    }

    return NextResponse.json({ result: parsed.data })

  } catch (error) {
    console.error("parse-project error:", error)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
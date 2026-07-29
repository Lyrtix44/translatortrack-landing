// scripts/test-day2.ts
import { buildSystemPrompt } from "../lib/ai/prompts"
import { ParsedProjectSchema } from "../lib/ai/schemas"

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

const testCases = [
  {
    id: "Test 1",
    message: "Hi Maria, new contract for you — about 4500 words, EN to DE, need it by next Friday, usual rate.",
  },
  {
    id: "Test 2 (No word count or rate)",
    message: "Can you take on the Pharma Translations job? It's the clinical trial summary, similar scope to last time.",
  },
  {
    id: "Test 3",
    message: "Quick one — 800 words, EN>FR, rate is $0.11/word, due end of month.",
  },
]

async function runTests() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing from environment variables.")
    return
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`
  const today = new Date().toISOString().split("T")[0]
  const systemPrompt = buildSystemPrompt(today)

  console.log(`\n🚀 Starting Day 2 Prompt & Schema Tests (Today: ${today})...\n`)

  for (const test of testCases) {
    console.log(`--- Running ${test.id} ---`)
    console.log(`Message: "${test.message}"`)

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [{ text: test.message }],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
          response_schema: GEMINI_RESPONSE_SCHEMA,
          temperature: 0.1,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(`❌ API Error for ${test.id}:`, data)
      continue
    }

    const rawText = data.candidates[0].content.parts[0].text
    const parsedJson = JSON.parse(rawText)

    // Validate using Zod schema
    const validationResult = ParsedProjectSchema.safeParse(parsedJson)

    if (validationResult.success) {
      console.log("✅ Zod Validation Passed!")
      console.log("Output:", JSON.stringify(validationResult.data, null, 2))
    } else {
      console.error("❌ Zod Validation Failed!")
      console.error(validationResult.error.format())
    }
    console.log("\n")
  }
}

runTests()
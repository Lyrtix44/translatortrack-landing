// app/api/draft-reminder/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkAndLogAiUsage } from "@/lib/ai/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Rate Limit check
    const { allowed } = await checkAndLogAiUsage(user.id, "draft_reminder")
    if (!allowed) {
      return NextResponse.json(
        { error: "Daily limit reached for AI features." },
        { status: 429 }
      )
    }

    // 3. Request validation
    const { clientName, invoiceNumber, amount, dueDate, daysOverdue } = await request.json()
    if (!clientName || !invoiceNumber || !amount) {
      return NextResponse.json({ error: "Missing required invoice details." }, { status: 400 })
    }

    // 4. Build prompt
    const systemPrompt = `You are a polite but firm freelance translator writing a payment reminder email.
Keep it professional, friendly, and under 150 words. Do not include subject lines or extra commentary.`

    const userPrompt = `Write a payment reminder for:
- Client: ${clientName}
- Invoice Number: ${invoiceNumber}
- Amount: ${amount}
- Due Date: ${dueDate}
- Days Overdue: ${daysOverdue} days overdue`

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "AI service configuration error." }, { status: 500 })
    }

    // Call Gemini streaming API using streamGenerateContent
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
        },
      }),
    })

    if (!geminiRes.ok || !geminiRes.body) {
      console.error("Gemini Streaming Error:", await geminiRes.text())
      return NextResponse.json({ error: "Failed to generate reminder." }, { status: 502 })
    }

    // 5. Pipe Gemini's SSE stream back to the client
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiRes.body!.getReader()
        let buffer = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const rawData = line.slice(6).trim()
              if (!rawData) continue
              try {
                const parsed = JSON.parse(rawData)
                const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text
                if (textChunk) {
                  controller.enqueue(encoder.encode(textChunk))
                }
              } catch (e) {
                // Skip non-JSON or partial lines
              }
            }
          }
        }
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("draft-reminder error:", error)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
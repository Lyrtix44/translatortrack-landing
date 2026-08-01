// lib/paddle/use-paddle.ts
"use client"
import { useEffect, useState } from "react"
import { initializePaddle, type Paddle } from "@paddle/paddle-js"

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle>()

  useEffect(() => {
    if (paddle) return
    initializePaddle({
      environment: (process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production") ?? "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then(setPaddle)
  }, [paddle])

  return paddle
}
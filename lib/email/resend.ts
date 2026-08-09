// lib/email/resend.ts
import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = "noreply@yourdomain.com" // Replace with your verified domain
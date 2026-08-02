// components/clients/AddClientForm.tsx
"use client"
import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { createClientAction, type ClientFormState } from "@/app/actions/clients"
import { SubmitButton } from "@/components/ui/submit-button"

const initialState: ClientFormState = { error: null, success: false }

export function AddClientForm() {
  const [state, formAction] = useActionState(createClientAction, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      toast.success("Client added.")
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {state.error && (
        <p className="text-red-600 text-sm" role="alert">{state.error}</p>
      )}
      <input
        name="name"
        required
        placeholder="Client name"
        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white"
      />
      <input
        name="email"
        type="email"
        placeholder="Email (optional)"
        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white"
      />
      <input
        name="default_rate"
        type="number"
        step="0.01"
        placeholder="Default rate per word (optional)"
        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-white"
      />
      <SubmitButton pendingText="Adding..." className="w-full bg-ink hover:bg-ink-light text-white">
        Add client
      </SubmitButton>
    </form>
  )
}
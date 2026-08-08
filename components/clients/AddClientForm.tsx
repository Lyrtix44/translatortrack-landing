// components/clients/AddClientForm.tsx
"use client"
import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { createClientAction, type ClientFormState } from "@/app/actions/clients"
import { SubmitButton } from "@/components/ui/submit-button"
import { Input } from "@/components/ui/input"

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
        <p className="text-danger text-sm" role="alert">
          {state.error}
        </p>
      )}
      <Input name="name" required placeholder="Client name" />
      <Input name="email" type="email" placeholder="Email (optional)" />
      <Input name="default_rate" type="number" step="0.01" placeholder="Default rate per word (optional)" />
      <SubmitButton pendingText="Adding..." variant="primary" size="md" className="w-full">
        Add client
      </SubmitButton>
    </form>
  )
}
// app/clients/page.tsx

import { createClient } from "@/lib/supabase/server";
import { AddClientForm } from "@/components/clients/AddClientForm";

export const metadata = {
  title: "Clients | TranslatorTrack",
};

type Client = {
  id: string;
  name: string;
  email: string | null;
  default_rate: number | null;
  currency: string;
  created_at: string;
};

async function getClients(): Promise<Client[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <main className="min-h-screen bg-paper px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Clients
          </h1>

          <p className="text-muted-foreground max-w-2xl">
            Manage everyone you work with. Store client details,
            contact information, and default translation rates so
            every new project is faster to create.
          </p>
        </div>

        {/* Add Client */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">
            Add New Client
          </h2>

          <AddClientForm />
        </section>

        {/* Client List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Your Clients
            </h2>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {clients.length}{" "}
              {clients.length === 1 ? "Client" : "Clients"}
            </span>
          </div>

          {clients.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-white p-12 text-center">
              <h3 className="text-xl font-semibold">
                No clients yet
              </h3>

              <p className="mt-2 text-muted-foreground">
                Add your first client using the form above.
                Once you've added clients, they'll appear here
                automatically.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {clients.map((client) => (
                <article
                  key={client.id}
                  className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {client.name}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {client.email ?? "No email provided"}
                      </p>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">
                          Default Rate:
                        </span>{" "}
                        {client.default_rate
                          ? `${client.currency} ${client.default_rate}/word`
                          : "Not set"}
                      </p>

                      <p>
                        <span className="font-medium">
                          Currency:
                        </span>{" "}
                        {client.currency}
                      </p>

                      <p>
                        <span className="font-medium">
                          Added:
                        </span>{" "}
                        {new Date(
                          client.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
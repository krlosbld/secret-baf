"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const res = await fetch("/api/secrets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, content }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setMsg(data?.error ?? "Erreur.");
      return;
    }

    setName("");
    setContent("");
    setMsg("Secret envoyé ✅");

    // Retour accueil pour voir le secret (anonyme)
    router.push("/");
  }

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <div
        style={{
          width: "min(520px, 100%)",
          background: "white",
          border: "1px solid #e5e5e5",
          borderRadius: 18,
          padding: 18,
          boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 12 }}>Soumettre un secret</h1>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            Nom de la personne
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Alex"
              style={{
                padding: 10,
                borderRadius: 12,
                border: "1px solid #ddd",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Secret
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écris le secret ici…"
              style={{
                padding: 10,
                borderRadius: 12,
                border: "1px solid #ddd",
                minHeight: 120,
                resize: "vertical",
              }}
            />
          </label>

          <button
            disabled={loading}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "#111827",
              color: "white",
              cursor: "pointer",
            }}
          >
            {loading ? "Envoi…" : "Envoyer"}
          </button>

          {msg && <p style={{ margin: 0 }}>{msg}</p>}
        </form>
      </div>
    </div>
  );
}
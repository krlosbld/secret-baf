"use client";

import { useEffect, useState } from "react";

type PublicSecret = {
  id: string;
  content: string;
  revealed: boolean;
  name: string | null;
};

export default function Home() {
  const [secrets, setSecrets] = useState<PublicSecret[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/public-secrets");
    const data = await res.json().catch(() => ({}));
    setSecrets(data.secrets ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div
      style={{
        display: "grid",
        justifyItems: "center",
        paddingTop: 20,
      }}
    >
      {/* HEADER */}
      <div style={{ width: "min(1100px, 100%)", textAlign: "center" }}>
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            marginBottom: 10,
          }}
        >
          BAFA
        </div>

        <h1
          style={{
            fontSize: 40,
            fontWeight: 800,
            margin: 0,
            marginBottom: 20,
          }}
        >
          Liste des Secrets
        </h1>

        <button
          onClick={load}
          style={{
            padding: "14px 20px",
            fontSize: 18,
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          Rafraîchir
        </button>
      </div>

      {/* LISTE */}
      <div
        style={{
          width: "min(1100px, 100%)",
          display: "grid",
          gap: 30,
          marginTop: 40,
          paddingBottom: 40,
        }}
      >
        {loading ? (
          <div style={{ fontSize: 22 }}>Chargement…</div>
        ) : secrets.length === 0 ? (
          <div style={{ fontSize: 22 }}>Aucun secret.</div>
        ) : (
          secrets.map((s) => {
            const displayName = s.revealed && s.name ? s.name : "Anonyme";

            return (
              <div
                key={s.id}
                style={{
                  background: "white",
                  borderRadius: 22,
                  padding: 35,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 15 }}>
                  <strong>Nom :</strong> {displayName}
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}
                >
                  <strong>Secret :</strong> {s.content}
                </div>

                {s.revealed && (
                  <div
                    style={{
                      marginTop: 15,
                      fontSize: 16,
                      opacity: 0.6,
                    }}
                  >
                    Secret révélé ✅
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
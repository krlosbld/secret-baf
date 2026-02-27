"use client";

import { useEffect, useState } from "react";

type AdminSecret = {
  id: string;
  name: string;
  content: string;
  points: number;
  revealed: boolean;
  createdAt: string;
};

export default function AdminPage() {
  const [code, setCode] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [secrets, setSecrets] = useState<AdminSecret[]>([]);
  const [loading, setLoading] = useState(false);

  // récupère le token admin si déjà enregistré
  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  async function load(t: string) {
    setLoading(true);
    setMsg(null);

    const res = await fetch("/api/admin/secrets", {
      headers: { Authorization: `Bearer ${t}` },
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setMsg(data?.error ?? "Non autorisé.");
      setSecrets([]);
      return;
    }

    setSecrets(data.secrets ?? []);
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    const t = code.trim();
    if (!t) return;

    localStorage.setItem("admin_token", t);
    setToken(t);
    await load(t);
  }

  async function patchSecret(
    id: string,
    patch: { revealed?: boolean; points?: number }
  ) {
    if (!token) return;

    const res = await fetch("/api/admin/secrets", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, ...patch }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data?.error ?? "Erreur.");
      return;
    }

    await load(token);
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setToken(null);
    setCode("");
    setSecrets([]);
    setMsg(null);
  }

  // si token existe, charge au premier affichage
  useEffect(() => {
    if (token) load(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ÉCRAN LOGIN
  if (!token) {
    return (
      <div style={{ display: "grid", placeItems: "center" }}>
        <div
          style={{
            width: "min(520px, 100%)",
            background: "white",
            border: "1px solid #e5e5e5",
            borderRadius: 18,
            padding: 18,
          }}
        >
          <h1 style={{ marginTop: 0 }}>Admin</h1>
          <p>
            Entre le code admin pour voir les secrets avec les noms et gérer les
            points.
          </p>

          <form onSubmit={onLogin} style={{ display: "grid", gap: 10 }}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code admin"
              style={{
                padding: 10,
                borderRadius: 12,
                border: "1px solid #ddd",
              }}
            />

            <button
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#111827",
                color: "white",
                cursor: "pointer",
              }}
            >
              Se connecter
            </button>
          </form>

          {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
        </div>
      </div>
    );
  }

  // ÉCRAN ADMIN
  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Admin</h1>

        <button
          onClick={() => token && load(token)}
          style={{
            marginLeft: "auto",
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
        >
          Rafraîchir
        </button>

        <button
          onClick={logout}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
        >
          Déconnexion
        </button>
      </div>

      {msg && <p>{msg}</p>}

      {loading ? (
        <p>Chargement…</p>
      ) : secrets.length === 0 ? (
        <p>Aucun secret.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {secrets.map((s) => (
            <div
              key={s.id}
              style={{
                background: "white",
                border: "1px solid #e5e5e5",
                borderRadius: 16,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {new Date(s.createdAt).toLocaleString("fr-FR")}
              </div>

              <div style={{ marginTop: 6 }}>
                <strong>Nom :</strong> {s.name}
              </div>

              <div style={{ marginTop: 6 }}>
                <strong>Secret :</strong> {s.content}
              </div>

              <div style={{ marginTop: 10 }}>
                <strong>Points :</strong> {s.points} pts
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => patchSecret(s.id, { revealed: !s.revealed })}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: s.revealed ? "#16a34a" : "#111827",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {s.revealed ? "Révélé ✅ (annuler)" : "Révéler"}
                </button>

                <button
                  onClick={() => patchSecret(s.id, { points: s.points + 1 })}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  +1
                </button>

                <button
                  onClick={() =>
                    patchSecret(s.id, { points: Math.max(0, s.points - 1) })
                  }
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  -1
                </button>

                <span style={{ fontSize: 12, opacity: 0.7 }}>
                  (id: {s.id})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
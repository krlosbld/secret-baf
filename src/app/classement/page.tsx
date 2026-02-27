"use client";

import { useEffect, useState } from "react";

type Secret = {
  id: string;
  name: string;
  points: number;
};

type Player = {
  name: string;
  total: number;
};

export default function ClassementPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    // On récupère les secrets via l’API admin
    const res = await fetch("/api/admin/secrets", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!data.secrets) {
      setPlayers([]);
      setLoading(false);
      return;
    }

    // Calcul total par personne
    const totals: Record<string, number> = {};

    data.secrets.forEach((s: Secret) => {
      totals[s.name] = (totals[s.name] || 0) + s.points;
    });

    const sorted = Object.entries(totals)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    setPlayers(sorted);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1>Classement</h1>

      <button
        onClick={load}
        style={{
          marginBottom: 20,
          padding: "8px 12px",
          borderRadius: 10,
          border: "1px solid #ddd",
          background: "white",
          cursor: "pointer",
        }}
      >
        Rafraîchir
      </button>

      {loading ? (
        <p>Chargement…</p>
      ) : players.length === 0 ? (
        <p>Aucun joueur pour le moment.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {players.map((p, index) => (
            <div
              key={p.name}
              style={{
                padding: 16,
                borderRadius: 14,
                background: "white",
                border: "1px solid #e5e5e5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: index === 0 ? "bold" : "normal",
              }}
            >
              <span>
                {index === 0 && "🥇 "}
                {index === 1 && "🥈 "}
                {index === 2 && "🥉 "}
                {index + 1}. {p.name}
              </span>
              <span>{p.total} pts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
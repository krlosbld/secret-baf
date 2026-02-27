import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Secret BAFA",
  description: "Un site pour soumettre des secrets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          background: "#f3f4f8",
        }}
      >
        <header
          style={{
            display: "flex",
            gap: 18,
            padding: 16,
            borderBottom: "1px solid #ddd",
            background: "white",
          }}
        >
          <Link href="/" style={{ fontWeight: 800 }}>
            Secret BAFA
          </Link>
          <Link href="/submit">Soumettre</Link>
          <Link href="/secrets">Secrets</Link>
          <Link href="/classement">Classement</Link>
          <Link href="/admin">Admin</Link>
        </header>

        <main style={{ flex: 1, padding: 24 }}>{children}</main>
      </body>
    </html>
  );
}
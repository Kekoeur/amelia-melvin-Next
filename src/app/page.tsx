import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test - Site Mariage</h1>
      <ul>
        <li><Link href="/Liste">📋 Liste des invités</Link></li>
        <li><Link href="/Reponse">✉️ Répondre à l&apos;invitation</Link></li>
      </ul>
    </div>
  );
}

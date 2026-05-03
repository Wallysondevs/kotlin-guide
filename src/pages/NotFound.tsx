import { Link } from "wouter";
  export default function NotFound() {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
        <p className="text-muted-foreground mb-6">Capítulo não encontrado.</p>
        <Link href="/" className="text-primary hover:underline">← Voltar ao início</Link>
      </div>
    );
  }
  
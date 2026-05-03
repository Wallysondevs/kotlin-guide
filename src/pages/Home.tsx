import { Triangle, BookOpen, Layers, Server, Wifi, Globe } from "lucide-react";

  export default function Home() {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Triangle className="w-10 h-10 text-primary fill-primary/30" />
            <h1 className="text-4xl sm:text-5xl font-extrabold">Kotlin Guide</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            O livro completo de <strong className="text-foreground">Kotlin</strong> em português: 140 capítulos cobrindo
            desde a sintaxe até coroutines, Spring Boot, Ktor, Android com Jetpack Compose e Multiplataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Introdução</div>
            <div className="text-xs text-muted-foreground mb-3">8 capítulos</div>
            <a href="#/o-que-e-kotlin" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Sintaxe e tipos</div>
            <div className="text-xs text-muted-foreground mb-3">12 capítulos</div>
            <a href="#/variaveis-val-var" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Null safety</div>
            <div className="text-xs text-muted-foreground mb-3">5 capítulos</div>
            <a href="#/null-safety" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Orientação a objetos</div>
            <div className="text-xs text-muted-foreground mb-3">12 capítulos</div>
            <a href="#/classes" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Funcional avançado</div>
            <div className="text-xs text-muted-foreground mb-3">8 capítulos</div>
            <a href="#/extension-functions" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Coleções</div>
            <div className="text-xs text-muted-foreground mb-3">10 capítulos</div>
            <a href="#/listas" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Coroutines</div>
            <div className="text-xs text-muted-foreground mb-3">10 capítulos</div>
            <a href="#/intro-coroutines" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Generics e reflexão</div>
            <div className="text-xs text-muted-foreground mb-3">5 capítulos</div>
            <a href="#/generics" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Anotações e DSLs</div>
            <div className="text-xs text-muted-foreground mb-3">4 capítulos</div>
            <a href="#/annotations" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Erros e Result</div>
            <div className="text-xs text-muted-foreground mb-3">4 capítulos</div>
            <a href="#/excecoes" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Testes</div>
            <div className="text-xs text-muted-foreground mb-3">6 capítulos</div>
            <a href="#/junit5" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Build e tooling</div>
            <div className="text-xs text-muted-foreground mb-3">8 capítulos</div>
            <a href="#/gradle-kts" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Spring Boot</div>
            <div className="text-xs text-muted-foreground mb-3">10 capítulos</div>
            <a href="#/spring-setup" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Ktor</div>
            <div className="text-xs text-muted-foreground mb-3">8 capítulos</div>
            <a href="#/ktor-setup" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Banco de dados</div>
            <div className="text-xs text-muted-foreground mb-3">6 capítulos</div>
            <a href="#/exposed-orm" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Android</div>
            <div className="text-xs text-muted-foreground mb-3">10 capítulos</div>
            <a href="#/android-intro" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Multiplataforma e avançado</div>
            <div className="text-xs text-muted-foreground mb-3">8 capítulos</div>
            <a href="#/kmp-intro" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Projetos</div>
            <div className="text-xs text-muted-foreground mb-3">6 capítulos</div>
            <a href="#/projeto-cli" className="text-sm text-foreground hover:text-primary inline-flex items-center gap-1">Começar →</a>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-6">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Como usar</h2>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Use o menu lateral para navegar entre os 140 capítulos.</li>
            <li>Cada capítulo tem conceito, exemplo prático, casos de uso e pegadinhas.</li>
            <li>Os blocos de código mostram Kotlin idiomático para Kotlin 1.9 / 2.0+.</li>
            <li>Pesquisa em tempo real no topo da sidebar.</li>
          </ul>
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          MIT · feito com ♥ por <a className="text-primary hover:underline" href="https://github.com/Wallysondevs" target="_blank" rel="noreferrer">Wallysondevs</a>
        </footer>
      </div>
    );
  }
  
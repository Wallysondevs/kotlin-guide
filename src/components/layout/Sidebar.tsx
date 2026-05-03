import { useState, useMemo } from "react";
  import { Link } from "wouter";
  import { useHashLocation } from "wouter/use-hash-location";
  import { cn } from "@/lib/utils";
  import { ChevronDown, ChevronRight, X, Search, BookOpen, Code2, Shield, Layers, Zap, Database, Waves, Cog, FileText, Hammer, TestTube, Server, Rocket, Wifi, Globe, Triangle } from "lucide-react";

  const ICONS: Record<string, any> = { BookOpen, Code2, Shield, Layers, Zap, Database, Waves, Cog, FileText, Hammer, TestTube, Server, Rocket, Wifi, Globe };

  const NAV = [
  {
    "section": "Introdução",
    "icon": "BookOpen",
    "items": [
      {
        "slug": "o-que-e-kotlin",
        "title": "O que é Kotlin"
      },
      {
        "slug": "historia-jvm",
        "title": "Kotlin e a JVM"
      },
      {
        "slug": "instalar-kotlin",
        "title": "Instalando o Kotlin"
      },
      {
        "slug": "kotlin-cli",
        "title": "kotlinc e ferramentas CLI"
      },
      {
        "slug": "repl",
        "title": "REPL Kotlin"
      },
      {
        "slug": "primeiro-projeto",
        "title": "Primeiro projeto"
      },
      {
        "slug": "gradle-basico",
        "title": "Gradle básico para Kotlin"
      },
      {
        "slug": "intellij-config",
        "title": "Configurando IntelliJ"
      }
    ]
  },
  {
    "section": "Sintaxe e tipos",
    "icon": "Code2",
    "items": [
      {
        "slug": "variaveis-val-var",
        "title": "val vs var"
      },
      {
        "slug": "tipos-basicos",
        "title": "Tipos primitivos"
      },
      {
        "slug": "operadores",
        "title": "Operadores"
      },
      {
        "slug": "strings-templates",
        "title": "Strings e templates"
      },
      {
        "slug": "controle-fluxo",
        "title": "if/else como expressão"
      },
      {
        "slug": "when-expression",
        "title": "when (smart switch)"
      },
      {
        "slug": "ranges",
        "title": "Ranges e progressões"
      },
      {
        "slug": "loops",
        "title": "for, while, do-while"
      },
      {
        "slug": "funcoes",
        "title": "Funções"
      },
      {
        "slug": "funcoes-default-named",
        "title": "Default e named arguments"
      },
      {
        "slug": "lambdas",
        "title": "Lambdas e função literal"
      },
      {
        "slug": "higher-order",
        "title": "Higher-order functions"
      }
    ]
  },
  {
    "section": "Null safety",
    "icon": "Shield",
    "items": [
      {
        "slug": "null-safety",
        "title": "Null safety"
      },
      {
        "slug": "operador-elvis",
        "title": "Operador Elvis ?:"
      },
      {
        "slug": "safe-call",
        "title": "Safe call ?."
      },
      {
        "slug": "not-null-assertion",
        "title": "!! e quando evitar"
      },
      {
        "slug": "let-also-run-apply",
        "title": "let, also, run, apply, with"
      }
    ]
  },
  {
    "section": "Orientação a objetos",
    "icon": "Layers",
    "items": [
      {
        "slug": "classes",
        "title": "Classes"
      },
      {
        "slug": "construtores",
        "title": "Construtores"
      },
      {
        "slug": "propriedades",
        "title": "Propriedades e backing field"
      },
      {
        "slug": "heranca",
        "title": "Herança"
      },
      {
        "slug": "interfaces",
        "title": "Interfaces"
      },
      {
        "slug": "classes-abstratas",
        "title": "Classes abstratas"
      },
      {
        "slug": "data-class",
        "title": "data class"
      },
      {
        "slug": "sealed-class",
        "title": "sealed class e interface"
      },
      {
        "slug": "enum-class",
        "title": "enum class"
      },
      {
        "slug": "object-singleton",
        "title": "object e singleton"
      },
      {
        "slug": "companion-object",
        "title": "companion object"
      },
      {
        "slug": "inner-nested",
        "title": "Inner e nested classes"
      }
    ]
  },
  {
    "section": "Funcional avançado",
    "icon": "Zap",
    "items": [
      {
        "slug": "extension-functions",
        "title": "Extension functions"
      },
      {
        "slug": "infix-functions",
        "title": "Infix functions"
      },
      {
        "slug": "operator-overload",
        "title": "Operator overloading"
      },
      {
        "slug": "inline-functions",
        "title": "inline functions"
      },
      {
        "slug": "tailrec",
        "title": "tailrec recursion"
      },
      {
        "slug": "funcoes-locais",
        "title": "Funções locais e closures"
      },
      {
        "slug": "type-alias",
        "title": "typealias"
      },
      {
        "slug": "value-class",
        "title": "value class (inline class)"
      }
    ]
  },
  {
    "section": "Coleções",
    "icon": "Database",
    "items": [
      {
        "slug": "listas",
        "title": "List e MutableList"
      },
      {
        "slug": "sets",
        "title": "Set e MutableSet"
      },
      {
        "slug": "mapas",
        "title": "Map e MutableMap"
      },
      {
        "slug": "mutable-immutable",
        "title": "Mutable vs Immutable"
      },
      {
        "slug": "operacoes-funcionais",
        "title": "Operações funcionais"
      },
      {
        "slug": "sequences",
        "title": "Sequences (lazy)"
      },
      {
        "slug": "group-by",
        "title": "groupBy e associate"
      },
      {
        "slug": "map-filter-reduce",
        "title": "map, filter, reduce"
      },
      {
        "slug": "flat-map",
        "title": "flatMap e flatten"
      },
      {
        "slug": "arrays",
        "title": "Arrays e IntArray"
      }
    ]
  },
  {
    "section": "Coroutines",
    "icon": "Waves",
    "items": [
      {
        "slug": "intro-coroutines",
        "title": "Introdução a coroutines"
      },
      {
        "slug": "coroutine-builders",
        "title": "launch, async, runBlocking"
      },
      {
        "slug": "coroutine-context",
        "title": "CoroutineContext e Job"
      },
      {
        "slug": "dispatchers",
        "title": "Dispatchers"
      },
      {
        "slug": "async-await",
        "title": "async/await em paralelo"
      },
      {
        "slug": "flows",
        "title": "Flow básico"
      },
      {
        "slug": "state-flow",
        "title": "StateFlow"
      },
      {
        "slug": "shared-flow",
        "title": "SharedFlow e events"
      },
      {
        "slug": "channels",
        "title": "Channels"
      },
      {
        "slug": "exception-handling-coroutines",
        "title": "Exceções em coroutines"
      }
    ]
  },
  {
    "section": "Generics e reflexão",
    "icon": "Cog",
    "items": [
      {
        "slug": "generics",
        "title": "Generics"
      },
      {
        "slug": "variance",
        "title": "Variance: in/out"
      },
      {
        "slug": "star-projection",
        "title": "Star projection <*>"
      },
      {
        "slug": "reified-types",
        "title": "reified types"
      },
      {
        "slug": "reflexao",
        "title": "kotlin-reflect"
      }
    ]
  },
  {
    "section": "Anotações e DSLs",
    "icon": "FileText",
    "items": [
      {
        "slug": "annotations",
        "title": "Annotations"
      },
      {
        "slug": "type-safe-builders",
        "title": "Type-safe builders (DSL)"
      },
      {
        "slug": "context-receivers",
        "title": "Context receivers (preview)"
      },
      {
        "slug": "delegates",
        "title": "Property delegates"
      }
    ]
  },
  {
    "section": "Erros e Result",
    "icon": "Hammer",
    "items": [
      {
        "slug": "excecoes",
        "title": "Exceções em Kotlin"
      },
      {
        "slug": "try-catch",
        "title": "try/catch/finally"
      },
      {
        "slug": "result-class",
        "title": "kotlin.Result<T>"
      },
      {
        "slug": "runcatching",
        "title": "runCatching idiom"
      }
    ]
  },
  {
    "section": "Testes",
    "icon": "TestTube",
    "items": [
      {
        "slug": "junit5",
        "title": "JUnit 5 com Kotlin"
      },
      {
        "slug": "kotest",
        "title": "Kotest"
      },
      {
        "slug": "mockk",
        "title": "MockK"
      },
      {
        "slug": "coroutine-testing",
        "title": "Testando coroutines"
      },
      {
        "slug": "property-based",
        "title": "Property-based testing"
      },
      {
        "slug": "coverage",
        "title": "Cobertura com Kover/JaCoCo"
      }
    ]
  },
  {
    "section": "Build e tooling",
    "icon": "Hammer",
    "items": [
      {
        "slug": "gradle-kts",
        "title": "Gradle Kotlin DSL profundo"
      },
      {
        "slug": "maven",
        "title": "Maven com Kotlin"
      },
      {
        "slug": "ktlint",
        "title": "Ktlint"
      },
      {
        "slug": "detekt",
        "title": "Detekt"
      },
      {
        "slug": "dokka",
        "title": "Dokka (KDoc)"
      },
      {
        "slug": "multiplataforma",
        "title": "Multiplataforma básico"
      },
      {
        "slug": "kotlin-script",
        "title": "Kotlin Script (.kts)"
      },
      {
        "slug": "publicar-lib",
        "title": "Publicar lib no Maven Central"
      }
    ]
  },
  {
    "section": "Spring Boot",
    "icon": "Server",
    "items": [
      {
        "slug": "spring-setup",
        "title": "Spring Boot + Kotlin"
      },
      {
        "slug": "spring-controllers",
        "title": "@RestController"
      },
      {
        "slug": "spring-services",
        "title": "@Service e DI"
      },
      {
        "slug": "spring-data-jpa",
        "title": "Spring Data JPA com Kotlin"
      },
      {
        "slug": "spring-validation",
        "title": "Validation com Bean Validation"
      },
      {
        "slug": "spring-security",
        "title": "Spring Security"
      },
      {
        "slug": "spring-jwt",
        "title": "JWT com Spring"
      },
      {
        "slug": "spring-testing",
        "title": "Testes Spring"
      },
      {
        "slug": "spring-webflux",
        "title": "Spring WebFlux + coroutines"
      },
      {
        "slug": "spring-actuator",
        "title": "Actuator e observabilidade"
      }
    ]
  },
  {
    "section": "Ktor",
    "icon": "Rocket",
    "items": [
      {
        "slug": "ktor-setup",
        "title": "Ktor server setup"
      },
      {
        "slug": "ktor-routing",
        "title": "Routing"
      },
      {
        "slug": "ktor-content-negotiation",
        "title": "Content Negotiation + JSON"
      },
      {
        "slug": "ktor-auth",
        "title": "Autenticação Ktor"
      },
      {
        "slug": "ktor-database",
        "title": "Ktor + Exposed/HikariCP"
      },
      {
        "slug": "ktor-websockets",
        "title": "WebSockets em Ktor"
      },
      {
        "slug": "ktor-client",
        "title": "Ktor HTTP client"
      },
      {
        "slug": "ktor-testing",
        "title": "Testando Ktor"
      }
    ]
  },
  {
    "section": "Banco de dados",
    "icon": "Database",
    "items": [
      {
        "slug": "exposed-orm",
        "title": "Exposed ORM"
      },
      {
        "slug": "jdbi",
        "title": "JDBI3 com Kotlin"
      },
      {
        "slug": "r2dbc",
        "title": "R2DBC reativo"
      },
      {
        "slug": "flyway",
        "title": "Migrations com Flyway"
      },
      {
        "slug": "postgres-conexao",
        "title": "PostgreSQL JDBC + HikariCP"
      },
      {
        "slug": "mongodb-driver",
        "title": "MongoDB driver Kotlin"
      }
    ]
  },
  {
    "section": "Android",
    "icon": "Wifi",
    "items": [
      {
        "slug": "android-intro",
        "title": "Android com Kotlin"
      },
      {
        "slug": "activities-fragments",
        "title": "Activities e Fragments"
      },
      {
        "slug": "jetpack-compose",
        "title": "Jetpack Compose básico"
      },
      {
        "slug": "compose-state",
        "title": "Estado em Compose"
      },
      {
        "slug": "compose-navigation",
        "title": "Navigation Compose"
      },
      {
        "slug": "viewmodel",
        "title": "ViewModel + StateFlow"
      },
      {
        "slug": "room-db",
        "title": "Room database"
      },
      {
        "slug": "retrofit",
        "title": "Retrofit + OkHttp + Moshi"
      },
      {
        "slug": "hilt-di",
        "title": "Hilt para DI"
      },
      {
        "slug": "android-coroutines",
        "title": "Coroutines no Android"
      }
    ]
  },
  {
    "section": "Multiplataforma e avançado",
    "icon": "Globe",
    "items": [
      {
        "slug": "kmp-intro",
        "title": "Kotlin Multiplatform intro"
      },
      {
        "slug": "kmp-shared",
        "title": "Compartilhar código KMP"
      },
      {
        "slug": "compose-multiplatform",
        "title": "Compose Multiplatform"
      },
      {
        "slug": "interop-java",
        "title": "Interop Java <-> Kotlin"
      },
      {
        "slug": "interop-js",
        "title": "Kotlin/JS interop"
      },
      {
        "slug": "native",
        "title": "Kotlin/Native"
      },
      {
        "slug": "serialization",
        "title": "kotlinx.serialization"
      },
      {
        "slug": "ktorm",
        "title": "Ktorm ORM"
      }
    ]
  },
  {
    "section": "Projetos",
    "icon": "Rocket",
    "items": [
      {
        "slug": "projeto-cli",
        "title": "Projeto: CLI com Clikt"
      },
      {
        "slug": "projeto-rest-api",
        "title": "Projeto: REST API com Ktor"
      },
      {
        "slug": "projeto-graphql",
        "title": "Projeto: GraphQL com graphql-kotlin"
      },
      {
        "slug": "projeto-android-todo",
        "title": "Projeto: Todo app Android"
      },
      {
        "slug": "projeto-spring-fullstack",
        "title": "Projeto: Spring + Thymeleaf fullstack"
      },
      {
        "slug": "projeto-microservico",
        "title": "Projeto: microserviço Ktor"
      }
    ]
  }
];

  interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
  }

  export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const [location] = useHashLocation();
    const [search, setSearch] = useState("");
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const filtered = useMemo(() => {
      if (!search.trim()) return NAV;
      const q = search.toLowerCase();
      return NAV.map(s => ({
        ...s,
        items: s.items.filter(i => i.title.toLowerCase().includes(q) || i.slug.toLowerCase().includes(q)),
      })).filter(s => s.items.length > 0);
    }, [search]);

    return (
      <>
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-card border-r border-border flex flex-col transition-transform",
            isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Triangle className="w-5 h-5 text-primary fill-primary/30" />
              <span className="font-bold">Kotlin Guide</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:bg-muted"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-3 py-3 border-b border-border shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar capítulo..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {filtered.map(section => {
              const Icon = ICONS[section.icon] ?? BookOpen;
              const open = openSections[section.section] !== false;
              return (
                <div key={section.section}>
                  <button
                    onClick={() => setOpenSections(s => ({ ...s, [section.section]: !open }))}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50"
                  >
                    {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <Icon className="w-3.5 h-3.5" />
                    <span className="uppercase tracking-wide">{section.section}</span>
                    <span className="ml-auto text-[10px] opacity-50">{section.items.length}</span>
                  </button>
                  {open && (
                    <div className="ml-4 mt-0.5 space-y-px border-l border-border/50 pl-2">
                      {section.items.map(item => {
                        const path = "/" + item.slug;
                        const active = location === path;
                        return (
                          <Link
                            key={item.slug}
                            href={path}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "block px-2 py-1 text-xs rounded-md transition-colors",
                              active
                                ? "bg-primary/15 text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            {item.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border text-[10px] text-muted-foreground shrink-0">
            140 capítulos · MIT · <a className="text-primary hover:underline" href="https://github.com/Wallysondevs/kotlin-guide" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </aside>
      </>
    );
  }
  
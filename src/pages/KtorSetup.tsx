export default function KtorSetup() {
    return (
      <article className="chapter max-w-3xl mx-auto px-6 py-10">
        <div className="text-xs text-muted-foreground mb-2 font-mono">Ktor · intermediario · 10 min</div>
        <h1>Ktor server setup</h1>
        <div dangerouslySetInnerHTML={{__html: `
  <p>Ktor é o framework HTTP "Kotlin-first" da JetBrains: leve, baseado em coroutines e modular. Ideal para microsserviços, APIs e clientes HTTP onde se quer controle fino e baixo overhead.</p>

  <h2>Conceito</h2>
  <p>O coração é <code>embeddedServer(engine) { module() }</code>. Você escolhe o engine (<strong>Netty</strong>, <strong>CIO</strong>, <strong>Jetty</strong>) e organiza features (autenticação, serialização, rotas) em <strong>módulos</strong> reutilizáveis.</p>
  <pre><code class="language-groovy">// build.gradle.kts
  plugins {
      kotlin("jvm") version "2.0.20"
      id("io.ktor.plugin") version "3.0.0"
      kotlin("plugin.serialization") version "2.0.20"
  }
  dependencies {
      implementation("io.ktor:ktor-server-core")
      implementation("io.ktor:ktor-server-netty")
      implementation("io.ktor:ktor-server-content-negotiation")
      implementation("io.ktor:ktor-serialization-kotlinx-json")
      implementation("ch.qos.logback:logback-classic:1.5.6")
  }</code></pre>

  <h2>Exemplo prático</h2>
  <p>Estrutura mínima:</p>
  <pre><code class="language-bash">app/
  ├── src/main/kotlin/com/exemplo/Application.kt
  └── src/main/resources/application.yaml</code></pre>

  <p>application.yaml:</p>
  <pre><code class="language-yaml">ktor:
    deployment:
      port: 8080
    application:
      modules:
        - com.exemplo.ApplicationKt.module</code></pre>

  <p>Application.kt:</p>
  <pre><code class="language-kotlin">package com.exemplo

  import io.ktor.serialization.kotlinx.json.*
  import io.ktor.server.application.*
  import io.ktor.server.engine.*
  import io.ktor.server.netty.*
  import io.ktor.server.plugins.contentnegotiation.*
  import io.ktor.server.response.*
  import io.ktor.server.routing.*
  import kotlinx.serialization.Serializable

  @Serializable data class Tarefa(val id: Int, val titulo: String, val feita: Boolean = false)

  fun main() {
      embeddedServer(Netty, port = 8080, module = Application::module).start(wait = true)
  }

  fun Application.module() {
      install(ContentNegotiation) { json() }
      routing {
          get("/health") { call.respond(mapOf("status" to "UP")) }
          get("/tarefas") {
              call.respond(listOf(Tarefa(1, "Estudar Ktor"), Tarefa(2, "Beber água")))
          }
      }
  }</code></pre>

  <h2>Engines: qual escolher?</h2>
  <ul>
  <li><strong>Netty</strong>: padrão, alta performance, NIO maduro.</li>
  <li><strong>CIO</strong>: 100% Kotlin/Coroutines, ideal para Multiplataforma.</li>
  <li><strong>Jetty</strong>: integra com servlets antigos.</li>
  <li><strong>Tomcat</strong>: para deploy em containers JEE.</li>
  </ul>

  <h2>Quando usar</h2>
  <ul>
  <li>APIs leves sem o peso do ecossistema Spring.</li>
  <li>Servidores com I/O intensivo (chat, streaming).</li>
  <li>Backends para apps Multiplataforma compartilhando modelos.</li>
  <li>Gateways e BFFs (backend-for-frontend).</li>
  </ul>

  <h2>Boas práticas</h2>
  <ul>
  <li>Separe módulos por contexto: <code>fun Application.authModule()</code>, <code>fun Application.routesModule()</code>.</li>
  <li>Use <code>application.yaml</code> em vez de <code>main()</code> hardcoded em produção.</li>
  <li>Adicione <code>StatusPages</code> para tratar exceções de forma centralizada.</li>
  <li>Para testes, use <code>testApplication { ... }</code> sem subir servidor real.</li>
  </ul>

  <h2>Como rodar</h2>
  <pre><code class="language-bash">./gradlew run
  curl http://localhost:8080/tarefas</code></pre>

  <div class="callout callout-tip"><div class="callout-title">Dica</div><div>O plugin Ktor 3.0 tem <code>./gradlew buildFatJar</code> para gerar um jar único pronto para Docker, e <code>./gradlew runDocker</code> para empacotar em imagem.</div></div>
  `}} />
      </article>
    );
  }
  
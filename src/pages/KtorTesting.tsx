export default function KtorTesting() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Ktor · intermediario · 9 min</div>
      <h1>Testando Ktor</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Ktor traz um motor de teste in-memory que evita subir Netty/Jetty e roda rotas diretamente. Combinado com <code>MockEngine</code> para mockar clientes HTTP, dá para cobrir servidor e integrações com latência mínima.</p>

<h2>Setup</h2>
<pre><code class="language-groovy">dependencies {
    testImplementation("io.ktor:ktor-server-test-host-jvm:3.0.0")
    testImplementation("io.ktor:ktor-client-content-negotiation:3.0.0")
    testImplementation("io.ktor:ktor-serialization-kotlinx-json:3.0.0")
    testImplementation("io.kotest:kotest-runner-junit5:5.9.1")
}
</code></pre>

<h2>Servidor sob teste</h2>
<pre><code class="language-kotlin">// src/main/kotlin/Module.kt
fun Application.module() {
    install(ContentNegotiation) { json() }
    routing {
        get("/ping") { call.respond(mapOf("ok" to true)) }
        post("/eco") {
            val body = call.receive&lt;Map&lt;String, String&gt;&gt;()
            call.respond(body)
        }
    }
}
</code></pre>

<h2>testApplication</h2>
<pre><code class="language-kotlin">import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import kotlin.test.*

class RotasTest {
    @Test fun ping() = testApplication {
        application { module() }
        val client = createClient { install(ContentNegotiation) { json() } }

        val res = client.get("/ping")
        assertEquals(200, res.status.value)
        val body: Map&lt;String, Boolean&gt; = res.body()
        assertEquals(true, body["ok"])
    }

    @Test fun eco() = testApplication {
        application { module() }
        val client = createClient { install(ContentNegotiation) { json() } }

        val res = client.post("/eco") {
            contentType(io.ktor.http.ContentType.Application.Json)
            setBody(mapOf("nome" to "Ada"))
        }
        assertEquals(mapOf("nome" to "Ada"), res.body())
    }
}
</code></pre>

<h2>Mockando clientes externos com MockEngine</h2>
<pre><code class="language-kotlin">import io.ktor.client.*
import io.ktor.client.engine.mock.*
import io.ktor.http.*

fun fakeClient() = HttpClient(MockEngine) {
    install(ContentNegotiation) { json() }
    engine {
        addHandler { req -&gt;
            when (req.url.encodedPath) {
                "/users/1" -&gt; respond(
                    """{"id":1,"nome":"Ada"}""",
                    HttpStatusCode.OK,
                    headersOf(HttpHeaders.ContentType, "application/json")
                )
                else -&gt; respond("", HttpStatusCode.NotFound)
            }
        }
    }
}

@Test fun usaApiExterna() = runTest {
    val client = fakeClient()
    val u: Map&lt;String, Any&gt; = client.get("/users/1").body()
    assertEquals("Ada", u["nome"])
}
</code></pre>

<h2>Injetando configuração em testes</h2>
<pre><code class="language-kotlin">@Test fun comConfig() = testApplication {
    environment { config = MapApplicationConfig("ktor.deployment.host" to "0.0.0.0") }
    application { module() }
    // ...
}
</code></pre>

<h2>Casos de uso</h2>
<ul>
  <li>Validar contratos REST (status, headers, JSON).</li>
  <li>Cobrir branches de erro (400, 401, 500) sem rede.</li>
  <li>Mockar APIs externas em pipelines de integração.</li>
  <li>Testar plugins customizados (autenticação, rate limit).</li>
  <li>Smoke tests rápidos antes de deploy.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><code>testApplication</code> usa um motor in-memory; não escuta portas reais. Para load test, use <code>embeddedServer</code> de verdade.</li>
  <li>Sem <code>install(ContentNegotiation)</code> no client de teste, <code>body&lt;T&gt;()</code> falha em parsear JSON.</li>
  <li>Cada <code>testApplication</code> sobe um app novo — não compartilhe estado mutável entre testes.</li>
  <li><code>MockEngine</code> não suporta WebSocket; para isso, use container ou servidor real.</li>
  <li>Mantenha o módulo configurável (function injetável); evite singletons globais que travam testes.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Speed first</div><div>O motor de teste do Ktor é tão rápido que vale rodar centenas de cenários — invista em cobrir validação, autenticação e parsing antes de partir para integração com Testcontainers.</div></div>
`}} />
    </article>
  );
}

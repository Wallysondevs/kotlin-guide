export default function KtorClient() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Ktor · intermediario · 9 min</div>
      <h1>Ktor HTTP client</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>O <strong>Ktor Client</strong> é a stack HTTP idiomática do Kotlin: 100% async via coroutines, multiplataforma (JVM, Android, iOS, JS, Native) e configurável via plugins. Vamos cobrir setup, chamadas, serialização, retries, timeouts.</p>

<h2>Dependências</h2>
<pre><code class="language-groovy">// build.gradle.kts (JVM)
dependencies {
    implementation("io.ktor:ktor-client-core:3.0.1")
    implementation("io.ktor:ktor-client-cio:3.0.1")               // engine
    implementation("io.ktor:ktor-client-content-negotiation:3.0.1")
    implementation("io.ktor:ktor-serialization-kotlinx-json:3.0.1")
    implementation("io.ktor:ktor-client-logging:3.0.1")
}</code></pre>
<p>Engines disponíveis: <code>cio</code> (puro Kotlin, ótimo para servidores), <code>okhttp</code> (Android), <code>darwin</code> (iOS), <code>js</code>, <code>curl</code>.</p>

<h2>Setup do client</h2>
<pre><code class="language-kotlin">import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json

val httpClient = HttpClient(CIO) {
    install(ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = true
            isLenient = true
        })
    }
    install(Logging) {
        level = LogLevel.INFO
    }
    install(HttpTimeout) {
        requestTimeoutMillis = 10_000
        connectTimeoutMillis = 5_000
    }
    install(HttpRequestRetry) {
        retryOnServerErrors(maxRetries = 3)
        exponentialDelay()
    }
    defaultRequest {
        url("https://api.example.com")
        headers.append("User-Agent", "MyApp/1.0")
    }
}</code></pre>

<h2>GET e POST</h2>
<pre><code class="language-kotlin">import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.serialization.Serializable

@Serializable data class Usuario(val id: Int, val nome: String)

@Serializable data class CriarUsuario(val nome: String, val email: String)

suspend fun listarUsuarios(): List&lt;Usuario&gt; =
    httpClient.get("/usuarios") {
        parameter("page", 1)
        parameter("size", 20)
    }.body()

suspend fun obter(id: Int): Usuario =
    httpClient.get("/usuarios/\$id").body()

suspend fun criar(req: CriarUsuario): Usuario =
    httpClient.post("/usuarios") {
        contentType(ContentType.Application.Json)
        setBody(req)
    }.body()

suspend fun deletar(id: Int) {
    httpClient.delete("/usuarios/\$id")
}</code></pre>

<h2>Tratamento de erros</h2>
<p>Por padrão Ktor não lança exceção em respostas 4xx/5xx — você precisa habilitar <code>expectSuccess</code> ou inspecionar <code>response.status</code>.</p>
<pre><code class="language-kotlin">val httpClient = HttpClient(CIO) {
    expectSuccess = true   // lança ResponseException em &gt;= 300
    HttpResponseValidator {
        handleResponseExceptionWithRequest { ex, req -&gt;
            val client = ex as? ClientRequestException ?: return@handleResponseExceptionWithRequest
            val body = client.response.bodyAsText()
            throw ApiException(client.response.status.value, body)
        }
    }
}

class ApiException(val status: Int, val body: String) : RuntimeException("HTTP \$status: \$body")</code></pre>

<h2>Streaming e download</h2>
<pre><code class="language-kotlin">import io.ktor.client.statement.*
import io.ktor.utils.io.*
import java.io.File

suspend fun baixar(url: String, destino: File) {
    httpClient.prepareGet(url).execute { response -&gt;
        val channel: ByteReadChannel = response.body()
        destino.outputStream().use { out -&gt;
            channel.copyTo(out)
        }
    }
}</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Apps Kotlin Multiplatform que compartilham camada de rede entre Android e iOS.</li>
  <li>Servidores Ktor consumindo APIs externas (mesma stack já está no projeto).</li>
  <li>Pipelines de coroutines em Spring/serviços JVM async.</li>
  <li>Quando você quer plugins composáveis (logging, retry, auth) ao invés do builder rígido do Retrofit.</li>
  <li>Testes — Ktor tem <code>MockEngine</code> built-in, sem necessidade de WireMock.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Crie <strong>um único</strong> <code>HttpClient</code> por app e reutilize. Cada instância carrega pool de conexões.</li>
  <li>Não esqueça de <code>httpClient.close()</code> no shutdown (em CLIs e testes).</li>
  <li><code>response.body()</code> consome o stream — só pode ser chamado uma vez.</li>
  <li>Para enviar form-urlencoded use <code>FormDataContent(parametersOf(...))</code>, não JSON.</li>
  <li>Em Android, prefira engine <code>okhttp</code> (suporta interceptors familiares e melhor integração com WorkManager).</li>
</ul>

<div class="callout callout-info"><div class="callout-title">MockEngine</div><div>Para testes sem rede: <code>HttpClient(MockEngine { req -&gt; respond("""{"id":1}""", HttpStatusCode.OK, headersOf(HttpHeaders.ContentType, "application/json")) })</code></div></div>

<div class="callout callout-tip"><div class="callout-title">Auth plugin</div><div>Use <code>install(Auth) { bearer { loadTokens { ... }; refreshTokens { ... } } }</code> para gerenciar JWT com refresh automático.</div></div>
`}} />
    </article>
  );
}

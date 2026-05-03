export default function KtorContentNegotiation() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Ktor · intermediario · 8 min</div>
      <h1>Content Negotiation + JSON</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>O plugin <strong>ContentNegotiation</strong> do Ktor decide como serializar respostas e desserializar requisições conforme o header <code>Content-Type</code>. Combinado com <code>kotlinx.serialization</code>, ele entrega APIs JSON tipadas, sem reflexão em runtime e prontas para Kotlin Multiplatform.</p>

<h2>Conceito</h2>
<p>Você instala o plugin uma vez no servidor e registra um ou mais conversores. As funções <code>call.receive&lt;T&gt;()</code> e <code>call.respond(obj)</code> usam o conversor adequado.</p>
<pre><code class="language-kotlin">// build.gradle.kts
dependencies {
    implementation("io.ktor:ktor-server-core:2.3.12")
    implementation("io.ktor:ktor-server-netty:2.3.12")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.12")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.12")
}</code></pre>

<h2>Setup com kotlinx.serialization</h2>
<pre><code class="language-kotlin">import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            ignoreUnknownKeys = true
            encodeDefaults = false
        })
    }
    routing {
        post("/usuarios") {
            val req = call.receive&lt;NovoUsuario&gt;()
            val criado = Usuario(id = 1, nome = req.nome, email = req.email)
            call.respond(HttpStatusCode.Created, criado)
        }
        get("/usuarios/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest)
            call.respond(Usuario(id, "Ana", "ana@ex.com"))
        }
    }
}

@Serializable
data class NovoUsuario(val nome: String, val email: String)

@Serializable
data class Usuario(val id: Int, val nome: String, val email: String)</code></pre>

<h2>Jackson e Gson</h2>
<p>Quando você precisa de polimorfismo, anotações Jackson legadas ou interop com código Java existente, troque o conversor:</p>
<pre><code class="language-kotlin">// implementation("io.ktor:ktor-serialization-jackson:2.3.12")
install(ContentNegotiation) {
    jackson {
        enable(SerializationFeature.INDENT_OUTPUT)
        registerModule(JavaTimeModule())
        disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
    }
}</code></pre>
<pre><code class="language-kotlin">// implementation("io.ktor:ktor-serialization-gson:2.3.12")
install(ContentNegotiation) {
    gson { setPrettyPrinting() }
}</code></pre>

<h2>Múltiplos formatos</h2>
<p>Você pode registrar JSON e XML simultaneamente; o Ktor escolhe pelo <code>Accept</code> do cliente.</p>
<pre><code class="language-kotlin">install(ContentNegotiation) {
    json()
    register(ContentType.Application.Xml, XmlConverter())
}</code></pre>

<div class="callout callout-info">
<div class="callout-title">kotlinx.serialization é o padrão</div>
<div>É o conversor recomendado pela JetBrains: sem reflexão (compile-time), funciona em Native/JS/JVM, e o plugin Gradle <code>kotlin("plugin.serialization")</code> só precisa ser aplicado uma vez.</div>
</div>

<h2>Casos de uso</h2>
<ul>
<li>APIs REST com DTOs <code>@Serializable</code> compartilhados entre cliente e servidor.</li>
<li>Migração gradual de Jackson para kotlinx em projetos legados.</li>
<li>Suporte a múltiplos <code>Accept</code> (JSON + XML) num mesmo endpoint.</li>
<li>Customização de datas/IDs com <code>@Contextual</code> e serializers próprios.</li>
<li>Logging de payloads com <code>prettyPrint</code> em dev e compacto em prod.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Esqueceu o plugin <code>kotlin("plugin.serialization")</code>? <code>data class</code> com <code>@Serializable</code> compila mas falha em runtime.</li>
<li><code>ignoreUnknownKeys = false</code> (padrão) quebra na primeira evolução do contrato — ative em APIs públicas.</li>
<li>Tipos polimórficos exigem <code>SerializersModule</code> explícito; não há "auto-discovery" como no Jackson.</li>
<li>Jackson com Kotlin precisa de <code>jackson-module-kotlin</code> para entender <code>data class</code> sem construtor padrão.</li>
<li><code>call.receive&lt;T&gt;()</code> lança <code>BadRequestException</code> em payload inválido — capture num <code>StatusPages</code> para resposta amigável.</li>
</ul>

<div class="callout callout-tip">
<div class="callout-title">StatusPages para erros JSON</div>
<div>Combine com <code>install(StatusPages)</code> e mapeie <code>SerializationException</code> para <code>HttpStatusCode.BadRequest</code> com um corpo <code>ErrorDto</code> coerente.</div>
</div>
`}} />
    </article>
  );
}

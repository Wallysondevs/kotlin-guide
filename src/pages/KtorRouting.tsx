export default function KtorRouting() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Ktor · intermediario · 9 min</div>
      <h1>Routing</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>O plugin <code>Routing</code> é o coração de qualquer aplicação Ktor: declara, em uma DSL aninhada, todos os endpoints HTTP e seus handlers. Tudo é função suspensível, integrada nativamente a coroutines.</p>

<h2>Conceito</h2>
<p>Você instala o plugin e abre o bloco <code>routing { }</code>. Dentro dele, funções como <code>get</code>, <code>post</code>, <code>put</code>, <code>delete</code> registram rotas. Subrotas vêm com <code>route("/prefixo") { ... }</code>.</p>
<pre><code class="language-kotlin">import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.module() {
    routing {
        get("/") { call.respondText("ok") }
        get("/health") { call.respond(mapOf("status" to "UP")) }
    }
}</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">import io.ktor.http.*
import io.ktor.server.request.*
import kotlinx.serialization.Serializable

@Serializable
data class Pedido(val id: Long, val total: Double)

fun Application.pedidosRoutes(repo: PedidoRepo) {
    routing {
        route("/api/v1/pedidos") {
            get {
                call.respond(repo.todos())
            }
            get("/{id}") {
                val id = call.parameters["id"]?.toLongOrNull()
                    ?: return@get call.respond(HttpStatusCode.BadRequest)
                val p = repo.porId(id)
                    ?: return@get call.respond(HttpStatusCode.NotFound)
                call.respond(p)
            }
            post {
                val novo = call.receive&lt;Pedido&gt;()
                repo.salvar(novo)
                call.respond(HttpStatusCode.Created, novo)
            }
            delete("/{id}") {
                val id = call.parameters["id"]!!.toLong()
                repo.apagar(id)
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>APIs JSON enxutas com kotlinx.serialization.</li>
<li>Backends para BFF mobile com latência baixa.</li>
<li>Webhooks e gateways internos.</li>
<li>Servidores SSE/WebSocket dentro do mesmo <code>routing</code>.</li>
<li>Endpoints estáticos para SPA + API no mesmo binário.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Quebre rotas em funções de extensão de <code>Route</code> ou <code>Application</code> por feature.</li>
<li>Centralize tratamento de erros com o plugin <code>StatusPages</code>.</li>
<li>Use <code>authenticate("jwt") { ... }</code> para grupos de rotas protegidas.</li>
<li>Valide parâmetros antes de chamar serviços — falhe rápido com <code>BadRequest</code>.</li>
<li>Configure <code>ContentNegotiation</code> com <code>json()</code> uma única vez no <code>module()</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Type-safe routing</div><div>Desde Ktor 2, há <code>Resources</code> plugin: declare <code>@Resource("/users/{id}") class UserById(val id: Long)</code> e use <code>get&lt;UserById&gt; { user -&gt; ... }</code>. Adeus <code>parameters["id"]!!</code>.</div></div>

<div class="callout callout-info"><div class="callout-title">Sub-routing</div><div><code>route("/api") { route("/v1") { get("/x") { ... } } }</code> compõe prefixos sem repetição. Ideal para versionamento e agrupamento por domínio.</div></div>
`}} />
    </article>
  );
}

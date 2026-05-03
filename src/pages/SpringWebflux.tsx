export default function SpringWebflux() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Spring Boot · avancado · 10 min</div>
      <h1>Spring WebFlux + coroutines</h1>
      <div dangerouslySetInnerHTML={{__html: `<p>Spring WebFlux é a stack <em>reativa</em> e não-bloqueante do Spring Boot, baseada em Project Reactor. Em Kotlin, ela combina perfeitamente com <strong>coroutines</strong>: handlers podem ser <code>suspend</code>, retornar <code>Flow</code> em vez de <code>Flux</code>, e usar <code>coRouter</code> para definir rotas funcionais.</p>

<h2>Conceito</h2>
<p>Em vez do modelo "uma thread por request" do Spring MVC, WebFlux usa um pequeno pool de event-loops (Netty por padrão) e composição assíncrona. Com Kotlin coroutines você escreve código <em>sequencial</em> que o runtime executa de forma não-bloqueante.</p>
<pre><code class="language-kotlin">// build.gradle.kts (trechos)
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor:1.8.1")
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    runtimeOnly("io.r2dbc:r2dbc-postgresql")
}</code></pre>

<h2>Controller com suspend</h2>
<pre><code class="language-kotlin">@RestController
@RequestMapping("/api/usuarios")
class UsuarioController(private val repo: UsuarioRepository) {

    @GetMapping("/{id}")
    suspend fun buscar(@PathVariable id: Long): Usuario =
        repo.findById(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)

    @GetMapping
    fun listar(): Flow&lt;Usuario&gt; = repo.findAll().asFlow()

    @PostMapping
    suspend fun criar(@RequestBody novo: Usuario): Usuario = repo.save(novo)
}</code></pre>

<h2>RouterFunction com coRouter</h2>
<pre><code class="language-kotlin">@Configuration
class Rotas(val handler: ProdutoHandler) {
    @Bean
    fun rotas() = coRouter {
        "/api/produtos".nest {
            GET("",          handler::listar)
            GET("/{id}",     handler::buscar)
            POST("",         handler::criar)
            DELETE("/{id}",  handler::remover)
        }
    }
}

@Component
class ProdutoHandler(val repo: ProdutoRepository) {
    suspend fun listar(req: ServerRequest): ServerResponse =
        ServerResponse.ok().bodyAndAwait(repo.findAll().asFlow())

    suspend fun buscar(req: ServerRequest): ServerResponse {
        val id = req.pathVariable("id").toLong()
        val p = repo.findById(id) ?: return ServerResponse.notFound().buildAndAwait()
        return ServerResponse.ok().bodyValueAndAwait(p)
    }

    suspend fun criar(req: ServerRequest): ServerResponse {
        val novo = req.awaitBody&lt;Produto&gt;()
        return ServerResponse.status(201).bodyValueAndAwait(repo.save(novo))
    }

    suspend fun remover(req: ServerRequest): ServerResponse {
        repo.deleteById(req.pathVariable("id").toLong())
        return ServerResponse.noContent().buildAndAwait()
    }
}</code></pre>

<h2>R2DBC (banco reativo)</h2>
<pre><code class="language-kotlin">@Table("usuarios")
data class Usuario(@Id val id: Long? = null, val nome: String, val email: String)

interface UsuarioRepository : CoroutineCrudRepository&lt;Usuario, Long&gt; {
    fun findByEmailContaining(parte: String): Flow&lt;Usuario&gt;
}</code></pre>

<h2>WebClient</h2>
<pre><code class="language-kotlin">@Service
class CepService(private val builder: WebClient.Builder) {
    private val client = builder.baseUrl("https://viacep.com.br").build()

    suspend fun buscar(cep: String): Cep = client.get()
        .uri("/ws/\$cep/json/")
        .retrieve()
        .awaitBody()
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>APIs de alta concorrência com pouco CPU por request (gateways, BFFs).</li>
<li>Streaming server-sent events (SSE) com <code>Flow</code>.</li>
<li>Composição de várias chamadas externas em paralelo (<code>coroutineScope</code> + <code>async</code>).</li>
<li>Pipelines reativos com Kafka Reactor ou MongoDB reativo.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><strong>Não bloqueie</strong> em handlers reativos. Nada de JDBC, <code>Thread.sleep</code>, ou libs síncronas — empurre para <code>Dispatchers.IO</code> com <code>withContext</code>.</li>
<li>Mistura de WebMVC + WebFlux no mesmo classpath quebra autoconfig — escolha um.</li>
<li><code>@Transactional</code> reativo precisa de <code>R2dbcTransactionManager</code>, não o JDBC.</li>
<li>Backpressure em <code>Flow</code> retornado em endpoints SSE: configure <code>produces = [TEXT_EVENT_STREAM_VALUE]</code>.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Quando NÃO usar WebFlux</div><div>Para CRUDs simples sobre JDBC, Spring MVC tradicional + Kotlin (com Loom no JDK 21) costuma ser mais fácil de operar e debugar. Adote WebFlux quando o gargalo é I/O e você precisa de milhares de conexões simultâneas.</div></div>

<div class="callout callout-tip"><div class="callout-title">Async paralelo</div><div>Para chamadas externas independentes: <code>coroutineScope { val a = async { servA() }; val b = async { servB() }; Resp(a.await(), b.await()) }</code>.</div></div>`}} />
    </article>
  );
}

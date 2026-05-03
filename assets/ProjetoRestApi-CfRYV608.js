import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function i(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Projetos · avancado · 15 min"}),e.jsx("h1",{children:"Projeto: REST API com Ktor"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Vamos construir uma API REST de tarefas (todo-list) completa com <strong>Ktor 3</strong>: persistência em <strong>PostgreSQL via Exposed</strong>, autenticação <strong>JWT</strong>, validação de entrada, testes integrados e empacotamento em <strong>Docker</strong>. O foco é mostrar uma stack idiomática e production-ready, em ~300 linhas de código real.</p>

<h2>Estrutura do projeto</h2>
<pre><code class="language-bash">tarefas-api/
├── build.gradle.kts
├── settings.gradle.kts
├── docker-compose.yml
├── Dockerfile
└── src/
    ├── main/
    │   ├── kotlin/br/com/exemplo/tarefas/
    │   │   ├── Application.kt
    │   │   ├── config/Database.kt
    │   │   ├── config/Security.kt
    │   │   ├── tarefas/Tarefa.kt
    │   │   ├── tarefas/TarefaRepository.kt
    │   │   ├── tarefas/TarefaRoutes.kt
    │   │   └── auth/AuthRoutes.kt
    │   └── resources/
    │       └── application.conf
    └── test/kotlin/br/com/exemplo/tarefas/
        └── TarefaRoutesTest.kt</code></pre>

<h2>build.gradle.kts</h2>
<pre><code class="language-groovy">plugins {
    kotlin("jvm") version "2.0.20"
    kotlin("plugin.serialization") version "2.0.20"
    id("io.ktor.plugin") version "3.0.0"
}

application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}

dependencies {
    val ktor = "3.0.0"
    val exposed = "0.55.0"

    implementation("io.ktor:ktor-server-core:$ktor")
    implementation("io.ktor:ktor-server-netty:$ktor")
    implementation("io.ktor:ktor-server-content-negotiation:$ktor")
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktor")
    implementation("io.ktor:ktor-server-auth:$ktor")
    implementation("io.ktor:ktor-server-auth-jwt:$ktor")
    implementation("io.ktor:ktor-server-status-pages:$ktor")
    implementation("io.ktor:ktor-server-call-logging:$ktor")

    implementation("org.jetbrains.exposed:exposed-core:$exposed")
    implementation("org.jetbrains.exposed:exposed-jdbc:$exposed")
    implementation("org.jetbrains.exposed:exposed-java-time:$exposed")
    implementation("org.postgresql:postgresql:42.7.4")
    implementation("com.zaxxer:HikariCP:6.0.0")
    implementation("ch.qos.logback:logback-classic:1.5.6")

    testImplementation("io.ktor:ktor-server-test-host:$ktor")
    testImplementation("org.testcontainers:postgresql:1.20.2")
    testImplementation(kotlin("test"))
}</code></pre>

<h2>Modelo e tabela</h2>
<pre><code class="language-kotlin">// tarefas/Tarefa.kt
@Serializable
data class Tarefa(
    val id: Long? = null,
    val titulo: String,
    val concluida: Boolean = false,
    val criadaEm: String? = null
)

object Tarefas : LongIdTable("tarefas") {
    val titulo = varchar("titulo", 200)
    val concluida = bool("concluida").default(false)
    val criadaEm = timestamp("criada_em").defaultExpression(CurrentTimestamp())
    val usuarioId = long("usuario_id").index()
}</code></pre>

<h2>Repository</h2>
<pre><code class="language-kotlin">class TarefaRepository {
    fun listar(usuarioId: Long): List&lt;Tarefa&gt; = transaction {
        Tarefas.selectAll().where { Tarefas.usuarioId eq usuarioId }
            .map { it.toTarefa() }
    }

    fun criar(usuarioId: Long, titulo: String): Tarefa = transaction {
        val id = Tarefas.insertAndGetId {
            it[Tarefas.titulo] = titulo
            it[Tarefas.usuarioId] = usuarioId
        }.value
        Tarefas.selectAll().where { Tarefas.id eq id }.single().toTarefa()
    }

    fun marcar(id: Long, usuarioId: Long, concluida: Boolean): Boolean = transaction {
        Tarefas.update({ (Tarefas.id eq id) and (Tarefas.usuarioId eq usuarioId) }) {
            it[Tarefas.concluida] = concluida
        } &gt; 0
    }

    fun apagar(id: Long, usuarioId: Long): Boolean = transaction {
        Tarefas.deleteWhere { (Tarefas.id eq id) and (Tarefas.usuarioId eq usuarioId) } &gt; 0
    }

    private fun ResultRow.toTarefa() = Tarefa(
        id = this[Tarefas.id].value,
        titulo = this[Tarefas.titulo],
        concluida = this[Tarefas.concluida],
        criadaEm = this[Tarefas.criadaEm].toString()
    )
}</code></pre>

<h2>Rotas e validação</h2>
<pre><code class="language-kotlin">@Serializable data class CriarReq(val titulo: String)
@Serializable data class MarcarReq(val concluida: Boolean)

fun Route.tarefaRoutes(repo: TarefaRepository) {
    authenticate("auth-jwt") {
        route("/tarefas") {
            get {
                val uid = call.userId()
                call.respond(repo.listar(uid))
            }
            post {
                val uid = call.userId()
                val req = call.receive&lt;CriarReq&gt;()
                require(req.titulo.length in 1..200) { "título deve ter 1..200 chars" }
                call.respond(HttpStatusCode.Created, repo.criar(uid, req.titulo))
            }
            patch("/{id}") {
                val uid = call.userId()
                val id = call.parameters["id"]!!.toLong()
                val req = call.receive&lt;MarcarReq&gt;()
                if (repo.marcar(id, uid, req.concluida)) call.respond(HttpStatusCode.NoContent)
                else call.respond(HttpStatusCode.NotFound)
            }
            delete("/{id}") {
                val uid = call.userId()
                val id = call.parameters["id"]!!.toLong()
                if (repo.apagar(id, uid)) call.respond(HttpStatusCode.NoContent)
                else call.respond(HttpStatusCode.NotFound)
            }
        }
    }
}

fun ApplicationCall.userId(): Long =
    principal&lt;JWTPrincipal&gt;()!!.payload.getClaim("uid").asLong()</code></pre>

<h2>Application.kt</h2>
<pre><code class="language-kotlin">fun main(args: Array&lt;String&gt;) = EngineMain.main(args)

fun Application.module() {
    Database.init(environment.config)
    install(ContentNegotiation) { json() }
    install(CallLogging)
    install(StatusPages) {
        exception&lt;IllegalArgumentException&gt; { call, e -&gt;
            call.respond(HttpStatusCode.BadRequest, mapOf("erro" to e.message))
        }
    }
    configureSecurity()
    routing {
        authRoutes()
        tarefaRoutes(TarefaRepository())
    }
}</code></pre>

<h2>Teste integrado</h2>
<pre><code class="language-kotlin">class TarefaRoutesTest {
    @Test
    fun criaEListaTarefa() = testApplication {
        application { module() }
        val client = createClient { install(ContentNegotiationClient) { json() } }
        val token = login(client, "ana@x.com", "senha")

        val resp = client.post("/tarefas") {
            bearerAuth(token)
            contentType(ContentType.Application.Json)
            setBody(CriarReq("comprar pão"))
        }
        assertEquals(HttpStatusCode.Created, resp.status)
    }
}</code></pre>

<h2>Dockerfile e docker-compose</h2>
<pre><code class="language-bash"># Dockerfile
FROM eclipse-temurin:21-jre
COPY build/libs/tarefas-api-all.jar /app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]</code></pre>
<pre><code class="language-yaml">services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: tarefas
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: tarefas
    ports: ["5432:5432"]
  api:
    build: .
    depends_on: [db]
    environment:
      DB_URL: jdbc:postgresql://db:5432/tarefas
      DB_USER: tarefas
      DB_PASS: secret
      JWT_SECRET: troque-isto
    ports: ["8080:8080"]</code></pre>

<h2>Como rodar</h2>
<pre><code class="language-bash">./gradlew buildFatJar
docker compose up --build

# em outro terminal
curl -X POST localhost:8080/auth/login \\
  -H 'content-type: application/json' \\
  -d '{"email":"ana@x.com","senha":"senha"}'

# guarde o token e use:
curl localhost:8080/tarefas -H "Authorization: Bearer $TOKEN"</code></pre>

<h2>Próximos passos</h2>
<ul>
<li>Adicionar paginação (<code>?limit=&offset=</code>) e ordenação.</li>
<li>Migrar transações síncronas Exposed para <code>newSuspendedTransaction</code>.</li>
<li>Adicionar OpenAPI com o plugin <code>io.github.smiley4:ktor-swagger-ui</code>.</li>
<li>Métricas com Micrometer + Prometheus.</li>
<li>CI no GitHub Actions: build + testes com Testcontainers.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Empacotamento</div><div>O plugin <code>io.ktor.plugin</code> oferece <code>buildFatJar</code>, <code>buildImage</code> e <code>publishImageToLocalRegistry</code> — você pode pular o Dockerfile manual em projetos simples.</div></div>

<div class="callout callout-warn"><div class="callout-title">Produção</div><div>Antes de ir ao ar: troque o <code>JWT_SECRET</code> por algo do secret manager, configure HTTPS (atrás de um proxy ou via <code>ktor-server-netty</code> com keystore), e ative <code>HikariCP</code> com pool tuned.</div></div>
`}})]})}export{i as default};

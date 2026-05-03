import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Ktor · avancado · 10 min"}),e.jsx("h1",{children:"Ktor + Exposed/HikariCP"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Ktor não impõe um ORM, mas a stack mais comum no ecossistema JetBrains é <strong>Exposed</strong> (DSL ou DAO) sobre um pool <strong>HikariCP</strong>. Esse setup é leve, performático e idiomático em Kotlin — sem reflexão pesada como Hibernate.</p>

<h2>Conceito</h2>
<p>HikariCP gerencia conexões TCP com o banco e as reaproveita. Exposed envolve o JDBC com uma DSL tipada em Kotlin, e roda dentro de blocos <code>transaction { }</code> (ou <code>newSuspendedTransaction</code> para corrotinas).</p>
<pre><code class="language-kotlin">// build.gradle.kts
dependencies {
    implementation("io.ktor:ktor-server-core-jvm:3.0.0")
    implementation("io.ktor:ktor-server-netty-jvm:3.0.0")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:3.0.0")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:3.0.0")
    implementation("org.jetbrains.exposed:exposed-core:0.55.0")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.55.0")
    implementation("org.jetbrains.exposed:exposed-java-time:0.55.0")
    implementation("com.zaxxer:HikariCP:5.1.0")
    implementation("org.postgresql:postgresql:42.7.4")
}
</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction

object Tarefas : Table("tarefas") {
    val id        = long("id").autoIncrement()
    val titulo    = varchar("titulo", 200)
    val concluida = bool("concluida").default(false)
    override val primaryKey = PrimaryKey(id)
}

fun configurarBanco(): Database {
    val config = HikariConfig().apply {
        jdbcUrl = "jdbc:postgresql://localhost:5432/app"
        username = "app"
        password = "secret"
        maximumPoolSize = 10
        driverClassName = "org.postgresql.Driver"
    }
    val ds = HikariDataSource(config)
    return Database.connect(ds).also {
        org.jetbrains.exposed.sql.transactions.transaction(it) {
            SchemaUtils.create(Tarefas)
        }
    }
}
</code></pre>

<h2>Integrando ao routing</h2>
<pre><code class="language-kotlin">import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.Serializable

@Serializable data class TarefaDto(val id: Long? = null, val titulo: String, val concluida: Boolean = false)

fun Application.module() {
    val db = configurarBanco()
    install(ContentNegotiation) { json() }

    routing {
        get("/tarefas") {
            val lista = newSuspendedTransaction(db = db) {
                Tarefas.selectAll().map {
                    TarefaDto(it[Tarefas.id], it[Tarefas.titulo], it[Tarefas.concluida])
                }
            }
            call.respond(lista)
        }

        post("/tarefas") {
            val dto = call.receive&lt;TarefaDto&gt;()
            val id = newSuspendedTransaction(db = db) {
                Tarefas.insert {
                    it[titulo] = dto.titulo
                    it[concluida] = dto.concluida
                } get Tarefas.id
            }
            call.respond(dto.copy(id = id))
        }
    }
}

fun main() {
    embeddedServer(Netty, port = 8080, module = Application::module).start(wait = true)
}
</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Microserviços HTTP que precisam de persistência relacional simples.</li>
<li>APIs internas onde JPA/Hibernate seria pesado demais.</li>
<li>Stack KMP-friendly no backend (Exposed roda só na JVM, mas DTOs com <code>kotlinx.serialization</code> compartilham com clients).</li>
<li>Migração gradual de scripts JDBC artesanais para uma DSL mais segura.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Use sempre <code>newSuspendedTransaction</code> dentro de handlers Ktor — <code>transaction { }</code> bloqueia a thread do event loop.</li>
<li>Configure <code>maximumPoolSize</code> ≈ <code>2 × CPU</code> para cargas mistas; menos para OLTP puro.</li>
<li>Não exponha <code>Tarefas.selectAll()</code> diretamente — mapeie para DTOs no boundary.</li>
<li>Adote Flyway ou Liquibase para migrations; <code>SchemaUtils.create</code> é só para dev/teste.</li>
<li>Habilite <code>Database.connect(...).useNestedTransactions = true</code> se precisar aninhar.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Atenção</div><div>Exposed lança suas próprias exceções (<code>ExposedSQLException</code>) que envolvem <code>SQLException</code>. Trate-as no <code>StatusPages</code> do Ktor para devolver 500 limpos em vez de stack traces ao cliente.</div></div>
`}})]})}export{r as default};

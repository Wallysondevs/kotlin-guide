import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function t(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Banco de dados · intermediario · 11 min"}),e.jsx("h1",{children:"Exposed ORM"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`<p><strong>Exposed</strong> é o ORM oficial da JetBrains para Kotlin/JVM. Oferece duas APIs: uma <em>DSL</em> tipada que se parece com SQL, e uma camada <em>DAO</em> com entidades. Não usa anotações; tudo é Kotlin idiomático.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">// build.gradle.kts
dependencies {
    implementation("org.jetbrains.exposed:exposed-core:0.52.0")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.52.0")
    implementation("org.jetbrains.exposed:exposed-dao:0.52.0")
    implementation("org.jetbrains.exposed:exposed-java-time:0.52.0")
    implementation("org.postgresql:postgresql:42.7.3")
    implementation("com.zaxxer:HikariCP:5.1.0")
}</code></pre>

<h2>Schema (Object Table)</h2>
<pre><code class="language-kotlin">import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.dao.id.IntIdTable

object Usuarios : IntIdTable("usuarios") {
    val nome  = varchar("nome", 120)
    val email = varchar("email", 200).uniqueIndex()
    val ativo = bool("ativo").default(true)
}

object Pedidos : IntIdTable("pedidos") {
    val usuario = reference("usuario_id", Usuarios)
    val total   = decimal("total", 10, 2)
    val criado  = datetime("criado").defaultExpression(CurrentDateTime)
}</code></pre>

<h2>DSL — operações tipadas</h2>
<pre><code class="language-kotlin">fun main() {
    Database.connect(hikari())

    transaction {
        SchemaUtils.create(Usuarios, Pedidos)

        val anaId = Usuarios.insertAndGetId {
            it[nome]  = "Ana"
            it[email] = "ana@x.com"
        }

        Pedidos.insert {
            it[usuario] = anaId
            it[total]   = "199.90".toBigDecimal()
        }

        // Query
        Usuarios
            .select { Usuarios.ativo eq true }
            .orderBy(Usuarios.nome)
            .forEach { println("\${it[Usuarios.nome]} - \${it[Usuarios.email]}") }

        // Update
        Usuarios.update({ Usuarios.email eq "ana@x.com" }) {
            it[nome] = "Ana Silva"
        }

        // Delete
        Pedidos.deleteWhere { total less "10".toBigDecimal() }
    }
}</code></pre>

<h2>Joins</h2>
<pre><code class="language-kotlin">val ricos = (Usuarios innerJoin Pedidos)
    .slice(Usuarios.nome, Pedidos.total)
    .select { Pedidos.total greater "1000".toBigDecimal() }
    .map { it[Usuarios.nome] to it[Pedidos.total] }</code></pre>

<h2>DAO — entidades</h2>
<pre><code class="language-kotlin">import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID

class Usuario(id: EntityID&lt;Int&gt;) : IntEntity(id) {
    companion object : IntEntityClass&lt;Usuario&gt;(Usuarios)
    var nome  by Usuarios.nome
    var email by Usuarios.email
    var ativo by Usuarios.ativo
    val pedidos by Pedido referrersOn Pedidos.usuario
}

class Pedido(id: EntityID&lt;Int&gt;) : IntEntity(id) {
    companion object : IntEntityClass&lt;Pedido&gt;(Pedidos)
    var usuario by Usuario referencedOn Pedidos.usuario
    var total   by Pedidos.total
}

transaction {
    val u = Usuario.new { nome = "Bia"; email = "bia@x.com" }
    Pedido.new { usuario = u; total = "59.90".toBigDecimal() }
    Usuario.find { Usuarios.ativo eq true }.forEach { println(it.nome) }
}</code></pre>

<h2>batchInsert</h2>
<pre><code class="language-kotlin">val novos = listOf("Carlos", "Diana", "Edu")
transaction {
    Usuarios.batchInsert(novos) { nome -&gt;
        this[Usuarios.nome] = nome
        this[Usuarios.email] = "\${nome.lowercase()}@x.com"
    }
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Backends Kotlin puros sem Spring (Ktor + Exposed é stack popular).</li>
<li>Quando você quer SQL controlado sem fugir totalmente para JDBC bruto.</li>
<li>Migrations leves combinadas com Flyway/Liquibase.</li>
<li>Microsserviços onde JPA/Hibernate seria peso desnecessário.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Toda operação precisa estar dentro de <code>transaction { }</code> — fora disso, a sessão está fechada.</li>
<li>DAO carrega lazy: acessar <code>pedidos</code> fora da transação lança erro.</li>
<li>Use <code>HikariCP</code> em produção — sem pool, performance despenca.</li>
<li><code>batchInsert</code> retorna a lista — para milhões de linhas, faça em chunks com <code>shouldReturnGeneratedValues = false</code>.</li>
<li>Migrations não são geradas automaticamente; <code>SchemaUtils.create</code> é só para dev/teste.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Coroutines</div><div>Use <code>newSuspendedTransaction(Dispatchers.IO)</code> do módulo <code>exposed-jdbc</code> para integrar com coroutines sem bloquear o pool de coroutines.</div></div>

<div class="callout callout-tip"><div class="callout-title">DSL ou DAO?</div><div>DSL é mais explícito e performático; DAO é mais conveniente para CRUD simples. Misture conforme a necessidade — eles compartilham o mesmo schema.</div></div>`}})]})}export{t as default};

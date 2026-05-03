export default function Ktorm() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Multiplataforma e avançado · avancado · 9 min</div>
      <h1>Ktorm ORM</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Ktorm é um ORM leve para Kotlin com DSL fortemente tipada. Diferente de JPA/Hibernate, não tem proxy, lazy loading nem ciclo de vida obscuro: você escreve queries em uma DSL que se parece com SQL, e o compilador checa tipos de colunas e parâmetros.</p>

<h2>Conceito</h2>
<p>Você define <em>Table objects</em> declarando colunas; <code>Database.connect</code> cria a conexão; queries usam funções como <code>from</code>, <code>select</code>, <code>where</code>, <code>groupBy</code>.</p>
<pre><code class="language-kotlin">import org.ktorm.database.Database
import org.ktorm.schema.*

object Usuarios : Table&lt;Nothing&gt;("usuario") {
    val id    = long("id").primaryKey()
    val nome  = varchar("nome")
    val email = varchar("email")
}

val db = Database.connect("jdbc:postgresql://localhost/app", user = "app", password = "app")</code></pre>

<h2>Exemplo prático — DSL queries</h2>
<pre><code class="language-kotlin">import org.ktorm.dsl.*

fun listarPorDominio(dominio: String): List&lt;Pair&lt;Long, String&gt;&gt; =
    db.from(Usuarios)
        .select(Usuarios.id, Usuarios.nome)
        .where { Usuarios.email like "%@\\$dominio" }
        .orderBy(Usuarios.nome.asc())
        .map { row -&gt; row[Usuarios.id]!! to row[Usuarios.nome]!! }

fun inserir(nome: String, email: String): Int =
    db.insert(Usuarios) {
        set(it.nome, nome)
        set(it.email, email)
    }

fun atualizarNome(id: Long, novo: String): Int =
    db.update(Usuarios) {
        set(it.nome, novo)
        where { it.id eq id }
    }</code></pre>

<h2>Entity interfaces (camada mais alta)</h2>
<pre><code class="language-kotlin">import org.ktorm.entity.*

interface Usuario : Entity&lt;Usuario&gt; {
    companion object : Entity.Factory&lt;Usuario&gt;()
    val id: Long
    var nome: String
    var email: String
}

object Usuarios : Table&lt;Usuario&gt;("usuario") {
    val id    = long("id").primaryKey().bindTo { it.id }
    val nome  = varchar("nome").bindTo { it.nome }
    val email = varchar("email").bindTo { it.email }
}

val Database.usuarios get() = this.sequenceOf(Usuarios)

fun buscarTodos() = db.usuarios.toList()
fun salvar(u: Usuario) { db.usuarios.add(u) }</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Backends Ktor/Spring que querem SQL explícito sem boilerplate JDBC.</li>
<li>Queries complexas com joins, subqueries e agregações tipadas.</li>
<li>Equipes que rejeitam a "mágica" do JPA mas querem mais que JOOQ Kotlin.</li>
<li>Microsserviços com schema pequeno e foco em performance.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Use <code>HikariCP</code> como pool no <code>Database.connect</code>.</li>
<li>Encapsule a DSL em funções de repositório — não vaze <code>db</code> pelo serviço.</li>
<li>Combine com Flyway para migrations; Ktorm não gera DDL.</li>
<li>Para tipos custom (UUID, Json), implemente <code>SqlType</code>.</li>
<li>Entidades são <em>interfaces</em>: instancie com <code>Entity.create()</code> ou factory.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Ktorm vs Exposed</div><div>Ambos são DSLs Kotlin para SQL. Exposed (JetBrains) tem mais adoção; Ktorm tem API mais coesa e menos overload de operadores. Avalie ergonomia no seu caso.</div></div>

<div class="callout callout-tip"><div class="callout-title">Suporte a coroutines</div><div>Ktorm é síncrono (JDBC). Para chamar de <code>suspend fun</code>, envolva em <code>withContext(Dispatchers.IO)</code> — assim não bloqueia o event loop.</div></div>
`}} />
    </article>
  );
}

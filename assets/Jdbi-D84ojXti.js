import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function l(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Banco de dados · intermediario · 9 min"}),e.jsx("h1",{children:"JDBI3 com Kotlin"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>JDBI3 é uma biblioteca Java leve sobre JDBC que oferece dois estilos: <strong>Fluent API</strong> e <strong>SqlObject</strong> (interfaces declarativas com SQL em anotações). Com o plugin <code>kotlin-jdbi</code>, ganha mapeamento automático para <code>data class</code>, named parameters e suporte a <code>component1()</code>/named arguments do construtor.</p>

<h2>Setup</h2>
<pre><code class="language-groovy">// build.gradle.kts
dependencies {
    implementation("org.jdbi:jdbi3-core:3.45.4")
    implementation("org.jdbi:jdbi3-sqlobject:3.45.4")
    implementation("org.jdbi:jdbi3-kotlin:3.45.4")
    implementation("org.jdbi:jdbi3-kotlin-sqlobject:3.45.4")
    implementation("org.postgresql:postgresql:42.7.4")
    implementation("com.zaxxer:HikariCP:5.1.0")
}</code></pre>

<pre><code class="language-kotlin">import com.zaxxer.hikari.HikariDataSource
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.kotlin.KotlinPlugin
import org.jdbi.v3.sqlobject.SqlObjectPlugin
import org.jdbi.v3.sqlobject.kotlin.KotlinSqlObjectPlugin

val ds = HikariDataSource().apply {
    jdbcUrl = "jdbc:postgresql://localhost:5432/app"
    username = "app"; password = "secret"; maximumPoolSize = 10
}

val jdbi: Jdbi = Jdbi.create(ds)
    .installPlugin(KotlinPlugin())
    .installPlugin(SqlObjectPlugin())
    .installPlugin(KotlinSqlObjectPlugin())</code></pre>

<h2>Fluent API</h2>
<pre><code class="language-kotlin">data class Usuario(val id: Long, val nome: String, val email: String)

fun listar(): List&lt;Usuario&gt; = jdbi.withHandle&lt;List&lt;Usuario&gt;, Exception&gt; { h -&gt;
    h.createQuery("SELECT id, nome, email FROM usuarios ORDER BY id")
        .mapTo(Usuario::class.java)
        .list()
}

fun criar(u: Usuario): Long = jdbi.withHandle&lt;Long, Exception&gt; { h -&gt;
    h.createUpdate("""
        INSERT INTO usuarios (nome, email)
        VALUES (:nome, :email)
    """)
    .bindKotlin(u)
    .executeAndReturnGeneratedKeys("id")
    .mapTo(Long::class.java)
    .one()
}</code></pre>
<p><code>bindKotlin(obj)</code> mapeia propriedades para parâmetros nomeados — sem boilerplate de <code>bind("nome", u.nome)</code>.</p>

<h2>SqlObject pattern</h2>
<pre><code class="language-kotlin">import org.jdbi.v3.sqlobject.customizer.BindKotlin
import org.jdbi.v3.sqlobject.kotlin.RegisterKotlinMapper
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

@RegisterKotlinMapper(Usuario::class)
interface UsuarioDao {

    @SqlQuery("SELECT * FROM usuarios WHERE id = :id")
    fun buscar(id: Long): Usuario?

    @SqlQuery("SELECT * FROM usuarios ORDER BY id LIMIT :limit OFFSET :offset")
    fun pagina(limit: Int, offset: Int): List&lt;Usuario&gt;

    @SqlUpdate("INSERT INTO usuarios (nome, email) VALUES (:nome, :email)")
    @GetGeneratedKeys("id")
    fun inserir(@BindKotlin u: Usuario): Long
}

fun comDao() {
    jdbi.useExtension(UsuarioDao::class.java) { dao -&gt;
        dao.inserir(Usuario(0, "Ada", "ada@x.com"))
        dao.pagina(10, 0).forEach(::println)
    }
}</code></pre>

<h2>Transações</h2>
<pre><code class="language-kotlin">jdbi.useTransaction&lt;Exception&gt; { h -&gt;
    h.createUpdate("UPDATE contas SET saldo = saldo - :v WHERE id = :de")
        .bind("v", 100).bind("de", 1).execute()
    h.createUpdate("UPDATE contas SET saldo = saldo + :v WHERE id = :para")
        .bind("v", 100).bind("para", 2).execute()
}</code></pre>
<p>Para SqlObject, anote o método com <code>@Transaction</code> ou abra explicitamente.</p>

<h2>Quando usar JDBI</h2>
<ul>
  <li>Projetos onde JPA/Hibernate é "muito" e SQL puro é "pouco".</li>
  <li>Times que querem controle total sobre as queries (sem proxies/L1 cache mágicos).</li>
  <li>APIs orientadas a dados (analytics, dashboards) com SQL otimizado à mão.</li>
  <li>Microsserviços enxutos que precisam de tempo de boot baixo.</li>
  <li>Migração gradual de JDBC puro para algo mais ergonômico.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">SQL em arquivos externos</div><div>Use <code>@SqlQuery("nome.sql")</code> com locator de classpath para manter SQL longo fora de strings Kotlin. Ganha syntax highlighting e diff legível.</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Esquecer plugins</strong>: sem <code>KotlinPlugin</code>, mapeamento para data class falha em runtime com mensagem genérica.</li>
  <li><strong>nullables</strong>: colunas <code>NULL</code> em campos não-nullable Kotlin lançam exceção. Modele com <code>String?</code>.</li>
  <li><strong>Reflection na imagem nativa</strong>: requer hints (kotlin reflection + acesso a construtores).</li>
  <li><strong>Pool de conexões</strong>: JDBI <em>não</em> traz pool. Use HikariCP — sem ele cada query abre conexão.</li>
  <li><strong>Coroutines</strong>: JDBI é bloqueante. Em Ktor/Spring WebFlux, envolva em <code>withContext(Dispatchers.IO)</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Combine JDBI com migrations Flyway/Liquibase. Schema vive sob versão; o código só consulta. Resultado: queries simples, deploys reproducíveis.</div></div>
`}})]})}export{l as default};

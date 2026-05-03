import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function s(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Banco de dados · intermediario · 9 min"}),e.jsx("h1",{children:"PostgreSQL JDBC + HikariCP"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Conexões com PostgreSQL em Kotlin geralmente passam por <strong>HikariCP</strong>, o pool padrão de fato na JVM. Conexões são caras — abrir/fechar a cada query mata performance. Um pool bem configurado e <code>PreparedStatement</code> reaproveitados são o que separa um endpoint de 5 ms de um de 500 ms.</p>

<h2>Conceito</h2>
<p>O Hikari mantém N conexões físicas vivas. <code>dataSource.connection</code> entrega uma conexão emprestada; <code>close()</code> a devolve ao pool (não fecha de verdade). O driver JDBC cuida da serialização do SQL e tipos.</p>
<pre><code class="language-kotlin">// build.gradle.kts
dependencies {
    implementation("com.zaxxer:HikariCP:5.1.0")
    implementation("org.postgresql:postgresql:42.7.3")
}</code></pre>

<h2>Configuração mínima</h2>
<pre><code class="language-kotlin">import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource

fun criarDataSource(): HikariDataSource {
    val cfg = HikariConfig().apply {
        jdbcUrl = "jdbc:postgresql://localhost:5432/app"
        username = System.getenv("DB_USER")
        password = System.getenv("DB_PASS")

        maximumPoolSize = 10
        minimumIdle = 2
        connectionTimeout = 5_000      // ms para esperar uma conexão livre
        idleTimeout = 60_000
        maxLifetime = 1_800_000        // 30 min, &lt; idle do Postgres
        validationTimeout = 2_000
        leakDetectionThreshold = 10_000

        addDataSourceProperty("reWriteBatchedInserts", "true")
        addDataSourceProperty("ApplicationName", "meu-app")
    }
    return HikariDataSource(cfg)
}</code></pre>

<h2>Pool sizing</h2>
<p>Regra empírica do próprio time do Hikari: <code>cores * 2 + spindles_efetivos</code>. Para a maioria dos apps web em servidores modernos, <strong>10-20 conexões</strong> bastam. Pool gigante (100+) <em>piora</em> latência: o Postgres alterna contexto demais.</p>
<ul>
<li>Calcule <code>maximumPoolSize</code> &lt;= <code>max_connections</code> do Postgres / nº de instâncias da app.</li>
<li><code>minimumIdle</code> = <code>maximumPoolSize</code> elimina latência de aquecer conexões em pico.</li>
<li><code>maxLifetime</code> deve ser menor que o timeout de idle do servidor (ou do balanceador na frente).</li>
</ul>

<h2>Prepared statements</h2>
<pre><code class="language-kotlin">data class Usuario(val id: Long, val nome: String, val email: String)

fun buscarPorEmail(ds: DataSource, email: String): Usuario? =
    ds.connection.use { conn -&gt;
        conn.prepareStatement(
            "SELECT id, nome, email FROM usuarios WHERE email = ?"
        ).use { ps -&gt;
            ps.setString(1, email)
            ps.executeQuery().use { rs -&gt;
                if (rs.next()) Usuario(rs.getLong(1), rs.getString(2), rs.getString(3))
                else null
            }
        }
    }</code></pre>
<p>O driver do Postgres faz <strong>server-side prepared statements</strong> automaticamente após algumas execuções da mesma query (<code>prepareThreshold</code>, padrão 5).</p>

<h2>Batching</h2>
<pre><code class="language-kotlin">fun inserirEmLote(ds: DataSource, usuarios: List&lt;Usuario&gt;) {
    ds.connection.use { conn -&gt;
        conn.autoCommit = false
        conn.prepareStatement(
            "INSERT INTO usuarios (nome, email) VALUES (?, ?)"
        ).use { ps -&gt;
            for (u in usuarios) {
                ps.setString(1, u.nome)
                ps.setString(2, u.email)
                ps.addBatch()
            }
            ps.executeBatch()
        }
        conn.commit()
    }
}</code></pre>
<p>Com <code>reWriteBatchedInserts=true</code>, o driver agrupa N inserts num único <code>INSERT ... VALUES (...), (...), (...)</code> — ganho de 5-10x em cargas maiores.</p>

<div class="callout callout-warn">
<div class="callout-title">Sempre use 'use { }'</div>
<div>Conexão, statement e resultset são <code>AutoCloseable</code>. Esquecer de fechar vaza recursos do pool. <code>use { }</code> garante <code>close()</code> mesmo em exceção — evita o anti-padrão clássico de "todas as conexões em uso" em produção.</div>
</div>

<h2>Casos de uso</h2>
<ul>
<li>Apps Spring Boot/Ktor com volume previsível de requisições.</li>
<li>ETLs noturnos com inserções em lote para data warehouse.</li>
<li>Migrações de dados com controle de transação manual.</li>
<li>Health checks: <code>SELECT 1</code> via Hikari para validar conexão.</li>
<li>Apps que rodam <code>EXPLAIN ANALYZE</code> programaticamente para profiling.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Não concatene strings em SQL: use <code>?</code> e <code>setXxx</code>. Concatenar abre SQL injection e perde cache de plano.</li>
<li><code>autoCommit = true</code> (padrão) faz cada statement virar uma transação — péssimo para batch.</li>
<li>Conexão emprestada do pool herda a config da última requisição (search_path, timezone). Sempre normalize.</li>
<li>Em coroutines, JDBC é bloqueante: rode em <code>Dispatchers.IO</code> ou prefira drivers reativos como R2DBC.</li>
<li>Logue queries lentas via <code>leakDetectionThreshold</code> e <code>log_min_duration_statement</code> no Postgres.</li>
</ul>

<div class="callout callout-tip">
<div class="callout-title">Use uma lib em cima do JDBC</div>
<div>Para projetos reais, prefira <strong>jOOQ</strong>, <strong>Exposed</strong> ou <strong>JdbcTemplate</strong> (Spring). JDBC cru é didático, mas verboso e fácil de errar no fechamento de recursos.</div>
</div>
`}})]})}export{s as default};

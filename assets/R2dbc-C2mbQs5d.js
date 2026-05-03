import{j as o}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function i(){return o.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[o.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Banco de dados · avancado · 10 min"}),o.jsx("h1",{children:"R2DBC reativo"}),o.jsx("div",{dangerouslySetInnerHTML:{__html:`
  <p>R2DBC (Reactive Relational Database Connectivity) traz I/O não-bloqueante para bancos relacionais. Em Kotlin, combinar Spring Data R2DBC com <code>Flow</code> resulta em código reativo conciso e idiomático.</p>

  <h2>Conceito</h2>
  <p>Diferente do JDBC tradicional (bloqueante), R2DBC usa drivers reativos (Postgres, MySQL, MSSQL, H2). Spring Data R2DBC oferece <code>CoroutineCrudRepository</code> que retorna <code>Flow</code> e funções <code>suspend</code>.</p>
  <pre><code class="language-groovy">dependencies {
      implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
      implementation("org.springframework.boot:spring-boot-starter-webflux")
      implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor:1.8.1")
      implementation("io.r2dbc:r2dbc-postgresql:1.0.7.RELEASE")
  }</code></pre>

  <p>application.yaml:</p>
  <pre><code class="language-yaml">spring:
    r2dbc:
      url: r2dbc:postgresql://localhost:5432/app
      username: app
      password: secret</code></pre>

  <h2>Exemplo prático</h2>
  <pre><code class="language-kotlin">import org.springframework.data.annotation.Id
  import org.springframework.data.relational.core.mapping.Table
  import org.springframework.data.repository.kotlin.CoroutineCrudRepository
  import org.springframework.web.bind.annotation.*
  import kotlinx.coroutines.flow.Flow

  @Table("produtos")
  data class Produto(
      @Id val id: Long? = null,
      val nome: String,
      val preco: Double,
  )

  interface ProdutoRepository : CoroutineCrudRepository&lt;Produto, Long&gt; {
      fun findByPrecoGreaterThan(min: Double): Flow&lt;Produto&gt;
  }

  @RestController
  @RequestMapping("/produtos")
  class ProdutoController(private val repo: ProdutoRepository) {
      @GetMapping
      fun todos(): Flow&lt;Produto&gt; = repo.findAll()

      @GetMapping("/caros")
      fun caros(@RequestParam min: Double): Flow&lt;Produto&gt; =
          repo.findByPrecoGreaterThan(min)

      @PostMapping
      suspend fun criar(@RequestBody p: Produto): Produto = repo.save(p)
  }</code></pre>

  <p>Schema (use Flyway ou <code>schema.sql</code>):</p>
  <pre><code class="language-sql">CREATE TABLE produtos (
      id BIGSERIAL PRIMARY KEY,
      nome VARCHAR(120) NOT NULL,
      preco NUMERIC(10,2) NOT NULL
  );</code></pre>

  <h2>Quando usar</h2>
  <ul>
  <li>Cargas com muitas conexões I/O simultâneas (websockets, streaming).</li>
  <li>APIs que servem outras APIs reativas/streaming sem bloqueio.</li>
  <li>Microsserviços que precisam escalar horizontalmente com poucos threads.</li>
  <li>Pipelines server-sent events com banco como fonte.</li>
  </ul>

  <h2>Pegadinhas</h2>
  <ul>
  <li>R2DBC <strong>não suporta</strong> JPA/Hibernate (sem lazy loading, sem relacionamentos automáticos).</li>
  <li>Migrações precisam de Flyway/Liquibase via JDBC; R2DBC não as faz.</li>
  <li>Transações: use <code>@Transactional</code> com <code>TransactionalOperator</code> para casos complexos.</li>
  <li>Não misture chamadas bloqueantes (JDBC, Files) no mesmo thread reativo — agende em <code>Dispatchers.IO</code>.</li>
  </ul>

  <div class="callout callout-warn"><div class="callout-title">Trade-off</div><div>R2DBC ainda é menos maduro que JPA. Se sua aplicação é CRUD clássico com pouca concorrência, <strong>JDBC + virtual threads (JDK 21)</strong> oferece simplicidade similar com performance comparável.</div></div>
  `}})]})}export{i as default};

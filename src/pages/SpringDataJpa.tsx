export default function SpringDataJpa() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Spring Boot · intermediario · 11 min</div>
      <h1>Spring Data JPA com Kotlin</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Combinar Spring Data JPA com Kotlin é direto, mas exige resolver um conflito filosófico: Kotlin marca classes como <code>final</code> por padrão, e o JPA/Hibernate precisa criar proxies em runtime, o que demanda classes <code>open</code>. Os plugins <code>kotlin-spring</code> e <code>kotlin-jpa</code> resolvem isso para você — desde que estejam configurados.</p>

<h2>Conceito: o "open class problem"</h2>
<p>Hibernate gera proxies para lazy loading. Para isso, sub-classifica suas entidades em runtime. Se a classe é <code>final</code>, falha. O plugin <code>kotlin-spring</code> abre automaticamente classes anotadas com <code>@Component</code>, <code>@Configuration</code>, <code>@Service</code>, <code>@Repository</code>, etc. Já <code>kotlin-jpa</code> abre as anotadas com <code>@Entity</code>, <code>@Embeddable</code>, <code>@MappedSuperclass</code> — e gera um construtor sem argumentos exigido pelo JPA.</p>

<h2>build.gradle.kts</h2>
<pre><code class="language-groovy">plugins {
    kotlin("jvm") version "2.0.20"
    kotlin("plugin.spring") version "2.0.20"
    kotlin("plugin.jpa") version "2.0.20"
    id("org.springframework.boot") version "3.3.4"
    id("io.spring.dependency-management") version "1.1.6"
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}</code></pre>

<h2>Entidade idiomática</h2>
<pre><code class="language-kotlin">import jakarta.persistence.*

@Entity
@Table(name = "produtos")
class Produto(
    @Column(nullable = false) var nome: String,
    @Column(nullable = false) var preco: Double,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
)</code></pre>
<p>Note que <strong>não usamos <code>data class</code></strong> para entidades: <code>equals</code>/<code>hashCode</code> baseados em todos os campos quebram o lazy loading e causam bugs com Set/cache. Use <code>class</code> normal e, se precisar de igualdade, baseie em <code>id</code>.</p>

<h2>Repository</h2>
<pre><code class="language-kotlin">import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ProdutoRepository : JpaRepository&lt;Produto, Long&gt; {

    fun findByNomeContainingIgnoreCase(termo: String): List&lt;Produto&gt;

    fun findByPrecoBetween(min: Double, max: Double): List&lt;Produto&gt;

    @Query("select p from Produto p where p.preco &gt; :limite order by p.preco desc")
    fun caros(@Param("limite") limite: Double): List&lt;Produto&gt;
}</code></pre>

<h2>Service e controller</h2>
<pre><code class="language-kotlin">@Service
class ProdutoService(private val repo: ProdutoRepository) {
    @Transactional
    fun criar(nome: String, preco: Double): Produto =
        repo.save(Produto(nome = nome, preco = preco))

    fun buscar(termo: String): List&lt;Produto&gt; =
        repo.findByNomeContainingIgnoreCase(termo)
}

@RestController
@RequestMapping("/produtos")
class ProdutoController(private val svc: ProdutoService) {

    data class Criar(val nome: String, val preco: Double)

    @PostMapping
    fun criar(@RequestBody req: Criar) = svc.criar(req.nome, req.preco)

    @GetMapping
    fun listar(@RequestParam q: String = "") = svc.buscar(q)
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>CRUDs tradicionais com Postgres/MySQL/Oracle.</li>
<li>Queries derivadas para 80% dos casos; <code>@Query</code> JPQL para o resto.</li>
<li>Paginação com <code>Pageable</code> e <code>Page&lt;T&gt;</code>.</li>
<li>Auditoria com <code>@CreatedDate</code>/<code>@LastModifiedDate</code>.</li>
<li>Transações declarativas com <code>@Transactional</code>.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><strong>Não use <code>data class</code> em entidades</strong> — equals/hashCode podem disparar lazy loading e quebrar coleções.</li>
<li>Sem <code>kotlin-jpa</code>, <code>@Entity</code> sem construtor vazio explode em runtime. Não esqueça o plugin.</li>
<li><code>val</code> em campos JPA impede que Hibernate hidrate via setters em alguns cenários — prefira <code>var</code>.</li>
<li>Lazy + Kotlin: <code>@OneToMany(fetch = FetchType.LAZY)</code> só funciona se a entidade for <code>open</code> (plugin resolve) e o acesso ocorrer dentro da transação.</li>
<li>Use <code>jackson-module-kotlin</code> para serializar classes Kotlin sem precisar de construtor sem argumentos no JSON.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Equals em entidades</div><div>Se precisar de <code>equals</code>/<code>hashCode</code>, baseie só no <code>id</code> e trate <code>id == null</code> com cuidado (entidade ainda não persistida). Hibernate recomenda inclusive <code>hashCode</code> constante para evitar mudança ao salvar.</div></div>
`}} />
    </article>
  );
}

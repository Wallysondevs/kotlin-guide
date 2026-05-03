export default function SpringTesting() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Spring Boot · intermediario · 10 min</div>
      <h1>Testes Spring</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Spring Boot oferece slices de teste que carregam só a parte necessária do contexto, deixando o feedback rápido. Combinado com MockMvc, MockK e Testcontainers, dá para testar do controller ao banco real sem rodar o app inteiro.</p>

<h2>@SpringBootTest</h2>
<p>Sobe o contexto completo. Use para smoke tests e cenários de integração ponta a ponta.</p>
<pre><code class="language-kotlin">@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class AppSmokeTest(@LocalServerPort val port: Int) {
    @Test fun appSobe() {
        val client = TestRestTemplate()
        val res = client.getForEntity("http://localhost:\\$port/health", String::class.java)
        assertEquals(HttpStatus.OK, res.statusCode)
    }
}
</code></pre>

<h2>@WebMvcTest + MockMvc</h2>
<p>Carrega só a camada web (controllers, filters, advices). Outros beans precisam ser mockados.</p>
<pre><code class="language-kotlin">@WebMvcTest(UsuarioController::class)
class UsuarioControllerTest(@Autowired val mvc: MockMvc) {

    @MockkBean lateinit var service: UsuarioService

    @Test fun retorna200ComJson() {
        every { service.buscar(1L) } returns Usuario(1L, "Ada")

        mvc.get("/usuarios/1")
            .andExpect {
                status { isOk() }
                jsonPath("$.nome") { value("Ada") }
            }
    }

    @Test fun retorna404QuandoNaoAcha() {
        every { service.buscar(99L) } returns null
        mvc.get("/usuarios/99").andExpect { status { isNotFound() } }
    }
}
</code></pre>

<h2>@DataJpaTest</h2>
<p>Slice para repositórios JPA. Por padrão usa H2 em memória; aponte para Postgres real com Testcontainers.</p>
<pre><code class="language-kotlin">@DataJpaTest
@Testcontainers
class UsuarioRepoTest(@Autowired val repo: UsuarioRepository) {
    companion object {
        @Container
        @JvmStatic
        val pg = PostgreSQLContainer("postgres:16-alpine")

        @DynamicPropertySource @JvmStatic
        fun props(reg: DynamicPropertyRegistry) {
            reg.add("spring.datasource.url", pg::getJdbcUrl)
            reg.add("spring.datasource.username", pg::getUsername)
            reg.add("spring.datasource.password", pg::getPassword)
        }
    }

    @Test fun salvarERecuperar() {
        val saved = repo.save(Usuario(nome = "Ada"))
        assertEquals("Ada", repo.findById(saved.id!!).get().nome)
    }
}
</code></pre>

<h2>Testcontainers reutilizável</h2>
<pre><code class="language-kotlin">@Testcontainers
abstract class IntegrationBase {
    companion object {
        @Container @JvmStatic
        val pg = PostgreSQLContainer("postgres:16-alpine").apply { withReuse(true) }
    }
}
</code></pre>

<h2>MockK com Spring</h2>
<p>Adicione <code>com.ninja-squad:springmockk:4.0.2</code> e use <code>@MockkBean</code>/<code>@SpykBean</code> em vez de <code>@MockBean</code> (que usa Mockito):</p>
<pre><code class="language-groovy">testImplementation("com.ninja-squad:springmockk:4.0.2")
</code></pre>
<pre><code class="language-kotlin">@MockkBean lateinit var notif: NotificationService
every { notif.enviar(any()) } just runs
</code></pre>

<h2>Quando usar cada slice</h2>
<ul>
  <li><strong>@SpringBootTest</strong>: validar wiring, integração completa, contratos de API.</li>
  <li><strong>@WebMvcTest</strong>: validar JSON, status codes, validações, security.</li>
  <li><strong>@DataJpaTest</strong>: queries customizadas, mapeamentos, migrations.</li>
  <li><strong>@JsonTest</strong>: serialização Jackson de DTOs.</li>
  <li><strong>@RestClientTest</strong>: clientes HTTP que consomem APIs externas.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><code>@SpringBootTest</code> em todo teste explode o tempo de build — use slices.</li>
  <li>Cuidado com beans <code>@Lazy</code> que não são iniciados em slices.</li>
  <li>MockMvc não passa pelo Tomcat real — para testar filters de baixo nível use <code>WebEnvironment.RANDOM_PORT</code>.</li>
  <li>Testcontainers exige Docker rodando — em CI configure o Docker socket.</li>
  <li>Em Kotlin, classes de teste e métodos não precisam ser <code>open</code> com <code>kotlin-spring</code> plugin (já abre).</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Reuse de containers</div><div>Habilite <code>testcontainers.reuse.enable=true</code> em <code>~/.testcontainers.properties</code> para reaproveitar o Postgres entre execuções locais — testes ficam ~10x mais rápidos.</div></div>
`}} />
    </article>
  );
}

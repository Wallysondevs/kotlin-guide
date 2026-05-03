import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function t(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Spring Boot · intermediario · 8 min"}),e.jsx("h1",{children:"@Service e DI"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Spring Boot com Kotlin elimina muito boilerplate: <strong>injeção por construtor é automática</strong> (sem <code>@Autowired</code>), classes <code>data class</code> servem como DTOs e <code>@Service</code> deixa o componente disponível no contexto. Saber a diferença entre <code>@Component</code>, <code>@Service</code> e <code>@Repository</code> evita confusão em projetos maiores.</p>

<h2>Conceito</h2>
<p>Os três são especializações de <code>@Component</code>: o Spring detecta a anotação no classpath scan e registra um bean. A diferença não é técnica para DI, mas <strong>semântica</strong> e ajuda em pós-processadores específicos.</p>
<ul>
<li><code>@Component</code> — genérico, qualquer bean.</li>
<li><code>@Service</code> — camada de regras de negócio.</li>
<li><code>@Repository</code> — camada de acesso a dados; ativa tradução de exceções JDBC para <code>DataAccessException</code>.</li>
<li><code>@Controller</code> / <code>@RestController</code> — camada web.</li>
</ul>

<h2>Construtor injection idiomática</h2>
<pre><code class="language-kotlin">@Service
class PedidoService(
    private val repo: PedidoRepository,
    private val pagamento: PagamentoGateway,
    private val clock: Clock
) {
    fun criar(cmd: NovoPedido): Pedido {
        val pedido = Pedido(
            id = UUID.randomUUID(),
            valor = cmd.valor,
            criadoEm = Instant.now(clock)
        )
        repo.save(pedido)
        pagamento.cobrar(pedido)
        return pedido
    }
}</code></pre>
<p>Sem <code>@Autowired</code>, sem <code>lateinit</code>, sem campos mutáveis. O Spring detecta o único construtor e injeta tudo. <code>val private</code> garante imutabilidade da referência.</p>

<h2>Exemplo prático: camadas</h2>
<pre><code class="language-kotlin">@Repository
interface UsuarioRepository : JpaRepository&lt;UsuarioEntity, UUID&gt; {
    fun findByEmail(email: String): UsuarioEntity?
}

@Service
class UsuarioService(
    private val repo: UsuarioRepository,
    private val encoder: PasswordEncoder
) {
    fun registrar(req: RegistroRequest): Usuario {
        check(repo.findByEmail(req.email) == null) { "email já cadastrado" }
        val entity = UsuarioEntity(
            email = req.email,
            senhaHash = encoder.encode(req.senha)
        )
        return repo.save(entity).toDomain()
    }
}

@RestController
@RequestMapping("/usuarios")
class UsuarioController(
    private val service: UsuarioService
) {
    @PostMapping
    fun registrar(@RequestBody req: RegistroRequest): ResponseEntity&lt;Usuario&gt; =
        ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(req))
}</code></pre>

<h2>Múltiplas implementações</h2>
<pre><code class="language-kotlin">interface NotificacaoSender { fun enviar(msg: String) }

@Service("emailSender")
class EmailSender : NotificacaoSender { override fun enviar(msg: String) = TODO() }

@Service("smsSender")
class SmsSender : NotificacaoSender { override fun enviar(msg: String) = TODO() }

@Service
class AlertaService(
    @Qualifier("emailSender") private val sender: NotificacaoSender
)</code></pre>

<div class="callout callout-tip">
<div class="callout-title">Sem open por padrão</div>
<div>Classes Kotlin são <code>final</code> por padrão. O plugin <code>kotlin-spring</code> torna automaticamente <code>open</code> as classes anotadas com <code>@Component</code>, <code>@Configuration</code>, <code>@Service</code> etc., para que o Spring consiga gerar proxies (AOP, transações).</div>
</div>

<h2>Casos de uso</h2>
<ul>
<li>Service orquestrando vários repositories e gateways.</li>
<li>Service com <code>@Transactional</code> delimitando unidade de trabalho.</li>
<li>Strategies plugáveis selecionadas por <code>@Qualifier</code> ou <code>Map&lt;String, Strategy&gt;</code> injetado.</li>
<li>Beans de teste substituídos com <code>@TestConfiguration</code> + <code>@Primary</code>.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Dependência circular entre dois <code>@Service</code> falha no startup — refatore para uma terceira camada ou use <code>ObjectProvider</code>.</li>
<li><code>@Transactional</code> em método chamado pelo próprio bean (self-invocation) <strong>não funciona</strong>: o proxy é externo.</li>
<li>Não use <code>field</code> injection com <code>@Autowired lateinit var</code> — perde testabilidade.</li>
<li>Em testes unitários puros, instancie o service direto (<code>UsuarioService(mockRepo, mockEncoder)</code>) sem subir contexto Spring.</li>
<li>Cuidado com <code>@Service</code> em <code>data class</code>: gera <code>equals/hashCode</code> baseado nos campos injetados, raramente o que você quer.</li>
</ul>

<div class="callout callout-info">
<div class="callout-title">@Service vs @Component</div>
<div>Funcionalmente quase idênticos hoje. Use <code>@Service</code> para sinalizar intenção de regra de negócio — facilita leitura do código e ferramentas de análise (SonarQube, Detekt).</div>
</div>
`}})]})}export{t as default};

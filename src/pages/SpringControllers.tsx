export default function SpringControllers() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Spring Boot · intermediario · 9 min</div>
      <h1>@RestController</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p><code>@RestController</code> é a anotação que casa <code>@Controller</code> + <code>@ResponseBody</code>. Em Kotlin, com data classes para DTOs e <code>suspend</code> para chamadas não-bloqueantes, fica enxuto e idiomático.</p>

<h2>Conceito</h2>
<p>Cada método mapeia uma rota HTTP. Os parâmetros vêm de path, query, body ou cabeçalhos. O retorno é serializado para JSON automaticamente (Jackson por padrão).</p>
<pre><code class="language-kotlin">import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity

@RestController
@RequestMapping("/api/v1/usuarios")
class UsuarioController(private val service: UsuarioService) {

    @GetMapping
    fun listar(@RequestParam(defaultValue = "0") page: Int) =
        service.listar(page)

    @GetMapping("/{id}")
    fun porId(@PathVariable id: Long): ResponseEntity&lt;UsuarioDto&gt; =
        service.buscar(id)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
}</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">data class CriarUsuarioReq(val nome: String, val email: String)
data class UsuarioDto(val id: Long, val nome: String, val email: String)

@RestController
@RequestMapping("/api/v1/usuarios")
class UsuarioController(private val service: UsuarioService) {

    @PostMapping
    fun criar(@RequestBody req: CriarUsuarioReq): ResponseEntity&lt;UsuarioDto&gt; {
        val novo = service.criar(req.nome, req.email)
        return ResponseEntity
            .created(java.net.URI("/api/v1/usuarios/\${novo.id}"))
            .body(novo)
    }

    @PutMapping("/{id}")
    fun atualizar(
        @PathVariable id: Long,
        @RequestBody req: CriarUsuarioReq
    ): UsuarioDto = service.atualizar(id, req.nome, req.email)

    @DeleteMapping("/{id}")
    fun apagar(@PathVariable id: Long): ResponseEntity&lt;Unit&gt; {
        service.apagar(id)
        return ResponseEntity.noContent().build()
    }
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>APIs REST tradicionais com JSON in/out.</li>
<li>Endpoints health/metrics customizados expostos sob /admin.</li>
<li>Webhooks recebendo payloads de terceiros.</li>
<li>Composição com <code>@RestControllerAdvice</code> para tratamento global de erros.</li>
<li>Upload/download de arquivos com <code>MultipartFile</code> e <code>StreamingResponseBody</code>.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Use DTOs separados das entidades JPA — evita expor schema interno.</li>
<li>Valide payloads com <code>@Valid</code> e Bean Validation (<code>@NotBlank</code>, <code>@Email</code>).</li>
<li>Marque métodos como <code>suspend</code> em controllers reativos (Spring WebFlux ou MVC com Coroutines).</li>
<li>Centralize erros em <code>@RestControllerAdvice</code> com <code>@ExceptionHandler</code>.</li>
<li>Versione no path (<code>/v1</code>, <code>/v2</code>) — mais simples que negociação por header.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">ResponseEntity vs retorno direto</div><div>Use <code>ResponseEntity</code> só quando precisa controlar status/headers. Para respostas 200 simples, retorne o DTO diretamente — menos ruído.</div></div>

<div class="callout callout-info"><div class="callout-title">Coroutines no MVC</div><div>Desde Spring 5.2, controllers MVC suportam <code>suspend fun</code> nativamente. O Spring escala usando schedulers internos sem precisar do WebFlux.</div></div>
`}} />
    </article>
  );
}

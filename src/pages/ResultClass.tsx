export default function ResultClass() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Erros e Result · intermediario · 8 min</div>
      <h1>kotlin.Result&lt;T&gt;</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p><code>kotlin.Result&lt;T&gt;</code> é um wrapper que representa <em>sucesso com valor</em> ou <em>falha com Throwable</em>, sem usar exceções para fluxo. Útil para encadear operações que podem falhar, mas tem restrições importantes — não deve ser usado como tipo de retorno público.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">val ok: Result&lt;Int&gt;  = Result.success(42)
val err: Result&lt;Int&gt; = Result.failure(IllegalStateException("xpto"))

ok.isSuccess     // true
err.isFailure    // true

ok.getOrNull()                        // 42
err.getOrNull()                       // null
err.exceptionOrNull()                 // IllegalStateException

val v = err.getOrElse { e -&gt; -1 }     // -1
val v2 = ok.getOrDefault(0)           // 42
</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">data class User(val id: Int, val nome: String)

fun parseId(raw: String): Result&lt;Int&gt; = runCatching { raw.toInt() }

fun buscarUser(id: Int): Result&lt;User&gt; = runCatching {
    require(id &gt; 0) { "id inválido" }
    User(id, "user-\${id}")
}

fun main() {
    val resultado: Result&lt;String&gt; = parseId("42")
        .mapCatching { id -&gt; buscarUser(id).getOrThrow() }
        .map { it.nome.uppercase() }

    val msg = resultado.fold(
        onSuccess = { "Olá, \${it}" },
        onFailure = { "Falhou: \${it.message}" }
    )
    println(msg)

    // recover transforma erro em sucesso
    val safe: Result&lt;String&gt; = parseId("abc").recover { "default" }
    println(safe.getOrNull())   // "default"
}
</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Encadear transformações onde cada passo pode falhar (parsing, validação).</li>
<li><code>runCatching { }</code> para encapsular código que lança <em>checked</em> exceptions vindas de Java.</li>
<li>APIs internas onde você quer composição funcional sem exceções no fluxo.</li>
<li>Coletar múltiplos erros: <code>list.map { runCatching { processar(it) } }</code>.</li>
</ul>

<h2>Restrições atuais</h2>
<ul>
<li>Não pode ser usado como tipo de retorno de funções <strong>públicas</strong> sem opt-in (<code>@OptIn(ExperimentalContracts::class)</code> não cobre — é uma restrição de design).</li>
<li>Pelo mesmo motivo, evite <code>Result&lt;T&gt;</code> em parâmetros e propriedades públicas. A recomendação oficial é usar tipos <em>sealed</em> próprios para representar resultados de domínio.</li>
<li><code>runCatching</code> também captura <code>CancellationException</code> — em corrotinas isso é perigoso. Use <code>runCatching { ... }.onFailure { if (it is CancellationException) throw it }</code> ou prefira sealed classes.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Não use <code>Result</code> para <em>esperado vs erro de domínio</em> em APIs públicas; modele com <code>sealed interface</code>.</li>
<li><code>getOrThrow()</code> joga a exceção armazenada — útil para reerguer no topo da pilha.</li>
<li><code>map</code> propaga a falha sem chamar o lambda; <code>mapCatching</code> envolve o lambda em try/catch.</li>
<li>Comparar dois <code>Result</code> com <code>==</code> compara também a exceção via <code>equals</code> — o que normalmente não é o que você quer.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Cuidado em corrotinas</div><div>Cuidado com <code>runCatching</code> dentro de <code>suspend fun</code>: ele engole <code>CancellationException</code>, quebrando a structured concurrency. Sempre relance esse caso específico.</div></div>
`}} />
    </article>
  );
}

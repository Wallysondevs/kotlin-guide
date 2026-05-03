export default function RunCatching() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Erros e Result · intermediario · 7 min</div>
      <h1>runCatching idiom</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p><code>runCatching</code> é a forma idiomática de capturar exceções de um bloco e transformá-las num <code>Result&lt;T&gt;</code>. O resultado é código mais funcional, encadeável e sem if/else aninhados — sem renunciar à segurança de tipos.</p>

<h2>Conceito</h2>
<p><code>runCatching { ... }</code> executa o bloco e devolve um <code>Result&lt;T&gt;</code> que pode ser <em>success</em> (com o valor) ou <em>failure</em> (com a exceção). É equivalente a um <code>try/catch</code> que devolve a Throwable como dado.</p>
<pre><code class="language-kotlin">val result: Result&lt;Int&gt; = runCatching { "42x".toInt() }

result.isSuccess        // false
result.exceptionOrNull() // NumberFormatException
result.getOrNull()       // null
result.getOrDefault(-1)  // -1</code></pre>

<h2>Exemplo prático: pipeline</h2>
<pre><code class="language-kotlin">fun parsePort(s: String): Result&lt;Int&gt; =
    runCatching { s.trim().toInt() }
        .mapCatching { p -&gt; require(p in 1..65535); p }
        .recover { 8080 }            // fallback se falhar
        .onSuccess { println("porta: \\$it") }
        .onFailure { println("falhou: \${it.message}") }

val porta = parsePort(System.getenv("PORT") ?: "")
    .getOrThrow()</code></pre>

<h2>Encadeamento com map e recover</h2>
<ul>
  <li><code>map { }</code> — transforma valor em sucesso; exceções na lambda <strong>propagam</strong>.</li>
  <li><code>mapCatching { }</code> — transforma e captura exceções dentro da lambda.</li>
  <li><code>recover { }</code> — converte falha em sucesso.</li>
  <li><code>recoverCatching { }</code> — recover que pode lançar (e captura).</li>
  <li><code>fold(onSuccess, onFailure)</code> — colapsa para outro tipo.</li>
</ul>

<pre><code class="language-kotlin">val mensagem: String = runCatching { repository.find(id) }
    .fold(
        onSuccess = { user -&gt; "Olá, \${user.nome}" },
        onFailure = { e -&gt; "Erro: \${e.message}" }
    )</code></pre>

<h2>vs try/catch</h2>
<p>Use <code>try/catch</code> quando precisa de fluxo imperativo, recursos com <code>use</code>, ou tratamento por tipo de exceção (<code>catch (e: IOException)</code>). Use <code>runCatching</code> quando o resultado é dado a ser propagado/transformado.</p>
<pre><code class="language-kotlin">// Imperativo: precisa de catch específico
val conn = try { openConn() } catch (e: SocketTimeoutException) {
    return null
}

// Funcional: passa adiante
fun load(): Result&lt;Config&gt; = runCatching {
    File("app.conf").readText()
}.mapCatching { Config.parse(it) }</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Wrappers em fronteiras de I/O (rede, disco, parsers).</li>
  <li>Camada de uso onde o erro vira estado da UI (Loading/Success/Error).</li>
  <li>Composição de operações que podem falhar isoladamente.</li>
  <li>Conversão entre exceptions (legacy) e tipos algébricos.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Captura tudo, inclusive <code>CancellationException</code></strong> — isso quebra coroutines! Em código suspending, use <code>try/catch</code> ou re-lance <code>CancellationException</code>.</li>
  <li>Engole <code>OutOfMemoryError</code>, <code>StackOverflowError</code> etc. — Errors não deveriam ser capturadas; <code>runCatching</code> as captura.</li>
  <li>Retornar <code>Result</code> em APIs públicas é debatido: alguns preferem tipos selados próprios.</li>
  <li>Não substitui validação — use junto com <code>require</code>/<code>check</code>.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Coroutines + runCatching</div><div>Em <code>suspend fun</code>, padrão seguro:</div></div>

<pre><code class="language-kotlin">suspend fun safeFetch(): Result&lt;Data&gt; = runCatching {
    fetchRemote()
}.onFailure { e -&gt;
    if (e is CancellationException) throw e   // re-throw!
}</code></pre>

<div class="callout callout-tip"><div class="callout-title">Result em APIs</div><div>Para domínio próprio, prefira <code>sealed class Resultado { class Ok(...); class Erro(...) }</code> — você modela as falhas esperadas, em vez de jogar <code>Throwable</code> em qualquer caso.</div></div>
`}} />
    </article>
  );
}

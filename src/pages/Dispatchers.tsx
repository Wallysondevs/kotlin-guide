export default function Dispatchers() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Coroutines · intermediario · 10 min</div>
      <h1>Dispatchers</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Um <code>CoroutineDispatcher</code> determina <strong>em qual thread</strong> (ou pool) sua coroutine roda. Escolher o dispatcher certo é a diferença entre uma app responsiva e uma que congela ou estoura threads. <code>kotlinx.coroutines</code> oferece quatro built-in mais o suporte a customs.</p>

<h2>Dispatchers built-in</h2>
<ul>
  <li><code>Dispatchers.Default</code> — pool com tamanho = número de cores da CPU. Para trabalho <strong>CPU-bound</strong> (parsing, cálculos, compressão).</li>
  <li><code>Dispatchers.IO</code> — pool elástico (até 64 threads por padrão). Para operações <strong>bloqueantes de I/O</strong> (JDBC, file system, HTTP síncrono).</li>
  <li><code>Dispatchers.Main</code> — thread única de UI (Android, Swing, JavaFX). Exige artefato específico (<code>kotlinx-coroutines-android</code>).</li>
  <li><code>Dispatchers.Unconfined</code> — não confina; executa na thread atual até o primeiro <code>suspend</code>. Útil em testes e advanced use cases.</li>
</ul>

<pre><code class="language-kotlin">import kotlinx.coroutines.*

suspend fun main() = coroutineScope {
    launch(Dispatchers.Default) {
        val r = (1..1_000_000).sum()
        println("CPU: \$r em \${Thread.currentThread().name}")
    }

    launch(Dispatchers.IO) {
        val texto = java.io.File("/etc/hostname").readText()
        println("IO: \${texto.trim()} em \${Thread.currentThread().name}")
    }
}</code></pre>

<h2>withContext: trocando de pool</h2>
<p>Use <code>withContext</code> dentro de uma função <code>suspend</code> para mover trabalho ao dispatcher certo e voltar. Não <code>launch</code> — <code>withContext</code> espera o resultado e retoma no contexto original.</p>
<pre><code class="language-kotlin">suspend fun carregarPerfil(id: Int): Perfil = withContext(Dispatchers.IO) {
    // bloco roda no pool IO; valor de retorno volta ao caller
    val json = httpClient.get("/perfil/\$id")
    parsePerfil(json)
}

// no UI thread:
val p = carregarPerfil(42)
mostrar(p)   // já de volta no Main</code></pre>

<h2>Custom dispatcher</h2>
<p>Você pode dimensionar pools próprios para isolar dependências (ex.: pool exclusivo para chamadas a um banco lento, evitando esgotar o <code>IO</code> global).</p>
<pre><code class="language-kotlin">import java.util.concurrent.Executors
import kotlinx.coroutines.asCoroutineDispatcher

val dbDispatcher = Executors
    .newFixedThreadPool(8) { r -&gt; Thread(r, "db-pool").apply { isDaemon = true } }
    .asCoroutineDispatcher()

suspend fun query(sql: String): List&lt;Row&gt; = withContext(dbDispatcher) {
    connection.prepareStatement(sql).executeQuery().toRows()
}

// Lembre-se de fechar quando a app terminar:
// dbDispatcher.close()</code></pre>

<h2>Limitando paralelismo</h2>
<p>A partir de <code>kotlinx-coroutines</code> 1.6, <code>limitedParallelism(n)</code> cria uma "view" do dispatcher com paralelismo capado — ideal para evitar martelar um recurso compartilhado.</p>
<pre><code class="language-kotlin">val apiDispatcher = Dispatchers.IO.limitedParallelism(4)

suspend fun chamarApi(req: Req) = withContext(apiDispatcher) {
    httpClient.post("/x", req)
}</code></pre>

<h2>Quando usar cada um</h2>
<ul>
  <li><code>Default</code>: laços pesados, parsers, criptografia, image processing.</li>
  <li><code>IO</code>: JDBC, <code>File</code>, <code>InputStream</code>, libs HTTP <strong>síncronas</strong> (OkHttp síncrono, Apache HttpClient).</li>
  <li><code>Main</code>: tudo que toca UI; navegue para outro dispatcher para qualquer trabalho real.</li>
  <li>Custom: isolar pools por dependência (DB, API externa) ou ajustar tamanho.</li>
  <li>Em servidores com clientes <strong>async</strong> (Ktor client, R2DBC, WebClient), você normalmente NÃO precisa de <code>IO</code> — o cliente já não bloqueia.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Rodar JDBC no <code>Default</code> bloqueia threads de CPU e degrada tudo. Use <code>IO</code> ou um pool dedicado.</li>
  <li><code>Dispatchers.Main</code> requer artefato. Em testes, use <code>StandardTestDispatcher</code> + <code>Dispatchers.setMain</code>.</li>
  <li><code>Unconfined</code> pode mudar de thread no meio do código — surpresas em código que assume thread fixa.</li>
  <li>Cuidado com <code>runBlocking</code> em produção: bloqueia a thread chamadora. OK em <code>main</code> de CLI, ruim em servidores.</li>
  <li>Custom dispatchers via <code>Executors</code> precisam ser fechados (<code>.close()</code>) — caso contrário, vazam threads.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Não chame Thread.sleep</div><div>Dentro de coroutine, use <code>delay(ms)</code>. <code>Thread.sleep</code> bloqueia a thread real e invalida o ganho do modelo cooperativo.</div></div>

<div class="callout callout-tip"><div class="callout-title">Métricas</div><div>Em produção, exponha o tamanho dos pools e tempo médio de execução por dispatcher (Micrometer + JFR). Isso revela quando você precisa de pool dedicado.</div></div>
`}} />
    </article>
  );
}

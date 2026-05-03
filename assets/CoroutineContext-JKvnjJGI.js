import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Coroutines · avancado · 10 min"}),e.jsx("h1",{children:"CoroutineContext e Job"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p><code>CoroutineContext</code> é o "ambiente" de uma coroutine: dispatcher, Job, exception handler e dados arbitrários. Entender como contextos se compõem e como Jobs formam uma árvore é o que separa quem usa coroutines de quem domina concorrência estruturada.</p>

<h2>Conceito</h2>
<p>Um <code>CoroutineContext</code> é um <em>set</em> indexado por chaves. Cada elemento (Job, Dispatcher, ExceptionHandler, Name) implementa <code>CoroutineContext.Element</code>. Você combina elementos com o operador <code>+</code>.</p>
<pre><code class="language-kotlin">import kotlinx.coroutines.*

val ctx = Dispatchers.IO + CoroutineName("io-worker") + SupervisorJob()
val scope = CoroutineScope(ctx)</code></pre>

<h2>Composição</h2>
<p>Quando você combina dois contextos, elementos com a mesma chave do <strong>lado direito sobrescrevem</strong> os do lado esquerdo. <code>launch(Dispatchers.IO)</code> em um scope com <code>Dispatchers.Default</code> usa IO.</p>
<pre><code class="language-kotlin">scope.launch(Dispatchers.Main) {
    // herda Job pai do scope, sobrescreve dispatcher
    val data = withContext(Dispatchers.IO) { fetch() }
    render(data)
}</code></pre>

<h2>Job tree e cancellation propagation</h2>
<p>Cada coroutine tem um <code>Job</code>. Quando você lança uma filha, seu Job vira filho do Job pai, formando uma <strong>árvore</strong>. Cancelar um nó cancela todos os descendentes; falhar em um filho cancela o pai e seus irmãos (regra do Job comum).</p>
<pre><code class="language-kotlin">val parent = scope.launch {
    val a = launch { delay(1000); println("a ok") }
    val b = launch {
        delay(200)
        throw IllegalStateException("boom")  // cancela a, parent e scope
    }
}
parent.join()</code></pre>

<h2>SupervisorJob</h2>
<p>Em um <code>SupervisorJob</code>, falha de um filho <strong>não</strong> cancela os irmãos nem o pai. Use para tarefas independentes (ex: múltiplas requisições paralelas onde uma pode falhar).</p>
<pre><code class="language-kotlin">val supervisor = CoroutineScope(SupervisorJob() + Dispatchers.IO)

supervisor.launch { fetchUser() }      // se falhar...
supervisor.launch { fetchOrders() }    // ...esta continua viva</code></pre>

<p>Equivalente em escopo local: <code>supervisorScope { ... }</code>.</p>

<h2>Exemplo prático: pipeline com nome e handler</h2>
<pre><code class="language-kotlin">val handler = CoroutineExceptionHandler { _, e -&gt;
    println("erro não tratado: \${e.message}")
}

val appScope = CoroutineScope(
    SupervisorJob() +
    Dispatchers.Default +
    CoroutineName("app") +
    handler
)

fun main() = runBlocking {
    val job = appScope.launch(CoroutineName("worker-1")) {
        repeat(5) { i -&gt;
            println("[\${coroutineContext[CoroutineName]}] tick \\$i")
            delay(100)
        }
    }
    job.join()
}</code></pre>

<h2>Estados de um Job</h2>
<ul>
  <li><strong>New</strong> — criado mas não iniciado (raro, <code>start = LAZY</code>).</li>
  <li><strong>Active</strong> — em execução.</li>
  <li><strong>Completing</strong> — corpo terminou, esperando filhos.</li>
  <li><strong>Completed</strong> — todos finalizaram com sucesso.</li>
  <li><strong>Cancelling</strong> — cancelamento em andamento.</li>
  <li><strong>Cancelled</strong> — finalizado por cancelamento ou exceção.</li>
</ul>

<h2>Quando usar cada coisa</h2>
<ul>
  <li><strong>Job comum</strong>: quando filhos são interdependentes (falha de um invalida tudo).</li>
  <li><strong>SupervisorJob</strong>: tarefas independentes paralelas em UI/server scopes.</li>
  <li><strong>NonCancellable</strong>: bloco de cleanup que precisa rodar mesmo após cancelamento (<code>withContext(NonCancellable)</code>).</li>
  <li><strong>CoroutineName</strong>: debug e logging em produção.</li>
  <li><strong>ExceptionHandler</strong>: somente em scopes raiz com SupervisorJob; coroutines filhas propagam para o pai.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><code>CoroutineExceptionHandler</code> só funciona em coroutines <strong>raiz</strong> de scopes com SupervisorJob (ou <code>launch</code>, não <code>async</code>).</li>
  <li><code>async</code> "encapsula" exceções — só são lançadas no <code>await()</code>.</li>
  <li>Cancelamento é <em>cooperativo</em>: código bloqueante (sem <code>suspend</code>) não responde. Use <code>ensureActive()</code> em loops longos.</li>
  <li>Não compartilhe scope global (<code>GlobalScope</code>); prefira scopes ligados ao ciclo de vida (Activity, Service).</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">CancellationException é especial</div><div>Capturar <code>CancellationException</code> num bloco <code>try/catch</code> sem re-lançar quebra a propagação de cancelamento. Sempre re-throw, ou use <code>try { ... } catch (e: IOException) { ... }</code> com tipos específicos.</div></div>

<div class="callout callout-tip"><div class="callout-title">Debug</div><div>Rode com a flag <code>-Dkotlinx.coroutines.debug</code> e veja nomes (<code>CoroutineName</code>) anexados aos thread-names — vida muda em produção.</div></div>
`}})]})}export{r as default};

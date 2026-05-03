import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function l(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Coroutines · intermediario · 12 min"}),e.jsx("h1",{children:"Flow básico"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`<p><code>Flow</code> é a abstração de stream <em>assíncrono</em> de <code>kotlinx.coroutines</code>. Representa uma sequência de valores produzidos ao longo do tempo, com <em>backpressure</em> embutida via suspensão. Pense em <code>Sequence</code> + <code>suspend</code>.</p>

<h2>Conceito</h2>
<p>Flows são <strong>cold</strong>: nada acontece até alguém fazer <code>collect</code>. Cada coletor dispara uma execução nova do bloco produtor.</p>
<pre><code class="language-kotlin">import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun ticker(): Flow&lt;Int&gt; = flow {
    var i = 0
    while (true) {
        emit(i++)
        delay(1000)
    }
}

suspend fun main() = coroutineScope {
    ticker()
        .take(5)
        .collect { println("recebi $it") }
}</code></pre>

<h2>Operadores intermediários</h2>
<pre><code class="language-kotlin">flowOf(1, 2, 3, 4, 5)
    .map { it * 10 }
    .filter { it &gt; 20 }
    .onEach { println("vendo $it") }
    .catch { e -&gt; println("erro $e") }
    .collect()                          // terminal vazio</code></pre>

<p>Outros úteis: <code>flatMapConcat</code>, <code>flatMapMerge</code>, <code>flatMapLatest</code>, <code>combine</code>, <code>zip</code>, <code>debounce</code>, <code>sample</code>, <code>distinctUntilChanged</code>, <code>buffer</code>, <code>conflate</code>.</p>

<h2>Exemplo prático: busca com debounce</h2>
<pre><code class="language-kotlin">@OptIn(kotlinx.coroutines.FlowPreview::class)
fun buscaInterativa(
    consultas: Flow&lt;String&gt;,
    api: suspend (String) -&gt; List&lt;String&gt;
): Flow&lt;List&lt;String&gt;&gt; = consultas
    .debounce(300)
    .filter { it.length &gt;= 3 }
    .distinctUntilChanged()
    .mapLatest { api(it) }              // cancela busca anterior
    .catch { emit(emptyList()) }</code></pre>

<h2>Builders</h2>
<ul>
<li><code>flowOf(1, 2, 3)</code> — emite valores fixos.</li>
<li><code>(1..10).asFlow()</code> — converte iteráveis.</li>
<li><code>flow { emit(...) }</code> — bloco suspend que emite.</li>
<li><code>channelFlow { send(...) }</code> — quando precisa emitir de múltiplas coroutines.</li>
<li><code>callbackFlow { ... awaitClose { } }</code> — pontes para APIs callback.</li>
</ul>

<h2>StateFlow e SharedFlow (hot)</h2>
<pre><code class="language-kotlin">class Contador {
    private val _state = MutableStateFlow(0)
    val state: StateFlow&lt;Int&gt; = _state.asStateFlow()

    fun incrementar() { _state.value += 1 }
}</code></pre>
<p><code>StateFlow</code> sempre tem valor atual e re-emite o último para novos coletores. <code>SharedFlow</code> permite múltiplos emissores e configuração fina de <em>replay</em>/<em>buffer</em>.</p>

<h2>Casos de uso</h2>
<ul>
<li>Streams de UI (Android Compose): coletar <code>StateFlow</code> com <code>collectAsState()</code>.</li>
<li>Eventos de WebSocket / SSE.</li>
<li>Polling de API com cancelamento estruturado.</li>
<li>Pipelines reativos com Spring WebFlux ou R2DBC.</li>
</ul>

<h2>Flow vs Sequence</h2>
<ul>
<li>Sequence é <strong>síncrona</strong>; Flow é <strong>suspend</strong>.</li>
<li>Sequence não cancela; Flow respeita cooperativamente <code>CancellationException</code>.</li>
<li>Sequence vive em uma thread; Flow troca de dispatcher com <code>flowOn</code>.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">flowOn afeta upstream</div><div><code>flowOn(Dispatchers.IO)</code> só muda o contexto do que vem <em>antes</em> dele na cadeia. Para o coletor, use o dispatcher do escopo coletor.</div></div>

<h2>Pegadinhas</h2>
<ul>
<li>Lançar exceção dentro de <code>collect</code> não é capturado por <code>catch</code> — só erros do upstream.</li>
<li><code>flatMapMerge</code> sem limite pode disparar concorrência não-controlada — use <code>concurrency = N</code>.</li>
<li>Não use <code>GlobalScope.launch { flow.collect() }</code>; sempre amarre a um escopo de vida útil clara.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Teste de Flow</div><div>Use <code>turbine</code> (CashApp) ou as utilidades de <code>kotlinx-coroutines-test</code> para fazer asserts elemento-a-elemento de forma síncrona.</div></div>`}})]})}export{l as default};

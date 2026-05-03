export default function AsyncAwait() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Coroutines · intermediario · 9 min</div>
      <h1>async/await em paralelo</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Em kotlinx.coroutines, <code>async</code> dispara uma coroutine que retorna um <code>Deferred&lt;T&gt;</code>. Você chama <code>await()</code> para colher o resultado. É o jeito idiomático de paralelizar várias chamadas suspensas independentes.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">import kotlinx.coroutines.*
import kotlin.system.measureTimeMillis

suspend fun buscarUsuario(): String { delay(500); return "ada" }
suspend fun buscarPedidos(): List&lt;Int&gt; { delay(700); return listOf(1, 2, 3) }

suspend fun perfil() = coroutineScope {
    val u = async { buscarUsuario() }
    val p = async { buscarPedidos() }
    "\${u.await()} -&gt; \${p.await()}"
}

fun main() = runBlocking {
    val t = measureTimeMillis { println(perfil()) }
    println("levou \${t}ms") // ~700ms, não 1200
}
</code></pre>

<h2>awaitAll</h2>
<pre><code class="language-kotlin">suspend fun baixar(url: String): ByteArray { delay(300); return ByteArray(0) }

suspend fun baixarTudo(urls: List&lt;String&gt;): List&lt;ByteArray&gt; = coroutineScope {
    urls.map { async { baixar(it) } }.awaitAll()
}
</code></pre>

<h2>Lazy async</h2>
<pre><code class="language-kotlin">val resultado = async(start = CoroutineStart.LAZY) { calculoCaro() }
// só roda quando você chamar
if (precisar()) println(resultado.await()) else resultado.cancel()
</code></pre>

<h2>Exemplo prático: agregando APIs</h2>
<pre><code class="language-kotlin">data class Dashboard(val user: String, val saldo: Double, val notif: Int)

suspend fun carregarDashboard(api: Api): Dashboard = coroutineScope {
    val user = async { api.usuario() }
    val saldo = async { api.saldo() }
    val notif = async { api.notificacoes() }
    Dashboard(user.await(), saldo.await(), notif.await())
}
</code></pre>
<p>Se qualquer <code>async</code> falhar, o <code>coroutineScope</code> cancela os outros e propaga a exceção — comportamento de "structured concurrency".</p>

<h2>Tratamento de exceções</h2>
<pre><code class="language-kotlin">suspend fun seguros() = supervisorScope {
    val a = async { riscoso(1) }
    val b = async { riscoso(2) }
    val resA = runCatching { a.await() }.getOrDefault(0)
    val resB = runCatching { b.await() }.getOrDefault(0)
    resA + resB
}
</code></pre>
<p><code>supervisorScope</code> isola falhas; em <code>coroutineScope</code> uma falha derruba os irmãos.</p>

<h2>Comparado a Promise.all (JS)</h2>
<ul>
  <li><code>Promise.all</code> rejeita ao primeiro erro; <code>awaitAll</code> também — mas <code>supervisorScope</code> permite tolerância.</li>
  <li>Promises começam imediatamente; <code>async</code> também, exceto com <code>LAZY</code>.</li>
  <li>Em Kotlin há cancelamento cooperativo — <code>cancel()</code> propaga.</li>
  <li>Coroutines respeitam o <code>Dispatcher</code>; promises são single-threaded.</li>
</ul>

<h2>Quando usar</h2>
<ul>
  <li>Várias chamadas independentes que somam latência se sequenciais.</li>
  <li>Carregamento de tela com múltiplas fontes.</li>
  <li>Fan-out/fan-in: dispara N tarefas, agrega resultados.</li>
  <li>Backfill paralelo de dados em jobs.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Não use <code>GlobalScope.async</code> em código de produção — leak garantido.</li>
  <li>Sem <code>await()</code>, exceções somem até alguém colher o <code>Deferred</code>.</li>
  <li><code>async { ... }.await()</code> imediato é o mesmo que chamar a função suspensa direta — não paraleliza nada.</li>
  <li>Cuidado com <code>Dispatchers.Main</code> em servidores; é específico de UI.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Structured concurrency</div><div>Sempre dispare <code>async</code> dentro de um escopo (<code>coroutineScope</code>, <code>viewModelScope</code>, etc.). Isso garante cancelamento e propagação corretos.</div></div>

<div class="callout callout-warn"><div class="callout-title">Não use async para fire-and-forget</div><div>Para "dispare e esqueça", use <code>launch</code>. <code>async</code> sem <code>await</code> esconde exceções.</div></div>
`}} />
    </article>
  );
}

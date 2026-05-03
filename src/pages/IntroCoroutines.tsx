export default function IntroCoroutines() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Coroutines · intermediario · 12 min</div>
      <h1>Introdução a coroutines</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Coroutines são a resposta de Kotlin para concorrência: código assíncrono escrito de forma sequencial, com cancelamento estruturado e custo de criação ridiculamente baixo. Em vez de threads do sistema operacional, você ganha milhões de "tarefas" leves multiplexadas em um pool pequeno.</p>

<h2>Conceito</h2>
<p>Uma função marcada com <code>suspend</code> pode pausar sem bloquear a thread. Ela só pode ser chamada de outra função <code>suspend</code> ou de dentro de um <code>CoroutineScope</code>.</p>
<pre><code class="language-kotlin">import kotlinx.coroutines.*

suspend fun buscarUsuario(id: Long): String {
    delay(200) // suspende, não bloqueia
    return "Usuário \$id"
}

fun main() = runBlocking {
    val nome = buscarUsuario(42)
    println(nome)
}</code></pre>

<h2>Threads vs coroutines</h2>
<p>Uma thread JVM consome ~1MB de stack. Uma coroutine consome alguns bytes. Comparação prática:</p>
<pre><code class="language-kotlin">// 100k threads — provavelmente OOM
repeat(100_000) { Thread { Thread.sleep(1000) }.start() }

// 100k coroutines — roda tranquilo
runBlocking {
    coroutineScope {
        repeat(100_000) {
            launch { delay(1000) }
        }
    }
}</code></pre>

<h2>Structured concurrency</h2>
<p>Toda coroutine vive dentro de um <code>CoroutineScope</code>. Quando o scope termina, todas as filhas são canceladas — sem vazamentos.</p>
<pre><code class="language-kotlin">suspend fun carregarTela() = coroutineScope {
    val usuario = async { buscarUsuario(1) }
    val pedidos = async { buscarPedidos(1) }
    Tela(usuario.await(), pedidos.await())
}
// Se buscarPedidos lançar exceção, buscarUsuario é cancelado automaticamente.</code></pre>

<h2>Builders principais</h2>
<ul>
<li><strong><code>launch</code></strong>: dispara fire-and-forget, retorna <code>Job</code>.</li>
<li><strong><code>async</code></strong>: dispara e devolve um <code>Deferred&lt;T&gt;</code> com resultado via <code>await()</code>.</li>
<li><strong><code>runBlocking</code></strong>: ponte de mundo bloqueante (main, testes) para coroutines. Não use em produção dentro de servidores.</li>
<li><strong><code>withContext</code></strong>: troca de dispatcher, ex.: rodar IO em <code>Dispatchers.IO</code>.</li>
</ul>

<h2>Casos de uso</h2>
<ul>
<li>UI Android sem callbacks aninhados (<code>viewModelScope.launch { ... }</code>).</li>
<li>Servidores HTTP de alta concorrência (Ktor, Spring WebFlux com coroutines).</li>
<li>Processamento paralelo de listas com <code>map { async { ... } }.awaitAll()</code>.</li>
<li>Pipelines reativos com <code>Flow</code> substituindo RxJava.</li>
<li>Jobs em background com timeout e cancelamento confiáveis.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><strong>Não use <code>GlobalScope</code></strong> — quebra structured concurrency e vaza coroutines.</li>
<li><code>Thread.sleep</code> dentro de coroutine bloqueia a thread inteira; use <code>delay</code>.</li>
<li>Exceções em <code>launch</code> propagam para o scope; em <code>async</code> só explodem no <code>await()</code>.</li>
<li>Misturar coroutines com código bloqueante exige <code>withContext(Dispatchers.IO)</code>; do contrário você esgota o pool default.</li>
<li>Cancelamento é cooperativo: laços longos precisam chamar <code>ensureActive()</code> ou alguma função suspending.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Dependência</div><div>Adicione <code>org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1</code> (ou superior) ao seu Gradle. Para Android, use também <code>kotlinx-coroutines-android</code>.</div></div>

<div class="callout callout-tip"><div class="callout-title">Mental model</div><div>Pense em coroutines como <em>continuations</em> que o compilador transforma em uma máquina de estados. Cada <code>suspend</code> é um ponto onde a tarefa pode pausar e ser retomada em outra thread.</div></div>
`}} />
    </article>
  );
}

export default function CoroutineBuilders() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Coroutines · intermediario · 11 min</div>
      <h1>launch, async, runBlocking</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Coroutine builders são funções que criam novas corrotinas a partir de um <code>CoroutineScope</code>. Os três principais são <code>launch</code> (fire-and-forget), <code>async</code> (com resultado) e <code>runBlocking</code> (ponte para código síncrono). Saber qual usar é o que separa código de produção de exemplos de README.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">import kotlinx.coroutines.*

// launch: dispara, devolve Job. Sem valor de retorno.
val job: Job = GlobalScope.launch { delay(100); println("oi") }

// async: dispara e devolve Deferred&lt;T&gt; (Job + valor futuro).
val def: Deferred&lt;Int&gt; = GlobalScope.async { delay(100); 42 }

// runBlocking: bloqueia a thread atual até a corrotina terminar.
fun main() = runBlocking {
    val n = def.await()
    println(n)
}
</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">import kotlinx.coroutines.*
import kotlin.system.measureTimeMillis

suspend fun buscarUsuario(id: Int): String {
    delay(500); return "user-\${id}"
}

suspend fun buscarPedidos(id: Int): List&lt;String&gt; {
    delay(700); return listOf("p1", "p2")
}

fun main() = runBlocking {
    // Sequencial: ~1200ms
    val t1 = measureTimeMillis {
        val u = buscarUsuario(1)
        val p = buscarPedidos(1)
        println("\${u} \${p}")
    }
    println("sequencial: \${t1} ms")

    // Paralelo com async: ~700ms (o maior dos dois)
    val t2 = measureTimeMillis {
        val u = async { buscarUsuario(1) }
        val p = async { buscarPedidos(1) }
        println("\${u.await()} \${p.await()}")
    }
    println("paralelo:   \${t2} ms")

    // launch para efeitos colaterais (log, métrica)
    launch { delay(100); println("log async") }
}
</code></pre>

<h2>Quando usar</h2>
<ul>
<li><code>launch</code>: ações sem valor de retorno (logs, envio de evento, refresh de tela).</li>
<li><code>async</code>: quando você precisa do resultado, especialmente para paralelizar duas chamadas independentes.</li>
<li><code>runBlocking</code>: <strong>somente</strong> em <code>main()</code>, em testes ou em pontes com APIs síncronas legadas.</li>
<li>Em UI: use o <code>lifecycleScope</code> / <code>viewModelScope</code>; nunca <code>GlobalScope</code>.</li>
<li>Em servidores: o framework (Ktor, Spring WebFlux) já te dá um scope adequado.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><strong>Hierarquia de jobs:</strong> uma exceção em filho cancela o scope inteiro (a menos que você use <code>SupervisorJob</code>).</li>
<li><code>async</code> só lança a exceção quando você chama <code>.await()</code> — se esquecer, fica silenciosa em alguns scopes.</li>
<li><code>runBlocking</code> em código de aplicação (não-main) trava a thread; em servidores reativos isso é catastrófico.</li>
<li><code>GlobalScope</code> é considerado <em>delicate API</em> desde 1.5: corrotinas órfãs vazam.</li>
<li>Não confunda <code>delay</code> (suspende) com <code>Thread.sleep</code> (bloqueia a thread).</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Cuidado</div><div>Builders são <em>extensões de CoroutineScope</em>. Se você não tem um scope estruturado, está fazendo errado — crie um com <code>CoroutineScope(SupervisorJob() + Dispatchers.Default)</code> e cancele-o no fim do ciclo de vida.</div></div>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Para paralelizar N tarefas: <code>list.map { async { processar(it) } }.awaitAll()</code>. Idiomático e seguro com structured concurrency.</div></div>
`}} />
    </article>
  );
}

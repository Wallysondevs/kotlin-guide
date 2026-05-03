export default function Channels() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Coroutines · avancado · 9 min</div>
      <h1>Channels</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Channels são filas suspensíveis para troca de valores entre coroutines — o equivalente a <code>BlockingQueue</code>, porém sem bloquear threads. São a base para padrões de pipeline, fan-in, fan-out e producer/consumer assíncronos.</p>

<h2>Conceito</h2>
<p>Um <code>Channel&lt;T&gt;</code> tem <code>send</code> (suspende se cheio) e <code>receive</code> (suspende se vazio). O comportamento depende da capacidade:</p>
<ul>
<li><code>RENDEZVOUS</code> (default, 0): cada send espera por um receive.</li>
<li><code>BUFFERED</code> (64) ou <em>n</em>: buffer fixo; send suspende quando cheio.</li>
<li><code>CONFLATED</code>: mantém só o último valor; sends nunca suspendem.</li>
<li><code>UNLIMITED</code>: cresce sob demanda (cuidado com OOM).</li>
</ul>
<pre><code class="language-kotlin">import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

val ch = Channel&lt;Int&gt;(capacity = Channel.BUFFERED)</code></pre>

<h2>Exemplo prático — produce + fan-out</h2>
<pre><code class="language-kotlin">fun CoroutineScope.numeros() = produce {
    for (i in 1..10) send(i)
}

fun CoroutineScope.worker(id: Int, ch: ReceiveChannel&lt;Int&gt;) = launch {
    for (n in ch) {
        println("worker \\$id processou \\$n")
        delay(50)
    }
}

fun main() = runBlocking {
    val ch = numeros()
    repeat(3) { worker(it, ch) }
    delay(2000)
    coroutineContext.cancelChildren()
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Pipelines de processamento em estágios (parse -&gt; transform -&gt; persist).</li>
<li>Distribuir trabalho entre N workers (fan-out).</li>
<li>Agregar resultados de várias fontes em um único consumidor (fan-in).</li>
<li>Implementar actors com <code>actor { }</code> (deprecado, mas o padrão segue válido com Channel).</li>
<li>Backpressure natural via capacidade limitada.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Esqueça <code>close()</code> e o <code>for (x in ch)</code> nunca termina — leak garantido.</li>
<li>Channels são <strong>hot</strong>: produzem mesmo sem consumidor (exceto <code>RENDEZVOUS</code>). Para streams reativos, prefira <code>Flow</code>.</li>
<li><code>CONFLATED</code> descarta valores; não use para eventos críticos.</li>
<li>Sem cancelamento adequado do <code>CoroutineScope</code>, workers ficam pendurados.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Flow vs Channel</div><div>Use <code>Flow</code> para fluxos cold de dados. Use <code>Channel</code> quando precisa de transferência ponto-a-ponto entre coroutines independentes (ex.: actor model).</div></div>

<div class="callout callout-warn"><div class="callout-title">UNLIMITED é uma armadilha</div><div>Sem backpressure, um produtor rápido pode encher a heap. Sempre prefira capacidade fixa e dimensione com base em medições.</div></div>
`}} />
    </article>
  );
}

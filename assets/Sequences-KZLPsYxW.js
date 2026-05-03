import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function l(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Coleções · intermediario · 9 min"}),e.jsx("h1",{children:"Sequences (lazy)"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`<p><code>Sequence&lt;T&gt;</code> é a versão <em>lazy</em> das coleções de Kotlin. Enquanto <code>List.map { }.filter { }</code> aloca uma lista intermediária a cada operação, uma sequência encadeia transformações <strong>elemento por elemento</strong> e só executa quando uma operação terminal (<code>toList</code>, <code>first</code>, <code>sum</code>) é chamada.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">val nums = (1..1_000_000).toList()

// Eager: aloca lista de 1M, depois filtra (alocação 2), depois map (alocação 3)
val r1 = nums.map { it * 2 }.filter { it % 7 == 0 }.take(5)

// Lazy: percorre só o suficiente para 5 elementos
val r2 = nums.asSequence()
    .map { it * 2 }
    .filter { it % 7 == 0 }
    .take(5)
    .toList()</code></pre>

<h2>generateSequence</h2>
<pre><code class="language-kotlin">val fibs = generateSequence(1 to 1) { (a, b) -&gt; b to a + b }
    .map { it.first }

println(fibs.take(10).toList())  // [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]

// Sequência infinita finalizada por null
val linhas = generateSequence { readlnOrNull() }
    .takeWhile { it.isNotBlank() }
    .toList()</code></pre>

<h2>sequence builder</h2>
<pre><code class="language-kotlin">fun pares(): Sequence&lt;Int&gt; = sequence {
    var i = 0
    while (true) {
        yield(i)
        i += 2
    }
}

fun ate100(): Sequence&lt;Int&gt; = sequence {
    yieldAll(0..50)
    yieldAll(60..100 step 5)
}

fun main() {
    println(pares().take(5).toList())  // [0, 2, 4, 6, 8]
}</code></pre>

<h2>Exemplo prático: parser de log</h2>
<pre><code class="language-kotlin">import java.io.File

fun erros(arquivo: File): Sequence&lt;String&gt; =
    arquivo.useLines { linhas -&gt;
        linhas
            .filter { "ERROR" in it }
            .map { it.substringAfter("ERROR ") }
            .toList()                          // materializa antes de fechar o stream
    }.asSequence()</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Pipelines longos onde a maioria dos elementos será descartada (<code>take</code>, <code>first</code>).</li>
<li>Fontes infinitas: <code>generateSequence</code> para IDs, fibonacci, retries.</li>
<li>Streams de I/O: ler arquivo linha-a-linha sem carregar tudo na memória.</li>
<li>Composição com <code>yield</code>/<code>yieldAll</code> em coroutines de geração.</li>
</ul>

<h2>Quando NÃO usar</h2>
<ul>
<li>Coleções pequenas (&lt;1000 elementos): a sobrecarga de criar iteradores supera o ganho.</li>
<li>Quando você vai materializar tudo no fim — vire <code>List</code> direto.</li>
<li>Operações que dependem de tamanho conhecido (<code>sortedBy</code> ainda força avaliação completa).</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Sequence vs Flow</div><div>Sequence é <em>síncrona</em> e bloqueante. Para fluxos <em>assíncronos</em> com coroutines (rede, DB reativo, eventos), use <code>kotlinx.coroutines.Flow</code>.</div></div>

<h2>Pegadinhas</h2>
<ul>
<li>Sequências são <strong>cold</strong>: cada terminal reexecuta toda a cadeia. Cache com <code>.toList()</code> se vai reusar.</li>
<li><code>sortedBy</code> e <code>distinct</code> consomem a sequência inteira em memória — perdem a vantagem lazy.</li>
<li>Não use <code>asSequence()</code> só para <em>aparentar</em> performance — meça.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Regra prática</div><div>Use <code>asSequence()</code> quando: (a) há &gt;3 operações encadeadas, (b) o dataset é grande, (c) o terminal pode parar cedo (<code>first</code>, <code>take</code>, <code>any</code>).</div></div>`}})]})}export{l as default};

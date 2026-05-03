import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Funcional avançado · intermediario · 10 min"}),e.jsx("h1",{children:"inline functions"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`<p>Funções <code>inline</code> em Kotlin pedem ao compilador para <strong>copiar o corpo da função no local da chamada</strong> em vez de gerar um <code>invoke()</code>. O ganho principal aparece quando a função recebe <em>lambdas</em>: elimina a alocação do objeto Function e permite <em>return não-local</em>.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">inline fun &lt;T&gt; medir(bloco: () -&gt; T): T {
    val ini = System.nanoTime()
    val r = bloco()
    println("levou \${System.nanoTime() - ini} ns")
    return r
}

fun main() {
    val soma = medir { (1..1_000).sum() }
    println(soma)
}</code></pre>
<p>Sem <code>inline</code>, cada chamada criaria um objeto <code>Function0</code>. Com <code>inline</code>, o bytecode resultante é equivalente a colar o cronômetro direto em volta de <code>(1..1_000).sum()</code>.</p>

<h2>Exemplo prático: synchronized funcional</h2>
<pre><code class="language-kotlin">inline fun &lt;T&gt; lockEx(l: java.util.concurrent.locks.Lock, bloco: () -&gt; T): T {
    l.lock()
    try { return bloco() } finally { l.unlock() }
}

val cache = HashMap&lt;String, String&gt;()
val lock  = java.util.concurrent.locks.ReentrantLock()

fun get(k: String): String? = lockEx(lock) { cache[k] }
fun put(k: String, v: String) = lockEx(lock) { cache[k] = v }</code></pre>

<h2>noinline e crossinline</h2>
<ul>
<li><code>noinline</code>: marca um lambda específico para <strong>não</strong> ser inlinado (você precisa passá-lo adiante como referência).</li>
<li><code>crossinline</code>: proíbe <em>return não-local</em> dentro do lambda — necessário quando o lambda será chamado de outro contexto (dentro de um <code>Runnable</code>, callback assíncrono etc.).</li>
</ul>
<pre><code class="language-kotlin">inline fun emThread(crossinline acao: () -&gt; Unit) {
    Thread { acao() }.start()   // crossinline: não pode 'return' do chamador aqui
}

inline fun comDois(
    a: () -&gt; Unit,
    noinline b: () -&gt; Unit
): () -&gt; Unit {
    a()
    return b   // só 'noinline' pode ser referenciado/retornado
}</code></pre>

<h2>Return não-local</h2>
<pre><code class="language-kotlin">fun primeiroPar(nums: List&lt;Int&gt;): Int? {
    nums.forEach {                 // forEach é inline na stdlib
        if (it % 2 == 0) return it // sai de primeiroPar inteira
    }
    return null
}</code></pre>
<p>Esse <code>return it</code> sai de <code>primeiroPar</code>, não só do lambda — só funciona porque <code>forEach</code> é <code>inline</code>.</p>

<h2>reified</h2>
<p>Inline também habilita <code>reified</code>: o tipo genérico fica disponível em runtime.</p>
<pre><code class="language-kotlin">inline fun &lt;reified T&gt; List&lt;Any&gt;.filtrarPor(): List&lt;T&gt; =
    filterIsInstance&lt;T&gt;()

val mistos: List&lt;Any&gt; = listOf(1, "a", 2, "b")
val ints: List&lt;Int&gt; = mistos.filtrarPor()</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Funções de ordem superior chamadas em loops quentes (perf).</li>
<li>DSLs onde você quer return não-local (<code>buildString</code>, <code>apply</code>).</li>
<li>APIs que precisam de <code>reified</code> (parsers JSON, serviços DI).</li>
<li>Wrappers de lock/transaction/measure.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><strong>Inline aumenta o bytecode</strong>: funções grandes inlinadas explodem o tamanho do APK/JAR. Limite a corpos pequenos.</li>
<li>Não dá para acessar membros <code>private</code> do chamador a partir do corpo inlinado — eles passam a ser referenciados de outro lugar.</li>
<li><code>inline</code> sem lambdas raramente compensa — o compilador avisa.</li>
<li>Recursão em função <code>inline</code> não é permitida.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Não inline tudo</div><div>Marcar todas as funções como <code>inline</code> é antipadrão. Use quando há lambdas <em>e</em> a função é pequena <em>ou</em> você precisa de <code>reified</code>/return não-local.</div></div>`}})]})}export{r as default};

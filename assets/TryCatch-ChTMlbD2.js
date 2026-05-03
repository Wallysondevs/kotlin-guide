import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function t(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Erros e Result · iniciante · 7 min"}),e.jsx("h1",{children:"try/catch/finally"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Kotlin trata todas as exceções como <em>unchecked</em> — você nunca é obrigado a declará-las na assinatura. Em compensação, a linguagem oferece <code>try</code> como expressão, blocos <code>use</code> para recursos e o tipo <code>Result&lt;T&gt;</code> para casos onde uma exceção é apenas um valor de retorno alternativo.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">try {
    fazerAlgo()
} catch (e: IOException) {
    log.error("io falhou", e)
} catch (e: IllegalArgumentException) {
    log.warn("argumento inválido", e)
} finally {
    println("sempre executa")
}</code></pre>

<h2>try como expressão</h2>
<p>O <code>try</code> retorna o valor do bloco principal ou do <code>catch</code>:</p>
<pre><code class="language-kotlin">val numero: Int = try {
    texto.toInt()
} catch (e: NumberFormatException) {
    -1
}</code></pre>

<h2>Multi-catch</h2>
<p>Kotlin não tem multi-catch nativo (como Java's <code>catch (A | B e)</code>), mas você pode emular:</p>
<pre><code class="language-kotlin">try {
    operacao()
} catch (e: Exception) {
    when (e) {
        is IOException, is TimeoutException -&gt; retentar()
        else -&gt; throw e
    }
}</code></pre>

<h2>use { }: AutoCloseable seguro</h2>
<p>Substitui <code>try-with-resources</code> do Java. Fecha o recurso mesmo em caso de exceção.</p>
<pre><code class="language-kotlin">import java.io.File

val texto = File("dados.txt").bufferedReader().use { reader -&gt;
    reader.readText()
}

// Funciona com qualquer Closeable / AutoCloseable
Database.openConnection().use { conn -&gt;
    conn.execute("SELECT 1")
}</code></pre>

<h2>runCatching e Result</h2>
<pre><code class="language-kotlin">val resultado: Result&lt;Int&gt; = runCatching { texto.toInt() }

resultado
    .map { it * 2 }
    .onSuccess { println("ok: $it") }
    .onFailure { println("erro: \${it.message}") }
    .getOrElse { -1 }</code></pre>

<h2>Quando usar cada estratégia</h2>
<ul>
<li><strong><code>try/catch</code> tradicional</strong>: lógica de recuperação localizada, logging estruturado.</li>
<li><strong><code>try</code> como expressão</strong>: quando o resultado da operação é o valor de uma variável.</li>
<li><strong><code>use { }</code></strong>: sempre que abrir arquivo, conexão, stream, qualquer <code>Closeable</code>.</li>
<li><strong><code>runCatching</code></strong>: pipelines funcionais onde você quer encadear sucesso/falha sem <code>try</code> aninhado.</li>
<li><strong><code>require</code>/<code>check</code></strong>: validações de pré/pós-condição que devem virar <code>IllegalArgumentException</code>/<code>IllegalStateException</code>.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><code>runCatching</code> captura <strong>todas</strong> as <code>Throwable</code>, inclusive <code>CancellationException</code> — em coroutines, isso é problemático. Use <code>kotlin.coroutines.cancellation.CancellationException</code> e relança.</li>
<li>Não use exceções para fluxo de controle "normal" — é caro e ofusca a intenção. Prefira <code>sealed class</code> de resultado ou <code>null</code>.</li>
<li><code>finally</code> roda mesmo após <code>return</code>, mas não evite isso para "consertar" valores — código fica difícil de seguir.</li>
<li>Capturar <code>Throwable</code> nu engole <code>Error</code>s da JVM (<code>OutOfMemoryError</code>, <code>StackOverflowError</code>) — quase sempre errado.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Coroutines</div><div>Em código suspending, <code>CancellationException</code> é o sinal de cancelamento estruturado. Engoli-la quebra o cancelamento de toda a árvore de coroutines.</div></div>
`}})]})}export{t as default};

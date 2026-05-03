export default function Lambdas() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Sintaxe e tipos · iniciante · 9 min</div>
      <h1>Lambdas e função literal</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Lambdas são funções anônimas escritas inline. Em Kotlin elas são <strong>cidadãos de primeira classe</strong>: têm tipo (<code>(A) -&gt; B</code>), podem ser passadas como argumento, retornadas, guardadas em <code>val</code>. Domine-as e você desbloqueia todo o estilo funcional da linguagem.</p>

<h2>Conceito</h2>
<p>A sintaxe é <code>{ parâmetros -&gt; corpo }</code>. O <strong>último expression</strong> do corpo é o valor de retorno. Se a lambda tem um único parâmetro, você pode omiti-lo e usar o nome implícito <code>it</code>.</p>
<pre><code class="language-kotlin">val dobrar: (Int) -&gt; Int = { x -&gt; x * 2 }
val ehPar: (Int) -&gt; Boolean = { it % 2 == 0 }   // único param: it

println(dobrar(5))   // 10
println(ehPar(4))    // true</code></pre>

<p>Quando a lambda é o <strong>último argumento</strong> de uma função, você pode escrevê-la fora dos parênteses (<em>trailing lambda</em>). Se ela é o único argumento, os parênteses somem.</p>
<pre><code class="language-kotlin">listOf(1, 2, 3).map { it * it }            // único arg
listOf(1, 2, 3).fold(0) { acc, x -&gt; acc + x }  // último arg</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">data class Pedido(val id: Int, val total: Double, val pago: Boolean)

fun main() {
    val pedidos = listOf(
        Pedido(1, 100.0, true),
        Pedido(2, 50.0, false),
        Pedido(3, 200.0, true),
    )

    val totalPagos = pedidos
        .filter { it.pago }
        .sumOf { it.total }

    val resumo = pedidos.joinToString(prefix = "[", postfix = "]") { p -&gt;
        val status = if (p.pago) "OK" else "PEND"
        "#\${p.id}:\$status"
    }

    println("total pagos = \$totalPagos")
    println(resumo)
}</code></pre>

<h2>Multi-line, retorno e function references</h2>
<p>Lambdas multi-linha são naturais. Para retornar antes do fim, use <code>return@nome</code> (return rotulado) — <code>return</code> nu sai da função envolvente.</p>
<pre><code class="language-kotlin">val classificar: (Int) -&gt; String = { n -&gt;
    when {
        n &lt; 0  -&gt; "negativo"
        n == 0 -&gt; "zero"
        else   -&gt; "positivo"
    }
}

listOf(1, 2, 3).forEach {
    if (it == 2) return@forEach   // pula só essa iteração
    println(it)
}</code></pre>

<p><strong>Function references</strong> com <code>::</code> permitem passar uma função existente onde se espera uma lambda — equivalente a <code>{ x -&gt; foo(x) }</code> mas mais limpo.</p>
<pre><code class="language-kotlin">fun isPositivo(n: Int) = n &gt; 0

listOf(-1, 0, 1, 2).filter(::isPositivo)    // [1, 2]
listOf("ana", "bia").map(String::uppercase) // [ANA, BIA]
val construtor = ::Pedido                   // referência a construtor</code></pre>

<h2>SAM conversion</h2>
<p>Quando uma API Java espera uma <em>Single Abstract Method interface</em> (Runnable, Callable, Listener), Kotlin converte uma lambda automaticamente.</p>
<pre><code class="language-kotlin">Thread { println("oi") }.start()                  // Runnable
button.setOnClickListener { v -&gt; toast("clique") } // OnClickListener</code></pre>

<h2>Boas práticas</h2>
<ul>
  <li>Use <code>it</code> apenas em lambdas curtas (uma linha, escopo claro). Em multi-line, dê nome ao parâmetro.</li>
  <li>Aninhe <code>it</code> apenas um nível — duas lambdas com <code>it</code> dentro de outra confunde. Renomeie.</li>
  <li>Prefira function references (<code>::foo</code>) para passar funções nominais.</li>
  <li>Lambdas capturam variáveis do escopo (closures); cuidado com mutabilidade compartilhada entre threads.</li>
  <li><code>return</code> dentro de lambda em função inline sai da função externa — geralmente o que você quer; em não-inline, exige rótulo.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Performance</div><div>Lambdas alocam objetos. Funções <code>inline</code> (como <code>map</code>, <code>filter</code>) eliminam essa alocação no call-site, então o custo é zero em hot paths.</div></div>
`}} />
    </article>
  );
}

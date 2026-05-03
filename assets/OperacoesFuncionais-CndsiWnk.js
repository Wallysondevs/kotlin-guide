import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Coleções · intermediario · 11 min"}),e.jsx("h1",{children:"Operações funcionais"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>A stdlib de Kotlin entrega dezenas de operações funcionais sobre <code>Iterable</code> que substituem laços imperativos por código declarativo. Dominar esse vocabulário acelera o dia a dia e reduz bugs de off-by-one.</p>

<h2>Conceito</h2>
<p>Cada operação devolve uma nova coleção (eager) e pode ser encadeada. Para coleções grandes, converta para <code>asSequence()</code> e ganhe avaliação preguiçosa, evitando alocar listas intermediárias.</p>

<h2>filter / map / sortedBy</h2>
<pre><code class="language-kotlin">data class Produto(val nome: String, val preco: Double, val categoria: String)

val catalogo = listOf(
    Produto("Café", 25.0, "bebidas"),
    Produto("Pão", 8.5, "padaria"),
    Produto("Leite", 7.0, "bebidas"),
    Produto("Bolo", 32.0, "padaria"),
)

val baratosOrdenados = catalogo
    .filter { it.preco &lt; 30.0 }
    .map { it.copy(preco = it.preco * 0.9) }
    .sortedBy { it.preco }

baratosOrdenados.forEach { println(it) }
</code></pre>

<h2>take / drop / distinct</h2>
<pre><code class="language-kotlin">val numeros = (1..20).toList()
numeros.take(5)            // [1,2,3,4,5]
numeros.drop(15)           // [16..20]
numeros.takeWhile { it &lt; 7 }   // [1..6]
numeros.dropLastWhile { it &gt; 18 } // remove finais &gt; 18

listOf(1, 2, 2, 3, 3, 3).distinct() // [1,2,3]
catalogo.distinctBy { it.categoria } // primeiro de cada categoria
</code></pre>

<h2>chunked / windowed</h2>
<pre><code class="language-kotlin">val pageSize = 3
val paginas = catalogo.chunked(pageSize)
// [[Café,Pão,Leite],[Bolo]]

val precos = listOf(10, 12, 9, 15, 14, 13)
val mediasMoveis = precos.windowed(size = 3, step = 1) { it.average() }
// [10.33, 12.0, 12.66, 14.0]
</code></pre>

<h2>partition</h2>
<pre><code class="language-kotlin">val (caros, baratos) = catalogo.partition { it.preco &gt; 20.0 }
println("caros=\${caros.size} baratos=\${baratos.size}")
</code></pre>

<h2>fold / reduce</h2>
<pre><code class="language-kotlin">val total = catalogo.fold(0.0) { acc, p -&gt; acc + p.preco }
val maisCaro = catalogo.reduce { a, b -&gt; if (a.preco &gt; b.preco) a else b }

// fold com estado complexo
val porCategoria = catalogo.fold(mutableMapOf&lt;String, Double&gt;()) { acc, p -&gt;
    acc.merge(p.categoria, p.preco, Double::plus); acc
}
</code></pre>

<h2>Exemplo prático: relatório</h2>
<pre><code class="language-kotlin">data class Venda(val data: String, val produto: String, val qtd: Int, val valor: Double)

fun relatorio(vendas: List&lt;Venda&gt;): Map&lt;String, Double&gt; =
    vendas
        .filter { it.qtd &gt; 0 }
        .groupBy { it.data }
        .mapValues { (_, v) -&gt; v.sumOf { it.qtd * it.valor } }
        .toSortedMap()
</code></pre>

<h2>Quando usar cada uma</h2>
<ul>
  <li><strong>filter</strong>: quando o laço só serve para descartar.</li>
  <li><strong>map</strong>: para transformar 1-para-1 (DTO ↔ entidade).</li>
  <li><strong>chunked</strong>: paginação, batch de inserts.</li>
  <li><strong>windowed</strong>: médias móveis, séries temporais.</li>
  <li><strong>partition</strong>: separar válidos/inválidos sem dois <code>filter</code>.</li>
  <li><strong>fold</strong>: agregações com estado de tipo diferente do elemento.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Cada operação eager aloca uma nova lista. Em pipelines &gt; 3 estágios sobre &gt; 10k itens, use <code>asSequence()</code>.</li>
  <li><code>reduce</code> em coleção vazia lança; use <code>fold</code> com seed.</li>
  <li><code>sortedBy</code> retorna nova lista; <code>sortBy</code> só funciona em <code>MutableList</code>.</li>
  <li>Cuidado com <code>map { ... }.first()</code> — prefira <code>firstOrNull { ... }?.let { ... }</code>.</li>
  <li><code>groupBy</code> pode explodir memória; prefira <code>groupingBy().eachCount()</code> quando só conta.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Sequences para pipelines longos</div><div>Para milhões de itens com várias operações, <code>asSequence()</code> processa elemento a elemento, evitando listas intermediárias e reduzindo GC.</div></div>

<div class="callout callout-info"><div class="callout-title">sumOf é seu amigo</div><div>Em vez de <code>map { it.preco }.sum()</code>, use <code>sumOf { it.preco }</code>: uma alocação a menos e tipo correto (Int/Long/Double/BigDecimal).</div></div>
`}})]})}export{r as default};

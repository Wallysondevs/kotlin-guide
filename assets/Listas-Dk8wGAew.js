import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function s(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Coleções · iniciante · 8 min"}),e.jsx("h1",{children:"List e MutableList"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Listas são a coleção mais usada em Kotlin. A linguagem distingue claramente entre a interface <strong>read-only</strong> <code>List&lt;T&gt;</code> e a mutável <code>MutableList&lt;T&gt;</code>. Essa separação no nível de tipo é uma das ferramentas mais simples e poderosas para escrever código previsível.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">val numeros: List&lt;Int&gt; = listOf(1, 2, 3)        // imutável (interface)
val mut: MutableList&lt;Int&gt; = mutableListOf(1, 2)
mut.add(3)

val vazia: List&lt;String&gt; = emptyList()
val ate10: List&lt;Int&gt; = (1..10).toList()</code></pre>
<p><code>List&lt;T&gt;</code> não é necessariamente imutável — apenas read-only. Sob o capô pode ser um <code>ArrayList</code> mutável; você só não tem permissão para alterá-lo via essa referência.</p>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">data class Produto(val nome: String, val preco: Double)

val carrinho = listOf(
    Produto("Caneta", 5.0),
    Produto("Caderno", 25.0),
    Produto("Mochila", 150.0)
)

val total = carrinho.sumOf { it.preco }
val caros = carrinho.filter { it.preco &gt; 20 }
val nomes = carrinho.map(Produto::nome)

// buildList: mutável durante a construção, retorna List imutável
val combo = buildList {
    add(Produto("Brinde", 0.0))
    addAll(carrinho)
}</code></pre>

<h2>Acesso, slicing e busca</h2>
<pre><code class="language-kotlin">val l = listOf("a", "b", "c", "d")
l[0]                   // "a"
l.first(); l.last()
l.getOrNull(99)        // null em vez de exceção
l.subList(1, 3)        // ["b", "c"] — view, não cópia!
l.indexOf("c")         // 2
l.take(2); l.drop(2)
l.chunked(2)           // [[a,b],[c,d]]
l.windowed(2, step = 1) // [[a,b],[b,c],[c,d]]</code></pre>

<h2>Igualdade</h2>
<p><code>List</code> implementa <code>equals</code> por conteúdo: <code>listOf(1,2) == listOf(1,2)</code> é <code>true</code>. Isso vale também entre <code>List</code> e <code>MutableList</code> com mesmo conteúdo, mas <strong>não</strong> entre <code>List</code> e <code>Set</code>.</p>

<h2>Quando usar cada um</h2>
<ul>
<li><strong><code>listOf</code></strong>: dados fixos, retorno de função, parâmetros — o default.</li>
<li><strong><code>mutableListOf</code></strong>: quando você realmente precisa adicionar/remover ao longo do tempo.</li>
<li><strong><code>buildList { }</code></strong>: construção complexa que termina imutável — combina o melhor dos dois.</li>
<li><strong><code>emptyList()</code></strong>: retorno padrão para "nenhum resultado" — não aloca.</li>
<li><strong><code>List&lt;T&gt;?</code></strong>: evite. Prefira lista vazia a <code>null</code>.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><code>subList</code> retorna uma <strong>view</strong> sobre a lista original — alterações na view (se mutável) afetam o pai. Use <code>.toList()</code> para copiar.</li>
<li><code>List.of</code> do Java é imutável de verdade; <code>listOf</code> em Kotlin/JVM costuma delegar para <code>java.util.Collections</code>, mas o tipo é <code>List</code>, não <code>MutableList</code> — confie no tipo.</li>
<li>Não passe <code>MutableList</code> em APIs públicas se não quer expor mutação.</li>
<li>Para filas/pilhas eficientes, considere <code>ArrayDeque</code> em vez de <code>MutableList</code>.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Variância</div><div><code>List&lt;out T&gt;</code> é covariante: <code>List&lt;String&gt;</code> é subtipo de <code>List&lt;Any&gt;</code>. Já <code>MutableList</code> é invariante — necessário para preservar segurança de tipos na escrita.</div></div>
`}})]})}export{s as default};

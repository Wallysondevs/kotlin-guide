export default function FlatMap() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Coleções · intermediario · 7 min</div>
      <h1>flatMap e flatten</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p><code>flatMap</code> e <code>flatten</code> resolvem o problema clássico de "lista de listas": transformar uma estrutura aninhada em uma única coleção plana, com ou sem transformação intermediária.</p>

<h2>Conceito</h2>
<p><code>flatten()</code> opera em <code>Iterable&lt;Iterable&lt;T&gt;&gt;</code> e devolve <code>List&lt;T&gt;</code>. Já <code>flatMap { it -&gt; Iterable }</code> faz <code>map</code> seguido de <code>flatten</code>.</p>
<pre><code class="language-kotlin">val matriz = listOf(listOf(1, 2), listOf(3, 4))
matriz.flatten()                  // [1, 2, 3, 4]
matriz.flatMap { it.map { x -&gt; x * 10 } } // [10, 20, 30, 40]</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">data class Autor(val nome: String, val livros: List&lt;String&gt;)

val acervo = listOf(
    Autor("Clarice", listOf("A Hora da Estrela", "Água Viva")),
    Autor("Machado", listOf("Dom Casmurro", "Memórias Póstumas"))
)

val todosLivros: List&lt;String&gt; = acervo.flatMap { it.livros }
val titulosUnicos = acervo.flatMap { it.livros }.distinct()

// flatMap também serve para "expansão condicional"
val numeros = listOf(1, 2, 3)
val pares = numeros.flatMap { if (it % 2 == 0) listOf(it, it) else emptyList() }
// [2, 2]</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Coletar todos os filhos de uma árvore de objetos.</li>
<li>Expandir resultados paginados em uma lista única.</li>
<li>Transformar e remover ao mesmo tempo (devolva <code>emptyList()</code> para excluir).</li>
<li>Combinar resultados de várias chamadas async (com <code>flatMap</code> em <code>Flow</code>).</li>
<li>Substituir <code>map { ... }.filterNotNull()</code> por <code>mapNotNull</code> quando só quer remover nulos.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Para nullables use <code>mapNotNull</code> em vez de <code>flatMap { listOfNotNull(...) }</code>.</li>
<li>Em coleções grandes, use <code>asSequence()</code> antes do <code>flatMap</code> para evitar listas intermediárias.</li>
<li>Em <code>Flow</code>, escolha o operador certo: <code>flatMapConcat</code>, <code>flatMapMerge</code>, <code>flatMapLatest</code>.</li>
<li>Evite <code>flatMap</code> com lambdas que mantêm estado — surpresas garantidas em paralelismo.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">flatMap em Map</div><div>Em <code>Map&lt;K, List&lt;V&gt;&gt;</code>, use <code>map.values.flatten()</code> para todos os valores ou <code>map.flatMap { (k, vs) -&gt; vs.map { k to it } }</code> para pares chave-valor expandidos.</div></div>
`}} />
    </article>
  );
}

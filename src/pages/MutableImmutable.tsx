export default function MutableImmutable() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Coleções · intermediario · 8 min</div>
      <h1>Mutable vs Immutable</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Kotlin separa <code>List</code> de <code>MutableList</code> (e Set/Map idem) já no sistema de tipos. Mas há um detalhe importante: essa separação é uma <strong>view</strong> em compile-time. Em runtime, ambas são <code>java.util.ArrayList</code>. Entender essa nuance evita bugs sutis e decisões equivocadas sobre thread-safety.</p>

<h2>Conceito</h2>
<p><code>List&lt;T&gt;</code> expõe apenas operações de leitura (<code>size</code>, <code>get</code>, <code>iterator</code>). <code>MutableList&lt;T&gt;</code> adiciona <code>add</code>, <code>remove</code>, <code>set</code>. Mas o objeto subjacente é o mesmo.</p>
<pre><code class="language-kotlin">val mutavel: MutableList&lt;Int&gt; = mutableListOf(1, 2, 3)
val somenteLeitura: List&lt;Int&gt; = mutavel       // mesma instância!

mutavel.add(4)
println(somenteLeitura)   // [1, 2, 3, 4]  — mudou "do nada"</code></pre>

<p>Isto é <strong>imutabilidade de interface</strong>, não imutabilidade real. Se alguém com a referência mutável mexer, sua "<code>List</code>" muda também.</p>

<h2>Exemplo prático: defensive copy</h2>
<pre><code class="language-kotlin">class Carrinho {
    private val _itens = mutableListOf&lt;String&gt;()

    // ❌ Vaza a referência mutável
    val itensRuim: List&lt;String&gt; get() = _itens

    // ✅ Copia defensiva
    val itens: List&lt;String&gt; get() = _itens.toList()

    fun adicionar(item: String) { _itens += item }
}

fun main() {
    val c = Carrinho()
    c.adicionar("café")

    // mesmo com cast malicioso, .toList() devolveu cópia
    val lista = c.itens
    (lista as? MutableList&lt;String&gt;)?.add("hack")  // null: ArrayList retornado por toList é distinto
}</code></pre>

<h2>Imutabilidade real: kotlinx.collections.immutable</h2>
<p>Para imutabilidade <em>de verdade</em>, use a biblioteca <code>kotlinx.collections.immutable</code>. Ela oferece <strong>persistent collections</strong>: cada operação retorna uma nova versão sem copiar tudo (estrutura compartilhada via árvore).</p>
<pre><code class="language-groovy">// build.gradle.kts
implementation("org.jetbrains.kotlinx:kotlinx-collections-immutable:0.3.7")</code></pre>
<pre><code class="language-kotlin">import kotlinx.collections.immutable.*

val v1: PersistentList&lt;Int&gt; = persistentListOf(1, 2, 3)
val v2 = v1.add(4)        // [1,2,3,4] — v1 continua [1,2,3]
val v3 = v2.removeAt(0)   // [2,3,4]   — v2 continua [1,2,3,4]

println(v1)  // [1, 2, 3]
println(v2)  // [1, 2, 3, 4]
println(v3)  // [2, 3, 4]</code></pre>

<h2>Quando usar</h2>
<ul>
  <li><code>List</code> read-only para retornos públicos por padrão.</li>
  <li><code>MutableList</code> em escopos locais bem delimitados (build de uma coleção).</li>
  <li>Persistent collections em estado compartilhado entre coroutines/threads ou estado de UI (Compose, Redux-like).</li>
  <li><code>buildList { add(...); add(...) }</code> para construir e congelar em um passo — devolve <code>List</code> imutável de fato (a partir de Kotlin 1.6).</li>
  <li><code>Collections.unmodifiableList(...)</code> em interop com Java quando precisa garantir read-only em runtime.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><code>List&lt;T&gt;</code> não é thread-safe automaticamente. Concorrência exige sincronização ou persistent collections.</li>
  <li>Cast malicioso <code>list as MutableList</code> pode funcionar se a instância é de fato mutável. Não confie só no tipo.</li>
  <li><code>.toList()</code>, <code>.toMap()</code>, <code>.toSet()</code> sempre devolvem cópia — barato e seguro.</li>
  <li><code>listOf(1,2,3)</code> retorna uma implementação não-mutável (<code>java.util.Arrays\$ArrayList</code> ou <code>EmptyList</code>); cast falha em runtime.</li>
  <li>Sequência <code>map { ... }</code> em <code>List</code> sempre cria uma nova lista; use <code>asSequence()</code> para evitar materializações intermediárias em pipelines longos.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Thread-safety</div><div>"Imutável" no Kotlin/JVM não significa <em>thread-safe</em> a menos que você use persistent collections, <code>Collections.synchronized*</code>, ou estruturas de <code>java.util.concurrent</code>.</div></div>

<div class="callout callout-info"><div class="callout-title">Compose</div><div>No Jetpack Compose, prefira <code>persistentListOf</code> em estado: a comparação de igualdade estrutural é O(1) por hash, evitando recomposições espúrias.</div></div>
`}} />
    </article>
  );
}

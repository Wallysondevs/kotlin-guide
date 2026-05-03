export default function Variance() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Generics e reflexão · avancado · 11 min</div>
      <h1>Variance: in/out</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Variance responde à pergunta: <em>se <code>Cachorro</code> é <code>Animal</code>, então <code>List&lt;Cachorro&gt;</code> é <code>List&lt;Animal&gt;</code>?</em>. Em Kotlin, isso é decidido na declaração do tipo genérico, com os modificadores <code>out</code> (covariância) e <code>in</code> (contravariância) — uma vantagem clara sobre os wildcards confusos do Java.</p>

<h2>Conceito</h2>
<p>Mnemônico <strong>PECS</strong> de Joshua Bloch — <em>Producer Extends, Consumer Super</em>:</p>
<ul>
<li><code>out T</code> — o tipo só <em>produz</em> T. <code>List&lt;out Animal&gt;</code> aceita <code>List&lt;Cachorro&gt;</code>.</li>
<li><code>in T</code> — o tipo só <em>consome</em> T. <code>Comparator&lt;in Cachorro&gt;</code> aceita <code>Comparator&lt;Animal&gt;</code>.</li>
<li>Sem modificador — invariante; só aceita exatamente o mesmo tipo.</li>
</ul>
<pre><code class="language-kotlin">interface Producer&lt;out T&gt; { fun produzir(): T }       // covariante
interface Consumer&lt;in T&gt;  { fun consumir(t: T) }      // contravariante
interface Box&lt;T&gt;          { var item: T }             // invariante (lê e escreve)
</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">open class Animal(val nome: String)
class Cachorro(nome: String) : Animal(nome)

// Covariância: lista de cachorros é "lista de animais"
fun nomes(animais: List&lt;Animal&gt;) = animais.map { it.nome }

fun main() {
    val cachorros: List&lt;Cachorro&gt; = listOf(Cachorro("Rex"))
    println(nomes(cachorros))         // OK porque List&lt;out E&gt; é covariante

    // Contravariância: um Comparator&lt;Animal&gt; serve para Cachorro
    val porNome: Comparator&lt;Animal&gt; = compareBy { it.nome }
    val ordenados: List&lt;Cachorro&gt; = cachorros.sortedWith(porNome)
    println(ordenados.map { it.nome })
}

// Variance no ponto de uso (use-site): equivalente aos wildcards do Java
fun copiar(de: Array&lt;out Any&gt;, para: Array&lt;in Any&gt;) {
    for (i in de.indices) para[i] = de[i]
}
</code></pre>

<h2>Quando usar</h2>
<ul>
<li><code>out</code> em coleções/streams somente-leitura: <code>List</code>, <code>Sequence</code>, <code>Iterable</code>.</li>
<li><code>in</code> em interfaces que recebem valores: <code>Comparator</code>, <code>OnClickListener</code>, <code>Consumer</code>.</li>
<li><strong>Use-site variance</strong> quando você não controla a declaração da classe (ex.: <code>Array</code>, que é invariante).</li>
<li>Star projection <code>Foo&lt;*&gt;</code> quando o argumento de tipo é desconhecido mas você só precisa ler como <code>Any?</code>.</li>
</ul>

<h2>Comparação com Java</h2>
<ul>
<li>Java tem <code>List&lt;? extends Animal&gt;</code> (use-site, covariante) e <code>List&lt;? super Cachorro&gt;</code> (use-site, contravariante).</li>
<li>Kotlin permite resolver <em>na declaração</em> (declaration-site) — <code>List&lt;out E&gt;</code> evita ter que escrever wildcard em todo cliente.</li>
<li>Quando interopera com Java, anote <code>@JvmSuppressWildcards</code>/<code>@JvmWildcard</code> para controlar a tradução.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><code>out T</code> proíbe T como parâmetro de função (<em>posição in</em>) — o compilador reclama.</li>
<li><code>Array</code> em Kotlin é <strong>invariante</strong>, diferente do Java (que tem array covariância — fonte de <code>ArrayStoreException</code>).</li>
<li>Mutable collections (<code>MutableList&lt;T&gt;</code>) são invariantes por design — não podem ser <code>out</code> nem <code>in</code>.</li>
<li>Star <code>List&lt;*&gt;</code> não é a mesma coisa que <code>List&lt;Any?&gt;</code>; você só pode ler.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Info</div><div>Pense assim: <code>out</code> é uma garantia para o consumidor da API ("vou só te dar coisas"); <code>in</code> é uma garantia para o produtor ("só vou receber coisas"). Quem viola, o compilador rejeita.</div></div>
`}} />
    </article>
  );
}

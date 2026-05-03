import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Generics e reflexão · intermediario · 10 min"}),e.jsx("h1",{children:"Generics"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Generics permitem escrever código tipado para múltiplos tipos sem perder segurança. Em Kotlin, o sistema vai além de Java com <strong>variância declarada</strong> (<code>in</code>/<code>out</code>), <code>reified</code> em funções inline e <code>where</code> para múltiplos limites.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">class Caixa&lt;T&gt;(val valor: T)
fun &lt;T&gt; identidade(x: T): T = x

val ci: Caixa&lt;Int&gt; = Caixa(1)
val cs: Caixa&lt;String&gt; = Caixa("oi")</code></pre>

<h2>Limites (bounds)</h2>
<pre><code class="language-kotlin">fun &lt;T : Comparable&lt;T&gt;&gt; maximo(a: T, b: T): T =
    if (a &gt;= b) a else b

// múltiplos limites com 'where'
fun &lt;T&gt; copiarSeAceitavel(t: T): T
        where T : CharSequence,
              T : Appendable {
    return t
}</code></pre>

<h2>Variância: in / out</h2>
<p>Em Java existe <code>? extends T</code> e <code>? super T</code> no <em>uso</em>. Em Kotlin você pode declarar a variância na <em>definição</em>:</p>
<pre><code class="language-kotlin">interface Produtor&lt;out T&gt; { fun produzir(): T }   // covariante
interface Consumidor&lt;in T&gt; { fun consumir(t: T) } // contravariante

val pAny: Produtor&lt;Any&gt; = object : Produtor&lt;String&gt; {
    override fun produzir() = "ok"
}
val cString: Consumidor&lt;String&gt; = object : Consumidor&lt;Any&gt; {
    override fun consumir(t: Any) {}
}</code></pre>
<p>Use <code>out</code> quando o parâmetro só sai (posições de retorno); <code>in</code> quando só entra (posições de parâmetro).</p>

<h2>Type erasure no JVM</h2>
<p>Como em Java, no runtime a JVM não conhece o parâmetro genérico — <code>List&lt;String&gt;</code> e <code>List&lt;Int&gt;</code> são apenas <code>List</code>. Por isso:</p>
<pre><code class="language-kotlin">val l: Any = listOf(1, 2, 3)
// l is List&lt;String&gt;     // erro de compilação
l is List&lt;*&gt;              // ok (star projection)</code></pre>

<h2>reified em funções inline</h2>
<p>O truque para "ter o tipo" em runtime é usar <code>inline</code> + <code>reified</code>:</p>
<pre><code class="language-kotlin">inline fun &lt;reified T&gt; Any?.castOrNull(): T? = this as? T

val x: Number = 10
val asInt: Int? = x.castOrNull()      // compila e funciona

inline fun &lt;reified T&gt; tipoDe(): String = T::class.simpleName ?: "?"
println(tipoDe&lt;Int&gt;())                 // "Int"</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Coleções e contêineres tipados (<code>Repository&lt;User&gt;</code>, <code>Cache&lt;K, V&gt;</code>).</li>
<li>DSLs e builders type-safe.</li>
<li>Serialização (<code>json.decodeFromString&lt;Pedido&gt;(s)</code> usa <code>reified</code>).</li>
<li>Funções utilitárias polimórficas (<code>fun &lt;T&gt; List&lt;T&gt;.segundo(): T?</code>).</li>
<li>Abstrações sobre callbacks/eventos (<code>EventBus.subscribe&lt;LoginEvent&gt; { ... }</code>).</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><code>reified</code> exige <code>inline</code>, e funções inline não podem ser virtuais nem armazenadas como referência tipada.</li>
<li><code>Array&lt;T&gt;</code> é invariante e não pode ser <code>reified</code> facilmente; prefira <code>List&lt;T&gt;</code>.</li>
<li>Variância declarada no site: <code>out T</code> impede usar <code>T</code> como parâmetro de método.</li>
<li>Star-projection (<code>List&lt;*&gt;</code>) não é o mesmo que <code>List&lt;Any?&gt;</code> — é "lista de algo desconhecido".</li>
<li>Cuidado com casts inseguros: <code>as List&lt;String&gt;</code> emite warning porque o tipo é apagado.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Regra prática</div><div>"Producer Extends, Consumer Super" (PECS) do Java vira em Kotlin: <strong>produz → <code>out</code>, consome → <code>in</code></strong>. Quem faz as duas coisas fica invariante.</div></div>
`}})]})}export{r as default};

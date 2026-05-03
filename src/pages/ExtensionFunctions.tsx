export default function ExtensionFunctions() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Funcional avançado · intermediario · 11 min</div>
      <h1>Extension functions</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Extension functions permitem "adicionar" métodos a classes existentes sem modificá-las nem herdar delas. É a base de bibliotecas como kotlinx.coroutines e Jetpack Compose, e de boa parte da fluência da stdlib.</p>

<h2>Conceito</h2>
<p>Uma extension function é uma função normal cuja primeira "receiver" aparece antes do nome. Por baixo dos panos, o compilador gera uma função estática que recebe o receiver como primeiro parâmetro — não há mágica em runtime.</p>
<pre><code class="language-kotlin">fun String.firstWord(): String = substringBefore(' ')

"Olá mundo".firstWord()   // "Olá"</code></pre>

<h2>Dispatch estático</h2>
<p>Diferente de métodos de membro, extensions são resolvidas em <strong>tempo de compilação</strong> pelo tipo declarado, não pelo tipo real em runtime. Não são polimórficas.</p>
<pre><code class="language-kotlin">open class Base
class Derived : Base()

fun Base.who() = "base"
fun Derived.who() = "derived"

val x: Base = Derived()
println(x.who())   // "base" — dispatch estático</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">// Stdlib pattern: extension idiomático sobre Iterable
fun &lt;T&gt; List&lt;T&gt;.second(): T =
    if (size &gt;= 2) this[1] else error("lista pequena")

// Extension com tipo nullable como receiver
fun String?.orEmpty2(): String = this ?: ""

// Extension com generic e bound
fun &lt;T : Comparable&lt;T&gt;&gt; List&lt;T&gt;.middle(): T = sorted()[size / 2]</code></pre>

<h2>Extension properties</h2>
<p>Propriedades também podem ser extensions, desde que sejam <strong>computadas</strong> (sem backing field).</p>
<pre><code class="language-kotlin">val String.lastChar: Char get() = this[length - 1]
val &lt;T&gt; List&lt;T&gt;.lastIndex: Int get() = size - 1</code></pre>

<h2>Member vs extension</h2>
<p>Quando há conflito entre membro e extension de mesma assinatura, o <strong>membro vence</strong>. Por isso extensions são seguras: nunca quebram o comportamento existente.</p>
<pre><code class="language-kotlin">class Foo {
    fun greet() = "member"
}
fun Foo.greet() = "extension"

Foo().greet()   // "member"</code></pre>

<h2>Escopo</h2>
<ul>
  <li><strong>Top-level</strong> — disponíveis após import; o caso mais comum.</li>
  <li><strong>Dentro de classe</strong> — disponíveis apenas no escopo dessa classe; útil para DSLs.</li>
  <li><strong>Locais</strong> — dentro de uma função, raramente úteis.</li>
</ul>

<h2>Quando usar</h2>
<ul>
  <li>Adicionar utilitários a classes que você não controla (Java stdlib, libs externas).</li>
  <li>Construir <strong>DSLs</strong> fluentes (Gradle DSL, HTML DSL, mocking libs).</li>
  <li>Ações específicas de domínio em tipos genéricos (<code>List&lt;Order&gt;.totalRevenue()</code>).</li>
  <li>Reduzir indentação de chamadas encadeadas.</li>
  <li>Type-safe builders combinados com lambdas com receiver.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Não são polimórficas</strong> — não use para sobrescrever comportamento.</li>
  <li>Cada extension precisa ser importada explicitamente; cuide da poluição de namespace.</li>
  <li>Não acessam membros <code>private</code> do receiver.</li>
  <li>Em Java, viram métodos estáticos com nome estranho — limita interop.</li>
  <li>Evite extensions sobre <code>Any?</code> — aparecem em todo lugar e confundem o autocomplete.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Padrão útil</div><div>Crie um arquivo <code>Extensions.kt</code> por contexto (ex: <code>StringExt.kt</code>, <code>FlowExt.kt</code>) e mantenha extensions agrupadas por receiver. Facilita descoberta e remoção de mortos.</div></div>

<div class="callout callout-info"><div class="callout-title">Lambdas com receiver</div><div>Combinando extension + lambda você consegue DSLs como <code>html { body { p { +"texto" } } }</code>. É o segredo do Compose: <code>Modifier.padding(8.dp).clickable { ... }</code>.</div></div>
`}} />
    </article>
  );
}

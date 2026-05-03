export default function HigherOrder() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Sintaxe e tipos · intermediario · 9 min</div>
      <h1>Higher-order functions</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Higher-order functions (HOFs) são funções que recebem outras funções como parâmetro ou as devolvem como resultado. Em Kotlin elas são cidadãs de primeira classe e a base de toda API funcional — de <code>map</code>/<code>filter</code> a DSLs como Ktor e Compose.</p>

<h2>Conceito</h2>
<p>Toda lambda em Kotlin tem um tipo de função: <code>(Int, Int) -&gt; Int</code>, <code>() -&gt; Unit</code>, <code>String.() -&gt; Boolean</code>. Por baixo dos panos, o compilador gera classes que implementam <code>Function0</code>, <code>Function1</code>, ..., <code>Function22</code>. Use <code>inline fun</code> para evitar a alocação dessas classes em hot paths.</p>
<pre><code class="language-kotlin">fun calcular(a: Int, b: Int, op: (Int, Int) -&gt; Int): Int = op(a, b)

val soma = calcular(2, 3) { x, y -&gt; x + y }
val mult = calcular(2, 3, Int::times)
</code></pre>

<h2>Funções que retornam funções</h2>
<pre><code class="language-kotlin">fun multiplicador(fator: Int): (Int) -&gt; Int = { it * fator }

val dobro = multiplicador(2)
val triplo = multiplicador(3)
println(dobro(10))  // 20
println(triplo(10)) // 30
</code></pre>

<h2>Currying via lambdas</h2>
<p>Kotlin não tem currying nativo, mas você o simula com lambdas aninhadas:</p>
<pre><code class="language-kotlin">fun soma(a: Int): (Int) -&gt; (Int) -&gt; Int = { b -&gt; { c -&gt; a + b + c } }

val r = soma(1)(2)(3) // 6
</code></pre>

<h2>Composição</h2>
<pre><code class="language-kotlin">infix fun &lt;A, B, C&gt; ((B) -&gt; C).compose(f: (A) -&gt; B): (A) -&gt; C = { a -&gt; this(f(a)) }

val parseAndDouble = { s: String -&gt; s.toInt() } compose { s: String -&gt; s.trim() }
val pipe = { x: Int -&gt; x * 2 } compose { x: Int -&gt; x + 1 }
println(pipe(3)) // 8
</code></pre>

<h2>Exemplo prático: pipeline de validação</h2>
<pre><code class="language-kotlin">typealias Validator&lt;T&gt; = (T) -&gt; Result&lt;T&gt;

fun &lt;T&gt; combine(vararg vs: Validator&lt;T&gt;): Validator&lt;T&gt; = { input -&gt;
    vs.fold(Result.success(input)) { acc, v -&gt; acc.mapCatching { v(it).getOrThrow() } }
}

val naoVazio: Validator&lt;String&gt; = { if (it.isNotBlank()) Result.success(it) else Result.failure(IllegalArgumentException("vazio")) }
val curto: Validator&lt;String&gt; = { if (it.length &lt;= 50) Result.success(it) else Result.failure(IllegalArgumentException("longo")) }

val nome = combine(naoVazio, curto)
println(nome("  ").exceptionOrNull()) // vazio
println(nome("Ada").getOrNull())      // Ada
</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Encapsular comportamento variável: estratégias, callbacks, hooks.</li>
  <li>Construir DSLs com <code>block: T.() -&gt; Unit</code>.</li>
  <li>Pipelines de transformação (validação, parsing, ETL).</li>
  <li>Inversão de controle: o framework chama seu código.</li>
  <li>Lazy evaluation com <code>() -&gt; T</code> para adiar custo.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Lambdas capturam variáveis do escopo — cuidado com closures sobre mutáveis em coroutines.</li>
  <li>Cada lambda não-inline aloca um objeto; em loops apertados use <code>inline fun</code>.</li>
  <li>Referências de função (<code>::foo</code>) também alocam, mas são reutilizadas.</li>
  <li><code>noinline</code> e <code>crossinline</code> existem por bons motivos — leia a doc antes de inlinar tudo.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Inline para zero overhead</div><div>Funções como <code>map</code>, <code>filter</code> e <code>let</code> são <code>inline</code>: a lambda some em tempo de compilação. Replique o padrão em sua API quando a lambda é pequena e usada com frequência.</div></div>
`}} />
    </article>
  );
}

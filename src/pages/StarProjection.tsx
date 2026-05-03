export default function StarProjection() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Generics e reflexão · avancado · 7 min</div>
      <h1>Star projection &lt;*&gt;</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>A projeção estrela <code>&lt;*&gt;</code> existe para quando você precisa lidar com um tipo genérico cujos parâmetros são <strong>desconhecidos mas seguros</strong>. É a forma type-safe de dizer "uma lista de algo, não importa o quê".</p>

<h2>Conceito</h2>
<p>Para um tipo <code>Foo&lt;out T : TUpper&gt;</code>, <code>Foo&lt;*&gt;</code> equivale a <code>Foo&lt;out TUpper&gt;</code>. Para <code>Foo&lt;in T&gt;</code>, equivale a <code>Foo&lt;in Nothing&gt;</code>. O resultado é que você pode <strong>ler</strong> com segurança como o tipo upper bound, mas <strong>não pode escrever</strong> nada (exceto <code>null</code> em casos in).</p>
<pre><code class="language-kotlin">val anyList: List&lt;*&gt; = listOf(1, "x", true)

for (item in anyList) {
    // item: Any?
    println(item)
}

// anyList.add(42)   // erro: write não permitido em &lt;*&gt;</code></pre>

<h2>Comparação com Any?</h2>
<ul>
  <li><code>List&lt;Any?&gt;</code> aceita <strong>qualquer</strong> valor — inclusive escrever via <code>MutableList</code>.</li>
  <li><code>List&lt;*&gt;</code> é uma view <strong>somente leitura</strong> sobre uma lista cujo tipo real você não conhece.</li>
  <li><code>List&lt;Any&gt;</code> é uma lista de não-nulos; <code>List&lt;String&gt;</code> não é subtipo de <code>List&lt;Any&gt;</code>... espera, é, porque <code>List</code> é covariante.</li>
</ul>
<pre><code class="language-kotlin">fun printAll(list: List&lt;*&gt;) = list.forEach(::println)

printAll(listOf(1, 2, 3))
printAll(listOf("a", "b"))
printAll(listOf&lt;Pessoa&gt;())</code></pre>

<h2>Exemplo prático: cache genérico</h2>
<pre><code class="language-kotlin">class Cache&lt;K, V&gt; {
    private val map = mutableMapOf&lt;K, V&gt;()
    fun put(k: K, v: V) { map[k] = v }
    fun get(k: K): V? = map[k]
    val size: Int get() = map.size
}

// Função que aceita qualquer Cache, sem se importar com tipos
fun reportSizes(caches: List&lt;Cache&lt;*, *&gt;&gt;) {
    caches.forEach { println("size=\${it.size}") }
}</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Funções utilitárias que só precisam ler ou inspecionar coleções.</li>
  <li>Heterogêneo: <code>List&lt;Pair&lt;*, *&gt;&gt;</code> para coleções mistas.</li>
  <li>Reflexão: APIs que devolvem <code>KClass&lt;*&gt;</code>.</li>
  <li>Quando você teria que adicionar um type parameter "fantasma" só para passar adiante.</li>
  <li>Em type checks com <code>is</code>: <code>x is List&lt;*&gt;</code> compila; <code>x is List&lt;String&gt;</code> não (erasure).</li>
</ul>

<h2>Exemplo com is</h2>
<pre><code class="language-kotlin">fun describe(x: Any) = when (x) {
    is List&lt;*&gt; -&gt; "lista com \${x.size} itens"
    is Map&lt;*, *&gt; -&gt; "mapa com \${x.size} entradas"
    is Set&lt;*&gt; -&gt; "set"
    else -&gt; "outro: \${x::class.simpleName}"
}</code></pre>

<h2>Pegadinhas</h2>
<ul>
  <li>Não confunda <code>List&lt;*&gt;</code> com <code>List&lt;Any?&gt;</code> — o primeiro é read-only sobre tipo desconhecido, o segundo é mutável de Any?.</li>
  <li>Em interfaces invariantes (<code>MutableList&lt;*&gt;</code>), você só lê como <code>Any?</code> e escrever só aceita <code>null</code>.</li>
  <li>Não use star projection só para "evitar" especificar um tipo — perde-se segurança e checagens.</li>
  <li>Em interop com Java, raw types viram <code>Foo&lt;*&gt;</code>.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Resumo prático</div><div>Use <code>&lt;*&gt;</code> quando você "precisa do recipiente, mas não dos detalhes". Para todo o resto, especifique o tipo ou use <code>reified</code> em funções inline.</div></div>
`}} />
    </article>
  );
}

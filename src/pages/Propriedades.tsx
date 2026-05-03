export default function Propriedades() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Orientação a objetos · iniciante · 10 min</div>
      <h1>Propriedades e backing field</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Em Kotlin, propriedades não são "atributos com getter/setter manual" como em Java — elas são primeiras classes da linguagem. O compilador gera os acessores; você só interfere quando precisa de comportamento custom. Entender <code>field</code>, <code>lateinit</code> e <code>by lazy</code> é essencial para modelar estado corretamente.</p>

<h2>Conceito</h2>
<p>Toda propriedade tem um <strong>getter</strong> (sempre) e, se for <code>var</code>, também um <strong>setter</strong>. O <em>backing field</em> (palavra-chave <code>field</code>) só existe quando o getter/setter custom o referencia.</p>
<pre><code class="language-kotlin">class Pessoa(nome: String) {
    var nome: String = nome
        get() = field.uppercase()
        set(value) {
            require(value.isNotBlank()) { "nome vazio" }
            field = value.trim()
        }
}</code></pre>

<h2>Sem backing field</h2>
<p>Propriedades computadas não precisam de campo: o getter retorna um valor derivado.</p>
<pre><code class="language-kotlin">class Retangulo(val largura: Int, val altura: Int) {
    val area: Int get() = largura * altura
    val ehQuadrado: Boolean get() = largura == altura
}</code></pre>

<h2>Exemplo prático: lateinit</h2>
<p><code>lateinit</code> adia a inicialização de uma <code>var</code> não-nula. Útil em DI, setUp de testes e injeções de Activity/Fragment Android.</p>
<pre><code class="language-kotlin">class UserService {
    lateinit var repository: UserRepository

    fun init(repo: UserRepository) { repository = repo }

    fun load(id: Long) =
        if (::repository.isInitialized) repository.findById(id) else null
}</code></pre>

<div class="callout callout-warn"><div class="callout-title">Limitações de lateinit</div><div>Só funciona em <code>var</code>, com tipos não-nulos e não-primitivos. Acessar antes de inicializar lança <code>UninitializedPropertyAccessException</code>.</div></div>

<h2>by lazy</h2>
<p><code>by lazy</code> calcula o valor na primeira leitura e cacheia. Por padrão é thread-safe (modo SYNCHRONIZED).</p>
<pre><code class="language-kotlin">class Config(private val path: String) {
    val parsed: Map&lt;String, String&gt; by lazy {
        println("parseando uma vez")
        path.toFile().readLines().associate { line -&gt;
            val (k, v) = line.split("=", limit = 2)
            k.trim() to v.trim()
        }
    }
}</code></pre>

<h2>Delegated properties: observable e vetoable</h2>
<pre><code class="language-kotlin">import kotlin.properties.Delegates

class Contador {
    var valor: Int by Delegates.observable(0) { _, old, new -&gt;
        println("\\$old -&gt; \\$new")
    }

    var limite: Int by Delegates.vetoable(10) { _, _, new -&gt;
        new in 0..100   // só aceita se passar
    }
}</code></pre>

<h2>Quando usar cada um</h2>
<ul>
  <li><strong>val computado</strong>: valor derivado barato de calcular.</li>
  <li><strong>by lazy</strong>: cálculo caro que pode nem ser necessário.</li>
  <li><strong>lateinit</strong>: dependências injetadas após o construtor (DI, testes).</li>
  <li><strong>observable</strong>: notificar mudança (UI binding, métricas).</li>
  <li><strong>vetoable</strong>: validação que pode rejeitar a alteração.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
  <li>Prefira <code>val</code> sempre que possível — imutabilidade reduz bugs.</li>
  <li>Não exponha <code>MutableList</code> publicamente; use a propriedade pública <code>List</code> + <code>private</code> mutável (backing property).</li>
  <li>Evite lógica pesada no getter — chamadores assumem custo O(1).</li>
  <li>Documente efeitos colaterais de setters custom.</li>
</ul>

<pre><code class="language-kotlin">class Carrinho {
    private val _items = mutableListOf&lt;String&gt;()
    val items: List&lt;String&gt; get() = _items   // backing property pattern

    fun add(s: String) { _items += s }
}</code></pre>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Use <code>by lazy(LazyThreadSafetyMode.NONE)</code> quando você tem certeza de uso single-thread (e.g., UI thread Android) — evita custo de sincronização.</div></div>
`}} />
    </article>
  );
}

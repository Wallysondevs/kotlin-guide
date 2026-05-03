export default function Construtores() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Orientação a objetos · iniciante · 10 min</div>
      <h1>Construtores</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Em Kotlin, a maioria das classes tem um <strong>primary constructor</strong> declarado direto no cabeçalho da classe. Construtores secundários e blocos <code>init</code> existem, mas são exceção, não regra. Entender a ordem em que tudo isso roda é essencial para evitar bugs sutis de inicialização.</p>

<h2>Conceito</h2>
<p>O primary constructor fica entre parênteses logo após o nome da classe. Se você anotar parâmetros com <code>val</code> ou <code>var</code>, eles viram propriedades automaticamente.</p>
<pre><code class="language-kotlin">class Usuario(val nome: String, var idade: Int)

// Equivalente verboso (Java-style)
class UsuarioVerbose(nome: String, idade: Int) {
    val nome: String = nome
    var idade: Int = idade
}
</code></pre>
<p>Blocos <code>init</code> rodam na ordem em que aparecem, intercalados com inicializadores de propriedade.</p>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">class Pedido(
    val id: Long,
    val itens: List&lt;Item&gt;,
    val cliente: String,
) {
    val total: Double = itens.sumOf { it.preco }

    init {
        require(id &gt; 0) { "id deve ser positivo" }
        require(itens.isNotEmpty()) { "pedido vazio" }
        println("Pedido \${id} criado com \${itens.size} itens")
    }

    // Construtor secundário: precisa delegar ao primary com this(...)
    constructor(id: Long, item: Item, cliente: String)
        : this(id, listOf(item), cliente)
}

data class Item(val sku: String, val preco: Double)

fun main() {
    val p = Pedido(1, Item("A", 10.0), "Ana")
    println("total = \${p.total}")
}
</code></pre>

<h2>Quando usar cada forma</h2>
<ul>
<li><strong>Primary constructor com val/var:</strong> caso padrão; data classes e DTOs.</li>
<li><strong>Bloco init:</strong> validações com <code>require</code>/<code>check</code>, ou para inicializar campos derivados de múltiplos parâmetros.</li>
<li><strong>Construtor secundário:</strong> apenas quando precisa interoperar com Java ou oferecer overloads que não cabem em <em>default arguments</em>.</li>
<li><strong>Sem construtor declarado:</strong> Kotlin gera um construtor sem argumentos automaticamente (apenas se nenhum outro for declarado).</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>A ordem de execução é: parâmetros do primary → inicializadores de propriedade e blocos <code>init</code> na ordem do código → corpo do construtor secundário.</li>
<li>Construtor secundário <strong>obrigatoriamente</strong> delega ao primary via <code>this(...)</code> (se houver primary).</li>
<li>Não chame métodos <code>open</code> dentro de <code>init</code> — subclasses ainda não inicializaram seus campos.</li>
<li>Para construir objetos imutáveis com muitas combinações, prefira <em>default arguments</em> ou padrão Builder em vez de N construtores secundários.</li>
<li>Anotações no primary constructor exigem a palavra-chave <code>constructor</code>: <code>class A @Inject constructor(val x: X)</code>.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Info</div><div>Use <code>require(cond)</code> para validar argumentos (lança <code>IllegalArgumentException</code>) e <code>check(cond)</code> para validar estado (lança <code>IllegalStateException</code>).</div></div>
`}} />
    </article>
  );
}

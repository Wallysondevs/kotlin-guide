export default function Interfaces() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Orientação a objetos · iniciante · 9 min</div>
      <h1>Interfaces</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Interfaces em Kotlin descrevem contratos sem estado próprio. Elas suportam métodos com implementação default, propriedades abstratas e herança múltipla — o suficiente para resolver muitos problemas que em Java exigiriam classes abstratas.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">interface Repositorio&lt;T&gt; {
    val nome: String                       // propriedade abstrata
    fun buscar(id: Long): T?
    fun salvar(item: T)
    fun listar(): List&lt;T&gt; = emptyList()    // método default
}
</code></pre>

<p>Interfaces não podem guardar estado (sem <code>field</code>), mas propriedades podem ter getters customizados:</p>
<pre><code class="language-kotlin">interface Identificavel {
    val id: Long
    val tag: String get() = "obj-\\$id"
}
</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">interface Voador { fun voar() = println("voando") }
interface Nadador { fun nadar() = println("nadando") }

class Pato : Voador, Nadador {
    override fun voar() = println("pato decola")
}

fun main() {
    val p = Pato()
    p.voar()   // pato decola
    p.nadar()  // nadando
}
</code></pre>

<h2>Conflitos de herança múltipla</h2>
<p>Quando duas interfaces dão a mesma assinatura com defaults diferentes, o compilador exige que você resolva via <code>super&lt;T&gt;</code>:</p>
<pre><code class="language-kotlin">interface A { fun saudar() = println("oi A") }
interface B { fun saudar() = println("oi B") }

class C : A, B {
    override fun saudar() {
        super&lt;A&gt;.saudar()
        super&lt;B&gt;.saudar()
    }
}
</code></pre>

<h2>Interfaces funcionais (SAM)</h2>
<p>Use <code>fun interface</code> para interfaces de método único, ganhando conversão SAM com lambdas:</p>
<pre><code class="language-kotlin">fun interface Predicado&lt;T&gt; {
    fun test(t: T): Boolean
}

val maiorQueZero = Predicado&lt;Int&gt; { it &gt; 0 }
println(maiorQueZero.test(5))
</code></pre>

<h2>Quando usar interfaces vs classes abstratas</h2>
<ul>
  <li>Use <strong>interface</strong> para contratos puros sem estado.</li>
  <li>Use <strong>interface</strong> quando precisar de "herança múltipla" de comportamento.</li>
  <li>Use <strong>abstract class</strong> quando precisar de campos (<code>val</code>/<code>var</code> com backing field) ou construtores.</li>
  <li>Prefira <strong>fun interface</strong> a typealias de função se quiser nomes claros e overloading.</li>
  <li>Sealed interfaces para restringir implementações ao mesmo módulo.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Métodos default em interface viram <code>static</code> no bytecode JVM até <code>-jvm-target 1.8</code>; configure <code>-Xjvm-default=all</code> em libs públicas.</li>
  <li>Não dá para definir <code>init</code> nem construtor em interface.</li>
  <li>Evite hierarquias profundas — composição com interfaces pequenas é quase sempre melhor.</li>
  <li>Conflitos silenciosos só aparecem em runtime se você ignorar warnings; não ignore.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Sealed interfaces</div><div>Desde Kotlin 1.5, <code>sealed interface</code> permite hierarquias fechadas com herança múltipla — perfeito para ADTs como <code>Result</code> ou <code>Event</code>.</div></div>
`}} />
    </article>
  );
}

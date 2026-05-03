export default function Heranca() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Orientação a objetos · iniciante · 9 min</div>
      <h1>Herança</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Em Kotlin, classes e métodos são <strong>final por padrão</strong>. Para permitir herança ou override você precisa marcar explicitamente com <code>open</code>. Essa decisão de design força você a desenhar herança intencionalmente, evitando o "fragile base class problem" do Java.</p>

<h2>Conceito</h2>
<p>Toda classe Kotlin estende <code>Any</code> (equivalente a <code>java.lang.Object</code>) implicitamente. Para herdar de outra classe, use <code>:</code> seguido da chamada do construtor da superclasse.</p>
<pre><code class="language-kotlin">open class Animal(val nome: String) {
    open fun som(): String = "..."
    fun apresentar() = "Sou \$nome e faço \${som()}"
}

class Cachorro(nome: String) : Animal(nome) {
    override fun som() = "auau"
}

class Gato(nome: String) : Animal(nome) {
    override fun som() = "miau"
}

fun main() {
    val animais: List&lt;Animal&gt; = listOf(Cachorro("Rex"), Gato("Mia"))
    animais.forEach { println(it.apresentar()) }
}</code></pre>

<p>Sem <code>open</code> na classe base, <code>class Cachorro : Animal()</code> não compila. Sem <code>open</code> no método, <code>override fun som()</code> também não compila.</p>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">abstract class Forma {
    abstract fun area(): Double
    abstract fun perimetro(): Double
    open fun descricao(): String = "Forma com área \${area()}"
}

class Retangulo(val largura: Double, val altura: Double) : Forma() {
    override fun area() = largura * altura
    override fun perimetro() = 2 * (largura + altura)
    override fun descricao() = "Retângulo \${largura}x\${altura}: " + super.descricao()
}

class Circulo(val raio: Double) : Forma() {
    override fun area() = Math.PI * raio * raio
    override fun perimetro() = 2 * Math.PI * raio
}

fun main() {
    val formas: List&lt;Forma&gt; = listOf(Retangulo(3.0, 4.0), Circulo(5.0))
    formas.forEach { println(it.descricao()) }
}</code></pre>

<h2>abstract, super e final</h2>
<p><code>abstract</code> implica <code>open</code> e exige que subclasses implementem o membro. Use <code>super</code> para chamar a versão da superclasse. Para <strong>fechar</strong> um override em subclasse intermediária, prefixe com <code>final</code>.</p>
<pre><code class="language-kotlin">open class Base {
    open fun hook() = println("base")
}

open class Meio : Base() {
    final override fun hook() = println("meio (não pode mais ser override)")
}

class Folha : Meio() {
    // override fun hook() ...   // erro: foi marcada final
}</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Hierarquias de domínio com comportamento compartilhado claro (ex.: <code>Forma</code>, <code>Pagamento</code>).</li>
  <li>Frameworks que esperam você estender uma classe abstrata (ex.: <code>AbstractController</code>).</li>
  <li>Quando a relação é genuinamente "é-um" e o invariante da base se mantém na subclasse (Liskov).</li>
  <li>Para variantes fechadas conhecidas, prefira <code>sealed class</code> (controle de exhaustiveness em <code>when</code>).</li>
  <li>Para reuso de comportamento sem hierarquia, prefira <strong>composição</strong> ou interfaces com default methods.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Esquecer <code>open</code> e levar erro críptico de compilação — leia "is final and cannot be overridden".</li>
  <li>Chamar métodos <code>open</code> dentro do construtor da base: a subclasse ainda não inicializou suas <code>val</code>s, NPEs aparecem.</li>
  <li>Sobrescrever propriedades exige tipo compatível e o mesmo modificador (<code>val</code> pode virar <code>var</code> mas não o contrário).</li>
  <li>Misturar herança profunda (3+ níveis) gera código difícil de testar — refatore para composição.</li>
  <li>Em interop com Java, lembre-se: classes Kotlin são final por padrão; bibliotecas Java podem precisar de plugin <code>all-open</code> (ex.: Spring, JPA).</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Filosofia "final por padrão"</div><div>Effective Java (Bloch) recomenda "design and document for inheritance, or else prohibit it". Kotlin codifica essa recomendação no compilador.</div></div>

<div class="callout callout-tip"><div class="callout-title">Plugin all-open</div><div>Para projetos Spring use <code>kotlin-spring</code> (que inclui <code>all-open</code>) — ele torna automaticamente <code>open</code> classes anotadas com <code>@Component</code>, <code>@Service</code>, <code>@Configuration</code>, etc.</div></div>
`}} />
    </article>
  );
}

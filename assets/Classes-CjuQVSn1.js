import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function s(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Orientação a objetos · iniciante · 9 min"}),e.jsx("h1",{children:"Classes"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Classes em Kotlin parecem familiares para quem vem de Java, mas há diferenças sutis com grandes consequências: tudo é <strong>public e final por padrão</strong>, não existe <code>new</code>, e o construtor primário fica na própria assinatura da classe. Esses defaults empurram para um design mais explícito e seguro.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">class Pessoa(val nome: String, var idade: Int) {
    fun aniversario() { idade++ }
}

val p = Pessoa("Ana", 30)   // sem 'new'
p.aniversario()
println(p.nome)             // 'val' gera só getter
println(p.idade)            // 'var' gera getter + setter</code></pre>
<p>Visibilidade: <code>public</code> (padrão), <code>internal</code> (módulo Gradle), <code>protected</code> (subclasses), <code>private</code> (arquivo ou classe).</p>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">class ContaBancaria(
    val titular: String,
    saldoInicial: Double = 0.0
) {
    var saldo: Double = saldoInicial
        private set                  // só a classe pode escrever

    init {
        require(saldoInicial &gt;= 0) { "Saldo inicial não pode ser negativo" }
    }

    fun depositar(valor: Double) {
        require(valor &gt; 0) { "Valor deve ser positivo" }
        saldo += valor
    }

    fun sacar(valor: Double): Boolean {
        if (valor &gt; saldo) return false
        saldo -= valor
        return true
    }
}

val c = ContaBancaria("Ana", 100.0)
c.depositar(50.0)
println(c.saldo)            // 150.0
// c.saldo = 999.0          // erro: setter privado</code></pre>

<h2>Construtores secundários</h2>
<pre><code class="language-kotlin">class Ponto(val x: Int, val y: Int) {
    constructor(par: Pair&lt;Int, Int&gt;) : this(par.first, par.second)
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Modelos de domínio com invariantes (use <code>init</code> + <code>require</code>).</li>
<li>Encapsulamento de estado mutável com setter privado.</li>
<li>Quando precisar de comportamento, não só dados — para puro DTO use <code>data class</code>.</li>
<li>Hierarquias controladas com <code>sealed class</code> em vez de <code>open</code> aberto.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><strong>Final por padrão:</strong> para herdar, marque a classe como <code>open</code> e o método também. Isso protege contra herança acidental.</li>
<li>Frameworks que dependem de proxies (Spring, Hibernate) exigem <code>open</code> — use os plugins <code>kotlin-spring</code>/<code>kotlin-jpa</code> que abrem automaticamente.</li>
<li>Não confunda <code>val</code> com imutabilidade profunda: <code>val lista = mutableListOf(1)</code> ainda permite <code>lista.add(2)</code>.</li>
<li>Construtor primário não tem corpo — lógica vai em blocos <code>init</code>, executados na ordem em que aparecem.</li>
<li>Evite expor <code>var</code> público; prefira <code>val</code> + métodos de mutação controlada.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Sem <code>new</code></div><div>Kotlin abandonou <code>new</code> porque construir um objeto é apenas chamar uma função. Isso uniformiza factories e construtores e elimina ruído sintático.</div></div>

<div class="callout callout-warn"><div class="callout-title">Cuidado com herança</div><div>Antes de marcar uma classe como <code>open</code>, considere composição ou interfaces. Herança é um contrato forte e difícil de evoluir.</div></div>
`}})]})}export{s as default};

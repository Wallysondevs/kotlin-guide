import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function t(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Orientação a objetos · iniciante · 7 min"}),e.jsx("h1",{children:"Classes abstratas"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`<p>Classes abstratas em Kotlin são marcadas com <code>abstract</code> e servem como base parcial para hierarquias: contêm estado, construtores e podem mesclar membros concretos com membros <code>abstract</code> (sem implementação) que subclasses devem prover.</p>

<h2>Conceito</h2>
<p>Diferente de classes normais (que são <code>final</code> por padrão em Kotlin), classes abstratas são <strong>sempre abertas</strong> à herança. Seus membros abstratos não precisam de <code>open</code> — são abertos por definição.</p>
<pre><code class="language-kotlin">abstract class Forma(val nome: String) {
    abstract fun area(): Double                // sem corpo
    open fun descricao(): String = "$nome com área \${area()}"
}

class Circulo(val raio: Double) : Forma("círculo") {
    override fun area() = Math.PI * raio * raio
}

class Quadrado(val lado: Double) : Forma("quadrado") {
    override fun area() = lado * lado
    override fun descricao() = "Quadrado de lado $lado"
}</code></pre>

<h2>Exemplo prático</h2>
<p>Hierarquia de processadores de pagamento, onde a base abstrai validação comum e exige que subclasses implementem o transporte específico.</p>
<pre><code class="language-kotlin">abstract class ProcessadorPagamento(val nomeGateway: String) {

    fun cobrar(valor: Double, cartao: String): Resultado {
        require(valor &gt; 0) { "valor deve ser positivo" }
        require(cartao.length in 13..19) { "cartão inválido" }
        return executar(valor, cartao)
    }

    protected abstract fun executar(valor: Double, cartao: String): Resultado

    open fun moedaPadrao(): String = "BRL"
}

data class Resultado(val ok: Boolean, val id: String? = null)

class StripeProcessor : ProcessadorPagamento("Stripe") {
    override fun executar(valor: Double, cartao: String): Resultado {
        // chamada HTTP real iria aqui
        return Resultado(true, "ch_\${(0..9999).random()}")
    }
}

fun main() {
    val r = StripeProcessor().cobrar(100.0, "4242424242424242")
    println(r)
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Template Method: a base define o algoritmo, subclasses preenchem passos.</li>
<li>Compartilhar estado mutável (campos) entre subclasses — interfaces não permitem isso.</li>
<li>Quando há um construtor primário com parâmetros obrigatórios.</li>
<li>Bases de framework: <code>AbstractController</code>, <code>AbstractRepository</code>.</li>
</ul>

<h2>Abstrata vs interface</h2>
<ul>
<li><strong>Interface</strong>: múltipla herança de comportamento, sem estado mutável (apenas <code>val</code> abstratos).</li>
<li><strong>Abstrata</strong>: herança única, pode ter <code>var</code>, construtores, blocos <code>init</code>.</li>
<li>Prefira interfaces + extensão para composição; use abstrata quando precisa <em>compartilhar implementação</em> com estado.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">sealed vs abstract</div><div>Se a hierarquia é <em>fechada</em> (você conhece todas as subclasses no compile-time), prefira <code>sealed class</code> — habilita <code>when</code> exaustivo e modela <em>algebraic data types</em>.</div></div>

<h2>Pegadinhas</h2>
<ul>
<li>Não dá para instanciar diretamente: <code>Forma("x")</code> não compila.</li>
<li>Membros <code>abstract</code> não podem ter <code>private</code> — subclasses precisam vê-los.</li>
<li>Métodos concretos em classe abstrata <strong>não</strong> são <code>open</code> automaticamente — adicione <code>open</code> se subclasses devem sobrescrever.</li>
<li>Cuidado ao chamar métodos <code>open</code> dentro do construtor: a subclasse ainda não terminou a inicialização.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Construtor secundário</div><div>Use <code>: super(...)</code> ou <code>: this(...)</code> para delegar. Em classe abstrata, isso permite múltiplas formas de criação preservando invariantes.</div></div>`}})]})}export{t as default};

import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function l(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Sintaxe e tipos · iniciante · 7 min"}),e.jsx("h1",{children:"val vs var"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Em Kotlin, toda declaração de variável começa com <code>val</code> ou <code>var</code>. A escolha entre as duas é a primeira decisão de design de cada linha que você escreve: <strong>imutabilidade por padrão</strong> é uma das filosofias centrais da linguagem e impacta diretamente legibilidade, concorrência e testabilidade.</p>

<h2>Conceito</h2>
<p><code>val</code> (de <em>value</em>) declara uma referência <strong>somente-leitura</strong>: depois de inicializada, ela não pode apontar para outro objeto. <code>var</code> (de <em>variable</em>) declara uma referência reatribuível. Note que <code>val</code> não significa "objeto imutável" — significa apenas que a <em>referência</em> é fixa.</p>
<pre><code class="language-kotlin">val nome: String = "Ana"
var idade: Int = 30

idade = 31         // ok
// nome = "Bia"    // erro de compilação</code></pre>

<p>O compilador faz <strong>inferência de tipos</strong>, então o tipo explícito quase sempre é opcional. Use anotação explícita em APIs públicas (top-level, propriedades de classe pública) para deixar o contrato claro.</p>
<pre><code class="language-kotlin">val pi = 3.14159          // Double inferido
val ids = listOf(1, 2, 3) // List&lt;Int&gt; inferido

// API pública: seja explícito
val MAX_RETRIES: Int = 5</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">class Carrinho {
    private val itens = mutableListOf&lt;String&gt;()  // val + coleção mutável: ok
    var desconto: Double = 0.0
        private set                                // setter privado

    fun adicionar(item: String) {
        itens += item
    }

    fun total(): Int = itens.size
}

fun main() {
    val c = Carrinho()
    c.adicionar("café")
    c.adicionar("pão")
    println("itens=\${c.total()} desconto=\${c.desconto}")
}</code></pre>

<h2>Top-level, lateinit e by lazy</h2>
<p>Variáveis podem viver no <strong>top-level</strong> de um arquivo (sem classe envolvente). Para campos não-nuláveis que serão preenchidos depois (DI, setUp de teste), use <code>lateinit var</code>. Para inicialização preguiçosa thread-safe, use <code>val ... by lazy</code>.</p>
<pre><code class="language-kotlin">// arquivo Config.kt
const val APP_NAME = "Loja"           // const val: literal em compile-time
val logger = LoggerFactory.getLogger("app")

class UserService {
    lateinit var repo: UserRepository  // injetado depois
}

val cacheGrande: Map&lt;String, Pessoa&gt; by lazy {
    carregarDoDisco()                  // só roda na primeira leitura
}</code></pre>

<h2>Quando usar</h2>
<ul>
  <li><strong>val por padrão</strong>: 90% das suas variáveis devem ser <code>val</code>.</li>
  <li><code>var</code> apenas quando há reatribuição genuína (acumuladores, estado de loop manual).</li>
  <li><code>const val</code> para constantes literais conhecidas em compile-time (top-level ou em <code>companion object</code>).</li>
  <li><code>lateinit var</code> para dependências injetadas (Spring, Koin) ou setup de teste.</li>
  <li><code>by lazy</code> para recursos caros, calculados sob demanda.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><code>val</code> não congela o objeto. <code>val lista = mutableListOf(1)</code> ainda permite <code>lista.add(2)</code>.</li>
  <li><code>lateinit</code> só funciona com tipos não-nuláveis e não-primitivos. Use <code>by Delegates.notNull()</code> para <code>Int</code>/<code>Boolean</code>.</li>
  <li>Acessar <code>lateinit</code> antes de inicializar lança <code>UninitializedPropertyAccessException</code>. Cheque com <code>::prop.isInitialized</code>.</li>
  <li><code>const val</code> só aceita <code>String</code> ou tipos primitivos e precisa estar em <code>object</code>/top-level.</li>
  <li>Reatribuir <code>var</code> dentro de lambdas que cruzam threads pede sincronização — prefira refatorar para <code>val</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Configure o IntelliJ para <em>highlight</em> reatribuições de <code>var</code> em outra cor. Visualizar onde o estado muda costuma revelar refatorações para <code>val</code>.</div></div>

<div class="callout callout-warn"><div class="callout-title">Cuidado</div><div><code>const val</code> é inlined no bytecode dos consumidores. Se você mudar o valor sem recompilar quem depende, eles continuarão usando o valor antigo.</div></div>
`}})]})}export{l as default};

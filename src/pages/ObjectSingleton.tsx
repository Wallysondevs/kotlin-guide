export default function ObjectSingleton() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Orientação a objetos · iniciante · 7 min</div>
      <h1>object e singleton</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>A palavra-chave <code>object</code> em Kotlin cria, em uma única declaração, uma classe e sua única instância. É a forma idiomática (e thread-safe por construção) de implementar singletons, anonymous classes e namespaces de utilidades, sem o boilerplate clássico do padrão em Java.</p>

<h2>Conceito</h2>
<p>Existem três usos principais:</p>
<ul>
  <li><strong>Object declaration</strong> — singleton no top-level ou aninhado.</li>
  <li><strong>Object expression</strong> — instância anônima (substitui <em>anonymous inner class</em> de Java).</li>
  <li><strong>Companion object</strong> — singleton dentro de outra classe (visto em capítulo próprio).</li>
</ul>

<pre><code class="language-kotlin">object ConfigApp {
    const val BASE_URL = "https://api.exemplo.com"
    val timeout = 30L
    fun urlPara(path: String) = "\${BASE_URL}/\${path}"
}

// Uso
val url = ConfigApp.urlPara("usuarios")</code></pre>

<h2>Inicialização e thread-safety</h2>
<p>O Kotlin compila <code>object</code> para uma classe final com instância estática inicializada por <code>&lt;clinit&gt;</code> da JVM, garantindo lazy + thread-safe sem código extra. A primeira referência ao objeto dispara a inicialização.</p>
<pre><code class="language-kotlin">object Cache {
    private val mapa = mutableMapOf&lt;String, String&gt;()
    init {
        println("Cache inicializado")  // executa uma única vez
    }
    fun put(k: String, v: String) { mapa[k] = v }
    fun get(k: String) = mapa[k]
}</code></pre>

<h2>Object expression</h2>
<p>Quando você precisa de uma instância única que implementa uma interface ou estende uma classe, sem dar nome a ela:</p>
<pre><code class="language-kotlin">val listener = object : ClickListener {
    override fun onClick() {
        println("clicou em \${this}")
    }
}

botao.setListener(listener)

// Múltiplas interfaces
val handler = object : Runnable, AutoCloseable {
    override fun run() { /* ... */ }
    override fun close() { /* ... */ }
}</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">interface Logger { fun log(msg: String) }

object ConsoleLogger : Logger {
    private val instante = java.time.Instant.now()
    override fun log(msg: String) {
        println("[\${instante}] \${msg}")
    }
}

object EventBus {
    private val handlers = mutableListOf&lt;(Any) -&gt; Unit&gt;()
    fun subscribe(h: (Any) -&gt; Unit) { handlers += h }
    fun publish(event: Any) = handlers.forEach { it(event) }
}

fun main() {
    EventBus.subscribe { ConsoleLogger.log("evento: \${it}") }
    EventBus.publish("login")
}</code></pre>

<h2>Casos de uso</h2>
<ul>
  <li>Configuração global imutável (constantes, URLs, feature flags).</li>
  <li>Caches in-memory simples e service locators leves.</li>
  <li>Listeners e callbacks anônimos (object expression).</li>
  <li>Implementação de Strategy/State quando há apenas uma instância por estratégia.</li>
  <li>Helpers utilitários (substituem classes <code>Utils</code> com membros estáticos).</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Singleton mutável = estado global</div><div>Manter estado mutável em um <code>object</code> é tentador, mas vira um global escondido. Em apps Android e servidores, prefira injeção de dependência (Koin, Hilt) e mantenha o <code>object</code> apenas para constantes/funções puras.</div></div>

<h2>Pegadinhas e boas práticas</h2>
<ul>
  <li>Object não tem construtor — use bloco <code>init</code> para setup.</li>
  <li>Não pode ser instanciado com <code>new</code> em Java; use <code>NomeObject.INSTANCE</code> ou anote membros com <code>@JvmStatic</code>.</li>
  <li>Em testes, singleton acoplado é difícil de mockar; abstraia para interface e injete.</li>
  <li>Object expression que captura variáveis fora do escopo guarda referência forte — atenção a leaks no Android.</li>
  <li>Evite herança profunda em object expressions; se ficar complexo, vire uma classe nomeada.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">@JvmStatic para Java</div><div>Para chamar <code>NomeObject.metodo()</code> em Java sem o sufixo <code>.INSTANCE</code>, anote os membros com <code>@JvmStatic</code>. Útil em libs com consumidores Java.</div></div>
`}} />
    </article>
  );
}

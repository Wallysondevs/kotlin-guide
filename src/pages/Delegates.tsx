export default function Delegates() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Anotações e DSLs · intermediario · 11 min</div>
      <h1>Property delegates</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Delegação de propriedades permite que a leitura/escrita de uma <code>val</code>/<code>var</code> seja terceirizada para outro objeto. É a infra por trás de <code>by lazy</code>, <code>by Delegates.observable</code>, ViewModels do Android e DSLs como <code>by parser</code>.</p>

<h2>Conceito</h2>
<p>O contrato é simples: o delegate precisa de <code>getValue(thisRef, property)</code> (e <code>setValue</code> para <code>var</code>). O compilador chama esses métodos em cada acesso.</p>
<pre><code class="language-kotlin">import kotlin.properties.Delegates
import kotlin.reflect.KProperty

val pesado: String by lazy {
    println("computando…")
    Thread.sleep(500)
    "pronto"
}

var nome: String by Delegates.observable("?") { _, old, new -&gt;
    println("\\$old -&gt; \\$new")
}</code></pre>

<h2>Exemplo prático — delegate por Map e custom</h2>
<pre><code class="language-kotlin">// 1) by Map: ótimo para parsing de JSON/Properties
class Config(map: Map&lt;String, Any?&gt;) {
    val host: String by map
    val porta: Int    by map
    val ssl: Boolean  by map
}

// 2) Custom delegate com validação
class NonBlank(initial: String) {
    private var value = initial
    operator fun getValue(t: Any?, p: KProperty&lt;*&gt;) = value
    operator fun setValue(t: Any?, p: KProperty&lt;*&gt;, novo: String) {
        require(novo.isNotBlank()) { "\${p.name} não pode ser vazio" }
        value = novo
    }
}

class Usuario {
    var nome: String by NonBlank("anônimo")
}

fun main() {
    val c = Config(mapOf("host" to "api.local", "porta" to 8080, "ssl" to true))
    println(c.host) // api.local

    val u = Usuario()
    u.nome = "Ana"  // ok
    // u.nome = " " // throws IllegalArgumentException
}</code></pre>

<h2>Quando usar</h2>
<ul>
<li><code>by lazy</code>: inicialização tardia thread-safe (default <code>SYNCHRONIZED</code>).</li>
<li><code>Delegates.observable</code>: notificar UI/listeners em mudanças.</li>
<li><code>Delegates.vetoable</code>: rejeitar mudanças baseado em predicado.</li>
<li><code>by Map</code>: prototipagem rápida e bindings dinâmicos.</li>
<li>Custom: regras de negócio reutilizáveis (validação, cache, métricas).</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li><code>lazy(LazyThreadSafetyMode.NONE)</code> em código single-thread reduz overhead.</li>
<li>Para Android, prefira <code>viewModels()</code>, <code>activityViewModels()</code> em vez de inventar delegates próprios.</li>
<li>Custom delegates merecem ser <code>operator</code> e marcados como <code>provideDelegate</code> quando precisam de inicialização baseada na <code>KProperty</code>.</li>
<li>Não exagere: três níveis de delegate viram caixa preta.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">provideDelegate</div><div>Se seu delegate precisa registrar a propriedade (ex.: bindings de UI), implemente <code>operator fun provideDelegate(thisRef, prop)</code> para acessar metadados antes do primeiro <code>getValue</code>.</div></div>

<div class="callout callout-tip"><div class="callout-title">Delegação de classe</div><div>Não confunda com <code>class Foo : Bar by impl</code> — essa é <em>delegação de interface</em>, mecanismo distinto para composição sobre herança.</div></div>
`}} />
    </article>
  );
}

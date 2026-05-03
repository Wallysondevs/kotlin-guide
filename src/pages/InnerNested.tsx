export default function InnerNested() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Orientação a objetos · iniciante · 7 min</div>
      <h1>Inner e nested classes</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Kotlin inverte o default do Java: classes declaradas dentro de outra são <strong>nested</strong> (estáticas) por padrão. Para acessar a instância externa, você precisa marcar explicitamente como <code>inner</code>. Essa distinção evita um dos vazamentos de memória mais comuns no Android.</p>

<h2>Conceito</h2>
<p>Nested classes não carregam referência ao outer; comportam-se como classes top-level. <code>inner</code> classes capturam o outer e podem referenciá-lo via <code>this@Outer</code>.</p>
<pre><code class="language-kotlin">class Outer(val nome: String) {
    class Nested {                 // estática, sem ref ao Outer
        fun ola() = "olá nested"
    }

    inner class Inner {            // captura Outer
        fun ola() = "olá de \${this@Outer.nome}"
    }
}

fun main() {
    println(Outer.Nested().ola())               // chamada sem instância
    println(Outer("Ana").Inner().ola())         // precisa de instância
}
</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">class Cache&lt;K, V&gt;(private val maxSize: Int) {

    // Nested: tipo público auxiliar, sem precisar do estado do Cache
    data class Stats(val hits: Long, val misses: Long)

    // Inner: precisa ler maxSize do outer
    inner class Eviction {
        fun deveDescartar(tamanhoAtual: Int): Boolean =
            tamanhoAtual &gt; this@Cache.maxSize
    }
}

fun main() {
    val c = Cache&lt;String, Int&gt;(maxSize = 100)
    val ev = c.Eviction()
    println(ev.deveDescartar(150))   // true
    println(Cache.Stats(hits = 10, misses = 2))
}
</code></pre>

<h2>Quando usar</h2>
<ul>
<li><strong>Nested:</strong> tipos auxiliares (Stats, Builder, Event) que pertencem semanticamente ao outer mas não dependem do estado dele.</li>
<li><strong>Inner:</strong> raro; só quando a classe interna precisa genuinamente do estado da instância externa (iteradores, listeners ligados ao outer).</li>
<li>Para callbacks no Android, prefira <strong>nested + parâmetro explícito</strong> em vez de <code>inner</code>, para evitar vazar Activity.</li>
<li><code>data class</code>, <code>sealed class</code> e <code>object</code> aninhados quase sempre são nested.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Esquecer <code>inner</code> e tentar acessar campos do outer dá erro de compilação confuso (<em>unresolved reference</em>).</li>
<li><code>inner class</code> não pode ser <code>data</code>.</li>
<li>No Android, <code>inner class Handler</code> mantém referência à Activity → memory leak. Use <code>static</code>/nested + <code>WeakReference</code>.</li>
<li>Para acessar membros de outers aninhados em mais níveis: <code>this@OuterMaisExterna</code>.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Cuidado no Android</div><div>Toda <code>inner class</code> dentro de uma Activity/Fragment vaza o ciclo de vida se for retida (em corrotina, listener, handler). A regra prática: <em>se está em Activity, evite inner</em>.</div></div>
`}} />
    </article>
  );
}

export default function Annotations() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Anotações e DSLs · intermediario · 8 min</div>
      <h1>Annotations</h1>
      <div dangerouslySetInnerHTML={{__html: `<p>Anotações em Kotlin são metadados anexados a declarações (classes, funções, parâmetros, propriedades). Elas são processadas em compile-time (KSP, KAPT, processadores) ou inspecionadas em runtime via reflexão. Em Kotlin para JVM, anotações também controlam a aparência do bytecode visto a partir de Java.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
annotation class Beta(val motivo: String = "API instável")

@Beta(motivo = "endpoint experimental")
fun novaApi() { /* ... */ }</code></pre>

<p>Os <code>Target</code> mais usados: <code>CLASS</code>, <code>FUNCTION</code>, <code>PROPERTY</code>, <code>FIELD</code>, <code>VALUE_PARAMETER</code>, <code>TYPE</code>, <code>FILE</code>, <code>CONSTRUCTOR</code>, <code>EXPRESSION</code>.</p>
<p>As <code>Retention</code>: <code>SOURCE</code> (descartada após compilação), <code>BINARY</code> (no .class, invisível por reflexão), <code>RUNTIME</code> (acessível via reflexão).</p>

<h2>Anotações para interop com Java</h2>
<ul>
<li><code>@JvmStatic</code> em <code>companion object</code> gera método estático real em Java.</li>
<li><code>@JvmField</code> expõe a propriedade como campo público (sem getter/setter).</li>
<li><code>@JvmName("outro")</code> renomeia o método/arquivo no bytecode.</li>
<li><code>@JvmOverloads</code> em construtor/função com defaults gera overloads de cada combinação para Java.</li>
<li><code>@file:JvmName("Utils")</code> dá nome customizado à classe gerada para top-levels do arquivo.</li>
</ul>
<pre><code class="language-kotlin">@file:JvmName("StringUtils")
package util

@JvmOverloads
fun saudar(nome: String, prefixo: String = "Olá"): String = "\$prefixo, \$nome"

class Config {
    companion object {
        @JvmStatic fun load(): Config = Config()
        @JvmField val DEFAULT_PORT = 8080
    }
}</code></pre>

<h2>Exemplo prático: anotação custom + reflexão</h2>
<pre><code class="language-kotlin">@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class Tempo(val nome: String)

class Servico {
    @Tempo("trabalho pesado")
    fun fazer() { Thread.sleep(50) }
}

fun main() {
    val s = Servico()
    s::class.java.declaredMethods.forEach { m -&gt;
        m.getAnnotation(Tempo::class.java)?.let { ann -&gt;
            val ini = System.nanoTime()
            m.invoke(s)
            println("\${ann.nome}: \${(System.nanoTime() - ini) / 1_000_000} ms")
        }
    }
}</code></pre>

<h2>Use-site targets</h2>
<p>Em propriedades (que viram getter+setter+field), você pode escolher onde a anotação cai:</p>
<pre><code class="language-kotlin">class Item(
    @field:Deprecated("use id2")
    val id: String,
    @get:JvmName("nomeReal")
    val nome: String
)</code></pre>
<p>Targets: <code>field</code>, <code>get</code>, <code>set</code>, <code>param</code>, <code>property</code>, <code>receiver</code>, <code>setparam</code>, <code>delegate</code>.</p>

<h2>Casos de uso</h2>
<ul>
<li>Marcadores semânticos: <code>@Beta</code>, <code>@Internal</code>, <code>@RequiresApi(26)</code>.</li>
<li>Configuração de frameworks: <code>@Service</code>, <code>@RestController</code>, <code>@Entity</code>.</li>
<li>Geração de código (KSP): <code>@Serializable</code>, <code>@Parcelize</code>, Room <code>@Dao</code>.</li>
<li>Controle de visibilidade do bytecode para Java.</li>
<li>Validação: Bean Validation (<code>@NotBlank</code>, <code>@Email</code>).</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Sem <code>@Retention(RUNTIME)</code> a reflexão não enxerga a anotação.</li>
<li>KAPT é mais lento e está em manutenção — para projetos novos use <strong>KSP</strong>.</li>
<li>Anotações em propriedades sem use-site target podem cair no lugar inesperado — seja explícito.</li>
<li>Argumentos de anotação só podem ser <em>compile-time constants</em>, classes, enums, ou arrays disso.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">@OptIn</div><div>Anotações marcadas com <code>@RequiresOptIn</code> exigem que o consumidor escreva <code>@OptIn(ApiBeta::class)</code> ou <code>-opt-in=...</code>. É a forma idiomática de marcar APIs experimentais.</div></div>`}} />
    </article>
  );
}

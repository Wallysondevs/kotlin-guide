export default function OQueEKotlin() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Introdução · iniciante · 8 min</div>
      <h1>O que é Kotlin</h1>
      <div dangerouslySetInnerHTML={{__html: `<p>Kotlin é uma linguagem de programação criada pela <strong>JetBrains</strong> em 2011, com versão 1.0 estável em 2016, e adotada oficialmente pelo Google como linguagem preferencial para Android em 2019. É estaticamente tipada, multiplataforma (JVM, Android, JavaScript, Native, Wasm) e foi desenhada para ser <strong>concisa</strong>, <strong>segura</strong> e <strong>100% interoperável com Java</strong>.</p>

<h2>Conceito</h2>
<p>Kotlin compila para bytecode da JVM, JavaScript ou código nativo (LLVM). O compilador <code>kotlinc</code> faz checagens em tempo de compilação que eliminam classes inteiras de bugs comuns em Java — principalmente <code>NullPointerException</code> — através do sistema de tipos <em>nullable</em> embutido na linguagem.</p>
<pre><code class="language-kotlin">fun main() {
    val nome: String = "Kotlin"
    val versao: String? = null   // tipo nullable explícito
    println("Olá, \${nome} \${versao?.length ?: "sem versão"}")
}</code></pre>
<p>O mesmo arquivo roda em servidor (JVM), Android, ou pode ser compilado para iOS via Kotlin Multiplatform.</p>

<h2>Exemplo prático</h2>
<p>Comparativo direto: a mesma classe DTO em Java e em Kotlin.</p>
<pre><code class="language-kotlin">// Kotlin: 1 linha
data class Usuario(val id: Long, val nome: String, val email: String?)

fun main() {
    val u = Usuario(1, "Ana", "ana@exemplo.com")
    val copia = u.copy(email = null)
    println(copia)  // Usuario(id=1, nome=Ana, email=null)
}</code></pre>
<p>Em Java, o equivalente exigiria construtor, getters, <code>equals</code>, <code>hashCode</code>, <code>toString</code> e um método <code>withEmail()</code> — facilmente 40 linhas.</p>

<h2>Casos de uso</h2>
<ul>
<li><strong>Android</strong>: stack oficial moderna (Compose + Coroutines + Hilt).</li>
<li><strong>Backend JVM</strong>: Spring Boot, Ktor, Micronaut, Quarkus — todos com suporte nativo a Kotlin.</li>
<li><strong>Multiplataforma</strong>: compartilhar lógica entre Android, iOS, web e desktop com KMP.</li>
<li><strong>Scripts e ferramentas</strong>: Gradle Kotlin DSL (<code>build.gradle.kts</code>) e <code>.main.kts</code>.</li>
<li><strong>Data/ML</strong>: Kotlin para Apache Spark e notebooks Jupyter.</li>
</ul>

<h2>Por que escolher Kotlin sobre Java</h2>
<ul>
<li><strong>Null safety</strong> embutida no sistema de tipos.</li>
<li><strong>Data classes</strong>, <strong>sealed classes</strong> e <strong>when</strong> exaustivo eliminam boilerplate.</li>
<li><strong>Coroutines</strong> oferecem concorrência estruturada com sintaxe suspend, mais leve que threads.</li>
<li><strong>Extension functions</strong> permitem estender APIs sem herança.</li>
<li><strong>Interop bidirecional</strong>: você pode adotar Kotlin gradualmente em projeto Java existente.</li>
<li>Compilação <em>incremental</em> e <em>K2</em> (Kotlin 2.0) deixaram o build até 2x mais rápido.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Versões atuais</div><div>Kotlin 2.0 estabilizou o compilador K2 (mais rápido, melhor inferência) e tornou estável o <code>data object</code>. Para projetos novos use sempre 2.0+.</div></div>

<h2>Pegadinhas</h2>
<ul>
<li><strong>Stdlib pesa ~1.5 MB</strong>: irrelevante no servidor, mas conta no Android (R8 remove o que não é usado).</li>
<li>Coroutines <em>parecem</em> threads, mas não são — bloquear uma <code>Dispatchers.Default</code> com I/O síncrono mata o pool.</li>
<li><code>val</code> não é imutabilidade profunda: <code>val lista = mutableListOf(1,2)</code> ainda permite <code>lista.add(3)</code>.</li>
<li>Interop com Java exige <code>@JvmStatic</code>, <code>@JvmField</code>, <code>@JvmOverloads</code> em APIs públicas para boa ergonomia do lado Java.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Por onde começar</div><div>Use o <a>play.kotlinlang.org</a> para experimentar sem instalar nada, e instale o IntelliJ IDEA Community para projetos reais — JetBrains mantém ambos.</div></div>`}} />
    </article>
  );
}

import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function t(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Generics e reflexão · avancado · 9 min"}),e.jsx("h1",{children:"kotlin-reflect"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>A biblioteca <code>kotlin-reflect</code> dá acesso a metadados ricos do Kotlin em runtime: classes, funções, propriedades, parâmetros nomeados e default — algo que <code>java.lang.reflect</code> não enxerga. É a base de bibliotecas como kotlinx.serialization, Koin e Spring Kotlin support.</p>

<h2>Conceito</h2>
<p>O ponto de entrada é <code>::class</code>, que devolve um <code>KClass&lt;T&gt;</code>. A partir dele você navega por <code>members</code>, <code>constructors</code>, <code>declaredMemberProperties</code>, etc.</p>
<pre><code class="language-kotlin">import kotlin.reflect.full.*

data class Pessoa(val nome: String, val idade: Int = 0)

fun main() {
    val k = Pessoa::class
    println(k.simpleName)
    k.memberProperties.forEach { println("\${it.name}: \${it.returnType}") }
}
</code></pre>

<h2>Dependência Gradle</h2>
<pre><code class="language-groovy">dependencies {
    implementation(kotlin("reflect"))
}
</code></pre>
<p>Sem essa dep, só funcionam as APIs leves de <code>kotlin.reflect</code> (basicamente <code>::class.simpleName</code>).</p>

<h2>KFunction e callBy</h2>
<pre><code class="language-kotlin">val ctor = Pessoa::class.primaryConstructor!!
val nomeParam = ctor.parameters.first { it.name == "nome" }
val p = ctor.callBy(mapOf(nomeParam to "Ada")) // idade usa default
println(p) // Pessoa(nome=Ada, idade=0)
</code></pre>
<p><code>callBy</code> respeita parâmetros default e nomeados; <code>call</code> é posicional e exige todos.</p>

<h2>KProperty</h2>
<pre><code class="language-kotlin">val pessoa = Pessoa("Ada", 36)
val nome = Pessoa::nome
println(nome.get(pessoa))    // Ada
println(nome.name)            // nome
</code></pre>

<h2>Exemplo prático: serialização toMap</h2>
<pre><code class="language-kotlin">fun Any.toMap(): Map&lt;String, Any?&gt; =
    this::class.memberProperties
        .associate { it.name to (it as kotlin.reflect.KProperty1&lt;Any, *&gt;).get(this) }

println(Pessoa("Ada", 36).toMap())
// {nome=Ada, idade=36}
</code></pre>

<h2>Anotações em runtime</h2>
<pre><code class="language-kotlin">@Target(AnnotationTarget.PROPERTY)
annotation class Coluna(val nome: String)

data class Tabela(@Coluna("user_name") val nome: String)

val ann = Tabela::class.memberProperties.first().findAnnotation&lt;Coluna&gt;()
println(ann?.nome) // user_name
</code></pre>

<h2>Custo runtime</h2>
<ul>
  <li>kotlin-reflect adiciona ~2.5 MB ao classpath.</li>
  <li>A primeira chamada inicializa o runtime de reflexão (centenas de ms).</li>
  <li>Cada acesso reflexivo é ordens de magnitude mais lento que chamada direta.</li>
  <li>Em hot paths, <strong>cache</strong> os <code>KFunction</code>/<code>KProperty</code> resolvidos.</li>
</ul>

<h2>Quando usar</h2>
<ul>
  <li>Frameworks de DI, ORM, serialização.</li>
  <li>Mappers genéricos (DTO ↔ Entity) quando KSP/codegen é overkill.</li>
  <li>Ferramentas de teste e mock.</li>
  <li>CLIs que descobrem comandos via reflexão.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Não funciona em Kotlin/Native ou JS — só JVM.</li>
  <li>R8/ProGuard pode strippar metadados; configure <code>-keep</code> para classes refletidas.</li>
  <li><code>javaClass</code> dá <code>Class&lt;T&gt;</code> Java — perde info de tipos genéricos e nullability Kotlin.</li>
  <li>Em libs públicas, prefira KSP a reflexão para tempo de build, não de runtime.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">KSP &gt; reflection</div><div>Para a maioria dos casos modernos (DI, serialização, validação), <strong>KSP</strong> gera código em build-time, eliminando custo de runtime e tamanho de jar.</div></div>
`}})]})}export{t as default};

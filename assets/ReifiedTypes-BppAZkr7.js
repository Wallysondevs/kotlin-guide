import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function n(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Generics e reflexão · avancado · 8 min"}),e.jsx("h1",{children:"reified types"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Por causa do <strong>type erasure</strong> da JVM, generics são apagados em runtime: <code>List&lt;String&gt;</code> e <code>List&lt;Int&gt;</code> viram apenas <code>List</code>. Kotlin contorna isso com <code>inline</code> + <code>reified</code>: o compilador injeta o tipo concreto no call-site, permitindo <code>T::class</code> em runtime.</p>

<h2>Conceito</h2>
<p>Apenas funções <code>inline</code> podem ter parâmetros de tipo <code>reified</code>. Como o corpo é colado em cada chamada, o compilador sabe qual tipo concreto está sendo usado.</p>
<pre><code class="language-kotlin">inline fun &lt;reified T&gt; tipoDe(): String = T::class.simpleName ?: "?"

println(tipoDe&lt;String&gt;())  // "String"
println(tipoDe&lt;Int&gt;())     // "Int"</code></pre>

<p>Sem <code>reified</code>, isso seria impossível — você teria que receber <code>Class&lt;T&gt;</code> manualmente, como em Java.</p>

<h2>Exemplo prático: parsing JSON</h2>
<pre><code class="language-kotlin">import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue

val mapper = jacksonObjectMapper()

inline fun &lt;reified T&gt; parseJson(json: String): T = mapper.readValue(json)

data class Usuario(val id: Int, val nome: String)

fun main() {
    val u: Usuario = parseJson("""{"id":1,"nome":"Ana"}""")
    val lista: List&lt;Usuario&gt; = parseJson("""[{"id":1,"nome":"Ana"}]""")
    println(u)
    println(lista)
}</code></pre>

<p>Repare na elegância: nem você nem o caller precisaram passar <code>Usuario::class</code> explicitamente. O Kotlin gera o equivalente a <code>mapper.readValue(json, object : TypeReference&lt;Usuario&gt;() {})</code> em cada call-site.</p>

<h2>Cast seguro com reified</h2>
<pre><code class="language-kotlin">inline fun &lt;reified T&gt; Any?.castOrNull(): T? = this as? T

val raw: Any = "olá"
val s: String? = raw.castOrNull()  // "olá"
val n: Int?    = raw.castOrNull()  // null

inline fun &lt;reified T&gt; List&lt;Any&gt;.filterIsInstance(): List&lt;T&gt; =
    this.filter { it is T }.map { it as T }

val mistura = listOf(1, "a", 2, "b", 3.0)
val ints: List&lt;Int&gt; = mistura.filterIsInstance()    // [1, 2]</code></pre>

<h2>Casos comuns</h2>
<ul>
  <li>Wrappers de bibliotecas que pedem <code>Class&lt;T&gt;</code>/<code>TypeReference</code> (Jackson, Gson, kotlinx.serialization, Retrofit).</li>
  <li>Cast checado com sintaxe limpa (<code>obj.castOrNull&lt;Foo&gt;()</code>).</li>
  <li>Dependency Injection manual (<code>val s: UserService = container.get()</code>).</li>
  <li>APIs Android: <code>startActivity&lt;DetailActivity&gt;()</code>, <code>findViewById&lt;TextView&gt;(id)</code> via extensão.</li>
  <li>Builders e DSLs onde o tipo participa da seleção de comportamento.</li>
</ul>

<h2>Exemplo: launcher de Activity (Android)</h2>
<pre><code class="language-kotlin">inline fun &lt;reified A : Activity&gt; Context.startActivity(
    extras: Bundle? = null
) {
    val intent = Intent(this, A::class.java)
    if (extras != null) intent.putExtras(extras)
    startActivity(intent)
}

// uso
context.startActivity&lt;DetailActivity&gt;()</code></pre>

<h2>Pegadinhas</h2>
<ul>
  <li>Funções <code>inline</code> são <strong>copiadas</strong> no call-site. Evite corpos grandes — explode o tamanho do bytecode.</li>
  <li>Não dá para chamar uma função <code>inline reified</code> a partir de Java — só de Kotlin.</li>
  <li><code>reified</code> não funciona em <em>recursão</em> com tipo dinâmico; o tipo precisa ser conhecido em compile-time no call-site.</li>
  <li>Não use para esconder reflexão pesada — o custo de <code>T::class.java.declaredFields</code> continua sendo runtime.</li>
  <li>Combine com <code>noinline</code> em parâmetros lambda quando você não quer que <em>todos</em> os lambdas sejam inlined.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Performance</div><div>Inlining elimina a alocação de lambda E a indireção de generics. Em hot paths, <code>inline reified</code> chega a ser mais rápido que código equivalente em Java.</div></div>

<div class="callout callout-warn"><div class="callout-title">Type erasure permanece</div><div><code>reified</code> só funciona no call-site da função inline. Dentro de classes não-inline, <code>T</code> continua apagado — não há <code>val tipo: T</code> em campo.</div></div>
`}})]})}export{n as default};

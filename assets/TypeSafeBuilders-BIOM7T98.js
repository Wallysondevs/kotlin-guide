import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function l(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Anotações e DSLs · avancado · 12 min"}),e.jsx("h1",{children:"Type-safe builders (DSL)"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Type-safe builders são DSLs internas em Kotlin que combinam <strong>lambdas com receiver</strong>, funções de extensão e <code>@DslMarker</code> para criar APIs declarativas seguras em tempo de compilação. Gradle Kotlin DSL, Ktor routing, Compose e kotlinx.html são todos exemplos.</p>

<h2>Conceito</h2>
<p>O bloco-chave é a função do tipo <code>T.() -&gt; Unit</code> — uma <em>lambda com receiver</em> em que <code>this</code> dentro do bloco é uma instância de <code>T</code>:</p>
<pre><code class="language-kotlin">class Html {
    private val children = mutableListOf&lt;String&gt;()
    fun head(block: Head.() -&gt; Unit) { children += Head().apply(block).render() }
    fun body(block: Body.() -&gt; Unit) { children += Body().apply(block).render() }
    fun render() = "&lt;html&gt;\${children.joinToString("")}&lt;/html&gt;"
}

fun html(block: Html.() -&gt; Unit): String = Html().apply(block).render()</code></pre>

<h2>Exemplo prático: mini HTML DSL</h2>
<pre><code class="language-kotlin">@DslMarker
annotation class HtmlDsl

@HtmlDsl
abstract class Tag(private val nome: String) {
    private val filhos = mutableListOf&lt;Tag&gt;()
    private val atributos = mutableMapOf&lt;String, String&gt;()
    private var texto: String = ""

    operator fun String.unaryPlus() { texto += this }
    fun atributo(k: String, v: String) { atributos[k] = v }

    protected fun &lt;T : Tag&gt; init(child: T, block: T.() -&gt; Unit): T {
        child.block(); filhos += child; return child
    }

    fun render(): String {
        val attrs = if (atributos.isEmpty()) "" else atributos.entries
            .joinToString(" ", prefix = " ") { "\${it.key}=\\"\${it.value}\\"" }
        val inner = texto + filhos.joinToString("") { it.render() }
        return "&lt;$nome$attrs&gt;$inner&lt;/$nome&gt;"
    }
}

class Html : Tag("html") {
    fun head(block: Head.() -&gt; Unit) = init(Head(), block)
    fun body(block: Body.() -&gt; Unit) = init(Body(), block)
}
class Head : Tag("head") {
    fun title(block: Title.() -&gt; Unit) = init(Title(), block)
}
class Title : Tag("title")
class Body : Tag("body") {
    fun h1(block: H1.() -&gt; Unit) = init(H1(), block)
    fun p(block: P.() -&gt; Unit) = init(P(), block)
}
class H1 : Tag("h1")
class P : Tag("p")

fun html(block: Html.() -&gt; Unit): Html = Html().apply(block)</code></pre>

<p>Uso:</p>
<pre><code class="language-kotlin">val pagina = html {
    head { title { +"Olá" } }
    body {
        h1 { +"Bem-vinda" }
        p {
            atributo("class", "intro")
            +"Este HTML foi gerado por um DSL Kotlin."
        }
    }
}.render()</code></pre>

<h2>O papel do @DslMarker</h2>
<p>Sem <code>@DslMarker</code>, dentro de <code>body { ... }</code> o programador conseguiria chamar <code>title { ... }</code> (que é método de <code>Head</code>) por causa do escopo aninhado de receivers implícitos. A anotação <code>@DslMarker</code> aplicada a um meta-marker (<code>@HtmlDsl</code>) impede acesso a receivers externos do mesmo grupo, gerando erro de compilação.</p>

<div class="callout callout-info"><div class="callout-title">Lambda com receiver vs lambda comum</div><div><code>(T) -&gt; Unit</code> recebe <code>T</code> como argumento <code>it</code>. <code>T.() -&gt; Unit</code> torna <code>T</code> o <code>this</code> implícito, dispensando prefixos e habilitando "linguagem natural" dentro do bloco.</div></div>

<h2>Quando criar um DSL</h2>
<ul>
  <li>API de configuração com muitas opções e estrutura aninhada (build, routing, UI).</li>
  <li>Geradores de código/markup com hierarquia clara.</li>
  <li>Testes (Kotest, Spek) onde a leitura natural agrega valor.</li>
  <li>Pipelines declarativos (workflows, máquinas de estado).</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Performance</strong>: cada bloco aloca objetos. Para hot paths (loops grandes), considere builders mais "magros" ou pré-construir.</li>
  <li><strong>Erros enigmáticos</strong>: sem <code>@DslMarker</code>, mensagens "this is not a function" surgem por sobrecarga de receivers.</li>
  <li><strong>Inferência de tipo</strong>: lambdas grandes podem confundir o compilador; declare tipos explícitos quando ele reclamar.</li>
  <li><strong>Mutabilidade interna</strong>: builders normalmente acumulam em <code>MutableList</code>. Garanta que o resultado final seja imutável (<code>toList()</code>).</li>
  <li><strong>Documentação</strong>: DSLs ficam intuitivos só depois de explicados; inclua exemplos no KDoc.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Padrão "build" do stdlib</div><div>Para casos simples, <code>buildList</code>, <code>buildSet</code>, <code>buildMap</code> e <code>buildString</code> já oferecem um mini-DSL pronto, sem necessidade de criar marker, classes etc.</div></div>
`}})]})}export{l as default};

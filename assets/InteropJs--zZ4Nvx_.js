import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function n(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Multiplataforma e avançado · avancado · 8 min"}),e.jsx("h1",{children:"Kotlin/JS interop"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`<p>Kotlin/JS compila Kotlin para JavaScript (ES5/ES2015) e roda em browser ou Node.js. A interoperabilidade com o ecossistema JS é feita via <code>external</code> declarations, o tipo <code>dynamic</code> e dependências npm declaradas no Gradle.</p>

<h2>Conceito</h2>
<p>Configuração mínima de um módulo Kotlin/JS no <code>build.gradle.kts</code>:</p>
<pre><code class="language-kotlin">plugins {
    kotlin("multiplatform") version "2.0.20"
}

kotlin {
    js(IR) {
        browser {
            commonWebpackConfig { outputFileName = "app.js" }
        }
        binaries.executable()
    }
    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation(npm("lodash", "4.17.21"))
                implementation(npm("axios", "1.7.2"))
            }
        }
    }
}</code></pre>

<h2>external declarations</h2>
<p>Declare a forma das APIs JS para conseguir tipo estático:</p>
<pre><code class="language-kotlin">@JsModule("axios")
@JsNonModule
external val axios: AxiosStatic

external interface AxiosStatic {
    fun &lt;T&gt; get(url: String): kotlin.js.Promise&lt;AxiosResponse&lt;T&gt;&gt;
    fun &lt;T&gt; post(url: String, data: dynamic): kotlin.js.Promise&lt;AxiosResponse&lt;T&gt;&gt;
}

external interface AxiosResponse&lt;T&gt; {
    val data: T
    val status: Int
}</code></pre>

<h2>dynamic</h2>
<p>Quando não vale a pena tipar (API caótica ou só consumida pontualmente), use <code>dynamic</code>: o compilador desliga checagens e qualquer chamada/propriedade é aceita.</p>
<pre><code class="language-kotlin">val resposta: dynamic = js("({ usuario: { nome: 'Ana', idade: 30 } })")
println(resposta.usuario.nome)   // sem checagem</code></pre>

<h2>Exemplo prático: chamar API</h2>
<pre><code class="language-kotlin">import kotlinx.coroutines.await
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

@kotlinx.serialization.Serializable
data class Usuario(val id: Int, val name: String, val email: String)

fun main() {
    GlobalScope.launch {
        val resp = axios.get&lt;Usuario&gt;("https://jsonplaceholder.typicode.com/users/1").await()
        println("\${resp.data.name} (\${resp.data.email})")
    }
}</code></pre>

<h2>Manipular o DOM</h2>
<pre><code class="language-kotlin">import kotlinx.browser.document
import org.w3c.dom.HTMLButtonElement
import org.w3c.dom.events.Event

fun main() {
    val btn = document.getElementById("ola") as HTMLButtonElement
    btn.addEventListener("click", { _: Event -&gt;
        document.body!!.append(document.createElement("p").also { it.textContent = "Olá!" })
    })
}</code></pre>

<h2>Bundling e output</h2>
<p>O Gradle integra com webpack: <code>./gradlew jsBrowserDevelopmentWebpack</code> gera <code>build/dist/js/productionExecutable/app.js</code> pronto para incluir no HTML. Para Node: <code>js(IR) { nodejs() }</code>.</p>

<h2>TypeScript declarations</h2>
<p>Kotlin/JS pode <strong>gerar</strong> arquivos <code>.d.ts</code> para APIs exportadas, permitindo que código TypeScript consuma seu Kotlin:</p>
<pre><code class="language-kotlin">@JsExport
class Calculadora {
    fun somar(a: Int, b: Int): Int = a + b
}</code></pre>
<pre><code class="language-bash">./gradlew jsBrowserProductionLibraryDistribution
# gera kotlin/&lt;module&gt;.d.ts</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Compartilhar regras de negócio entre Android (JVM) e Web (JS) via Kotlin Multiplatform.</li>
<li>Front-end completo em Kotlin com <em>compose-html</em> ou <em>kotlin-react</em>.</li>
<li>Bibliotecas distribuídas via npm escritas em Kotlin.</li>
<li>Scripts Node.js tipados (CLIs, automação) reutilizando código JVM.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><code>dynamic</code> remove segurança — restrinja a fronteiras.</li>
<li>Tamanho do bundle: a stdlib Kotlin/JS pesa, ative DCE (já default no IR backend).</li>
<li>Exceções viram <code>Error</code> JS — stack traces podem ficar confusas sem <em>source maps</em>.</li>
<li>Nomes mangleados: para APIs exportadas, use <code>@JsName("nomeExterno")</code> ou <code>@JsExport</code>.</li>
<li>Coroutines em JS são <em>single-threaded</em> — não há paralelismo real, só concorrência cooperativa.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Backend IR</div><div>O backend "Legacy" foi removido. Sempre use <code>js(IR)</code>; mensagens de erro de tutoriais antigos (<code>js { browser { } }</code> sem IR) não se aplicam mais.</div></div>

<div class="callout callout-tip"><div class="callout-title">Dukat</div><div>O <em>Dukat</em> tentava gerar declarações Kotlin a partir de <code>.d.ts</code> automaticamente, mas foi descontinuado. Hoje a recomendação é escrever <code>external</code> manualmente, focando só no que você usa.</div></div>`}})]})}export{n as default};

import{j as o}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return o.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[o.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Introdução · iniciante · 10 min"}),o.jsx("h1",{children:"Primeiro projeto"}),o.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Antes de mergulhar em sintaxe, vale entender como um projeto Kotlin nasce: o ponto de entrada, a organização em pacotes e como executá-lo tanto pela IDE quanto pela linha de comando. Em Kotlin idiomático, quase todo projeto novo começa com <code>gradle init</code> usando Kotlin DSL, o que dá auto-completar e refatoração no próprio script de build.</p>

<h2>Conceito</h2>
<p>O ponto de entrada é uma função top-level chamada <code>main</code>. Diferente de Java, ela não precisa estar dentro de uma classe e o parâmetro <code>args</code> é opcional.</p>
<pre><code class="language-kotlin">fun main() {
    println("Hello, Kotlin!")
}

fun main(args: Array&lt;String&gt;) {
    println("Olá, \${args.firstOrNull() ?: "mundo"}!")
}</code></pre>
<p>Pacotes seguem a convenção reverse-domain (<code>br.com.empresa.app</code>) e mapeiam para o caminho do arquivo dentro de <code>src/main/kotlin</code>.</p>

<h2>Exemplo prático</h2>
<p>Crie a pasta do projeto e gere o esqueleto:</p>
<pre><code class="language-bash">mkdir hello-kt && cd hello-kt
gradle init \\
  --type kotlin-application \\
  --dsl kotlin \\
  --project-name hello-kt \\
  --package br.com.exemplo.hello</code></pre>
<p>Estrutura resultante:</p>
<pre><code class="language-bash">hello-kt/
├── build.gradle.kts
├── settings.gradle.kts
└── app/
    ├── build.gradle.kts
    └── src/
        ├── main/kotlin/br/com/exemplo/hello/App.kt
        └── test/kotlin/br/com/exemplo/hello/AppTest.kt</code></pre>
<p>Edite <code>App.kt</code>:</p>
<pre><code class="language-kotlin">package br.com.exemplo.hello

fun main(args: Array&lt;String&gt;) {
    val nome = args.firstOrNull() ?: "Kotlin"
    println("Olá, $nome — versão \${KotlinVersion.CURRENT}")
}</code></pre>
<p>Rode pela CLI:</p>
<pre><code class="language-bash">./gradlew :app:run --args="Mundo"</code></pre>

<h2>Quando usar cada forma</h2>
<ul>
<li><strong>IDE (IntelliJ/Android Studio):</strong> ciclo de feedback rápido, debug gráfico, refactors seguros.</li>
<li><strong>CLI Gradle:</strong> CI/CD, builds reprodutíveis, integração com Docker.</li>
<li><strong>Kotlin script (.kts):</strong> automações pontuais, sem precisar de projeto inteiro.</li>
<li><strong>kotlinc direto:</strong> POCs rápidas, ensino, REPL com <code>kotlinc -script</code>.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Adote Kotlin DSL (<code>build.gradle.kts</code>) desde o dia 1 — auto-complete vale o esforço.</li>
<li>Defina <code>kotlin.jvmToolchain(21)</code> para fixar a JDK e evitar surpresas no CI.</li>
<li>Mantenha o <code>main</code> minúsculo: delegue a uma classe/função de aplicação para facilitar testes.</li>
<li>Configure <code>application.mainClass.set("br.com.exemplo.hello.AppKt")</code> — o sufixo <code>Kt</code> vem do nome do arquivo.</li>
<li>Versione o <code>gradle/wrapper</code> junto com o código.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Por que <code>AppKt</code>?</div><div>Funções top-level do arquivo <code>App.kt</code> são compiladas para uma classe sintética chamada <code>AppKt</code>. Você pode mudar isso com <code>@file:JvmName("App")</code> no topo do arquivo.</div></div>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Use <code>./gradlew run -q</code> para suprimir os logs do Gradle durante demos — só o output do programa aparece.</div></div>
`}})]})}export{r as default};

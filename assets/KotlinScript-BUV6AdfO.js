import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Build e tooling · intermediario · 7 min"}),e.jsx("h1",{children:"Kotlin Script (.kts)"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`<p>Kotlin Script (extensão <code>.kts</code>) permite escrever programas Kotlin <em>sem</em> declarar <code>main()</code> nem classe — o arquivo inteiro vira o corpo de execução. É a base do <strong>Gradle Kotlin DSL</strong> e útil para automação, prototipagem e ferramentas internas.</p>

<h2>Conceito</h2>
<p>Salve como <code>hello.kts</code> e execute com o compilador:</p>
<pre><code class="language-kotlin">// hello.kts
val nome = args.getOrElse(0) { "mundo" }
println("Olá, $nome")</code></pre>
<pre><code class="language-bash">kotlinc -script hello.kts -- Ana
# ou, com kotlin instalado:
kotlin hello.kts Ana</code></pre>

<h2>kotlin-main-kts</h2>
<p>O <code>kotlin-main-kts</code> adiciona diretivas de dependência via comentários <code>@file:DependsOn</code> e <code>@file:Repository</code>, transformando scripts em ferramentas autônomas:</p>
<pre><code class="language-kotlin">#!/usr/bin/env kotlin

@file:Repository("https://repo.maven.apache.org/maven2/")
@file:DependsOn("com.squareup.okhttp3:okhttp:4.12.0")

import okhttp3.OkHttpClient
import okhttp3.Request

val client = OkHttpClient()
val req = Request.Builder().url("https://api.github.com").build()
client.newCall(req).execute().use { res -&gt;
    println("status=\${res.code}")
}</code></pre>
<p>Torne executável: <code>chmod +x script.main.kts &amp;&amp; ./script.main.kts</code>.</p>

<h2>Gradle Kotlin DSL</h2>
<p>Os arquivos <code>build.gradle.kts</code> e <code>settings.gradle.kts</code> são scripts Kotlin com receivers especiais (<code>Project</code>, <code>Settings</code>):</p>
<pre><code class="language-kotlin">plugins {
    kotlin("jvm") version "2.0.20"
    application
}

repositories { mavenCentral() }

dependencies {
    implementation("io.ktor:ktor-server-core:2.3.12")
    testImplementation(kotlin("test"))
}

application { mainClass.set("AppKt") }</code></pre>

<h2>Exemplo prático: backup script</h2>
<pre><code class="language-kotlin">#!/usr/bin/env kotlin
@file:DependsOn("org.apache.commons:commons-compress:1.26.2")

import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream
import java.io.File
import java.io.FileOutputStream

val origem = File(args.getOrElse(0) { "." })
val destino = File("backup-\${System.currentTimeMillis()}.tar")

TarArchiveOutputStream(FileOutputStream(destino)).use { tar -&gt;
    origem.walkTopDown().filter { it.isFile }.forEach { f -&gt;
        val entry = tar.createArchiveEntry(f, f.relativeTo(origem).path)
        tar.putArchiveEntry(entry)
        f.inputStream().use { it.copyTo(tar) }
        tar.closeArchiveEntry()
    }
}
println("gerado \${destino.name}")</code></pre>

<h2>Custom script definitions</h2>
<p>É possível criar uma "linguagem" própria definindo um <code>ScriptDefinition</code> com receivers e imports implícitos. Frameworks como <strong>Jupyter Kotlin</strong>, <strong>Spring Init</strong> e <strong>Gradle</strong> usam esse mecanismo.</p>

<h2>Casos de uso</h2>
<ul>
<li>Build scripts: <code>build.gradle.kts</code>, <code>settings.gradle.kts</code>.</li>
<li>Tarefas de DevOps com tipos seguros (em vez de Bash/Python).</li>
<li>Notebooks Jupyter (kernel <code>kotlin-jupyter</code>).</li>
<li>Prototipagem rápida de algoritmos sem criar projeto.</li>
<li>Plugins de IDE / migrações de dados pontuais.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Startup de <code>.kts</code> é lento (compilação JIT) — para CLI quente, compile para JAR.</li>
<li>Cada execução resolve dependências: cache em <code>~/.kotlin/main-kts</code> ajuda.</li>
<li>Variáveis top-level viram propriedades de uma classe sintética — ordem importa.</li>
<li>Scripts não têm <code>package</code>; cuidado com colisões em <code>import</code>.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">.kts vs .kt</div><div>Use <code>.kt</code> para código de produção compilado em JAR. Reserve <code>.kts</code> para automação, configuração ou exploração — onde a velocidade de iteração importa mais que tempo de startup.</div></div>

<div class="callout callout-tip"><div class="callout-title">Shebang</div><div>Com <code>#!/usr/bin/env kotlin</code> no topo e bit de execução, scripts <code>.main.kts</code> rodam como qualquer ferramenta Unix — com o bônus de tipos estáticos.</div></div>`}})]})}export{r as default};

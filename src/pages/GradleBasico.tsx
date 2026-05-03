export default function GradleBasico() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Introdução · iniciante · 12 min</div>
      <h1>Gradle básico para Kotlin</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>O Gradle é o build tool padrão para projetos Kotlin/JVM, Android e Multiplataforma. Escrever o build em Kotlin DSL (<code>build.gradle.kts</code>) traz autocompletar e checagem de tipos no próprio IDE, evitando erros que apareceriam só na execução. Este capítulo cobre o esqueleto mínimo de um projeto Kotlin/JVM com Gradle 8.x.</p>

<h2>Conceito</h2>
<p>Um projeto Gradle tem dois arquivos centrais: <code>settings.gradle.kts</code> (declara os módulos) e <code>build.gradle.kts</code> (declara plugins, repositórios, dependências e tasks). O Kotlin entra como um plugin oficial: <code>kotlin("jvm")</code> para JVM puro, <code>kotlin("multiplatform")</code> para KMP, ou <code>org.jetbrains.kotlin.android</code> para Android.</p>
<pre><code class="language-kotlin">// settings.gradle.kts
rootProject.name = "meu-app"
</code></pre>
<pre><code class="language-kotlin">// build.gradle.kts
plugins {
    kotlin("jvm") version "2.0.20"
    application
}

repositories { mavenCentral() }

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
    testImplementation(kotlin("test"))
}

kotlin {
    jvmToolchain(21)
}

application {
    mainClass.set("com.exemplo.MainKt")
}
</code></pre>

<h2>Exemplo prático</h2>
<p>Estrutura mínima de diretórios e código rodando com <code>./gradlew run</code>:</p>
<pre><code class="language-bash">meu-app/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle/wrapper/
└── src/
    ├── main/kotlin/com/exemplo/Main.kt
    └── test/kotlin/com/exemplo/MainTest.kt
</code></pre>
<pre><code class="language-kotlin">// src/main/kotlin/com/exemplo/Main.kt
package com.exemplo

fun main() {
    val nome = System.getenv("USER") ?: "mundo"
    println("Olá, \${nome}!")
}
</code></pre>
<pre><code class="language-kotlin">// src/test/kotlin/com/exemplo/MainTest.kt
package com.exemplo

import kotlin.test.Test
import kotlin.test.assertTrue

class MainTest {
    @Test fun smoke() {
        assertTrue(true)
    }
}
</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Aplicação CLI ou serviço JVM puro com <code>application</code>.</li>
<li>Biblioteca Kotlin publicada no Maven Central (com <code>java-library</code> + <code>maven-publish</code>).</li>
<li>Backend Spring Boot ou Ktor com plugin específico aplicado por cima do <code>kotlin("jvm")</code>.</li>
<li>App Android com <code>com.android.application</code> + <code>kotlin("android")</code>.</li>
<li>Projeto multi-módulo que compartilha dependências via <code>buildSrc</code> ou Version Catalogs.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Use sempre o Gradle Wrapper (<code>./gradlew</code>) — ele garante a versão correta do Gradle independentemente do que está instalado na máquina ou no CI.</div></div>

<h2>Boas práticas</h2>
<ul>
<li><strong>JVM toolchain:</strong> declare <code>jvmToolchain(21)</code> para o Gradle baixar o JDK certo automaticamente, ao invés de depender do <code>JAVA_HOME</code>.</li>
<li><strong>Version Catalog:</strong> centralize versões em <code>gradle/libs.versions.toml</code> em vez de hardcodar strings.</li>
<li><strong>Configuration cache:</strong> habilite com <code>org.gradle.configuration-cache=true</code> em <code>gradle.properties</code> para builds 2-3x mais rápidos.</li>
<li>Não misture <code>compile</code>/<code>runtime</code> antigos com <code>implementation</code>/<code>api</code>; os primeiros estão removidos no Gradle 8.</li>
<li>Rode <code>./gradlew tasks</code> para descobrir o que cada plugin adiciona.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Atenção</div><div>Evite <code>buildscript { dependencies }</code> e a sintaxe <code>apply plugin:</code> antiga. O bloco <code>plugins { }</code> moderno resolve plugins via Plugin Portal e é o único caminho recomendado.</div></div>
`}} />
    </article>
  );
}

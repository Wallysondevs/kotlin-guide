export default function GradleKts() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Build e tooling · intermediario · 11 min</div>
      <h1>Gradle Kotlin DSL profundo</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>O Gradle Kotlin DSL (<code>.gradle.kts</code>) substitui o Groovy por Kotlin tipado: você ganha autocomplete, refatoração e detecção de erros antes do build. Em projetos grandes, dominar <strong>version catalog</strong>, <strong>multi-module</strong>, <strong>buildSrc</strong>, <strong>convention plugins</strong> e <strong>configuration cache</strong> é o que separa um build lento e quebradiço de um pipeline rápido e reaproveitável.</p>

<h2>Conceito</h2>
<p>Cada projeto Gradle tem um <code>settings.gradle.kts</code> (define módulos e plugin management) e um <code>build.gradle.kts</code> por módulo. A partir do Gradle 7+, recomenda-se <code>libs.versions.toml</code> como única fonte de verdade para versões.</p>
<pre><code class="language-kotlin">// settings.gradle.kts
pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories { mavenCentral() }
}
rootProject.name = "meu-app"
include(":app", ":core", ":data")</code></pre>

<h2>Version catalog</h2>
<pre><code class="language-yaml"># gradle/libs.versions.toml
[versions]
kotlin = "2.0.20"
coroutines = "1.8.1"
ktor = "2.3.12"

[libraries]
kotlinx-coroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "coroutines" }
ktor-server-core = { module = "io.ktor:ktor-server-core", version.ref = "ktor" }

[bundles]
ktor-server = ["ktor-server-core"]

[plugins]
kotlin-jvm = { id = "org.jetbrains.kotlin.jvm", version.ref = "kotlin" }</code></pre>
<pre><code class="language-kotlin">// app/build.gradle.kts
plugins { alias(libs.plugins.kotlin.jvm) }
dependencies {
    implementation(libs.kotlinx.coroutines)
    implementation(libs.bundles.ktor.server)
}</code></pre>

<h2>Multi-module</h2>
<p>Cada módulo tem seu próprio <code>build.gradle.kts</code>. Use <code>api</code> apenas quando um tipo for parte da assinatura pública exposta a outros módulos; caso contrário, <code>implementation</code> dá builds incrementais melhores.</p>
<pre><code class="language-kotlin">// core/build.gradle.kts
plugins { alias(libs.plugins.kotlin.jvm) }
dependencies {
    api(libs.kotlinx.coroutines)        // exposto a quem depende de :core
    implementation("org.slf4j:slf4j-api:2.0.13")
}

// app/build.gradle.kts
dependencies {
    implementation(project(":core"))
    implementation(project(":data"))
}</code></pre>

<h2>buildSrc e convention plugins</h2>
<p>Para evitar copiar configurações entre módulos, extraia para <strong>convention plugins</strong>. A pasta <code>buildSrc/</code> é compilada antes do build principal e seus plugins ficam disponíveis em todos os módulos.</p>
<pre><code class="language-bash">buildSrc/
├── build.gradle.kts
└── src/main/kotlin/
    └── kotlin-library-conventions.gradle.kts</code></pre>
<pre><code class="language-kotlin">// buildSrc/build.gradle.kts
plugins { &#96;kotlin-dsl&#96; }
repositories { gradlePluginPortal() }
dependencies {
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:2.0.20")
}</code></pre>
<pre><code class="language-kotlin">// buildSrc/src/main/kotlin/kotlin-library-conventions.gradle.kts
plugins { id("org.jetbrains.kotlin.jvm") }

kotlin {
    jvmToolchain(17)
    compilerOptions {
        freeCompilerArgs.add("-Xjsr305=strict")
    }
}

tasks.withType&lt;Test&gt;().configureEach {
    useJUnitPlatform()
}</code></pre>
<pre><code class="language-kotlin">// core/build.gradle.kts — agora só:
plugins { id("kotlin-library-conventions") }</code></pre>

<h2>Configuration cache</h2>
<p>Cache da fase de configuração: o Gradle pula a reexecução dos scripts quando nada mudou. Habilite e corrija incompatibilidades aos poucos.</p>
<pre><code class="language-bash"># gradle.properties
org.gradle.configuration-cache=true
org.gradle.caching=true
org.gradle.parallel=true</code></pre>
<p>Tasks devem ser <strong>configuration-cache safe</strong>: nada de <code>Project</code> dentro de <code>doLast</code>, sem <code>System.getProperty</code> em runtime — use <code>providers.systemProperty(...)</code>.</p>

<div class="callout callout-tip">
<div class="callout-title">Composite builds vs buildSrc</div>
<div>Em monorepos grandes, prefira <code>includeBuild</code> a <code>buildSrc</code>: builds incrementais melhores e isolamento real entre o projeto e as convenções.</div>
</div>

<h2>Casos de uso</h2>
<ul>
<li>Padronizar versões de Kotlin/JDK em dezenas de módulos.</li>
<li>Forçar Detekt, ktlint e Jacoco em todos os módulos via convention plugin.</li>
<li>Compartilhar configuração de publicação Maven entre libs.</li>
<li>Builds Android multi-flavor com plugins próprios por flavor.</li>
<li>CI rápido com configuration cache + remote build cache.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Aspas e crases em DSL Kotlin: <code>&#96;kotlin-dsl&#96;</code> precisa de backticks por causa do hífen.</li>
<li>Não misture catalog com <code>"grupo:artefato:versão"</code> hardcoded — perde o controle central.</li>
<li><code>api</code> excessivo vaza dependências e detona builds incrementais.</li>
<li>Plugins aplicados via <code>apply(plugin = "...")</code> não são tipados; prefira o bloco <code>plugins { }</code>.</li>
<li>Configuration cache quebra com plugins antigos — atualize ou desabilite por tarefa específica.</li>
</ul>

<div class="callout callout-info">
<div class="callout-title">Toolchains</div>
<div>Use <code>jvmToolchain(17)</code> em vez de <code>sourceCompatibility</code>: o Gradle baixa o JDK certo automaticamente, eliminando o "funciona na minha máquina".</div>
</div>
`}} />
    </article>
  );
}

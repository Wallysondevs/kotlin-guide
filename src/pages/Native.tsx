export default function Native() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Multiplataforma e avançado · avancado · 9 min</div>
      <h1>Kotlin/Native</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Kotlin/Native compila código Kotlin para binários nativos via LLVM, sem JVM. É o backend que viabiliza Kotlin Multiplatform (KMP) em iOS, macOS, Linux, Windows e até embarcados (mingwArm32). O foco principal hoje é compartilhar lógica entre Android e iOS dentro de um app KMP.</p>

<h2>Targets suportados</h2>
<ul>
  <li><strong>Apple</strong>: iosArm64, iosX64, iosSimulatorArm64, macosArm64, macosX64, watchosArm64, tvosArm64.</li>
  <li><strong>Linux</strong>: linuxX64, linuxArm64.</li>
  <li><strong>Windows</strong>: mingwX64.</li>
  <li><strong>Android Native</strong> (NDK): androidNativeArm64, androidNativeX64.</li>
</ul>
<p>JS e Wasm são alvos separados (Kotlin/JS, Kotlin/Wasm), não Native.</p>

<h2>Configuração mínima KMP</h2>
<pre><code class="language-groovy">// build.gradle.kts
plugins {
    kotlin("multiplatform") version "2.0.20"
}

kotlin {
    jvm()
    iosArm64()
    iosSimulatorArm64()
    linuxX64 { binaries { executable() } }

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
        }
    }
}</code></pre>

<h2>Exemplo: hello em código comum</h2>
<pre><code class="language-kotlin">// commonMain/kotlin/Saudacao.kt
expect fun plataforma(): String

fun saudar(): String = "Olá de \${plataforma()}!"

// jvmMain/kotlin/Saudacao.kt
actual fun plataforma(): String = "JVM \${System.getProperty("java.version")}"

// linuxX64Main/kotlin/Saudacao.kt
actual fun plataforma(): String = "Linux nativo"

// nativeMain/kotlin/Main.kt
fun main() { println(saudar()) }</code></pre>

<pre><code class="language-bash">./gradlew linkReleaseExecutableLinuxX64
./build/bin/linuxX64/releaseExecutable/app.kexe</code></pre>

<h2>Memory model</h2>
<p>Desde Kotlin 1.7.20, o <strong>novo memory model</strong> é padrão e estável: comportamento similar à JVM (objetos compartilhados livremente entre threads, garbage collector concorrente). O modelo antigo, com <code>freeze()</code> e regras estritas de imutabilidade, foi descontinuado — código KMP atual não precisa pensar mais nisso.</p>

<div class="callout callout-info"><div class="callout-title">Coroutines em Native</div><div><code>kotlinx-coroutines-core</code> funciona normalmente. Em iOS, prefira <code>Dispatchers.Main</code> integrado a <code>NSRunLoop</code> e exponha suspend functions ao Swift via wrappers (Skie ou helpers manuais).</div></div>

<h2>cinterop: chamando C/Objective-C</h2>
<pre><code class="language-kotlin">// build.gradle.kts (target Linux)
linuxX64 {
    compilations.getByName("main") {
        cinterops.create("zlib") {
            defFile(project.file("src/nativeInterop/cinterop/zlib.def"))
        }
    }
}

// zlib.def
package = zlib
headers = zlib.h
linkerOpts = -lz</code></pre>
<pre><code class="language-kotlin">import zlib.*
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun versaoZlib(): String =
    zlibVersion()?.toKString() ?: "?"</code></pre>
<p>Ponteiros, structs e arrays C aparecem como tipos <code>CPointer</code>, <code>CValue</code>, <code>CArrayPointer</code>; alocação manual é feita em <code>memScoped { ... }</code>.</p>

<h2>CocoaPods integration</h2>
<p>Para consumir libs Objective-C/Swift via CocoaPods:</p>
<pre><code class="language-groovy">plugins { kotlin("native.cocoapods") version "2.0.20" }

kotlin {
    cocoapods {
        version = "1.0"
        summary = "Lib compartilhada"
        homepage = "https://example.com"
        ios.deploymentTarget = "14.0"
        framework { baseName = "Shared" }
        pod("FirebaseAnalytics") { version = "~&gt; 11.0" }
    }
}</code></pre>
<p>O Gradle gera um <code>Shared.podspec</code> consumido pelo Xcode via <code>pod install</code>.</p>

<h2>Quando escolher Kotlin/Native</h2>
<ul>
  <li>App KMP compartilhando lógica (rede, modelo, regras) entre Android e iOS.</li>
  <li>CLI multiplataforma sem JVM no runtime.</li>
  <li>Library publicada como <code>.framework</code> para devs iOS.</li>
  <li>Casos de embarcado/IoT em Linux ARM.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Tempo de build</strong>: linkagem nativa é lenta. Use <code>debug</code> em iteração; <code>release</code> só quando precisar.</li>
  <li><strong>Dependências JVM-only</strong> não funcionam — use libs <code>multiplatform</code> (Ktor, SQLDelight, kotlinx.serialization).</li>
  <li><strong>Reflection</strong> é limitada (sem KClass.members completos); design APIs estáticas.</li>
  <li><strong>Exposição ao Swift</strong>: nomes podem ficar feios (<code>Kotlin</code> prefix). Ferramentas como Skie melhoram a interop.</li>
  <li><strong>Threads</strong>: criar threads diretamente exige <code>Worker</code> ou usar coroutines com <code>Dispatchers.Default</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Para começar com KMP mobile, use o template oficial "Kotlin Multiplatform Mobile" do Android Studio — ele já configura targets iOS, Gradle e Xcode com <code>./gradlew embedAndSignAppleFrameworkForXcode</code> integrado.</div></div>
`}} />
    </article>
  );
}

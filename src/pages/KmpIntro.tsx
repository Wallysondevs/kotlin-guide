export default function KmpIntro() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Multiplataforma e avançado · avancado · 10 min</div>
      <h1>Kotlin Multiplatform intro</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Kotlin Multiplatform (KMP) permite compartilhar código Kotlin entre Android, iOS, JVM, Web (JS/Wasm) e nativos (Linux/macOS/Windows). Estável desde novembro de 2023, é a aposta da JetBrains para reduzir duplicação entre apps móveis sem abrir mão da UI nativa.</p>

<h2>Conceito</h2>
<p>Você organiza o código em <strong>source sets</strong> por target. O <code>commonMain</code> contém a lógica compartilhada (Kotlin puro + bibliotecas KMP). Cada target (<code>androidMain</code>, <code>iosMain</code>, <code>jvmMain</code>) implementa o que precisa de plataforma específica via <code>expect</code>/<code>actual</code>.</p>
<pre><code class="language-bash">shared/
└── src/
    ├── commonMain/kotlin/  ← código comum
    ├── androidMain/kotlin/ ← Android-only
    ├── iosMain/kotlin/     ← iOS-only
    └── jvmMain/kotlin/     ← JVM/server-only
</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">// shared/build.gradle.kts
plugins {
    kotlin("multiplatform") version "2.0.20"
    id("com.android.library")
}

kotlin {
    androidTarget()
    jvm()
    iosX64(); iosArm64(); iosSimulatorArm64()

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
            implementation("io.ktor:ktor-client-core:3.0.0")
        }
        androidMain.dependencies {
            implementation("io.ktor:ktor-client-okhttp:3.0.0")
        }
        iosMain.dependencies {
            implementation("io.ktor:ktor-client-darwin:3.0.0")
        }
    }
}

android {
    namespace = "com.exemplo.shared"
    compileSdk = 35
    defaultConfig.minSdk = 24
}
</code></pre>
<pre><code class="language-kotlin">// commonMain — declaração esperada
expect class Plataforma() {
    val nome: String
}

// androidMain — implementação Android
actual class Plataforma {
    actual val nome: String = "Android \${android.os.Build.VERSION.SDK_INT}"
}

// iosMain — implementação iOS
import platform.UIKit.UIDevice

actual class Plataforma {
    actual val nome: String = UIDevice.currentDevice.systemName() +
        " " + UIDevice.currentDevice.systemVersion
}
</code></pre>
<pre><code class="language-kotlin">// commonMain — código que usa expect
class Saudador {
    private val plat = Plataforma()
    fun ola() = "Olá do \${plat.nome}!"
}
</code></pre>

<h2>Quando usar</h2>
<ul>
<li><strong>KMM</strong> (Kotlin Multiplatform Mobile) — compartilhar lógica de domínio, networking, persistência e ViewModels entre Android e iOS, mantendo UI nativa.</li>
<li>Compartilhar SDKs/clientes de API entre backend JVM e apps móveis.</li>
<li>Bibliotecas open-source que querem servir múltiplos ecossistemas.</li>
<li>Compose Multiplatform para também compartilhar UI (Android, Desktop, iOS, Web Wasm).</li>
</ul>

<h2>Ferramentas</h2>
<ul>
<li><strong>Kotlin Multiplatform Mobile plugin</strong> no Android Studio.</li>
<li><strong>Fleet</strong> — IDE da JetBrains com bom suporte a KMP cross-IDE.</li>
<li><strong>CocoaPods integration</strong> ou <strong>SwiftPM</strong> para distribuir o framework iOS gerado.</li>
<li><strong>kotlinx</strong>: coroutines, serialization, datetime, atomicfu — todas multiplatform.</li>
<li><strong>Ktor Client</strong>, <strong>SQLDelight</strong>, <strong>Koin</strong>, <strong>Voyager</strong> — bibliotecas com targets KMP de primeira classe.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Compilar para iOS exige um Mac com Xcode — não tem como contornar.</li>
<li>O modelo de memória do Kotlin/Native foi reescrito (a partir de 1.7.20). Código antigo com <code>freeze()</code> está obsoleto.</li>
<li><code>expect</code>/<code>actual</code> deve ter assinatura idêntica em todos os targets.</li>
<li>Bibliotecas Java puras (sem variant KMP) não rodam em <code>commonMain</code> — só em <code>jvmMain</code>/<code>androidMain</code>.</li>
<li>Tempo de build inicial em iOS é alto; cache de Gradle e Xcode ajuda muito.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Info</div><div>KMP é estável; <strong>Compose Multiplatform iOS</strong> ficou estável em 2025. Para apps novos com restrição de orçamento, é a opção mais produtiva para iOS+Android sem times separados.</div></div>
`}} />
    </article>
  );
}

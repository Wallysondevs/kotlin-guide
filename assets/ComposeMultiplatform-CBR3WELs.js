import{j as o}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function s(){return o.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[o.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Multiplataforma e avançado · avancado · 10 min"}),o.jsx("h1",{children:"Compose Multiplatform"}),o.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p><strong>Compose Multiplatform</strong> (CMP), mantido pela JetBrains, leva o Jetpack Compose para Desktop (JVM), iOS, Web (Wasm) e até CLI. A API é praticamente idêntica à do Android — você reaproveita Composables, layouts, Material3 e a maior parte do ecossistema.</p>

<h2>Estrutura típica de projeto</h2>
<pre><code class="language-bash">app/
├── build.gradle.kts
├── composeApp/
│   ├── build.gradle.kts
│   └── src/
│       ├── commonMain/kotlin/    # código compartilhado
│       ├── androidMain/kotlin/   # específico Android
│       ├── desktopMain/kotlin/   # específico Desktop
│       ├── iosMain/kotlin/       # específico iOS
│       └── wasmJsMain/kotlin/    # específico Web (Wasm)
└── iosApp/                        # projeto Xcode wrapper</code></pre>

<h2>Setup com Gradle</h2>
<pre><code class="language-groovy">// composeApp/build.gradle.kts
plugins {
    kotlin("multiplatform") version "2.0.20"
    id("org.jetbrains.compose") version "1.7.0"
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.20"
}

kotlin {
    androidTarget()
    jvm("desktop")
    iosX64(); iosArm64(); iosSimulatorArm64()

    @OptIn(org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl::class)
    wasmJs { browser() }

    sourceSets {
        commonMain.dependencies {
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
            implementation(compose.components.resources)
        }
        androidMain.dependencies {
            implementation("androidx.activity:activity-compose:1.9.3")
        }
        named("desktopMain").dependencies {
            implementation(compose.desktop.currentOs)
        }
    }
}</code></pre>

<h2>Composable compartilhado</h2>
<pre><code class="language-kotlin">// commonMain/kotlin/App.kt
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun App() {
    MaterialTheme {
        var count by remember { mutableIntStateOf(0) }

        Column(
            modifier = Modifier.fillMaxSize().padding(32.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text("Compose em todas as plataformas")
            Text("Cliques: $count", style = MaterialTheme.typography.headlineMedium)
            Button(onClick = { count++ }) { Text("Clique") }
        }
    }
}</code></pre>

<h2>Entry-points por plataforma</h2>
<p><strong>Desktop (JVM):</strong></p>
<pre><code class="language-kotlin">// desktopMain/kotlin/Main.kt
import androidx.compose.ui.window.*

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Meu App") {
        App()
    }
}</code></pre>

<p><strong>Web (Wasm):</strong></p>
<pre><code class="language-kotlin">// wasmJsMain/kotlin/Main.kt
import androidx.compose.ui.window.ComposeViewport
import kotlinx.browser.document

fun main() {
    ComposeViewport(document.body!!) { App() }
}</code></pre>

<p><strong>iOS:</strong> exposto como <code>UIViewController</code> consumido pelo Swift.</p>
<pre><code class="language-kotlin">// iosMain/kotlin/MainViewController.kt
import androidx.compose.ui.window.ComposeUIViewController

fun MainViewController() = ComposeUIViewController { App() }</code></pre>

<h2>Resources</h2>
<p>Compose Multiplatform tem sistema de recursos próprio em <code>commonMain/composeResources/</code>:</p>
<pre><code class="language-bash">composeResources/
├── drawable/
│   └── logo.png
├── values/
│   └── strings.xml
└── files/
    └── data.json</code></pre>
<pre><code class="language-kotlin">import org.jetbrains.compose.resources.painterResource
import org.jetbrains.compose.resources.stringResource
import myapp.composeapp.generated.resources.Res
import myapp.composeapp.generated.resources.logo
import myapp.composeapp.generated.resources.app_title

@Composable
fun Cabecalho() {
    Image(painterResource(Res.drawable.logo), contentDescription = stringResource(Res.string.app_title))
}</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Times com expertise Kotlin que querem cobrir Android + iOS + Desktop com uma codebase.</li>
  <li>Apps internos onde uniformidade visual entre plataformas é desejável.</li>
  <li>Ferramentas Desktop (CLIs com GUI, painéis admin) — o ecossistema Java/Kotlin é robusto.</li>
  <li>POCs e MVPs multi-plataforma rápidos.</li>
  <li>Não substitui SwiftUI nativo quando você precisa de toque-fino em iOS — avalie trade-offs.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Web (Wasm) é estável mas o bundle inicial é grande (vários MB). Não use para landing pages.</li>
  <li>iOS tem <strong>limites de uso de memória</strong> e diferenças sutis em fontes/teclado.</li>
  <li>Bibliotecas Android (Room, WorkManager) NÃO funcionam em commonMain — abstraia com <code>expect/actual</code>.</li>
  <li>Navegação ainda evolui rápido; opções: <code>compose-navigation</code>, <code>Decompose</code>, <code>Voyager</code>, <code>PreCompose</code>.</li>
  <li>Não espere paridade 100%: alguns Modifiers e APIs Android-only ainda não chegaram em CMP.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Estado de produção</div><div>JetBrains classifica iOS como <em>Beta</em> (estável para produção desde meados de 2024) e Web como <em>Alpha</em>. Desktop é <em>Stable</em>.</div></div>

<div class="callout callout-tip"><div class="callout-title">Comece pelo Wizard</div><div>Use o <em>Kotlin Multiplatform Wizard</em> (kmp.jetbrains.com) para gerar projeto base com targets corretos e configuração de plugins atualizada.</div></div>
`}})]})}export{s as default};

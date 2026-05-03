import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function n(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Multiplataforma e avançado · avancado · 10 min"}),e.jsx("h1",{children:"Compartilhar código KMP"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Kotlin Multiplatform (KMP) permite escrever lógica uma única vez e rodar em Android, iOS, JVM, JS e nativos. O segredo está em organizar bem o módulo <code>shared</code>, escolher bibliotecas que suportem múltiplos targets e manter as APIs públicas idiomáticas para cada plataforma.</p>

<h2>Conceito</h2>
<p>Um projeto KMP tem source sets hierárquicos: <code>commonMain</code> contém o código compartilhado; <code>androidMain</code> e <code>iosMain</code> contêm implementações específicas. O mecanismo <code>expect</code>/<code>actual</code> resolve dependências de plataforma de forma type-safe.</p>

<pre><code class="language-groovy">// shared/build.gradle.kts
plugins {
    kotlin("multiplatform") version "2.0.20"
    kotlin("plugin.serialization") version "2.0.20"
}

kotlin {
    androidTarget()
    iosX64()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("io.ktor:ktor-client-core:2.3.12")
                implementation("io.ktor:ktor-client-content-negotiation:2.3.12")
                implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.12")
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")
            }
        }
        val androidMain by getting {
            dependencies { implementation("io.ktor:ktor-client-okhttp:2.3.12") }
        }
        val iosMain by getting {
            dependencies { implementation("io.ktor:ktor-client-darwin:2.3.12") }
        }
    }
}</code></pre>

<h2>expect/actual</h2>
<pre><code class="language-kotlin">// commonMain
expect class Platform() {
    val name: String
}

expect fun httpEngine(): HttpClientEngine

// androidMain
import io.ktor.client.engine.okhttp.OkHttp

actual class Platform actual constructor() {
    actual val name: String = "Android \${android.os.Build.VERSION.SDK_INT}"
}
actual fun httpEngine(): HttpClientEngine = OkHttp.create()

// iosMain
import io.ktor.client.engine.darwin.Darwin
import platform.UIKit.UIDevice

actual class Platform actual constructor() {
    actual val name: String =
        UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
}
actual fun httpEngine(): HttpClientEngine = Darwin.create()</code></pre>

<h2>Exemplo prático: networking compartilhado</h2>
<pre><code class="language-kotlin">// commonMain/Models.kt
import kotlinx.serialization.Serializable

@Serializable
data class Joke(val id: Int, val joke: String)

// commonMain/Api.kt
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*

class JokeApi {
    private val client = HttpClient(httpEngine()) {
        install(ContentNegotiation) { json() }
    }

    suspend fun random(): Joke =
        client.get("https://icanhazdadjoke.com/") {
            headers["Accept"] = "application/json"
        }.body()
}</code></pre>

<h2>Lógica de negócio compartilhada</h2>
<pre><code class="language-kotlin">// commonMain/JokeRepository.kt
import kotlinx.coroutines.flow.*

class JokeRepository(private val api: JokeApi) {
    private val cache = MutableStateFlow&lt;List&lt;Joke&gt;&gt;(emptyList())
    val jokes: StateFlow&lt;List&lt;Joke&gt;&gt; = cache.asStateFlow()

    suspend fun fetch() {
        val j = api.random()
        cache.update { it + j }
    }
}</code></pre>

<h2>Consumo no Android (Compose)</h2>
<pre><code class="language-kotlin">@Composable
fun JokeScreen(repo: JokeRepository = remember { JokeRepository(JokeApi()) }) {
    val state by repo.jokes.collectAsStateWithLifecycle()
    val scope = rememberCoroutineScope()

    Column(Modifier.padding(16.dp)) {
        Button(onClick = { scope.launch { repo.fetch() } }) {
            Text("Nova piada")
        }
        state.forEach { Text(it.joke) }
    }
}</code></pre>

<h2>Consumo no iOS (Swift)</h2>
<pre><code class="language-bash"># framework gerado pelo cocoapods plugin ou XCFramework
./gradlew :shared:assembleXCFramework</code></pre>
<p>No Swift, classes Kotlin viram tipos Swift; <code>suspend</code> functions viram callbacks ou (com plugin SKIE) async/await Swift nativo.</p>

<h2>Quando usar</h2>
<ul>
  <li>Models, validações e parsing — alto reuso, baixo risco.</li>
  <li>Camada de rede com Ktor Client.</li>
  <li>Persistência leve com SQLDelight.</li>
  <li>Lógica de negócio: cálculos, formatação, regras de domínio.</li>
  <li>State management compartilhado (StateFlow + ViewModels com MVIKotlin/Decompose).</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>UI <strong>não</strong> é compartilhada (a menos que use Compose Multiplatform). Trate cada UI como nativa.</li>
  <li><code>expect</code> sem <code>actual</code> em algum target = build quebra.</li>
  <li>Bibliotecas Java puras (sem variant Kotlin/Native) ficam fora do <code>commonMain</code>.</li>
  <li>iOS exige cuidado com <strong>memory model</strong> (em K/N moderno, igual JVM, mas legados podem ter freeze).</li>
  <li>Tempos de build de iOS são lentos; otimize com cache de XCFramework no CI.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Comece pequeno</div><div>Adote KMP só na camada de domínio primeiro. Quando o time estiver confortável, expanda para networking e persistência. Evite refatorar o mundo inteiro de uma vez.</div></div>

<div class="callout callout-info"><div class="callout-title">SKIE</div><div>O plugin SKIE da Touchlab traduz <code>suspend</code>, <code>Flow</code>, sealed classes etc. para idioms Swift naturais. Recomendado para qualquer projeto sério com iOS.</div></div>
`}})]})}export{n as default};

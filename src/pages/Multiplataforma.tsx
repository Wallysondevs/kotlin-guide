export default function Multiplataforma() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Build e tooling · avancado · 9 min</div>
      <h1>Multiplataforma básico</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Kotlin Multiplatform (KMP) permite compartilhar código Kotlin entre JVM, JS, Native (iOS, macOS, Linux, Windows) e Wasm. O ponto-chave é o sistema de <em>source sets</em> com <code>commonMain</code> + <code>expect</code>/<code>actual</code> para preencher diferenças por plataforma.</p>

<h2>Setup com Gradle Kotlin DSL</h2>
<pre><code class="language-groovy">plugins {
    kotlin("multiplatform") version "2.0.0"
}

kotlin {
    jvm()
    js(IR) { browser(); nodejs() }
    linuxX64()

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.6.0")
        }
        commonTest.dependencies {
            implementation(kotlin("test"))
        }
        jvmMain.dependencies {
            implementation("org.slf4j:slf4j-api:2.0.13")
        }
        jsMain.dependencies { /* npm deps via kotlin-wrappers */ }
    }
}
</code></pre>

<h2>Estrutura de diretórios</h2>
<pre><code class="language-bash">src/
├── commonMain/kotlin/   # API e implementação compartilhada
├── commonTest/kotlin/   # testes que rodam em todas as plataformas
├── jvmMain/kotlin/       # implementações específicas JVM
├── jvmTest/kotlin/
├── jsMain/kotlin/
└── linuxX64Main/kotlin/
</code></pre>

<h2>expect / actual</h2>
<p>Declare a assinatura em <code>commonMain</code> com <code>expect</code> e implemente com <code>actual</code> em cada plataforma:</p>
<pre><code class="language-kotlin">// commonMain
expect class Plataforma() {
    val nome: String
}

expect fun agoraEpochMs(): Long
</code></pre>
<pre><code class="language-kotlin">// jvmMain
actual class Plataforma actual constructor() {
    actual val nome: String = "JVM \${System.getProperty("java.version")}"
}
actual fun agoraEpochMs(): Long = System.currentTimeMillis()
</code></pre>
<pre><code class="language-kotlin">// jsMain
actual class Plataforma actual constructor() {
    actual val nome: String = "JS"
}
actual fun agoraEpochMs(): Long = js("Date.now()") as Double).toLong()
</code></pre>

<h2>Exemplo prático: relógio compartilhado</h2>
<pre><code class="language-kotlin">// commonMain
class Relogio {
    fun agora(): Long = agoraEpochMs()
    fun banner(): String = "Em \${Plataforma().nome} são \${agora()} ms"
}

// commonTest
class RelogioTest {
    @Test fun naoZero() {
        assertTrue(Relogio().agora() &gt; 0)
    }
}
</code></pre>

<h2>Hierarquia de source sets</h2>
<p>Source sets podem se compor: <code>concurrentMain</code> agrega JVM+Native (que têm threads), enquanto JS herda só de <code>commonMain</code>. Configure com <code>kotlin { applyDefaultHierarchyTemplate() }</code> em Kotlin 1.9+ para a estrutura padrão automaticamente.</p>

<h2>Quando usar KMP</h2>
<ul>
  <li>Compartilhar regras de negócio entre Android e iOS (KMP Mobile).</li>
  <li>Cliente HTTP/parsing reutilizado em servidor + frontend JS.</li>
  <li>SDKs publicados para múltiplas plataformas (analytics, billing).</li>
  <li>Domínio puro (DDD) reutilizado entre serviços JVM e Native.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Bibliotecas Java <strong>não</strong> existem em <code>commonMain</code> — só dá para usá-las em <code>jvmMain</code>.</li>
  <li>Coroutines, serialization, datetime e ktor-client são multiplataforma; muitas outras não.</li>
  <li>Tempo de build cresce com o número de targets — ative só os que você publica.</li>
  <li>iOS exige Xcode + macOS para gerar o framework.</li>
  <li>Compose Multiplatform é uma camada acima de KMP — vale aprender separado.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Foco em domínio</div><div>O sweet spot do KMP é compartilhar lógica pura (validação, modelos, casos de uso). UI e integrações específicas geralmente continuam por plataforma.</div></div>

<div class="callout callout-warn"><div class="callout-title">Estabilidade por target</div><div>JVM, JS e iOS estão estáveis; Wasm e alguns Native ainda evoluem rápido. Confira a página oficial de stability antes de adotar em produção.</div></div>
`}} />
    </article>
  );
}

export default function ProjetoCli() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Projetos · intermediario · 14 min</div>
      <h1>Projeto: CLI com Clikt</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Vamos construir uma CLI completa em Kotlin usando <strong>Clikt</strong>, a biblioteca padrão de fato para CLIs na JVM Kotlin. O projeto cobre <strong>subcomandos</strong>, <strong>opções tipadas</strong>, <strong>validação</strong>, <strong>output colorido</strong> com <code>mordant</code> e <strong>packaging</strong> em shadow JAR executável.</p>

<h2>O que vamos construir</h2>
<p>Uma CLI <code>tarefas</code> que gerencia uma lista local de TODOs em JSON. Comandos: <code>add</code>, <code>list</code>, <code>done</code>, <code>rm</code>. Saída colorida, validação de entrada e empacotamento como JAR executável.</p>

<h2>Estrutura de diretórios</h2>
<pre><code class="language-bash">tarefas-cli/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle/
│   └── libs.versions.toml
└── src/
    ├── main/kotlin/com/exemplo/tarefas/
    │   ├── Main.kt
    │   ├── Tarefa.kt
    │   ├── Repositorio.kt
    │   └── comandos/
    │       ├── AddCommand.kt
    │       ├── ListCommand.kt
    │       ├── DoneCommand.kt
    │       └── RmCommand.kt
    └── test/kotlin/com/exemplo/tarefas/
        └── RepositorioTest.kt</code></pre>

<h2>settings.gradle.kts</h2>
<pre><code class="language-kotlin">rootProject.name = "tarefas-cli"

dependencyResolutionManagement {
    repositories { mavenCentral() }
}</code></pre>

<h2>gradle/libs.versions.toml</h2>
<pre><code class="language-yaml">[versions]
kotlin = "2.0.20"
clikt = "4.4.0"
mordant = "2.7.1"
serialization = "1.7.1"
shadow = "8.1.1"

[libraries]
clikt = { module = "com.github.ajalt.clikt:clikt", version.ref = "clikt" }
mordant = { module = "com.github.ajalt.mordant:mordant", version.ref = "mordant" }
kotlinx-serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "serialization" }

[plugins]
kotlin-jvm = { id = "org.jetbrains.kotlin.jvm", version.ref = "kotlin" }
kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
shadow = { id = "com.github.johnrengelman.shadow", version.ref = "shadow" }</code></pre>

<h2>build.gradle.kts</h2>
<pre><code class="language-kotlin">plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.shadow)
    application
}

group = "com.exemplo"
version = "1.0.0"

dependencies {
    implementation(libs.clikt)
    implementation(libs.mordant)
    implementation(libs.kotlinx.serialization.json)
    testImplementation(kotlin("test"))
}

application {
    mainClass.set("com.exemplo.tarefas.MainKt")
}

kotlin { jvmToolchain(17) }

tasks.test { useJUnitPlatform() }

tasks.shadowJar {
    archiveBaseName.set("tarefas")
    archiveClassifier.set("")
    archiveVersion.set("")
    mergeServiceFiles()
}</code></pre>

<h2>Modelo, repositório e main</h2>
<pre><code class="language-kotlin">// Tarefa.kt + Repositorio.kt + Main.kt
@Serializable
data class Tarefa(val id: Int, val titulo: String, val concluida: Boolean = false)

class Repositorio(private val arquivo: Path) {
    private val json = Json { prettyPrint = true }

    fun carregar(): List&lt;Tarefa&gt; =
        if (Files.exists(arquivo)) json.decodeFromString(Files.readString(arquivo))
        else emptyList()

    fun salvar(t: List&lt;Tarefa&gt;) {
        Files.createDirectories(arquivo.parent)
        Files.writeString(arquivo, json.encodeToString(t))
    }

    fun proximoId(): Int = (carregar().maxOfOrNull { it.id } ?: 0) + 1
}

class Tarefas : CliktCommand(name = "tarefas", help = "Gerencia tarefas locais") {
    val arquivo: Path by option("--arquivo", "-f").path()
        .default(Paths.get(System.getProperty("user.home"), ".tarefas", "data.json"))
    override fun run() = Unit
}

fun main(args: Array&lt;String&gt;) = Tarefas()
    .subcommands(AddCommand(), ListCommand(), DoneCommand(), RmCommand())
    .main(args)</code></pre>

<pre><code class="language-kotlin">// comandos/AddCommand.kt e ListCommand.kt (resumido)
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.arguments.argument
import com.github.ajalt.clikt.parameters.arguments.validate
import com.github.ajalt.clikt.parameters.options.flag
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.mordant.rendering.TextColors.*

class AddCommand : CliktCommand(name = "add", help = "Adiciona tarefa") {
    private val titulo by argument()
        .validate { require(it.length in 3..120) { "Título de 3 a 120 chars" } }

    override fun run() {
        val pai = currentContext.findRoot().command as Tarefas
        val repo = Repositorio(pai.arquivo)
        val nova = Tarefa(id = repo.proximoId(), titulo = titulo)
        repo.salvar(repo.carregar() + nova)
        echo(green("✔ tarefa #\${nova.id} criada"))
    }
}

class ListCommand : CliktCommand(name = "list", help = "Lista tarefas") {
    private val tudo by option("--all", "-a").flag()
    override fun run() {
        val pai = currentContext.findRoot().command as Tarefas
        val tarefas = Repositorio(pai.arquivo).carregar()
            .filter { tudo || !it.concluida }
        if (tarefas.isEmpty()) { echo(gray("nenhuma tarefa")); return }
        tarefas.forEach { t -&gt;
            val marca = if (t.concluida) green("[x]") else yellow("[ ]")
            echo("\$marca #\${t.id} \${t.titulo}")
        }
    }
}

// DoneCommand e RmCommand seguem o mesmo padrão: argumento int + load/update/save.</code></pre>

<h2>Teste rápido</h2>
<pre><code class="language-kotlin">// RepositorioTest.kt
class RepositorioTest {
    @Test fun salvaERecarrega() {
        val tmp = Files.createTempFile("t", ".json")
        val repo = Repositorio(tmp)
        repo.salvar(listOf(Tarefa(1, "estudar")))
        assertEquals(1, repo.carregar().size)
    }
}</code></pre>

<h2>Como rodar</h2>
<pre><code class="language-bash">./gradlew shadowJar                                    # build do fat JAR
java -jar build/libs/tarefas.jar add "Estudar Kotlin"
java -jar build/libs/tarefas.jar list --all
java -jar build/libs/tarefas.jar done 1
./gradlew run --args="add 'Comprar pão'"               # dev mode
./gradlew installDist &amp;&amp; ./build/install/tarefas-cli/bin/tarefas list</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Ferramentas internas de DevOps (deploy, migração, geração de código) e wrappers tipados sobre APIs HTTP da empresa.</li>
<li>Scripts de automação que precisam de validação rica e ajuda autodocumentada.</li>
<li>CLI distribuída para clientes via Homebrew ou container.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Shadow JAR pode esconder conflitos — use <code>mergeServiceFiles()</code> sempre.</li>
<li>Cores ANSI atrapalham em pipes; <code>mordant</code> detecta TTY, mas teste em CI.</li>
<li>Não esqueça <code>jvmToolchain(17)</code>: rodar com JDK errado quebra startup.</li>
<li>Para distribuir sem JVM, use GraalVM <code>native-image</code>.</li>
</ul>

<div class="callout callout-info">
<div class="callout-title">Próximos passos</div>
<div>Adicione completion shell (<code>./tarefas --generate-completion bash</code>), persistência em SQLite via <strong>Exposed</strong>, e empacotamento nativo com <strong>GraalVM</strong> para startup &lt; 50 ms.</div>
</div>
`}} />
    </article>
  );
}

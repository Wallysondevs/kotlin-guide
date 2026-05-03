export default function IntellijConfig() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Introdução · iniciante · 8 min</div>
      <h1>Configurando IntelliJ</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>O IntelliJ IDEA (Community ou Ultimate) é o IDE de referência para Kotlin — feito pela mesma JetBrains que mantém a linguagem. Configurar bem o ambiente reduz fricção diária: atalhos certos, code style consistente, inspeções ativas e <em>live templates</em> aceleram o trabalho do iniciante ao senior.</p>

<h2>Conceito</h2>
<p>O IntelliJ trabalha com <strong>projetos baseados em Gradle</strong> (recomendado) e usa o plugin oficial Kotlin que já vem instalado. Configurações importantes ficam em três níveis: <code>Settings</code> globais (IDE), <code>Project Structure</code> (SDK, JDK, target) e <code>.editorconfig</code>/Gradle (compartilhado com o time).</p>
<pre><code class="language-bash">File &gt; Settings &gt; Editor &gt; Code Style &gt; Kotlin &gt; Set from... &gt; Kotlin style guide</code></pre>

<h2>Plugins essenciais</h2>
<ul>
  <li><strong>Kotlin</strong> — já incluso, mantenha sempre na versão estável mais recente.</li>
  <li><strong>Detekt</strong> — análise estática integrada ao editor.</li>
  <li><strong>Ktlint</strong> — formatação consistente e fix-on-save.</li>
  <li><strong>GitToolBox</strong> — anotações de blame e status no gutter.</li>
  <li><strong>Rainbow Brackets</strong> — leitura de aninhamentos profundos (lambdas, DSLs).</li>
</ul>

<h2>Atalhos que valem o investimento</h2>
<ul>
  <li><code>Shift+Shift</code> — Search Everywhere (arquivos, símbolos, ações).</li>
  <li><code>Ctrl+Alt+L</code> (Cmd+Alt+L) — Reformat Code.</li>
  <li><code>Alt+Enter</code> — quick fix / intention actions (a alma do IDE).</li>
  <li><code>Ctrl+Shift+T</code> — gerar/navegar para teste.</li>
  <li><code>Ctrl+B</code> — Go to declaration.</li>
  <li><code>Ctrl+Alt+V</code> — Extract variable; <code>Ctrl+Alt+M</code> — Extract method.</li>
</ul>

<h2>Live templates</h2>
<p>Live templates expandem abreviações em snippets. Já vêm vários, e você pode criar os seus em <code>Settings &gt; Editor &gt; Live Templates &gt; Kotlin</code>.</p>
<pre><code class="language-kotlin">// Digite "main" + Tab
fun main() {
    println("Hello")
}

// Digite "fun0" + Tab
fun name() {

}

// Digite "iter" + Tab dentro de uma coleção
for (item in items) {

}</code></pre>

<h2>Exemplo prático: novo projeto Kotlin/JVM</h2>
<pre><code class="language-bash">File &gt; New &gt; Project
  Language: Kotlin
  Build system: Gradle
  Gradle DSL: Kotlin
  JDK: 17 (Temurin)</code></pre>
<pre><code class="language-groovy">plugins {
    kotlin("jvm") version "2.0.20"
}

repositories { mavenCentral() }

dependencies {
    testImplementation(kotlin("test"))
}

kotlin { jvmToolchain(17) }</code></pre>

<h2>Inspeções e Run configurations</h2>
<ul>
  <li>Em <code>Settings &gt; Editor &gt; Inspections &gt; Kotlin</code>, eleve para <em>Warning</em> regras como "Redundant qualifier name" e "Convert to single-expression function".</li>
  <li>Crie <strong>Run Configurations</strong> reutilizáveis para tarefas Gradle (<code>./gradlew test</code>, <code>./gradlew bootRun</code>).</li>
  <li>Use <code>Compound</code> para subir backend + frontend juntos.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Habilite <strong>Build, Execution, Deployment &gt; Compiler &gt; Kotlin Compiler &gt; Enable incremental compilation</strong> e <strong>Build project automatically</strong> para feedback instantâneo.</div></div>

<h2>Boas práticas</h2>
<ul>
  <li>Comite um <code>.editorconfig</code> com indent 4, max line 120, charset utf-8.</li>
  <li>Use <code>Code With Me</code> para pair programming remoto.</li>
  <li>Evite plugins exóticos no início — IntelliJ já é bastante completo.</li>
  <li>Mantenha o IDE atualizado; cada release traz suporte a novas features de Kotlin.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Atalhos para Mac</div><div>Substitua <code>Ctrl</code> por <code>Cmd</code> e <code>Alt</code> por <code>Option</code>. O cheat sheet oficial está em <code>Help &gt; Keymap Reference</code>.</div></div>
`}} />
    </article>
  );
}

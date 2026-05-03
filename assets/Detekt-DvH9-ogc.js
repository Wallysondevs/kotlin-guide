import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function s(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Build e tooling · intermediario · 8 min"}),e.jsx("h1",{children:"Detekt"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Detekt é a principal ferramenta de análise estática para Kotlin. Detecta code smells, complexidade alta, estilo inconsistente, padrões inseguros e dependências acopladas — tudo no build e no IDE, antes de chegar ao code review.</p>

<h2>Conceito</h2>
<p>Detekt roda como tarefa Gradle e/ou plugin do IntelliJ, lê seu código (com ou sem type-resolution) e aplica um catálogo de regras configurável. Saída em CLI, HTML, SARIF, XML — ideal para CI.</p>

<pre><code class="language-groovy">// build.gradle.kts (Kotlin DSL)
plugins {
    id("io.gitlab.arturbosch.detekt") version "1.23.6"
}

detekt {
    toolVersion = "1.23.6"
    config.setFrom("\\$projectDir/detekt.yml")
    baseline = file("\\$projectDir/detekt-baseline.xml")
    buildUponDefaultConfig = true
    parallel = true
}

tasks.withType&lt;io.gitlab.arturbosch.detekt.Detekt&gt;().configureEach {
    jvmTarget = "17"
    reports {
        html.required.set(true)
        sarif.required.set(true)
    }
}</code></pre>

<h2>Configuração: detekt.yml</h2>
<pre><code class="language-yaml">complexity:
  LongMethod:
    active: true
    threshold: 60
  CyclomaticComplexMethod:
    threshold: 15

naming:
  FunctionNaming:
    functionPattern: '[a-z][a-zA-Z0-9]*'

style:
  MagicNumber:
    active: true
    ignoreNumbers: ['-1', '0', '1', '2']
  ReturnCount:
    max: 3

potential-bugs:
  UnsafeCallOnNullableType:
    active: true</code></pre>

<h2>Exemplo prático: rodar e gerar baseline</h2>
<pre><code class="language-bash"># roda análise em todos os módulos
./gradlew detekt

# gera baseline (silencia issues atuais para você adotar gradualmente)
./gradlew detektBaseline

# em CI, falha o build se houver novas issues
./gradlew detekt --no-daemon</code></pre>

<p>O baseline é um XML com hashes das issues existentes. Detekt ignora-as e só reporta <strong>novas</strong> — perfeito para legados que não dá para corrigir tudo de uma vez.</p>

<h2>Type resolution</h2>
<p>Sem type-resolution, Detekt analisa apenas o AST sintático. Com type-resolution, ele tem acesso ao classpath e pode detectar regras mais profundas (ex: <code>UnnecessaryAbstractClass</code>, <code>RedundantSuspendModifier</code>).</p>
<pre><code class="language-groovy">tasks.withType&lt;io.gitlab.arturbosch.detekt.Detekt&gt; {
    classpath.setFrom(sourceSets.main.get().compileClasspath)
}
// ou use a tarefa pronta
./gradlew detektMain</code></pre>

<h2>Custom rules</h2>
<p>Você escreve uma regra estendendo <code>Rule</code> e registrando num <code>RuleSetProvider</code>. Útil para padrões internos da empresa.</p>
<pre><code class="language-kotlin">class NoPrintln(config: Config) : Rule(config) {
    override val issue = Issue(
        id = "NoPrintln",
        severity = Severity.Style,
        description = "Use o logger oficial em vez de println",
        debt = Debt.FIVE_MINS
    )

    override fun visitCallExpression(expression: KtCallExpression) {
        super.visitCallExpression(expression)
        if (expression.calleeExpression?.text == "println") {
            report(CodeSmell(issue, Entity.from(expression), issue.description))
        }
    }
}</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Todo projeto Kotlin de produção — não negociável em times com mais de 2 devs.</li>
  <li>Como gate em PR: GitHub Action <code>detekt-action</code> publica anotações inline.</li>
  <li>Para impor convenções de domínio via custom rules.</li>
  <li>Em refactors grandes: rode localmente para encontrar pontos de complexidade alta.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
  <li>Comece com <code>buildUponDefaultConfig = true</code> e ajuste pontualmente em <code>detekt.yml</code>.</li>
  <li>Comite o baseline e revise reduções nele a cada sprint (ele só deve diminuir).</li>
  <li>Não desligue regras globalmente — use <code>@Suppress("MagicNumber")</code> pontual.</li>
  <li>Combine com <strong>ktlint</strong> (formatação) — Detekt foca em smells, ktlint em estilo.</li>
  <li>Em monorepos, configure no projeto raiz para regras compartilhadas.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Regras valiosas</div><div>Habilite <code>ForbiddenComment</code> com <code>TODO|FIXME</code>, <code>MagicNumber</code> e <code>LongParameterList</code>. Esses três sozinhos elevam a qualidade média de qualquer base.</div></div>

<div class="callout callout-info"><div class="callout-title">SARIF + GitHub</div><div>Suba o relatório SARIF como artefato e o GitHub mostra cada issue como anotação no Pull Request, com link para o arquivo e linha.</div></div>
`}})]})}export{s as default};

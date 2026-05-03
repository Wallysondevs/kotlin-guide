import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function a(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Build e tooling · iniciante · 6 min"}),e.jsx("h1",{children:"Ktlint"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Ktlint é um linter e formatter para Kotlin que aplica o <em>Kotlin Coding Conventions</em> oficial sem configuração. Integrá-lo no Gradle e no CI elimina discussões de style review e mantém o codebase consistente.</p>

<h2>Conceito</h2>
<p>O jeito mais comum em projetos Gradle é o plugin <strong>jlleitschuh/ktlint-gradle</strong> (não confundir com pinterest, que descontinuou o plugin original e mantém apenas o CLI). Ele adiciona tasks <code>ktlintCheck</code> e <code>ktlintFormat</code>.</p>
<pre><code class="language-kotlin">// build.gradle.kts
plugins {
    kotlin("jvm") version "2.0.20"
    id("org.jlleitschuh.gradle.ktlint") version "12.1.1"
}

ktlint {
    version.set("1.3.1")
    android.set(false)
    ignoreFailures.set(false)
    reporters {
        reporter(org.jlleitschuh.gradle.ktlint.reporter.ReporterType.PLAIN)
        reporter(org.jlleitschuh.gradle.ktlint.reporter.ReporterType.CHECKSTYLE)
    }
}
</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-bash"># Verifica estilo
./gradlew ktlintCheck

# Corrige automaticamente o que dá pra corrigir
./gradlew ktlintFormat

# Hook do git para rodar antes do commit
./gradlew addKtlintCheckGitPreCommitHook
</code></pre>
<p>Para customizações, use <code>.editorconfig</code> na raiz do projeto:</p>
<pre><code class="language-bash"># .editorconfig
root = true

[*.{kt,kts}]
indent_style = space
indent_size = 4
max_line_length = 120
ij_kotlin_allow_trailing_comma = true
ij_kotlin_allow_trailing_comma_on_call_site = true
ktlint_standard_no-wildcard-imports = enabled
ktlint_standard_filename = disabled
</code></pre>

<h2>Integração CI</h2>
<pre><code class="language-yaml"># .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 21 }
      - run: ./gradlew ktlintCheck --no-daemon
</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Garantir formatação consistente em times (sem brigas de tabs vs espaços).</li>
<li>Bloquear PRs com violações no CI.</li>
<li>Auto-fix em pre-commit hook ou no save do IDE.</li>
<li>Substituir checagens manuais de imports não usados, ordem de modifiers, etc.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Sempre fixe a versão do ktlint no plugin — <em>quebra de regra</em> entre minor versions é comum.</li>
<li>Configure por <code>.editorconfig</code>, não no Gradle, para que o IDE também respeite.</li>
<li>Não desabilite regras só porque o code review reclamou — discuta primeiro.</li>
<li>Rode <code>ktlintFormat</code> antes de mandar PR; deixe o <code>ktlintCheck</code> só validar no CI.</li>
<li>Em monorepos, aplique o plugin no root via <code>subprojects { }</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Combine ktlint com <strong>detekt</strong>: ktlint cuida de <em>formatação</em>, detekt cuida de <em>complexidade e bugs</em>. Eles se complementam, não se substituem.</div></div>
`}})]})}export{a as default};

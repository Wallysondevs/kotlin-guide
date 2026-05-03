import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function i(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Build e tooling · intermediario · 7 min"}),e.jsx("h1",{children:"Dokka (KDoc)"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p><strong>Dokka</strong> é o gerador oficial de documentação de APIs Kotlin — equivalente ao Javadoc, mas entendendo nullability, extensions, type aliases, propriedades, etc. A sintaxe de comentários é <strong>KDoc</strong>: parecida com Javadoc, mas em Markdown.</p>

<h2>KDoc: sintaxe</h2>
<pre><code class="language-kotlin">/**
 * Calcula o frete para um pedido.
 *
 * Usa a tabela do correio mais um adicional de seguro
 * proporcional ao [valor] declarado.
 *
 * @param peso Peso em quilogramas. Deve ser positivo.
 * @param valor Valor declarado em reais.
 * @return Custo total em centavos.
 * @throws IllegalArgumentException se [peso] for &lt;= 0.
 * @sample com.exemplo.samples.calculaFreteSample
 * @see Pedido
 * @since 1.2
 */
fun calcularFrete(peso: Double, valor: Double): Int {
    require(peso &gt; 0) { "peso deve ser positivo" }
    return (peso * 1000 + valor * 0.01).toInt()
}</code></pre>

<p>Tags úteis: <code>@param</code>, <code>@return</code>, <code>@throws</code>, <code>@receiver</code> (extension), <code>@property</code> (em data class), <code>@constructor</code>, <code>@sample</code>, <code>@see</code>, <code>@since</code>, <code>@suppress</code>. Links com <code>[Tipo]</code> são resolvidos pelo Dokka.</p>

<h2>Plugin no Gradle</h2>
<pre><code class="language-groovy">// build.gradle.kts (root)
plugins {
    id("org.jetbrains.dokka") version "1.9.20"
}

// build.gradle.kts (módulo)
plugins {
    kotlin("jvm")
    id("org.jetbrains.dokka")
}

tasks.dokkaHtml.configure {
    outputDirectory.set(layout.buildDirectory.dir("dokka"))

    dokkaSourceSets.configureEach {
        includes.from("module.md")
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl.set(uri("https://github.com/org/repo/blob/main/src/main/kotlin").toURL())
            remoteLineSuffix.set("#L")
        }
        suppress.set(false)
        skipDeprecated.set(false)
        reportUndocumented.set(true)
        jdkVersion.set(17)
    }
}</code></pre>

<p>Comandos:</p>
<pre><code class="language-bash">./gradlew dokkaHtml         # HTML estático
./gradlew dokkaGfm          # GitHub-flavored Markdown
./gradlew dokkaJavadoc      # Javadoc HTML (compatibilidade)
./gradlew dokkaHtmlMultiModule  # agrega vários módulos</code></pre>

<h2>Multi-module</h2>
<p>Em projetos grandes, configure cada submódulo com Dokka e use <code>dokkaHtmlMultiModule</code> no root para gerar um índice unificado com navegação cruzada.</p>
<pre><code class="language-groovy">// build.gradle.kts (root)
tasks.dokkaHtmlMultiModule.configure {
    outputDirectory.set(rootDir.resolve("docs/api"))
    moduleName.set("Minha API")
}</code></pre>

<h2>Publicar no GitHub Pages</h2>
<pre><code class="language-yaml"># .github/workflows/docs.yml
name: docs
on:
  push: { branches: [main] }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: 'temurin', java-version: '17' }
      - run: ./gradlew dokkaHtmlMultiModule --no-daemon
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/api</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Bibliotecas publicadas (Maven Central) — usuários esperam Javadoc/Dokka.</li>
  <li>SDKs internos consumidos por outras equipes.</li>
  <li>APIs públicas de microserviços (combinado com OpenAPI).</li>
  <li>Documentação versionada por release no GitHub Pages.</li>
  <li>Quando você quer <code>@sample</code> compilável (snippets vivos que não quebram).</li>
</ul>

<h2>Boas práticas</h2>
<ul>
  <li>Documente o <strong>contrato</strong>, não a implementação. "Lança X se Y" é melhor que "usa um if".</li>
  <li>Use <code>@sample</code> apontando para código real em <code>src/test</code> — fica garantido que compila.</li>
  <li>Habilite <code>reportUndocumented = true</code> para CI: força documentação em APIs públicas.</li>
  <li>Mantenha <code>module.md</code> com overview do módulo (Dokka usa como página inicial).</li>
  <li>Para internal/private: marque <code>@suppress</code> ou configure visibility no plugin.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Dokka 2.x</div><div>A versão 2 introduz Gradle Plugin DSL nova e melhor suporte a KMP. Veja <code>org.jetbrains.dokka:dokka-gradle-plugin:2.0.0</code> (release candidate em 2024).</div></div>
`}})]})}export{i as default};

import{j as o}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function l(){return o.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[o.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Introdução · iniciante · 6 min"}),o.jsx("h1",{children:"Instalando o Kotlin"}),o.jsx("div",{dangerouslySetInnerHTML:{__html:`
  <p>Instalar o Kotlin é o primeiro passo para experimentar a linguagem fora do navegador. O ecossistema oferece várias formas de obter o compilador <code>kotlinc</code>, ferramentas de build e a IDE; escolher o caminho certo evita dor de cabeça com versões e PATH.</p>

  <h2>Conceito</h2>
  <p>O Kotlin roda sobre a JVM, então você precisa de um <strong>JDK 17+</strong> instalado. A partir daí, o compilador (<code>kotlinc</code>) pode vir via gerenciador de versões, build tool (Gradle/Maven) ou empacotado em uma IDE como IntelliJ IDEA ou Android Studio.</p>
  <pre><code class="language-bash">java -version
  # openjdk version "17.0.10" 2024-01-16
  kotlinc -version
  # Kotlin version 2.0.20-release-360 (JRE 17.0.10+7)</code></pre>

  <h2>Exemplo prático</h2>
  <p>O caminho mais robusto em macOS/Linux é via <strong>SDKMAN!</strong>:</p>
  <pre><code class="language-bash">curl -s https://get.sdkman.io | bash
  source "\${HOME}/.sdkman/bin/sdkman-init.sh"

  sdk install java 17.0.10-tem
  sdk install kotlin 2.0.20

  kotlinc -script - &lt;&lt;&lt; 'println("Olá Kotlin")'</code></pre>
  <p>No Windows o equivalente é o <strong>Chocolatey</strong> (ou Scoop):</p>
  <pre><code class="language-bash">choco install temurin17
  choco install kotlinc</code></pre>
  <p>No macOS, alternativamente, <strong>Homebrew</strong>:</p>
  <pre><code class="language-bash">brew install --cask temurin@17
  brew install kotlin</code></pre>

  <h2>Quando usar cada opção</h2>
  <ul>
  <li><strong>SDKMAN!</strong>: trocar entre múltiplas versões do JDK e do Kotlin sem dor.</li>
  <li><strong>Homebrew/Chocolatey</strong>: instalação única, gerenciada pelo SO.</li>
  <li><strong>IntelliJ IDEA Community</strong>: já vem com kotlinc embutido — ideal para quem só usa a IDE.</li>
  <li><strong>Android Studio</strong>: obrigatório para apps Android; traz Kotlin alinhado ao Gradle Plugin.</li>
  <li><strong>Gradle wrapper (gradlew)</strong>: em projetos reais, baixe o Kotlin via plugin no <code>build.gradle.kts</code> e nem precisa de kotlinc global.</li>
  </ul>

  <h2>Pegadinhas</h2>
  <ul>
  <li>Esquecer do <code>JAVA_HOME</code>: no macOS use <code>export JAVA_HOME=$(/usr/libexec/java_home -v 17)</code>.</li>
  <li>JDK 8/11 ainda funciona para Kotlin 1.x, mas Kotlin 2.0+ recomenda <strong>JDK 17 LTS</strong>.</li>
  <li>No Windows, conferir o PATH: <code>where kotlinc</code> deve apontar para um único binário.</li>
  <li>Misturar Kotlin do Homebrew com o do IntelliJ pode causar mismatch — em projetos reais, deixe o Gradle ditar a versão.</li>
  </ul>

  <div class="callout callout-tip"><div class="callout-title">Dica</div><div>Para experimentar sem instalar nada, abra <code>play.kotlinlang.org</code>. Para projetos sérios, use sempre o <code>./gradlew</code> que vem no repositório — assim ninguém depende da versão local.</div></div>

  <div class="callout callout-warn"><div class="callout-title">Atenção</div><div>Kotlin 2.0 ativou o compilador K2 por padrão. Plugins antigos do KAPT podem precisar de migração para <strong>KSP</strong>.</div></div>
  `}})]})}export{l as default};

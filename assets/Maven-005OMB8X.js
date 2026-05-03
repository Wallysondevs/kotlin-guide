import{j as t}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function n(){return t.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[t.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Build e tooling · intermediario · 8 min"}),t.jsx("h1",{children:"Maven com Kotlin"}),t.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Embora Gradle Kotlin DSL seja a escolha padrão para projetos novos, Maven ainda é a realidade em muitas empresas — especialmente no ecossistema Spring/Java legado. Felizmente, suportar Kotlin em Maven é simples: basta adicionar o <code>kotlin-maven-plugin</code>.</p>

<h2>Conceito</h2>
<p>O plugin <code>kotlin-maven-plugin</code> hookea-se nas fases <code>process-sources</code> e <code>process-test-sources</code>, compilando <code>.kt</code> antes (ou depois) de <code>.java</code>. Configura-se a versão do JVM target via propriedade Maven.</p>

<h2>Exemplo prático: pom.xml mínimo</h2>
<pre><code class="language-xml">&lt;project xmlns="http://maven.apache.org/POM/4.0.0"&gt;
    &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;
    &lt;groupId&gt;br.com.exemplo&lt;/groupId&gt;
    &lt;artifactId&gt;hello-mvn&lt;/artifactId&gt;
    &lt;version&gt;0.1.0&lt;/version&gt;

    &lt;properties&gt;
        &lt;kotlin.version&gt;2.0.20&lt;/kotlin.version&gt;
        &lt;kotlin.compiler.jvmTarget&gt;21&lt;/kotlin.compiler.jvmTarget&gt;
        &lt;maven.compiler.source&gt;21&lt;/maven.compiler.source&gt;
        &lt;maven.compiler.target&gt;21&lt;/maven.compiler.target&gt;
    &lt;/properties&gt;

    &lt;dependencies&gt;
        &lt;dependency&gt;
            &lt;groupId&gt;org.jetbrains.kotlin&lt;/groupId&gt;
            &lt;artifactId&gt;kotlin-stdlib&lt;/artifactId&gt;
            &lt;version&gt;\${kotlin.version}&lt;/version&gt;
        &lt;/dependency&gt;
    &lt;/dependencies&gt;

    &lt;build&gt;
        &lt;sourceDirectory&gt;src/main/kotlin&lt;/sourceDirectory&gt;
        &lt;testSourceDirectory&gt;src/test/kotlin&lt;/testSourceDirectory&gt;
        &lt;plugins&gt;
            &lt;plugin&gt;
                &lt;groupId&gt;org.jetbrains.kotlin&lt;/groupId&gt;
                &lt;artifactId&gt;kotlin-maven-plugin&lt;/artifactId&gt;
                &lt;version&gt;\${kotlin.version}&lt;/version&gt;
                &lt;executions&gt;
                    &lt;execution&gt;
                        &lt;id&gt;compile&lt;/id&gt;
                        &lt;phase&gt;process-sources&lt;/phase&gt;
                        &lt;goals&gt;&lt;goal&gt;compile&lt;/goal&gt;&lt;/goals&gt;
                    &lt;/execution&gt;
                    &lt;execution&gt;
                        &lt;id&gt;test-compile&lt;/id&gt;
                        &lt;phase&gt;process-test-sources&lt;/phase&gt;
                        &lt;goals&gt;&lt;goal&gt;test-compile&lt;/goal&gt;&lt;/goals&gt;
                    &lt;/execution&gt;
                &lt;/executions&gt;
            &lt;/plugin&gt;
        &lt;/plugins&gt;
    &lt;/build&gt;
&lt;/project&gt;</code></pre>

<h2>Spring + Kotlin no Maven</h2>
<p>Spring exige classes <code>open</code> para proxies. O plugin <code>kotlin-maven-allopen</code> abre automaticamente as classes anotadas com <code>@Component</code>, <code>@Service</code>, etc.:</p>
<pre><code class="language-xml">&lt;plugin&gt;
    &lt;groupId&gt;org.jetbrains.kotlin&lt;/groupId&gt;
    &lt;artifactId&gt;kotlin-maven-plugin&lt;/artifactId&gt;
    &lt;configuration&gt;
        &lt;compilerPlugins&gt;
            &lt;plugin&gt;spring&lt;/plugin&gt;
            &lt;plugin&gt;jpa&lt;/plugin&gt;
        &lt;/compilerPlugins&gt;
    &lt;/configuration&gt;
    &lt;dependencies&gt;
        &lt;dependency&gt;
            &lt;groupId&gt;org.jetbrains.kotlin&lt;/groupId&gt;
            &lt;artifactId&gt;kotlin-maven-allopen&lt;/artifactId&gt;
            &lt;version&gt;\${kotlin.version}&lt;/version&gt;
        &lt;/dependency&gt;
        &lt;dependency&gt;
            &lt;groupId&gt;org.jetbrains.kotlin&lt;/groupId&gt;
            &lt;artifactId&gt;kotlin-maven-noarg&lt;/artifactId&gt;
            &lt;version&gt;\${kotlin.version}&lt;/version&gt;
        &lt;/dependency&gt;
    &lt;/dependencies&gt;
&lt;/plugin&gt;</code></pre>

<h2>Comparação com Gradle</h2>
<ul>
<li><strong>Verbosidade:</strong> Maven é XML-puro; Gradle Kotlin DSL é código com auto-complete.</li>
<li><strong>Velocidade:</strong> Gradle tem build cache e configuration cache; Maven é mais simples mas mais lento em projetos grandes.</li>
<li><strong>Ecossistema Kotlin:</strong> KMP (Kotlin Multiplatform), Compose, e ferramentas novas <strong>só funcionam no Gradle</strong>.</li>
<li><strong>Curva:</strong> Maven é mais previsível; Gradle exige aprender DSL e o modelo de tasks.</li>
</ul>

<h2>Quando ainda usar Maven</h2>
<ul>
<li>Empresa com pipeline CI/CD profundamente acoplado a Maven.</li>
<li>Projeto Spring legado migrando gradualmente para Kotlin.</li>
<li>Equipe com expertise forte em Maven e sem necessidade de KMP.</li>
<li>Bibliotecas internas publicadas em Nexus que já dependem do ciclo de releases do Maven.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Migração suave</div><div>Spring Initializr permite escolher Kotlin + Maven. É a forma mais rápida de gerar um <code>pom.xml</code> correto, com plugins all-open/no-arg já configurados.</div></div>
`}})]})}export{n as default};

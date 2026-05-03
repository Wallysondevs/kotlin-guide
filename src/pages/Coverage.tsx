export default function Coverage() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Testes · intermediario · 7 min</div>
      <h1>Cobertura com Kover/JaCoCo</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Medir cobertura de testes responde a uma pergunta básica: quais linhas/branches do código foram exercitados? Em projetos Kotlin modernos a recomendação é <strong>Kover</strong> (oficial JetBrains, integra direto com o compiler), mas <strong>JaCoCo</strong> ainda é amplamente usado.</p>

<h2>Conceito</h2>
<p>Kover injeta instrumentação durante o build do Kotlin e mede execução real dos testes. Gera relatórios HTML, XML (para SonarQube) e binário <code>.ic</code> (intermediário).</p>
<pre><code class="language-groovy">// build.gradle.kts (Kotlin DSL)
plugins {
    kotlin("jvm") version "2.0.21"
    id("org.jetbrains.kotlinx.kover") version "0.8.3"
}

kover {
    reports {
        verify {
            rule {
                minBound(80) // falha o build abaixo de 80%
            }
        }
    }
}</code></pre>

<h2>Exemplo prático</h2>
<p>Rodar e gerar relatório:</p>
<pre><code class="language-bash">./gradlew test koverHtmlReport
# abre build/reports/kover/html/index.html

./gradlew koverXmlReport      # para SonarQube/Codecov
./gradlew koverVerify         # falha se abaixo do mínimo</code></pre>
<p>Excluir gerados/DTOs do cálculo:</p>
<pre><code class="language-groovy">kover {
    reports {
        filters {
            excludes {
                classes("*.generated.*", "*Dto", "*Application*")
                annotatedBy("kotlinx.serialization.Serializable")
            }
        }
    }
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Bloquear PRs que reduzem cobertura abaixo do limiar acordado.</li>
<li>Visualizar <em>quais</em> branches de <code>when</code> faltam teste.</li>
<li>Integrar com Codecov/Coveralls/SonarQube usando o XML.</li>
<li>Medir cobertura por módulo em projetos multi-módulo Gradle.</li>
<li>Comparar cobertura entre commits no CI.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Foque em cobertura de <em>branches</em>, não só de linhas — é o que pega bugs.</li>
<li>Não persiga 100%: gerados, DTOs e <code>main</code> falseiam o número.</li>
<li>Combine com mutation testing (Pitest) para medir <em>qualidade</em> dos testes.</li>
<li>Em multi-módulo, agregue com <code>kover { merge { /* ... */ } }</code>.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Kover vs JaCoCo</div><div>Kover entende inline functions, lambdas e desugaring de coroutines do Kotlin. JaCoCo, por ser orientado a bytecode Java, costuma reportar linhas mortas falsamente como não cobertas.</div></div>

<div class="callout callout-tip"><div class="callout-title">CI sample</div><div>No GitHub Actions, rode <code>./gradlew test koverXmlReport</code> e use a action <code>codecov/codecov-action</code> apontando para <code>build/reports/kover/report.xml</code>.</div></div>
`}} />
    </article>
  );
}

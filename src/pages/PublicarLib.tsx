export default function PublicarLib() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Build e tooling · avancado · 11 min</div>
      <h1>Publicar lib no Maven Central</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Publicar uma biblioteca no Maven Central torna-a consumível por qualquer projeto Java/Kotlin do mundo via Gradle ou Maven. O processo envolve registrar um namespace na Sonatype, gerar um JAR assinado com GPG e publicar via OSSRH (Nexus). O plugin <code>com.vanniktech.maven.publish</code> automatiza 80% do caminho.</p>

<h2>Pré-requisitos</h2>
<ul>
  <li>Conta no <code>central.sonatype.com</code> com namespace verificado (ex.: <code>io.github.seu-usuario</code>).</li>
  <li>Chave GPG gerada e enviada a um keyserver público.</li>
  <li>Token de usuário gerado no portal Sonatype (substitui senha).</li>
  <li>POM com licença, SCM, developers — Maven Central é estrito sobre metadados.</li>
</ul>

<h2>Configuração com vanniktech-maven-publish</h2>
<pre><code class="language-groovy">// build.gradle.kts
plugins {
    kotlin("jvm") version "2.0.20"
    id("com.vanniktech.maven.publish") version "0.30.0"
}

group = "io.github.seu-usuario"
version = "0.1.0"

mavenPublishing {
    publishToMavenCentral(SonatypeHost.CENTRAL_PORTAL, automaticRelease = true)
    signAllPublications()

    coordinates(group as String, "minha-lib", version as String)
    pom {
        name.set("Minha Lib")
        description.set("Utilitários Kotlin para X.")
        url.set("https://github.com/seu-usuario/minha-lib")
        licenses {
            license {
                name.set("Apache-2.0")
                url.set("https://www.apache.org/licenses/LICENSE-2.0.txt")
            }
        }
        developers {
            developer { id.set("seu-usuario"); name.set("Seu Nome"); email.set("voce@x.com") }
        }
        scm {
            url.set("https://github.com/seu-usuario/minha-lib")
            connection.set("scm:git:git://github.com/seu-usuario/minha-lib.git")
            developerConnection.set("scm:git:ssh://git@github.com/seu-usuario/minha-lib.git")
        }
    }
}</code></pre>

<h2>Credenciais (~/.gradle/gradle.properties)</h2>
<pre><code class="language-bash">mavenCentralUsername=USUARIO_TOKEN
mavenCentralPassword=SENHA_TOKEN
signing.keyId=ABCD1234
signing.password=senha-da-chave
signing.secretKeyRingFile=/home/voce/.gnupg/secring.gpg

# Em CI prefira chaves in-memory:
signingInMemoryKey=base64-da-chave-gpg-exportada
signingInMemoryKeyPassword=senha</code></pre>

<h2>Publicação manual</h2>
<pre><code class="language-bash"># Para o Maven local (smoke test)
./gradlew publishToMavenLocal

# Para o Central Portal (Sonatype)
./gradlew publishAllPublicationsToMavenCentralRepository</code></pre>
<p>Com <code>automaticRelease = true</code>, o plugin promove o staging repository assim que a validação passa. Sem isso, é preciso liberar manualmente no portal.</p>

<h2>Automatizando com GitHub Actions</h2>
<pre><code class="language-yaml">name: Publish
on:
  push:
    tags: ["v*"]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: "17" }
      - uses: gradle/actions/setup-gradle@v3
      - name: Publish
        env:
          ORG_GRADLE_PROJECT_mavenCentralUsername: \${{ secrets.OSSRH_USERNAME }}
          ORG_GRADLE_PROJECT_mavenCentralPassword: \${{ secrets.OSSRH_PASSWORD }}
          ORG_GRADLE_PROJECT_signingInMemoryKey: \${{ secrets.GPG_PRIVATE_KEY }}
          ORG_GRADLE_PROJECT_signingInMemoryKeyPassword: \${{ secrets.GPG_PASSPHRASE }}
        run: ./gradlew publishAllPublicationsToMavenCentralRepository --no-configuration-cache</code></pre>

<div class="callout callout-info"><div class="callout-title">Central Portal vs OSSRH legado</div><div>Desde 2024, novas contas usam o "Central Portal" (central.sonatype.com). Tutoriais antigos referenciam <code>oss.sonatype.org</code> e plugin <code>maven-publish</code> direto, mas o fluxo recomendado hoje é via Central Portal + plugin Vanniktech.</div></div>

<h2>Quando publicar publicamente</h2>
<ul>
  <li>Bibliotecas reusáveis entre projetos da empresa ou comunidade.</li>
  <li>SDKs para integração com sua API/produto.</li>
  <li>Plugins Gradle ou Kotlin compilers próprios.</li>
  <li>Quando uma cópia interna em <code>libs/</code> está virando dor.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>POM incompleto</strong>: faltando licença/scm/developer, a validação rejeita o release.</li>
  <li><strong>Versão -SNAPSHOT</strong>: Central Portal não aceita; use SNAPSHOTs em repositório separado (s01.oss.sonatype.org).</li>
  <li><strong>Reuso de versão</strong>: uma vez liberada, não dá para sobrescrever. Sempre incremente.</li>
  <li><strong>Sources/Javadoc</strong>: o plugin gera automaticamente; sem eles o release é rejeitado.</li>
  <li><strong>Replicação</strong>: pode levar 30 min até o artefato aparecer em <code>repo1.maven.org</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Boas práticas</div><div>Adote SemVer rigorosamente, escreva CHANGELOG por release e use Renovate/Dependabot para manter as próprias dependências em dia. Lib popular com versões erráticas perde tração rápido.</div></div>
`}} />
    </article>
  );
}

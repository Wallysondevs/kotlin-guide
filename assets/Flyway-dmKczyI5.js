import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Banco de dados · intermediario · 8 min"}),e.jsx("h1",{children:"Migrations com Flyway"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Flyway versiona o schema do banco como uma sequência ordenada de scripts SQL. Cada migration roda uma única vez, em ordem, e o estado fica registrado na tabela <code>flyway_schema_history</code>. É a forma padrão da indústria de evoluir schemas com segurança.</p>

<h2>Conceito</h2>
<p>Os arquivos seguem o padrão <code>V&lt;versao&gt;__&lt;descricao&gt;.sql</code>. Existem três tipos:</p>
<ul>
<li><strong>Versioned</strong> (<code>V1__init.sql</code>): roda uma vez, em ordem.</li>
<li><strong>Repeatable</strong> (<code>R__views.sql</code>): roda sempre que o checksum muda — bom para views/procs.</li>
<li><strong>Undo</strong> (<code>U1__init.sql</code>): rollback (apenas Flyway Teams).</li>
</ul>
<pre><code class="language-sql">-- src/main/resources/db/migration/V1__init.sql
CREATE TABLE usuario (
    id    BIGSERIAL PRIMARY KEY,
    nome  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);</code></pre>

<h2>Exemplo prático — Spring Boot</h2>
<pre><code class="language-groovy">// build.gradle.kts
dependencies {
    implementation("org.flywaydb:flyway-core:10.17.0")
    runtimeOnly("org.postgresql:postgresql")
}</code></pre>
<pre><code class="language-yaml">spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/app
    username: app
    password: app
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true</code></pre>
<p>Com Ktor, chame manualmente:</p>
<pre><code class="language-kotlin">import org.flywaydb.core.Flyway

fun migrar(jdbcUrl: String, user: String, pass: String) {
    Flyway.configure()
        .dataSource(jdbcUrl, user, pass)
        .locations("classpath:db/migration")
        .load()
        .migrate()
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Evolução incremental de schemas em times grandes.</li>
<li>Sincronizar dev/staging/prod com a mesma sequência.</li>
<li>Provisionar bancos efêmeros em testes integrados (Testcontainers + <code>migrate()</code>).</li>
<li>Manter views/funções com <code>R__</code>.</li>
<li>Rodar migrations em pipeline de CD antes de subir o app.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Migrations são <strong>imutáveis</strong>: nunca edite uma já aplicada — crie outra.</li>
<li>Versione os SQLs no mesmo repositório do código.</li>
<li>Para alterações destrutivas, use estratégia expand/contract em duas releases.</li>
<li>Valide localmente com <code>flywayInfo</code> e <code>flywayValidate</code>.</li>
<li>Em CI, rode migrations contra um Postgres limpo e teste os DAOs.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Checksums</div><div>Editar uma migration aplicada quebra o checksum. Em emergência, use <code>flyway repair</code>, mas avise o time — é sintoma de processo errado.</div></div>

<div class="callout callout-tip"><div class="callout-title">Liquibase como alternativa</div><div>Se preferir mudanças declarativas em XML/YAML/JSON com rollback nativo, considere Liquibase. Para times que pensam em SQL puro, Flyway é mais direto.</div></div>
`}})]})}export{r as default};

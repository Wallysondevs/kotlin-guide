export default function ProjetoSpringFullstack() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Projetos · avancado · 14 min</div>
      <h1>Projeto: Spring + Thymeleaf fullstack</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Vamos construir um app fullstack <strong>server-rendered</strong> com Spring Boot 3.3, Thymeleaf, Spring Security, JPA + Postgres e deploy via Docker. Cenário: gerenciador simples de tarefas com login, CRUD e roles. Ideal para quem quer um stack JVM enxuto sem SPA.</p>

<h2>Estrutura do projeto</h2>
<pre><code class="language-bash">tarefas-app/
├── build.gradle.kts
├── settings.gradle.kts
├── Dockerfile
├── compose.yaml
├── src/main/
│   ├── kotlin/com/exemplo/tarefas/
│   │   ├── TarefasApplication.kt
│   │   ├── config/SecurityConfig.kt
│   │   ├── domain/{Tarefa.kt, Usuario.kt}
│   │   ├── repo/{TarefaRepository.kt, UsuarioRepository.kt}
│   │   ├── service/{TarefaService.kt, UsuarioService.kt}
│   │   └── web/{HomeController.kt, TarefaController.kt}
│   └── resources/
│       ├── application.yml
│       ├── templates/{layout.html, login.html, tarefas/list.html, tarefas/form.html}
│       ├── static/css/app.css
│       └── db/migration/V1__init.sql
└── src/test/kotlin/com/exemplo/tarefas/...</code></pre>

<h2>build.gradle.kts</h2>
<pre><code class="language-groovy">plugins {
    kotlin("jvm") version "2.0.20"
    kotlin("plugin.spring") version "2.0.20"
    kotlin("plugin.jpa") version "2.0.20"
    id("org.springframework.boot") version "3.3.4"
    id("io.spring.dependency-management") version "1.1.6"
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.thymeleaf.extras:thymeleaf-extras-springsecurity6")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    runtimeOnly("org.postgresql:postgresql")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.testcontainers:postgresql:1.20.3")
}

kotlin { jvmToolchain(21) }</code></pre>

<h2>application.yml</h2>
<pre><code class="language-yaml">spring:
  datasource:
    url: jdbc:postgresql://\${DB_HOST:localhost}:5432/\${DB_NAME:tarefas}
    username: \${DB_USER:tarefas}
    password: \${DB_PASS:tarefas}
  jpa:
    hibernate.ddl-auto: validate
    open-in-view: false
  flyway:
    enabled: true
    locations: classpath:db/migration
server:
  port: 8080
  error.whitelabel.enabled: false</code></pre>

<h2>Domain</h2>
<pre><code class="language-kotlin">// domain/Tarefa.kt
package com.exemplo.tarefas.domain

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "tarefas")
class Tarefa(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, length = 200)
    var titulo: String,

    @Column(length = 2000)
    var descricao: String? = null,

    @Column(nullable = false)
    var concluida: Boolean = false,

    @Column(nullable = false)
    var criadaEm: Instant = Instant.now(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dono_id", nullable = false)
    var dono: Usuario,
)</code></pre>

<h2>Repository e Service</h2>
<pre><code class="language-kotlin">// repo/TarefaRepository.kt
interface TarefaRepository : JpaRepository&lt;Tarefa, Long&gt; {
    fun findByDonoUsernameOrderByCriadaEmDesc(username: String): List&lt;Tarefa&gt;
}

// service/TarefaService.kt
@Service
@Transactional
class TarefaService(
    private val repo: TarefaRepository,
    private val usuarios: UsuarioRepository,
) {
    fun listarPara(username: String) = repo.findByDonoUsernameOrderByCriadaEmDesc(username)

    fun criar(username: String, titulo: String, descricao: String?): Tarefa {
        val dono = usuarios.findByUsername(username) ?: error("usuário não existe")
        return repo.save(Tarefa(titulo = titulo, descricao = descricao, dono = dono))
    }

    fun alternarConcluida(id: Long, username: String) {
        val t = repo.findById(id).orElseThrow()
        check(t.dono.username == username) { "não é dona da tarefa" }
        t.concluida = !t.concluida
    }
}</code></pre>

<h2>Controller + Thymeleaf</h2>
<pre><code class="language-kotlin">@Controller
@RequestMapping("/tarefas")
class TarefaController(private val service: TarefaService) {

    @GetMapping
    fun lista(model: Model, auth: Authentication): String {
        model.addAttribute("itens", service.listarPara(auth.name))
        return "tarefas/list"
    }

    @PostMapping
    fun criar(
        @RequestParam titulo: String,
        @RequestParam descricao: String?,
        auth: Authentication,
    ): String {
        service.criar(auth.name, titulo, descricao)
        return "redirect:/tarefas"
    }

    @PostMapping("/{id}/toggle")
    fun toggle(@PathVariable id: Long, auth: Authentication): String {
        service.alternarConcluida(id, auth.name)
        return "redirect:/tarefas"
    }
}</code></pre>

<pre><code class="language-xml">&lt;!-- templates/tarefas/list.html --&gt;
&lt;!DOCTYPE html&gt;
&lt;html xmlns:th="http://www.thymeleaf.org" xmlns:sec="http://www.thymeleaf.org/extras/spring-security"&gt;
&lt;head&gt;&lt;link rel="stylesheet" th:href="@{/css/app.css}"/&gt;&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Olá, &lt;span sec:authentication="name"&gt;&lt;/span&gt;&lt;/h1&gt;
  &lt;form th:action="@{/tarefas}" method="post"&gt;
    &lt;input name="titulo" required/&gt;
    &lt;textarea name="descricao"&gt;&lt;/textarea&gt;
    &lt;button type="submit"&gt;Adicionar&lt;/button&gt;
  &lt;/form&gt;
  &lt;ul&gt;
    &lt;li th:each="t : \${itens}"&gt;
      &lt;form th:action="@{|/tarefas/\${t.id}/toggle|}" method="post" style="display:inline"&gt;
        &lt;button type="submit"&gt;[[\${t.concluida ? '✓' : '○'}]]&lt;/button&gt;
      &lt;/form&gt;
      &lt;span th:text="\${t.titulo}"&gt;&lt;/span&gt;
    &lt;/li&gt;
  &lt;/ul&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>

<h2>Security</h2>
<pre><code class="language-kotlin">@Configuration
class SecurityConfig {
    @Bean
    fun chain(http: HttpSecurity): SecurityFilterChain = http
        .authorizeHttpRequests {
            it.requestMatchers("/css/**", "/login").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
        }
        .formLogin { it.loginPage("/login").defaultSuccessUrl("/tarefas") }
        .logout { it.logoutSuccessUrl("/login?out") }
        .build()

    @Bean fun encoder() = BCryptPasswordEncoder()
}</code></pre>

<h2>Migração SQL</h2>
<pre><code class="language-sql">-- V1__init.sql
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
);

CREATE TABLE tarefas (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao VARCHAR(2000),
    concluida BOOLEAN NOT NULL DEFAULT false,
    criada_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    dono_id BIGINT NOT NULL REFERENCES usuarios(id)
);
CREATE INDEX idx_tarefas_dono ON tarefas(dono_id);</code></pre>

<h2>Dockerfile + compose</h2>
<pre><code class="language-bash"># Dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]</code></pre>

<pre><code class="language-yaml"># compose.yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: tarefas
      POSTGRES_USER: tarefas
      POSTGRES_PASSWORD: tarefas
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]
  app:
    build: .
    depends_on: [db]
    environment:
      DB_HOST: db
    ports: ["8080:8080"]
volumes:
  pgdata:</code></pre>

<h2>Como rodar</h2>
<pre><code class="language-bash"># 1. Build
./gradlew clean bootJar

# 2. Subir tudo
docker compose up --build -d

# 3. Acessar
open http://localhost:8080
# usuário inicial seedável via Flyway V2__seed.sql ou via CommandLineRunner</code></pre>

<h2>Boas práticas</h2>
<ul>
  <li>Use Flyway para schema; <code>ddl-auto: validate</code> impede drift acidental.</li>
  <li>Senhas com BCrypt (custo 10–12); nunca SHA1/MD5.</li>
  <li>Sessions stateful para apps server-rendered (Thymeleaf) — JWT é overkill aqui.</li>
  <li>CSRF habilitado por padrão no Spring Security; Thymeleaf inclui token em forms automaticamente.</li>
  <li>Configure <code>open-in-view: false</code> para evitar lazy loading fora de transação.</li>
  <li>Health endpoint via Actuator: <code>spring-boot-starter-actuator</code> + <code>/actuator/health</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Hot reload</div><div>Adicione <code>spring-boot-devtools</code> em <code>developmentOnly</code> para reload automático ao salvar arquivos durante desenvolvimento.</div></div>

<div class="callout callout-warn"><div class="callout-title">Produção</div><div>Não use a senha do compose em produção. Use Secrets do Docker Swarm/K8s ou um vault (HashiCorp Vault, AWS Secrets Manager).</div></div>
`}} />
    </article>
  );
}

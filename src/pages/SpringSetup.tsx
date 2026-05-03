export default function SpringSetup() {
    return (
      <article className="chapter max-w-3xl mx-auto px-6 py-10">
        <div className="text-xs text-muted-foreground mb-2 font-mono">Spring Boot · intermediario · 10 min</div>
        <h1>Spring Boot + Kotlin</h1>
        <div dangerouslySetInnerHTML={{__html: `
  <p>Kotlin é cidadão de primeira classe no Spring Boot 3.x. O Spring Initializr (<code>start.spring.io</code>) gera projetos com Gradle Kotlin DSL, plugins certos e uma classe principal anotada com <code>@SpringBootApplication</code>.</p>

  <h2>Conceito</h2>
  <p>Dois plugins Kotlin tornam a integração suave: <strong><code>kotlin-spring</code></strong> abre classes anotadas (Spring exige classes não-final para proxy CGLIB) e <strong><code>kotlin-jpa</code></strong> gera construtor sem-args para entidades JPA.</p>

  <h2>Exemplo prático</h2>
  <p>Estrutura típica gerada:</p>
  <pre><code class="language-bash">demo/
  ├── build.gradle.kts
  ├── settings.gradle.kts
  └── src/main/kotlin/com/exemplo/demo/
      ├── DemoApplication.kt
      └── HelloController.kt</code></pre>

  <p>build.gradle.kts:</p>
  <pre><code class="language-groovy">plugins {
      kotlin("jvm") version "2.0.20"
      kotlin("plugin.spring") version "2.0.20"
      kotlin("plugin.jpa") version "2.0.20"
      id("org.springframework.boot") version "3.3.4"
      id("io.spring.dependency-management") version "1.1.6"
  }

  dependencies {
      implementation("org.springframework.boot:spring-boot-starter-web")
      implementation("org.springframework.boot:spring-boot-starter-data-jpa")
      implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
      runtimeOnly("com.h2database:h2")
      testImplementation("org.springframework.boot:spring-boot-starter-test")
  }

  kotlin {
      compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17) }
  }</code></pre>

  <p>Aplicação principal:</p>
  <pre><code class="language-kotlin">package com.exemplo.demo

  import org.springframework.boot.autoconfigure.SpringBootApplication
  import org.springframework.boot.runApplication
  import org.springframework.web.bind.annotation.*

  @SpringBootApplication
  class DemoApplication

  fun main(args: Array&lt;String&gt;) {
      runApplication&lt;DemoApplication&gt;(*args)
  }

  @RestController
  @RequestMapping("/api")
  class HelloController {
      @GetMapping("/hello")
      fun hello(@RequestParam(defaultValue = "mundo") nome: String) =
          mapOf("mensagem" to "Olá, $nome!")
  }</code></pre>

  <h2>Quando usar</h2>
  <ul>
  <li>APIs REST corporativas com integração Spring Security/Cloud.</li>
  <li>Microsserviços com observabilidade (Micrometer + Actuator).</li>
  <li>Camada de persistência com Spring Data JPA/R2DBC.</li>
  <li>Migração gradual de bases Java existentes.</li>
  </ul>

  <h2>Boas práticas</h2>
  <ul>
  <li>Use <code>jackson-module-kotlin</code> — sem ele, classes <code>data</code> com defaults dão erro de desserialização.</li>
  <li>Para <code>@Configuration</code>: o plugin já abre, não precisa de <code>open</code> manual.</li>
  <li>Prefira injeção via construtor: <code>class Service(private val repo: Repo)</code>.</li>
  <li>Em entidades JPA, use <code>var</code> em campos mutáveis e <code>@field:</code> para anotar o backing field corretamente.</li>
  </ul>

  <h2>Como rodar</h2>
  <pre><code class="language-bash">./gradlew bootRun
  # ou
  ./gradlew bootJar &amp;&amp; java -jar build/libs/demo-0.0.1-SNAPSHOT.jar</code></pre>

  <div class="callout callout-info"><div class="callout-title">Dica</div><div>Para hot reload em dev, adicione <code>spring-boot-devtools</code> e habilite "Build project automatically" na IDE.</div></div>
  `}} />
      </article>
    );
  }
  
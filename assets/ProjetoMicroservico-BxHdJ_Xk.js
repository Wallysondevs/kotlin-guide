import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function i(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Projetos · avancado · 14 min"}),e.jsx("h1",{children:"Projeto: microserviço Ktor"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Vamos construir um microserviço de pedidos em Ktor 3 que expõe REST, consome e produz mensagens Kafka, exporta métricas e traces via OpenTelemetry e roda em Docker Compose ao lado de Postgres, Kafka e Jaeger. O foco é mostrar a estrutura completa, não cada linha.</p>

<h2>Estrutura de diretórios</h2>
<pre><code class="language-bash">pedidos/
├── build.gradle.kts
├── settings.gradle.kts
├── docker-compose.yml
├── Dockerfile
└── src/main/kotlin/com/exemplo/pedidos/
    ├── Application.kt
    ├── config/Otel.kt
    ├── http/Routes.kt
    ├── http/Dtos.kt
    ├── domain/Pedido.kt
    ├── domain/PedidoService.kt
    ├── infra/PedidoRepository.kt
    ├── infra/KafkaProducer.kt
    └── infra/KafkaConsumer.kt
</code></pre>

<h2>build.gradle.kts</h2>
<pre><code class="language-groovy">plugins {
    kotlin("jvm") version "2.0.0"
    kotlin("plugin.serialization") version "2.0.0"
    id("io.ktor.plugin") version "3.0.0"
    application
}

application { mainClass.set("io.ktor.server.netty.EngineMain") }

dependencies {
    implementation("io.ktor:ktor-server-netty:3.0.0")
    implementation("io.ktor:ktor-server-content-negotiation:3.0.0")
    implementation("io.ktor:ktor-serialization-kotlinx-json:3.0.0")
    implementation("io.ktor:ktor-server-status-pages:3.0.0")
    implementation("io.ktor:ktor-server-call-logging:3.0.0")
    implementation("io.ktor:ktor-server-metrics-micrometer:3.0.0")

    implementation("org.apache.kafka:kafka-clients:3.7.0")
    implementation("org.postgresql:postgresql:42.7.3")
    implementation("com.zaxxer:HikariCP:5.1.0")
    implementation("org.jetbrains.exposed:exposed-core:0.52.0")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.52.0")

    implementation("io.opentelemetry:opentelemetry-api:1.40.0")
    implementation("io.opentelemetry:opentelemetry-sdk:1.40.0")
    implementation("io.opentelemetry:opentelemetry-exporter-otlp:1.40.0")
    implementation("io.opentelemetry.instrumentation:opentelemetry-ktor-3.0:2.6.0-alpha")

    implementation("io.micrometer:micrometer-registry-prometheus:1.13.0")
    implementation("ch.qos.logback:logback-classic:1.5.6")
}
</code></pre>

<h2>Application.kt</h2>
<pre><code class="language-kotlin">package com.exemplo.pedidos

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.callloging.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.http.*
import io.ktor.server.response.*

fun Application.module() {
    Otel.install(this)
    install(ContentNegotiation) { json() }
    install(CallLogging)
    install(StatusPages) {
        exception&lt;IllegalArgumentException&gt; { call, e -&gt;
            call.respond(HttpStatusCode.BadRequest, mapOf("erro" to (e.message ?: "")))
        }
    }
    routes()
}
</code></pre>

<h2>http/Routes.kt</h2>
<pre><code class="language-kotlin">@kotlinx.serialization.Serializable
data class NovoPedido(val cliente: String, val total: Double)

fun Application.routes() {
    val service = PedidoService(PedidoRepository, KafkaProducer)

    routing {
        get("/health") { call.respond(mapOf("ok" to true)) }

        post("/pedidos") {
            val body = call.receive&lt;NovoPedido&gt;()
            val criado = service.criar(body)
            call.respond(HttpStatusCode.Created, criado)
        }

        get("/pedidos/{id}") {
            val id = call.parameters["id"]?.toLongOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
            service.buscar(id)?.let { call.respond(it) } ?: call.respond(HttpStatusCode.NotFound)
        }
    }
}
</code></pre>

<h2>domain/PedidoService.kt</h2>
<pre><code class="language-kotlin">class PedidoService(
    private val repo: PedidoRepository,
    private val producer: KafkaProducer,
) {
    suspend fun criar(input: NovoPedido): Pedido {
        require(input.total &gt; 0) { "total deve ser positivo" }
        val pedido = repo.salvar(Pedido(cliente = input.cliente, total = input.total))
        producer.publicar("pedidos.criados", pedido.id.toString(), pedido)
        return pedido
    }

    suspend fun buscar(id: Long): Pedido? = repo.porId(id)
}
</code></pre>

<h2>infra/KafkaProducer.kt e Consumer</h2>
<pre><code class="language-kotlin">object KafkaProducer {
    private val producer = org.apache.kafka.clients.producer.KafkaProducer&lt;String, String&gt;(
        java.util.Properties().apply {
            put("bootstrap.servers", System.getenv("KAFKA_BROKERS") ?: "kafka:9092")
            put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer")
            put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer")
        }
    )

    fun publicar(topico: String, chave: String, payload: Any) {
        val json = kotlinx.serialization.json.Json.encodeToString(
            kotlinx.serialization.serializer(payload::class.java), payload
        )
        producer.send(org.apache.kafka.clients.producer.ProducerRecord(topico, chave, json))
    }
}

object KafkaConsumer {
    fun start(topico: String, handler: (String) -&gt; Unit) {
        val c = org.apache.kafka.clients.consumer.KafkaConsumer&lt;String, String&gt;(
            java.util.Properties().apply {
                put("bootstrap.servers", System.getenv("KAFKA_BROKERS") ?: "kafka:9092")
                put("group.id", "pedidos-svc")
                put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer")
                put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer")
            }
        )
        c.subscribe(listOf(topico))
        Thread {
            while (true) c.poll(java.time.Duration.ofMillis(500)).forEach { handler(it.value()) }
        }.start()
    }
}
</code></pre>

<h2>config/Otel.kt</h2>
<pre><code class="language-kotlin">object Otel {
    fun install(app: io.ktor.server.application.Application) {
        val sdk = io.opentelemetry.sdk.OpenTelemetrySdk.builder()
            .setTracerProvider(
                io.opentelemetry.sdk.trace.SdkTracerProvider.builder()
                    .addSpanProcessor(
                        io.opentelemetry.sdk.trace.export.BatchSpanProcessor.builder(
                            io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter.builder()
                                .setEndpoint(System.getenv("OTLP") ?: "http://jaeger:4317")
                                .build()
                        ).build()
                    ).build()
            ).buildAndRegisterGlobal()
        // instrumentação automática Ktor:
        // app.install(io.opentelemetry.instrumentation.ktor.v3_0.server.KtorServerTracing) { setOpenTelemetry(sdk) }
    }
}
</code></pre>

<h2>docker-compose.yml</h2>
<pre><code class="language-yaml">services:
  app:
    build: .
    ports: ["8080:8080"]
    environment:
      KAFKA_BROKERS: kafka:9092
      OTLP: http://jaeger:4317
      DB_URL: jdbc:postgresql://postgres:5432/pedidos
    depends_on: [postgres, kafka, jaeger]

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: pedidos
      POSTGRES_PASSWORD: pedidos
    ports: ["5432:5432"]

  kafka:
    image: bitnami/kafka:3.7
    environment:
      KAFKA_CFG_NODE_ID: 0
      KAFKA_CFG_PROCESS_ROLES: controller,broker
      KAFKA_CFG_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_CFG_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_CFG_CONTROLLER_QUORUM_VOTERS: 0@kafka:9093
      KAFKA_CFG_CONTROLLER_LISTENER_NAMES: CONTROLLER

  jaeger:
    image: jaegertracing/all-in-one:1.56
    ports: ["16686:16686", "4317:4317"]
</code></pre>

<h2>Dockerfile</h2>
<pre><code class="language-bash">FROM gradle:8.7-jdk21 AS build
WORKDIR /src
COPY . .
RUN gradle --no-daemon installDist

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /src/build/install/pedidos /app
EXPOSE 8080
CMD ["./bin/pedidos"]
</code></pre>

<h2>Como rodar</h2>
<pre><code class="language-bash">docker compose build
docker compose up -d
curl -XPOST localhost:8080/pedidos -H 'content-type: application/json' \\\\
  -d '{"cliente":"ada","total":129.9}'
curl localhost:8080/pedidos/1
# Traces: http://localhost:16686
</code></pre>

<h2>Observabilidade na prática</h2>
<ul>
  <li><strong>Logs</strong>: structured via Logback + JSON encoder.</li>
  <li><strong>Métricas</strong>: <code>micrometer-registry-prometheus</code> em <code>/metrics</code>.</li>
  <li><strong>Traces</strong>: OpenTelemetry SDK exportando OTLP gRPC para Jaeger.</li>
  <li><strong>Health</strong>: <code>/health</code> e <code>/ready</code> distintos para liveness/readiness.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Kafka producer não é suspend-friendly nativamente — envolva em <code>Dispatchers.IO</code> ou use <code>kotlinx-kafka</code>.</li>
  <li>Inicie o consumer fora da inicialização do Ktor para não bloquear o boot.</li>
  <li>Gerencie schema com Liquibase/Flyway; não use <code>create-drop</code> em produção.</li>
  <li>Configure <code>graceful shutdown</code> — feche producer/consumer no <code>monitor.subscribe(ApplicationStopping)</code>.</li>
  <li>OTLP por gRPC requer porta 4317 aberta; via HTTP use 4318.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Próximos passos</div><div>Adicione contratos com Avro/Protobuf no Kafka, idempotência com chave de mensagem, retry com Outbox pattern e <code>kotest</code> + <code>testApplication</code> + Testcontainers para testes de integração ponta a ponta.</div></div>

<div class="callout callout-tip"><div class="callout-title">Trace tudo</div><div>Use <code>KtorServerTracing</code> e <code>KtorClientTracing</code> da instrumentação OpenTelemetry; cada chamada HTTP, query e mensagem Kafka vira span correlacionado.</div></div>
`}})]})}export{i as default};

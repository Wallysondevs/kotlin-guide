import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function i(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Spring Boot · intermediario · 8 min"}),e.jsx("h1",{children:"Actuator e observabilidade"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>O <code>spring-boot-starter-actuator</code> expõe endpoints HTTP para healthcheck, métricas, info, env, threads e tracing. Combinado com Micrometer e um backend (Prometheus, Datadog, OTel), forma a base de observabilidade de microsserviços Spring Boot 3 escritos em Kotlin.</p>

<h2>Setup</h2>
<pre><code class="language-groovy">// build.gradle.kts
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("io.micrometer:micrometer-registry-prometheus")
}</code></pre>
<p>Por padrão, apenas <code>/actuator/health</code> e <code>/actuator/info</code> são expostos via HTTP. Outros endpoints existem mas são "desabilitados" para web.</p>

<h2>Configuração</h2>
<pre><code class="language-yaml"># application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,env,threaddump
      base-path: /actuator
  endpoint:
    health:
      show-details: when_authorized
      probes:
        enabled: true
  metrics:
    tags:
      application: \${spring.application.name}
  prometheus:
    metrics:
      export:
        enabled: true</code></pre>

<h2>Health check customizado</h2>
<pre><code class="language-kotlin">import org.springframework.boot.actuate.health.Health
import org.springframework.boot.actuate.health.HealthIndicator
import org.springframework.stereotype.Component

@Component
class ExternalApiHealth(private val client: ExternalClient) : HealthIndicator {
    override fun health(): Health {
        return runCatching { client.ping() }.fold(
            onSuccess = { latency -&gt;
                Health.up().withDetail("latencyMs", latency).build()
            },
            onFailure = { e -&gt;
                Health.down(e).withDetail("endpoint", client.url).build()
            },
        )
    }
}</code></pre>
<p>Spring Boot 3 separa <code>liveness</code> e <code>readiness</code> automaticamente quando <code>probes.enabled = true</code>. Em Kubernetes, configure:</p>
<pre><code class="language-yaml">livenessProbe:  { httpGet: { path: /actuator/health/liveness,  port: 8080 } }
readinessProbe: { httpGet: { path: /actuator/health/readiness, port: 8080 } }</code></pre>

<h2>Métricas customizadas com Micrometer</h2>
<pre><code class="language-kotlin">import io.micrometer.core.instrument.MeterRegistry
import io.micrometer.core.instrument.Timer
import org.springframework.stereotype.Service

@Service
class PedidoService(registry: MeterRegistry) {

    private val criados  = registry.counter("pedidos.criados")
    private val falhas   = registry.counter("pedidos.criados.falha")
    private val duracao: Timer = Timer.builder("pedidos.criar.duracao")
        .publishPercentiles(0.5, 0.95, 0.99)
        .register(registry)

    fun criar(req: PedidoRequest): Pedido = duracao.recordCallable {
        runCatching { repo.criar(req).also { criados.increment() } }
            .onFailure { falhas.increment() }
            .getOrThrow()
    }
}</code></pre>

<h2>Endpoint Prometheus</h2>
<p>Com <code>micrometer-registry-prometheus</code> no classpath, <code>GET /actuator/prometheus</code> retorna métricas no formato OpenMetrics:</p>
<pre><code class="language-bash">curl -s localhost:8080/actuator/prometheus | head
# HELP jvm_memory_used_bytes
# TYPE jvm_memory_used_bytes gauge
# ...
# pedidos_criar_duracao_seconds{quantile="0.95"} 0.084</code></pre>

<h2>Quando usar cada endpoint</h2>
<ul>
  <li><code>/health</code>: liveness/readiness para orquestrador.</li>
  <li><code>/metrics</code>: exploração ad-hoc (formato JSON).</li>
  <li><code>/prometheus</code>: scraping pelo Prometheus/Grafana.</li>
  <li><code>/env</code>, <code>/configprops</code>: debug de configuração — exponha só em ambiente seguro.</li>
  <li><code>/threaddump</code>, <code>/heapdump</code>: troubleshooting de produção (proteja com auth).</li>
  <li><code>/info</code>: build info, git commit, versão (com <code>spring-boot-info</code>).</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Segurança</div><div>Endpoints como <code>/env</code> e <code>/heapdump</code> vazam segredos. Coloque-os atrás de Spring Security ou exponha em uma porta interna (<code>management.server.port</code>) que não vá para a internet.</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Métricas com cardinalidade alta</strong> (ex.: tag por userId) explodem a memória do Prometheus. Limite tags a valores enumeráveis.</li>
  <li><strong>Healthcheck pesado</strong> bloqueia o probe; mantenha em &lt; 1s ou separe readiness de checks profundos.</li>
  <li><strong>Cache de status</strong>: por padrão, status agregado é cacheado por 1s — bom para tráfego alto, ruim para detecção rápida.</li>
  <li><strong>Versões do Micrometer</strong>: Spring Boot 3.x usa Micrometer 1.12+. Misturar versões antigas causa <code>NoSuchMethodError</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Use <code>@Observed</code> (Micrometer Observation) para instrumentar métodos com métricas + tracing OpenTelemetry de uma vez só, sem código manual.</div></div>
`}})]})}export{i as default};

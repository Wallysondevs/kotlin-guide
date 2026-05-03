import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Ktor · avancado · 9 min"}),e.jsx("h1",{children:"WebSockets em Ktor"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Ktor traz suporte nativo a WebSockets em servidor e cliente, com integração natural a coroutines e Flow. É a forma mais limpa de implementar comunicação bidirecional em Kotlin sem boilerplate de Netty cru.</p>

<h2>Conceito</h2>
<p>WebSocket é um protocolo full-duplex sobre HTTP. No Ktor, você instala o plugin <code>WebSockets</code> e define rotas com o builder <code>webSocket("/path") { ... }</code>. O bloco roda dentro de uma sessão (<code>DefaultWebSocketServerSession</code>) com <code>incoming: ReceiveChannel&lt;Frame&gt;</code> e <code>outgoing: SendChannel&lt;Frame&gt;</code>.</p>

<h2>Setup</h2>
<pre><code class="language-groovy">// build.gradle.kts
dependencies {
    implementation("io.ktor:ktor-server-core:2.3.12")
    implementation("io.ktor:ktor-server-netty:2.3.12")
    implementation("io.ktor:ktor-server-websockets:2.3.12")
}</code></pre>

<pre><code class="language-kotlin">import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlin.time.Duration.Companion.seconds

fun main() {
    embeddedServer(Netty, port = 8080) {
        install(WebSockets) {
            pingPeriod = 15.seconds
            timeout = 60.seconds
            maxFrameSize = Long.MAX_VALUE
            masking = false
        }
        routing {
            webSocket("/echo") {
                for (frame in incoming) {
                    if (frame is Frame.Text) {
                        val text = frame.readText()
                        send(Frame.Text("eco: \\$text"))
                    }
                }
            }
        }
    }.start(wait = true)
}</code></pre>

<h2>Exemplo prático: chat broadcast</h2>
<pre><code class="language-kotlin">import io.ktor.websocket.*
import kotlinx.coroutines.channels.ClosedSendChannelException
import java.util.concurrent.ConcurrentHashMap

class ChatHub {
    private val sessions = ConcurrentHashMap.newKeySet&lt;DefaultWebSocketServerSession&gt;()

    fun add(s: DefaultWebSocketServerSession) { sessions += s }
    fun remove(s: DefaultWebSocketServerSession) { sessions -= s }

    suspend fun broadcast(msg: String) {
        sessions.forEach { s -&gt;
            try { s.send(Frame.Text(msg)) }
            catch (_: ClosedSendChannelException) { sessions -= s }
        }
    }
}

fun Application.chatModule() {
    val hub = ChatHub()
    routing {
        webSocket("/chat") {
            hub.add(this)
            try {
                for (frame in incoming) {
                    when (frame) {
                        is Frame.Text -&gt; hub.broadcast(frame.readText())
                        is Frame.Close -&gt; break
                        else -&gt; { /* binary, ping, pong */ }
                    }
                }
            } finally {
                hub.remove(this)
            }
        }
    }
}</code></pre>

<h2>Frames</h2>
<ul>
  <li><strong>Frame.Text</strong> — string UTF-8.</li>
  <li><strong>Frame.Binary</strong> — bytes arbitrários.</li>
  <li><strong>Frame.Close</strong> — encerramento limpo.</li>
  <li><strong>Frame.Ping / Frame.Pong</strong> — keep-alive (geralmente automáticos).</li>
</ul>

<h2>Integração com Flow</h2>
<pre><code class="language-kotlin">import kotlinx.coroutines.flow.*
import kotlinx.coroutines.channels.consumeEach

webSocket("/cotacoes") {
    val cotacoes: Flow&lt;Double&gt; = cotacaoService.stream()
    cotacoes.collect { preco -&gt;
        send(Frame.Text("\\$preco"))
    }
}

webSocket("/comandos") {
    incoming.consumeEach { frame -&gt;
        if (frame is Frame.Text) commandBus.emit(frame.readText())
    }
}</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Chats, notificações em tempo real, dashboards live.</li>
  <li>Streaming de cotações, métricas, logs.</li>
  <li>Multiplayer leve, colaboração em documentos.</li>
  <li>Servidor → cliente em alta frequência (acima de 1 evento/s) onde polling é caro.</li>
  <li>Quando latência baixa de comando + reposta importa (UI responsiva).</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Sessões expiram em proxies HTTP/1.1 sem ping; configure <code>pingPeriod</code>.</li>
  <li><code>maxFrameSize</code> default é 64KB; aumente para enviar imagens.</li>
  <li>Não bloqueie a coroutine da sessão — delegue para outra coroutine ou Channel.</li>
  <li>Em load balancers (nginx, ALB), habilite suporte a WebSocket (<code>Upgrade</code> header).</li>
  <li>Autenticação: extraia token de query string ou subprotocolo, valide antes do handshake com <code>install(Authentication)</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Cliente Ktor</div><div>O mesmo Ktor tem cliente WebSocket: <code>HttpClient(CIO) { install(WebSockets) }</code> + <code>client.webSocket(...)</code>. Útil para testes de integração e para conectar microsserviços Kotlin entre si.</div></div>

<div class="callout callout-warn"><div class="callout-title">Cuidado com vazamento</div><div>Sempre use <code>try { } finally { hub.remove(this) }</code> para garantir cleanup quando a sessão cair por exceção ou desconexão abrupta.</div></div>
`}})]})}export{r as default};

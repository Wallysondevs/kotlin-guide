export default function SharedFlow() {
    return (
      <article className="chapter max-w-3xl mx-auto px-6 py-10">
        <div className="text-xs text-muted-foreground mb-2 font-mono">Coroutines · avancado · 9 min</div>
        <h1>SharedFlow e events</h1>
        <div dangerouslySetInnerHTML={{__html: `
  <p><code>SharedFlow</code> é o <strong>hot stream</strong> do kotlinx.coroutines projetado para emitir eventos para múltiplos coletores. Diferente de <code>StateFlow</code> (estado), ele modela fluxos de eventos discretos como cliques, mensagens ou notificações.</p>

  <h2>Conceito</h2>
  <p>Um <code>MutableSharedFlow</code> não tem valor inicial; coletores que entram depois <strong>perdem</strong> emissões — a menos que você configure <code>replay</code>. Buffers controlam backpressure quando emissores são mais rápidos que coletores.</p>
  <pre><code class="language-kotlin">val events = MutableSharedFlow&lt;String&gt;(
      replay = 0,
      extraBufferCapacity = 64,
      onBufferOverflow = BufferOverflow.DROP_OLDEST,
  )</code></pre>

  <h2>Exemplo prático</h2>
  <pre><code class="language-kotlin">import kotlinx.coroutines.*
  import kotlinx.coroutines.channels.BufferOverflow
  import kotlinx.coroutines.flow.*

  class EventBus {
      private val _events = MutableSharedFlow&lt;String&gt;(
          replay = 1,
          extraBufferCapacity = 16,
          onBufferOverflow = BufferOverflow.DROP_OLDEST,
      )
      val events = _events.asSharedFlow()

      suspend fun publish(msg: String) = _events.emit(msg)
      fun tryPublish(msg: String) = _events.tryEmit(msg)
  }

  fun main() = runBlocking {
      val bus = EventBus()

      val job = launch {
          bus.events.collect { println("A: $it") }
      }
      bus.publish("login")
      bus.publish("perfil")

      delay(50)
      val job2 = launch {
          bus.events.collect { println("B: $it") } // recebe "perfil" via replay
      }
      delay(50)
      bus.publish("logout")
      delay(50)
      job.cancel(); job2.cancel()
  }</code></pre>

  <h2>Quando usar</h2>
  <ul>
  <li>Eventos one-shot de UI (snackbars, navegações).</li>
  <li>Bus de eventos entre módulos sem acoplamento.</li>
  <li>Notificar múltiplos coletores ativos simultaneamente.</li>
  <li>Pipeline de telemetria/log que aceita perdas.</li>
  </ul>

  <h2>SharedFlow vs Channel</h2>
  <ul>
  <li><strong>Channel</strong>: 1-para-1, cada item é consumido por um único receiver; bloqueia/suspende ao buffer cheio.</li>
  <li><strong>SharedFlow</strong>: 1-para-N, multicasting; controle fino via <code>replay</code> e <code>onBufferOverflow</code>.</li>
  <li>Para "navegação única" prefira Channel ou <code>SharedFlow(replay=0)</code> com <code>tryEmit</code>.</li>
  </ul>

  <h2>Pegadinhas</h2>
  <ul>
  <li><code>replay &gt; 0</code> + <code>collect</code> em escopo errado pode reentregar eventos antigos (ex.: rotação de tela).</li>
  <li><code>tryEmit</code> retorna <code>false</code> se o buffer encher e a política não for DROP — trate o resultado.</li>
  <li>Não use <code>SharedFlow</code> para representar estado: prefira <code>StateFlow</code>.</li>
  </ul>

  <div class="callout callout-warn"><div class="callout-title">Cuidado</div><div>Eventos com <code>replay</code> em ViewModels podem ressurgir após reconfiguração — modele com <code>Channel.receiveAsFlow()</code> quando o consumo deve ser único.</div></div>
  `}} />
      </article>
    );
  }
  
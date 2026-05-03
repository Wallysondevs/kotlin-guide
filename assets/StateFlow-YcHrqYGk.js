import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Coroutines · intermediario · 9 min"}),e.jsx("h1",{children:"StateFlow"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p><code>StateFlow</code> é um <strong>hot flow</strong> que sempre tem um valor "atual" e o emite para qualquer novo coletor. Foi desenhado para representar estado observável — perfeito para ViewModels, configuração reativa e qualquer cenário em que "qual é o valor agora?" faz sentido.</p>

<h2>Conceito</h2>
<p>Diferente de um <code>Flow</code> frio (que só executa quando coletado), o <code>StateFlow</code>:</p>
<ul>
  <li>Exige um <strong>valor inicial</strong> obrigatório.</li>
  <li>Mantém apenas o <strong>valor mais recente</strong> (replay = 1, conflated).</li>
  <li>Ignora emissões iguais ao valor atual (<code>distinctUntilChanged</code> embutido por padrão de igualdade).</li>
  <li>Expõe a propriedade síncrona <code>.value</code>.</li>
</ul>
<pre><code class="language-kotlin">import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

private val _contador = MutableStateFlow(0)
val contador = _contador.asStateFlow()   // expõe só leitura

fun incrementar() { _contador.value += 1 }</code></pre>

<h2>Exemplo prático em ViewModel</h2>
<pre><code class="language-kotlin">data class UiState(
    val carregando: Boolean = false,
    val itens: List&lt;Item&gt; = emptyList(),
    val erro: String? = null,
)

class ItensViewModel(private val repo: Repo) : ViewModel() {

    private val _state = MutableStateFlow(UiState())
    val state = _state.asStateFlow()

    fun carregar() {
        viewModelScope.launch {
            _state.update { it.copy(carregando = true, erro = null) }
            runCatching { repo.listar() }
                .onSuccess { itens -&gt; _state.update { it.copy(carregando = false, itens = itens) } }
                .onFailure { e -&gt; _state.update { it.copy(carregando = false, erro = e.message) } }
        }
    }
}</code></pre>
<p>Use <code>update { ... }</code> para mutações atômicas baseadas no estado anterior — evita race conditions de <code>value = newValue</code>.</p>

<h2>Coletando na UI</h2>
<pre><code class="language-kotlin">// Compose
@Composable
fun Tela(vm: ItensViewModel = viewModel()) {
    val state by vm.state.collectAsStateWithLifecycle()
    when {
        state.carregando -&gt; Spinner()
        state.erro != null -&gt; ErroView(state.erro!!)
        else -&gt; Lista(state.itens)
    }
}

// Activity/Fragment clássico
lifecycleScope.launch {
    repeatOnLifecycle(Lifecycle.State.STARTED) {
        vm.state.collect { render(it) }
    }
}</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Estado de UI em ViewModel ou presenter.</li>
  <li>Configuração que muda em runtime (feature flags, tema, locale).</li>
  <li>"Cache local" reativo de uma entidade (usuário logado, carrinho).</li>
  <li>Bridge entre callbacks legados e código reativo (<code>callbackFlow</code> + <code>stateIn</code>).</li>
</ul>

<h2>StateFlow vs SharedFlow vs LiveData</h2>
<ul>
  <li><strong>StateFlow</strong>: 1 valor sempre presente, conflated, replay = 1.</li>
  <li><strong>SharedFlow</strong>: configurável (replay N, buffer), serve para eventos one-shot.</li>
  <li><strong>LiveData</strong>: legacy Android, lifecycle-aware via API própria; em projetos novos, prefira StateFlow + <code>collectAsStateWithLifecycle</code>.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Por que .value funciona?</div><div>StateFlow guarda o valor em uma referência atômica. Ler <code>.value</code> é thread-safe e síncrono — útil para snapshot, mas evite usar como substituto de coleta reativa.</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Igualdade</strong>: emissões com <code>equals</code> idênticos ao atual são descartadas. Em data classes isso é desejável; em listas mutáveis pode "comer" updates.</li>
  <li><strong>Conflation</strong>: coletor lento perde valores intermediários. Para histórico, use <code>SharedFlow</code> com replay/buffer.</li>
  <li><strong>One-shot events</strong> (toast, navegação): NÃO modele com StateFlow — após coletar, o valor "fica" e re-dispara em recomposição. Use <code>Channel</code> ou <code>SharedFlow(replay=0)</code>.</li>
  <li><strong>stateIn</strong>: para converter um Flow frio em StateFlow, escolha <code>SharingStarted.WhileSubscribed(5_000)</code> em ViewModel para sobreviver a rotações sem vazar.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Mantenha o estado <strong>imutável</strong> (data class com <code>val</code>). Toda mudança vira <code>copy</code> dentro de <code>update { ... }</code>. Isso garante que igualdade funcione e que recomposições do Compose sejam previsíveis.</div></div>
`}})]})}export{r as default};

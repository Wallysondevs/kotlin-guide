import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function l(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Android · intermediario · 10 min"}),e.jsx("h1",{children:"ViewModel + StateFlow"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>No Android moderno, a dupla <code>ViewModel</code> + <code>StateFlow</code> é o padrão para gerenciar estado de tela: o <code>ViewModel</code> sobrevive a rotações de tela e mudanças de configuração; o <code>StateFlow</code> entrega o estado de forma reativa, segura e compatível com Compose.</p>

<h2>Setup</h2>
<pre><code class="language-groovy">// build.gradle.kts
dependencies {
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.6")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.6")
    implementation("androidx.activity:activity-compose:1.9.2")
    implementation("androidx.compose.material3:material3:1.3.0")
}</code></pre>

<h2>Esqueleto de ViewModel</h2>
<pre><code class="language-kotlin">import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class TelaState(
    val carregando: Boolean = false,
    val itens: List&lt;Item&gt; = emptyList(),
    val erro: String? = null,
    val filtro: String = "",
)

class ListaViewModel(
    private val repo: ItemRepository,
    private val savedState: SavedStateHandle,
) : ViewModel() {

    private val _state = MutableStateFlow(
        TelaState(filtro = savedState["filtro"] ?: "")
    )
    val state = _state.asStateFlow()

    init { recarregar() }

    fun setFiltro(q: String) {
        savedState["filtro"] = q
        _state.update { it.copy(filtro = q) }
        recarregar()
    }

    fun recarregar() {
        viewModelScope.launch {
            _state.update { it.copy(carregando = true, erro = null) }
            runCatching { repo.buscar(_state.value.filtro) }
                .onSuccess { itens -&gt;
                    _state.update { it.copy(carregando = false, itens = itens) }
                }
                .onFailure { e -&gt;
                    _state.update { it.copy(carregando = false, erro = e.message) }
                }
        }
    }
}</code></pre>

<h2>Coletando em Compose</h2>
<pre><code class="language-kotlin">import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun ListaScreen(vm: ListaViewModel = viewModel()) {
    val state by vm.state.collectAsStateWithLifecycle()

    Column {
        OutlinedTextField(
            value = state.filtro,
            onValueChange = vm::setFiltro,
            label = { Text("Filtrar") },
        )
        when {
            state.carregando -&gt; CircularProgressIndicator()
            state.erro != null -&gt; Text("Erro: \${state.erro}")
            else -&gt; LazyColumn {
                items(state.itens, key = { it.id }) { item -&gt;
                    ListItem(headlineContent = { Text(item.nome) })
                }
            }
        }
    }
}</code></pre>

<h2>SavedStateHandle</h2>
<p><code>SavedStateHandle</code> persiste valores leves através de "process death" (sistema mata o app por memória). É um <code>Map</code> serializável injetado pelo framework. Use para inputs do usuário, IDs de seleção e outros estados pequenos. Para listas grandes, use Room/DataStore.</p>

<h2>One-shot events</h2>
<p>Eventos como "navegar", "mostrar snackbar" não devem virar <code>StateFlow</code> — coletor recomposto reexibiria o evento. Padrão recomendado:</p>
<pre><code class="language-kotlin">private val _eventos = Channel&lt;Evento&gt;(Channel.BUFFERED)
val eventos = _eventos.receiveAsFlow()

fun salvar() = viewModelScope.launch {
    runCatching { repo.salvar() }
        .onSuccess { _eventos.send(Evento.Sucesso) }
        .onFailure { _eventos.send(Evento.Erro(it.message ?: "")) }
}</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Toda tela com estado não-trivial (formulários, listas, filtros).</li>
  <li>Operações assíncronas que devem sobreviver a rotação.</li>
  <li>Compartilhamento de estado entre Composables-irmãos via <code>viewModel()</code> com escopo de Activity/NavGraph.</li>
  <li>Quando se quer testar lógica de UI sem instrumentação (puro JVM).</li>
</ul>

<div class="callout callout-info"><div class="callout-title">collectAsStateWithLifecycle</div><div>Use sempre a variante "WithLifecycle" no Compose. A versão sem ela mantém coleta ativa mesmo com app em background, gastando bateria e podendo travar UI ao voltar.</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Vazar contexto</strong>: nunca guarde <code>Context</code> de Activity em ViewModel — use <code>AndroidViewModel</code> com <code>Application</code> se precisar.</li>
  <li><strong>Hot StateFlow vs cold Flow</strong>: lembrar que StateFlow ignora valores iguais ao atual; objetos mutáveis bagunçam isso.</li>
  <li><strong>Múltiplas chamadas de carregar</strong>: rotação reinvoca <code>init</code>? Não — ViewModel é reusado. Mas chamadas externas duplicadas devem ser controladas com flags ou <code>distinctUntilChanged</code>.</li>
  <li><strong>viewModelScope</strong> usa <code>SupervisorJob</code>: filhos falham sem derrubar o pai. Trate exceções por launch.</li>
  <li><strong>Process death</strong>: estado em memória se perde. Use SavedStateHandle ou storage persistente.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Boas práticas</div><div>Mantenha o ViewModel "puro" (sem dependências de View, Activity, Compose). Injete repositórios via Hilt/Koin com factory que aceita <code>SavedStateHandle</code>. Resultado: testes de unidade triviais com <code>runTest</code>.</div></div>
`}})]})}export{l as default};

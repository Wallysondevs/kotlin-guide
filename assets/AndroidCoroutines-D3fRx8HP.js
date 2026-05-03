import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function c(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Android · intermediario · 10 min"}),e.jsx("h1",{children:"Coroutines no Android"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>No Android, coroutines substituíram callbacks, AsyncTask e RxJava como o caminho oficial para concorrência. O segredo é usar os <strong>scopes certos</strong> (<code>viewModelScope</code>, <code>lifecycleScope</code>) para que o cancelamento siga o ciclo de vida — eliminando a maior fonte de leaks históricos do Android.</p>

<h2>Conceito</h2>
<p>Cada componente Android tem um scope associado:</p>
<ul>
<li><strong><code>viewModelScope</code></strong>: vive enquanto o <code>ViewModel</code> existe. Cancela em <code>onCleared()</code>.</li>
<li><strong><code>lifecycleScope</code></strong>: vive enquanto a <code>Activity</code>/<code>Fragment</code> não foi destruída.</li>
<li><strong><code>repeatOnLifecycle</code></strong>: re-executa o bloco quando o lifecycle entra em um estado mínimo (ex.: <code>STARTED</code>).</li>
</ul>

<h2>Dependências</h2>
<pre><code class="language-groovy">implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.4")
implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.4")
implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.4")
implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")</code></pre>

<h2>ViewModel + StateFlow</h2>
<pre><code class="language-kotlin">class PerfilViewModel(
    private val repo: UserRepository
) : ViewModel() {

    private val _state = MutableStateFlow&lt;UiState&gt;(UiState.Loading)
    val state: StateFlow&lt;UiState&gt; = _state.asStateFlow()

    init {
        carregar()
    }

    fun carregar() {
        viewModelScope.launch {
            _state.value = UiState.Loading
            _state.value = try {
                val user = withContext(Dispatchers.IO) { repo.buscarUsuario() }
                UiState.Sucesso(user)
            } catch (e: Exception) {
                UiState.Erro(e.message ?: "falha")
            }
        }
    }

    sealed interface UiState {
        data object Loading : UiState
        data class Sucesso(val user: User) : UiState
        data class Erro(val msg: String) : UiState
    }
}</code></pre>

<h2>Coletando com repeatOnLifecycle</h2>
<pre><code class="language-kotlin">class PerfilFragment : Fragment(R.layout.fragment_perfil) {
    private val vm: PerfilViewModel by viewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                vm.state.collect { ui -&gt;
                    when (ui) {
                        is PerfilViewModel.UiState.Loading -&gt; mostrarLoading()
                        is PerfilViewModel.UiState.Sucesso -&gt; mostrar(ui.user)
                        is PerfilViewModel.UiState.Erro -&gt; mostrarErro(ui.msg)
                    }
                }
            }
        }
    }
}</code></pre>

<h2>Compose: collectAsStateWithLifecycle</h2>
<pre><code class="language-kotlin">@Composable
fun PerfilScreen(vm: PerfilViewModel = viewModel()) {
    val ui by vm.state.collectAsStateWithLifecycle()

    when (val s = ui) {
        is PerfilViewModel.UiState.Loading -&gt; CircularProgressIndicator()
        is PerfilViewModel.UiState.Sucesso -&gt; Text("Olá, \${s.user.nome}")
        is PerfilViewModel.UiState.Erro -&gt; Text("Erro: \${s.msg}", color = Color.Red)
    }
}</code></pre>

<h2>Dispatchers</h2>
<ul>
<li><strong><code>Dispatchers.Main</code></strong>: thread principal, atualiza UI. Padrão dentro de <code>viewModelScope</code>.</li>
<li><strong><code>Dispatchers.Main.immediate</code></strong>: como Main, mas roda inline se já estiver na Main — evita um post.</li>
<li><strong><code>Dispatchers.IO</code></strong>: pool elástico para IO bloqueante (HTTP, disco, banco).</li>
<li><strong><code>Dispatchers.Default</code></strong>: CPU-bound (parsing, cálculos). Pool do tamanho dos cores.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Repositórios expõem funções <code>suspend</code>; quem decide o dispatcher é o repositório (com <code>withContext(Dispatchers.IO)</code>), não o caller.</li>
<li>Use <code>StateFlow</code>/<code>SharedFlow</code> para estado e eventos; evite <code>LiveData</code> em código novo.</li>
<li>Em Compose, prefira <code>collectAsStateWithLifecycle()</code> a <code>collectAsState()</code> — respeita lifecycle.</li>
<li>Para chamadas paralelas (ex.: dois endpoints), use <code>coroutineScope { val a = async {...}; val b = async {...}; a.await() to b.await() }</code>.</li>
<li>Evite <code>GlobalScope.launch</code>. Sempre escolha um scope ligado ao lifecycle.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Coletar um <code>Flow</code> diretamente em <code>onCreate</code> sem <code>repeatOnLifecycle</code> mantém a coroutine viva em background — desperdício e potencial bug.</li>
<li>Atualizar UI a partir de <code>Dispatchers.IO</code> crasha. Volte para Main via <code>withContext</code> ou colete via <code>StateFlow</code>.</li>
<li><code>Job</code>s lançados em <code>viewModelScope</code> sobrevivem rotações — bom para requests, mas evite operações que precisam do lifecycle da view.</li>
<li>Excepções em <code>launch</code> não vão para o <code>try/catch</code> ao redor — capture dentro do bloco ou use <code>CoroutineExceptionHandler</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Testes</div><div>Use <code>kotlinx-coroutines-test</code> com <code>runTest { }</code> e <code>StandardTestDispatcher</code>. Para ViewModels, injete o dispatcher no construtor.</div></div>
`}})]})}export{c as default};

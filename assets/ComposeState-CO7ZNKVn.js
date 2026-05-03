import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function s(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Android · intermediario · 10 min"}),e.jsx("h1",{children:"Estado em Compose"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Em Jetpack Compose, estado é tudo o que pode mudar e disparar recomposição. Entender <code>remember</code>, <code>mutableStateOf</code>, <code>derivedStateOf</code>, <code>rememberSaveable</code> e o padrão de state hoisting é essencial para escrever UI reativa, testável e performante.</p>

<h2>mutableStateOf + remember</h2>
<pre><code class="language-kotlin">@Composable
fun Contador() {
    var count by remember { mutableStateOf(0) }
    Column {
        Text("Cliques: \\$count")
        Button(onClick = { count++ }) { Text("Mais um") }
    }
}
</code></pre>
<p><code>mutableStateOf</code> cria um <code>MutableState&lt;T&gt;</code> observável; <code>remember</code> garante que o valor sobreviva à recomposição (mas não a configuração).</p>

<h2>rememberSaveable</h2>
<p>Persiste o valor através de mudanças de configuração (rotação, tema do sistema, processo recriado pelo SO):</p>
<pre><code class="language-kotlin">@Composable
fun NomeForm() {
    var nome by rememberSaveable { mutableStateOf("") }
    OutlinedTextField(value = nome, onValueChange = { nome = it })
}
</code></pre>
<p>Para tipos não-Parcelable, forneça um <code>Saver</code> customizado.</p>

<h2>derivedStateOf</h2>
<p>Use quando um estado é <em>derivado</em> de outros e você só quer recompor quando o resultado mudar — não a cada mudança das fontes.</p>
<pre><code class="language-kotlin">@Composable
fun Lista(itens: List&lt;String&gt;) {
    val state = rememberLazyListState()
    val mostrarTopo by remember {
        derivedStateOf { state.firstVisibleItemIndex &gt; 5 }
    }

    Box {
        LazyColumn(state = state) { items(itens) { Text(it) } }
        if (mostrarTopo) {
            FloatingActionButton(onClick = { /* ... */ }, modifier = Modifier.align(Alignment.BottomEnd)) {
                Icon(Icons.Default.KeyboardArrowUp, null)
            }
        }
    }
}
</code></pre>

<h2>State hoisting</h2>
<p>Em vez de cada componente segurar seu próprio estado, "ice" para o pai. Filhos viram <em>stateless</em> — recebem valor + callback. Ganho: testabilidade, reuso e previsibilidade.</p>
<pre><code class="language-kotlin">@Composable
fun ContadorStateless(valor: Int, onIncrement: () -&gt; Unit) {
    Column {
        Text("Cliques: \\$valor")
        Button(onClick = onIncrement) { Text("Mais um") }
    }
}

@Composable
fun TelaContador() {
    var c by rememberSaveable { mutableStateOf(0) }
    ContadorStateless(valor = c, onIncrement = { c++ })
}
</code></pre>

<h2>Estado em ViewModel</h2>
<pre><code class="language-kotlin">class ChatViewModel : ViewModel() {
    private val _state = MutableStateFlow(ChatUi())
    val state: StateFlow&lt;ChatUi&gt; = _state.asStateFlow()

    fun enviar(texto: String) {
        _state.update { it.copy(mensagens = it.mensagens + texto) }
    }
}

@Composable
fun ChatScreen(vm: ChatViewModel = viewModel()) {
    val ui by vm.state.collectAsStateWithLifecycle()
    // ...
}
</code></pre>

<h2>Quando usar cada API</h2>
<ul>
  <li><strong>remember</strong>: estado local efêmero (animações, expanded/collapsed).</li>
  <li><strong>rememberSaveable</strong>: estado de UI que deve sobreviver à rotação.</li>
  <li><strong>derivedStateOf</strong>: cálculos custosos derivados de estado de alta frequência (scroll, drag).</li>
  <li><strong>StateFlow</strong> em ViewModel: estado de tela/feature compartilhado.</li>
  <li><strong>mutableStateListOf</strong>: listas observáveis sem ter que recriar a List inteira.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Esqueceu o <code>by</code> e usou <code>val state = remember { mutableStateOf(0) }</code>? Lembre de acessar via <code>state.value</code>.</li>
  <li><code>remember</code> sem chave guarda o primeiro valor — passe <code>remember(input) { ... }</code> para invalidar quando <code>input</code> muda.</li>
  <li>Não capture <code>State</code> em coroutines fora de Compose; converta para <code>Flow</code>.</li>
  <li>Mutar uma <code>List</code> normal não dispara recomposição; use <code>mutableStateListOf</code> ou substitua a referência inteira.</li>
  <li>Coletar <code>Flow</code> com <code>collectAsState</code> ignora lifecycle; prefira <code>collectAsStateWithLifecycle</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Stateless é a meta</div><div>Componentes sem estado interno são fáceis de testar com Compose Preview e com <code>createComposeRule()</code>. Reserve estado para o ponto mais alto que faz sentido.</div></div>

<div class="callout callout-warn"><div class="callout-title">Cuidado com leituras em escopos errados</div><div>Ler estado dentro de um <code>LaunchedEffect(Unit)</code> sem chave correta pode disparar com valor stale. Sempre passe as dependências como chave.</div></div>
`}})]})}export{s as default};

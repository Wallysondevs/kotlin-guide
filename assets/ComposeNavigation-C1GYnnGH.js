import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function l(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Android · intermediario · 9 min"}),e.jsx("h1",{children:"Navigation Compose"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`<p><strong>Navigation Compose</strong> é a biblioteca oficial AndroidX para navegação entre <em>composables</em>. Em vez de <code>Fragment</code>s e <code>FragmentManager</code>, você define um grafo declarativo de rotas — cada rota mapeia para um <em>composable</em>.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">// build.gradle.kts (módulo app)
dependencies {
    val nav = "2.8.0"
    implementation("androidx.navigation:navigation-compose:$nav")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.1")
}</code></pre>

<h2>NavController e NavHost</h2>
<pre><code class="language-kotlin">@Composable
fun AppNav() {
    val nav = rememberNavController()
    NavHost(navController = nav, startDestination = "home") {
        composable("home") {
            HomeScreen(onAbrirDetalhe = { id -&gt; nav.navigate("detalhe/$id") })
        }
        composable("detalhe/{id}",
            arguments = listOf(navArgument("id") { type = NavType.LongType })
        ) { entry -&gt;
            val id = entry.arguments?.getLong("id") ?: return@composable
            DetalheScreen(id = id, onVoltar = { nav.popBackStack() })
        }
    }
}</code></pre>

<h2>Type-safe routes (Kotlin Serialization, Nav 2.8+)</h2>
<p>A grande novidade da 2.8 é poder usar <code>@Serializable</code> nas rotas — chega de strings e parsing manual:</p>
<pre><code class="language-kotlin">import kotlinx.serialization.Serializable

@Serializable object Home
@Serializable data class Detalhe(val id: Long, val origem: String = "lista")
@Serializable object Configuracoes

@Composable
fun AppNav() {
    val nav = rememberNavController()
    NavHost(navController = nav, startDestination = Home) {
        composable&lt;Home&gt; {
            HomeScreen(onItem = { id -&gt; nav.navigate(Detalhe(id)) })
        }
        composable&lt;Detalhe&gt; { entry -&gt;
            val args: Detalhe = entry.toRoute()
            DetalheScreen(args.id, args.origem)
        }
        composable&lt;Configuracoes&gt; { ConfigScreen() }
    }
}</code></pre>

<h2>Exemplo prático: lista + detalhe + form</h2>
<pre><code class="language-kotlin">@Serializable object Lista
@Serializable data class Edicao(val id: Long?)

@Composable
fun ProdutosNav(vm: ProdutosVm = viewModel()) {
    val nav = rememberNavController()
    NavHost(navController = nav, startDestination = Lista) {
        composable&lt;Lista&gt; {
            val itens by vm.itens.collectAsState()
            ListaScreen(
                itens = itens,
                onNovo  = { nav.navigate(Edicao(id = null)) },
                onEditar = { id -&gt; nav.navigate(Edicao(id = id)) }
            )
        }
        composable&lt;Edicao&gt; { entry -&gt;
            val args: Edicao = entry.toRoute()
            EdicaoScreen(
                id = args.id,
                onSalvo = { nav.popBackStack() }
            )
        }
    }
}</code></pre>

<h2>BottomBar e nested graphs</h2>
<pre><code class="language-kotlin">@Serializable object FeedRoot
@Serializable object FeedHome
@Serializable object FeedSalvos

NavHost(nav, startDestination = FeedRoot) {
    navigation&lt;FeedRoot&gt;(startDestination = FeedHome) {
        composable&lt;FeedHome&gt;   { FeedHomeScreen() }
        composable&lt;FeedSalvos&gt; { SalvosScreen() }
    }
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Apps Compose-only com múltiplas telas e back stack.</li>
<li>Deep links: <code>composable&lt;Detalhe&gt;(deepLinks = listOf(navDeepLink { uriPattern = "myapp://item/{id}" }))</code>.</li>
<li>Single-Activity architecture moderna (Activity hospeda <code>NavHost</code>).</li>
<li>Compartilhar ViewModel em escopo de subgrafo via <code>hiltViewModel(navController.getBackStackEntry(...))</code>.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Não passe objetos grandes como argumento — use IDs e busque no destino.</li>
<li><code>navigate</code> não é idempotente: clicar duas vezes empilha duas telas. Use <code>launchSingleTop = true</code>.</li>
<li>Para limpar back stack ao navegar para Home: <code>popUpTo(Home) { inclusive = false }</code>.</li>
<li>Rotas type-safe exigem o plugin <code>org.jetbrains.kotlin.plugin.serialization</code> aplicado.</li>
<li>Em testes, use <code>TestNavHostController</code>.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">SavedStateHandle</div><div>Em <code>ViewModel</code> dentro de um destino, injete <code>SavedStateHandle</code> e use <code>handle.toRoute&lt;Detalhe&gt;()</code> para ler argumentos com tipo seguro.</div></div>

<div class="callout callout-tip"><div class="callout-title">Animações</div><div>Use <code>composable&lt;X&gt;(enterTransition = { slideInHorizontally() }, exitTransition = { fadeOut() })</code> para transições por destino sem precisar de <code>AnimatedNavHost</code> de terceiros.</div></div>`}})]})}export{l as default};

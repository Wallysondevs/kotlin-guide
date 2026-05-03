import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function n(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Android · avancado · 10 min"}),e.jsx("h1",{children:"Hilt para DI"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p><strong>Hilt</strong> é a camada do Google sobre o Dagger feita para Android: gera os componentes, conecta scopes ao ciclo de vida (Application, Activity, ViewModel) e elimina a maior parte do boilerplate. Em troca de seguir convenções, você ganha DI tipada, validada em compile time e integrada com Jetpack.</p>

<h2>Conceito</h2>
<p>Hilt opera por anotações. O ponto de entrada é a classe <code>Application</code> com <code>@HiltAndroidApp</code> — isso aciona a geração do componente raiz. A partir daí, Activities, Fragments, Services e ViewModels recebem dependências via <code>@AndroidEntryPoint</code> e <code>@Inject constructor</code>.</p>
<pre><code class="language-kotlin">// build.gradle.kts (módulo app)
plugins {
    id("com.google.dagger.hilt.android")
    id("com.google.devtools.ksp")
}
dependencies {
    implementation("com.google.dagger:hilt-android:2.51.1")
    ksp("com.google.dagger:hilt-compiler:2.51.1")
    implementation("androidx.hilt:hilt-navigation-compose:1.2.0")
}</code></pre>

<h2>Setup mínimo</h2>
<pre><code class="language-kotlin">@HiltAndroidApp
class MeuApp : Application()

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    @Inject lateinit var analytics: Analytics
    // ...
}

class Analytics @Inject constructor(
    private val client: HttpClient
) {
    fun track(event: String) { /* ... */ }
}</code></pre>

<h2>@Module e @InstallIn</h2>
<p>Quando o Hilt não consegue construir um tipo sozinho (interface, classe de terceiros, builder complexo), você fornece via <code>@Module</code> + <code>@Provides</code> ou <code>@Binds</code>. O <code>@InstallIn</code> diz em que componente o módulo vive — define o <strong>scope</strong> e a visibilidade.</p>
<pre><code class="language-kotlin">@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideOkHttp(): OkHttpClient = OkHttpClient.Builder()
        .addInterceptor(HttpLoggingInterceptor())
        .build()

    @Provides
    @Singleton
    fun provideRetrofit(client: OkHttpClient): Retrofit = Retrofit.Builder()
        .baseUrl("https://api.exemplo.com/")
        .client(client)
        .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
        .build()

    @Provides
    fun provideUsuarioApi(retrofit: Retrofit): UsuarioApi =
        retrofit.create(UsuarioApi::class.java)
}</code></pre>
<pre><code class="language-kotlin">@Module
@InstallIn(SingletonComponent::class)
abstract class RepoModule {
    @Binds
    abstract fun bindUsuarioRepo(impl: UsuarioRepoImpl): UsuarioRepo
}</code></pre>

<h2>Scopes e componentes</h2>
<ul>
<li><code>SingletonComponent</code> + <code>@Singleton</code> — vive enquanto a aplicação existir.</li>
<li><code>ActivityRetainedComponent</code> + <code>@ActivityRetainedScoped</code> — sobrevive a recriações por rotação.</li>
<li><code>ViewModelComponent</code> + <code>@ViewModelScoped</code> — escopo do ViewModel.</li>
<li><code>ActivityComponent</code> + <code>@ActivityScoped</code> — recriado a cada Activity.</li>
<li><code>FragmentComponent</code>, <code>ServiceComponent</code>, <code>ViewComponent</code>.</li>
</ul>

<h2>ViewModel injection</h2>
<pre><code class="language-kotlin">@HiltViewModel
class UsuarioViewModel @Inject constructor(
    private val repo: UsuarioRepo,
    savedState: SavedStateHandle
) : ViewModel() {
    private val _ui = MutableStateFlow(UsuarioUi())
    val ui: StateFlow&lt;UsuarioUi&gt; = _ui.asStateFlow()

    fun carregar(id: String) = viewModelScope.launch {
        _ui.update { it.copy(loading = true) }
        runCatching { repo.buscar(id) }
            .onSuccess { u -&gt; _ui.update { it.copy(loading = false, usuario = u) } }
            .onFailure { e -&gt; _ui.update { it.copy(loading = false, erro = e.message) } }
    }
}</code></pre>
<pre><code class="language-kotlin">// Em Compose com hilt-navigation-compose:
@Composable
fun TelaUsuario(vm: UsuarioViewModel = hiltViewModel()) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    // ...
}</code></pre>

<h2>Qualifiers</h2>
<pre><code class="language-kotlin">@Qualifier @Retention(AnnotationRetention.BINARY)
annotation class AuthClient

@Qualifier @Retention(AnnotationRetention.BINARY)
annotation class LoggingClient

@Module
@InstallIn(SingletonComponent::class)
object Clients {
    @Provides @AuthClient @Singleton
    fun auth(): OkHttpClient = OkHttpClient()

    @Provides @LoggingClient @Singleton
    fun logging(): OkHttpClient = OkHttpClient()
}

class Repo @Inject constructor(
    @AuthClient private val client: OkHttpClient
)</code></pre>

<div class="callout callout-info">
<div class="callout-title">KSP &gt; KAPT</div>
<div>A partir do Hilt 2.48, use <code>ksp("hilt-compiler")</code> em vez de <code>kapt</code>. Builds 30-50% mais rápidos e melhor compatibilidade com Kotlin 2.0.</div>
</div>

<h2>Casos de uso</h2>
<ul>
<li>Apps Compose com múltiplos módulos features (data, domain, ui) trocando dependências.</li>
<li>Substituir implementações reais por fakes em testes instrumentados com <code>@HiltAndroidTest</code>.</li>
<li>WorkManager: injetar dependências em <code>CoroutineWorker</code> via <code>@HiltWorker</code>.</li>
<li>Trocar base URL e interceptors por <code>BuildType</code> (debug/release) com módulos diferentes.</li>
<li>Compartilhar estado entre Activity e Fragments com <code>@ActivityRetainedScoped</code>.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Esquecer <code>@HiltAndroidApp</code> faz <strong>tudo</strong> falhar em runtime com erro confuso.</li>
<li>Injeção em Fragment exige <code>@AndroidEntryPoint</code> também na Activity host.</li>
<li>Não use <code>@Singleton</code> em coisas que dependem de Activity/Context — vaza.</li>
<li>Para <code>@ApplicationContext</code> use a anotação do Hilt, não o Context da Activity.</li>
<li>Hilt e Compose Multiplatform/KMM não combinam ainda — em código compartilhado, use Koin ou DI manual.</li>
</ul>

<div class="callout callout-warn">
<div class="callout-title">Não abuse de DI</div>
<div>Hilt brilha em projetos médios/grandes com múltiplos módulos. Em apps pequenos, DI manual via construtor + factory simples pode ser mais leve e direto.</div>
</div>
`}})]})}export{n as default};

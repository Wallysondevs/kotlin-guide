import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function n(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Android · intermediario · 10 min"}),e.jsx("h1",{children:"Activities e Fragments"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Activities são os pontos de entrada de uma tela em apps Android tradicionais; Fragments dividem a UI dentro de uma Activity em pedaços reutilizáveis. Mesmo na era Compose, entender o ciclo de vida e a navegação entre eles é essencial para integrar com SDKs, push notifications e deep links.</p>

<h2>Conceito</h2>
<p>Uma <code>Activity</code> é uma classe que representa uma tela. Tem ciclo de vida gerenciado pelo sistema (<code>onCreate</code>, <code>onStart</code>, <code>onResume</code>, <code>onPause</code>, <code>onStop</code>, <code>onDestroy</code>). Um <code>Fragment</code> vive <strong>dentro</strong> de uma Activity e tem ciclo de vida análogo.</p>

<pre><code class="language-kotlin">class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnDetalhes.setOnClickListener {
            startActivity(Intent(this, DetailActivity::class.java).apply {
                putExtra("id", 42L)
            })
        }
    }

    override fun onResume() {
        super.onResume()
        // refresh de dados
    }
}</code></pre>

<h2>Intent: navegação e dados</h2>
<pre><code class="language-kotlin">// Explícito
val i = Intent(this, DetailActivity::class.java)
i.putExtra("user_id", 42L)
i.putExtra("name", "Ana")
startActivity(i)

// Implícito (delegação ao sistema)
val view = Intent(Intent.ACTION_VIEW, Uri.parse("https://kotlinlang.org"))
startActivity(view)

// Recuperar
class DetailActivity : AppCompatActivity() {
    override fun onCreate(state: Bundle?) {
        super.onCreate(state)
        val id = intent.getLongExtra("user_id", -1L)
        val name = intent.getStringExtra("name").orEmpty()
    }
}</code></pre>

<h2>ViewBinding</h2>
<p>ViewBinding gera classes type-safe para cada layout, eliminando <code>findViewById</code>.</p>
<pre><code class="language-groovy">// build.gradle.kts (módulo app)
android {
    buildFeatures { viewBinding = true }
}</code></pre>
<pre><code class="language-kotlin">class ProfileFragment : Fragment(R.layout.fragment_profile) {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        _binding = FragmentProfileBinding.bind(view)
        binding.txtNome.text = "Ana"
    }

    override fun onDestroyView() {
        _binding = null   // evita leak (Fragment pode sobreviver à View)
        super.onDestroyView()
    }
}</code></pre>

<h2>FragmentManager</h2>
<pre><code class="language-kotlin">supportFragmentManager.commit {
    setReorderingAllowed(true)
    replace&lt;ProfileFragment&gt;(R.id.fragment_container)
    addToBackStack("profile")
}</code></pre>

<h2>Ciclo de vida resumido</h2>
<ul>
  <li><strong>onCreate</strong> — única vez, configure UI e dependências.</li>
  <li><strong>onStart</strong> — visível, ainda não interativa.</li>
  <li><strong>onResume</strong> — em foco, registre listeners.</li>
  <li><strong>onPause</strong> — perde foco, libere câmera/sensores.</li>
  <li><strong>onStop</strong> — invisível.</li>
  <li><strong>onDestroy</strong> — finalizada (rotação ou usuário fechou).</li>
</ul>

<h2>Exemplo prático: passar dados entre Fragments</h2>
<pre><code class="language-kotlin">// Recomendado: usar Activity-scoped ViewModel
class SharedVM : ViewModel() {
    private val _selecao = MutableStateFlow&lt;Long?&gt;(null)
    val selecao: StateFlow&lt;Long?&gt; = _selecao.asStateFlow()

    fun selecionar(id: Long) { _selecao.value = id }
}

class ListFragment : Fragment() {
    private val shared: SharedVM by activityViewModels()
    private fun onItemClick(id: Long) = shared.selecionar(id)
}

class DetailFragment : Fragment() {
    private val shared: SharedVM by activityViewModels()
    override fun onViewCreated(v: View, s: Bundle?) {
        viewLifecycleOwner.lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                shared.selecao.collect { id -&gt; if (id != null) load(id) }
            }
        }
    }
}</code></pre>

<h2>Quando usar</h2>
<ul>
  <li><strong>Activity</strong>: ponto de entrada, deep link, integração com sistema (notificações, sharing).</li>
  <li><strong>Fragment</strong>: pedaços de UI reutilizáveis, master/detail em tablets, navegação dentro de uma Activity.</li>
  <li><strong>Single-Activity + Navigation Component</strong>: padrão moderno; uma Activity hospeda vários destinos (Fragments ou Compose).</li>
  <li>Em app novo, prefira Compose puro com <code>NavHost</code>; Fragments só para legado ou bibliotecas que exigem.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Rotação destrói a Activity</strong> — salve estado em <code>onSaveInstanceState</code> ou use ViewModel.</li>
  <li>Fragment pode sobreviver à sua View (back stack) — sempre limpe <code>_binding = null</code> em <code>onDestroyView</code>.</li>
  <li>Não toque na UI a partir de <code>onStop</code>/<code>onDestroy</code>.</li>
  <li>Use <code>repeatOnLifecycle</code> em vez de <code>lifecycleScope.launch</code> direto para coletar Flows — evita coletar em background.</li>
  <li>Não passe objetos pesados via <code>Intent</code> — use IDs e busque depois.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Memory leaks comuns</div><div>Anonymous inner classes (listeners) que capturam <code>Activity</code> + handlers do main thread = leak. Use <code>WeakReference</code> ou cancele no <code>onDestroy</code>.</div></div>

<div class="callout callout-tip"><div class="callout-title">Compose interop</div><div>Você pode hospedar Compose dentro de Fragments com <code>ComposeView</code> ou migrar telas isoladas — sem reescrever o app inteiro.</div></div>
`}})]})}export{n as default};

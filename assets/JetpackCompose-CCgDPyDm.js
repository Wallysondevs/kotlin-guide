import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function d(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Android · intermediario · 12 min"}),e.jsx("h1",{children:"Jetpack Compose básico"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Jetpack Compose é o toolkit declarativo de UI do Android, 100% Kotlin. Você descreve <em>o que</em> renderizar para um estado; o framework cuida do <em>como</em> atualizar quando o estado muda. Adeus XML, adeus <code>findViewById</code>.</p>

<h2>Setup mínimo</h2>
<pre><code class="language-groovy">// app/build.gradle.kts
plugins {
    id("com.android.application")
    kotlin("android")
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.20"
}

android {
    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.14" } // se não usar plugin compose
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.10.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.activity:activity-compose:1.9.3")
    debugImplementation("androidx.compose.ui:ui-tooling")
}</code></pre>

<h2>Primeira tela</h2>
<pre><code class="language-kotlin">import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    ContadorApp()
                }
            }
        }
    }
}

@Composable
fun ContadorApp() {
    var contador by remember { mutableIntStateOf(0) }

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Text("Contador: $contador", style = MaterialTheme.typography.headlineMedium)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = { contador-- }) { Text("-") }
            Button(onClick = { contador++ }) { Text("+") }
            OutlinedButton(onClick = { contador = 0 }) { Text("zerar") }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ContadorPreview() {
    MaterialTheme { ContadorApp() }
}</code></pre>

<h2>Composable functions</h2>
<p>Toda função <code>@Composable</code> é uma "receita" para a UI. Ela só pode ser chamada de dentro de outra <code>@Composable</code> ou de <code>setContent</code>. Não retorna View — o Compose monta uma árvore interna.</p>
<pre><code class="language-kotlin">@Composable
fun Saudacao(nome: String, modifier: Modifier = Modifier) {
    Text(
        text = "Olá, $nome!",
        modifier = modifier.padding(8.dp),
        style = MaterialTheme.typography.titleLarge,
    )
}</code></pre>

<h2>Modifier: o "estilo" do Compose</h2>
<p><code>Modifier</code> encadeia comportamentos: tamanho, padding, background, click, shape. <strong>Ordem importa</strong>: <code>padding</code> antes ou depois de <code>background</code> dá visual diferente.</p>
<pre><code class="language-kotlin">Box(
    modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp)
        .background(MaterialTheme.colorScheme.primaryContainer)
        .padding(24.dp)
        .clickable { println("clique") }
) {
    Text("conteúdo")
}</code></pre>

<h2>Layouts</h2>
<ul>
  <li><code>Column</code> — itens na vertical.</li>
  <li><code>Row</code> — itens na horizontal.</li>
  <li><code>Box</code> — empilha (Z-order); ótimo para overlays.</li>
  <li><code>LazyColumn</code> / <code>LazyRow</code> — listas virtualizadas (substituto de RecyclerView).</li>
  <li><code>Scaffold</code> — esqueleto Material com TopBar, BottomBar, FAB, Drawer.</li>
</ul>
<pre><code class="language-kotlin">@Composable
fun ListaTarefas(tarefas: List&lt;String&gt;) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(12.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        items(tarefas) { tarefa -&gt;
            Card(modifier = Modifier.fillMaxWidth()) {
                Text(tarefa, modifier = Modifier.padding(16.dp))
            }
        }
    }
}</code></pre>

<h2>Estado e recomposition</h2>
<p><code>remember</code> guarda valor entre recomposições; <code>mutableStateOf</code> notifica mudanças. Quando o estado muda, o Compose <strong>recompõe</strong> apenas as funções afetadas. Para sobreviver a mudanças de configuração (rotação), use <code>rememberSaveable</code>.</p>
<pre><code class="language-kotlin">@Composable
fun Login() {
    var email by rememberSaveable { mutableStateOf("") }
    var senha by remember { mutableStateOf("") }   // perde-se na rotação
    val valido = email.contains("@") &amp;&amp; senha.length &gt;= 6

    Column {
        OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Email") })
        OutlinedTextField(value = senha, onValueChange = { senha = it }, label = { Text("Senha") })
        Button(onClick = { /* enviar */ }, enabled = valido) { Text("Entrar") }
    }
}</code></pre>

<h2>Boas práticas</h2>
<ul>
  <li>Composables <strong>state-hoisting</strong>: receba estado e callback, não guarde estado em folhas reusáveis.</li>
  <li>Use <code>derivedStateOf</code> para valores derivados caros.</li>
  <li>Marque parâmetros como <code>@Stable</code>/<code>@Immutable</code> para evitar recomposições desnecessárias.</li>
  <li>Listas grandes: sempre <code>Lazy*</code> + <code>key = { it.id }</code>.</li>
  <li>Coletar Flow no UI: <code>val data by viewModel.data.collectAsStateWithLifecycle()</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Preview</div><div>Use <code>@Preview</code> generosamente. Multiplos previews por arquivo (claro/escuro, telas pequenas/grandes) acelera o desenvolvimento sem rodar o emulador.</div></div>

<div class="callout callout-info"><div class="callout-title">Compose Compiler 2.0</div><div>Desde Kotlin 2.0, o Compose Compiler virou plugin separado (<code>org.jetbrains.kotlin.plugin.compose</code>) — não precisa mais alinhar versão com Kotlin manualmente.</div></div>
`}})]})}export{d as default};

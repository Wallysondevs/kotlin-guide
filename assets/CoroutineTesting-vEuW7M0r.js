import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Testes · avancado · 10 min"}),e.jsx("h1",{children:"Testando coroutines"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Testar código com coroutines exige controle sobre tempo virtual, dispatchers e a propagação de exceções. O módulo <code>kotlinx-coroutines-test</code> fornece <code>runTest</code>, <code>TestDispatcher</code> e helpers para que testes rodem rápido, deterministicamente e sem <code>Thread.sleep</code>.</p>

<h2>Setup</h2>
<pre><code class="language-groovy">// build.gradle.kts
dependencies {
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.8.1")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
}</code></pre>

<h2>runTest</h2>
<p><code>runTest</code> executa o bloco em um <code>TestScope</code> com tempo virtual e <code>TestDispatcher</code> embutido. Delays são <em>skipped</em> automaticamente:</p>
<pre><code class="language-kotlin">import kotlinx.coroutines.delay
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals

class TimerTest {
    @Test
    fun delaysAreSkipped() = runTest {
        val inicio = currentTime              // tempo virtual em ms
        delay(5_000)
        assertEquals(5_000, currentTime - inicio)
    }
}</code></pre>

<h2>TestDispatcher: Standard vs Unconfined</h2>
<ul>
  <li><strong>StandardTestDispatcher</strong> (padrão): coroutines novas ficam pendentes até você avançar tempo ou chamar <code>runCurrent()</code>.</li>
  <li><strong>UnconfinedTestDispatcher</strong>: executa eagerly até a primeira suspensão real, reproduzindo comportamento "imediato".</li>
</ul>
<pre><code class="language-kotlin">import kotlinx.coroutines.test.*

@Test
fun standard() = runTest {
    var x = 0
    launch { x = 1 }
    assertEquals(0, x)        // ainda não rodou
    runCurrent()              // executa pendentes
    assertEquals(1, x)
}

@Test
fun unconfined() = runTest(UnconfinedTestDispatcher()) {
    var x = 0
    launch { x = 1 }
    assertEquals(1, x)        // já rodou eagerly
}</code></pre>

<h2>Avançando o tempo</h2>
<pre><code class="language-kotlin">@Test
fun debounce() = runTest {
    val resultados = mutableListOf&lt;String&gt;()
    val job = launch {
        delay(100); resultados += "a"
        delay(200); resultados += "b"
    }
    advanceTimeBy(150)        // executa até 150ms
    assertEquals(listOf("a"), resultados)
    advanceUntilIdle()        // termina tudo
    assertEquals(listOf("a", "b"), resultados)
    job.join()
}</code></pre>

<h2>Substituindo Dispatchers.Main</h2>
<p>Em código Android/ViewModel, <code>viewModelScope</code> usa <code>Dispatchers.Main</code>. Em testes, instale um dispatcher controlável:</p>
<pre><code class="language-kotlin">import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.test.*
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach

class ViewModelTest {
    private val dispatcher = StandardTestDispatcher()

    @BeforeEach fun setUp() = Dispatchers.setMain(dispatcher)
    @AfterEach  fun tearDown() = Dispatchers.resetMain()

    @Test
    fun carregaDados() = runTest(dispatcher) {
        val vm = ItensViewModel(repoFake())
        vm.carregar()
        advanceUntilIdle()
        assertEquals(3, vm.state.value.itens.size)
    }
}</code></pre>

<h2>Testando Flows</h2>
<pre><code class="language-kotlin">import app.cash.turbine.test   // biblioteca Turbine

@Test
fun emiteValores() = runTest {
    flowOf(1, 2, 3).test {
        assertEquals(1, awaitItem())
        assertEquals(2, awaitItem())
        assertEquals(3, awaitItem())
        awaitComplete()
    }
}</code></pre>

<h2>Quando usar cada ferramenta</h2>
<ul>
  <li><strong>runTest</strong>: 95% dos testes de código suspend.</li>
  <li><strong>StandardTestDispatcher</strong>: quando ordem importa e você quer controle fino.</li>
  <li><strong>UnconfinedTestDispatcher</strong>: testes que querem "sem mágica de scheduling".</li>
  <li><strong>setMain/resetMain</strong>: ViewModels e código que injeta <code>Dispatchers.Main</code>.</li>
  <li><strong>Turbine</strong>: asserts ergonômicos sobre Flows quentes/frios.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Não misture com runBlocking</div><div><code>runBlocking</code> usa o relógio real e pode mascarar bugs de timing. Em testes novos, use <code>runTest</code> sempre que o código for suspend/coroutine.</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Coroutines vazadas</strong> falham o teste: se um <code>launch</code> não terminar, <code>runTest</code> reclama. Use <code>job.cancel()</code> ou <code>advanceUntilIdle()</code>.</li>
  <li><strong>Withcontext(Dispatchers.IO)</strong>: troca de dispatcher real ainda usa thread real; injete um dispatcher de teste via interface (<code>DispatcherProvider</code>).</li>
  <li><strong>Tempo virtual ≠ wall clock</strong>: <code>System.currentTimeMillis</code> não anda. Use <code>currentTime</code> do <code>TestScope</code>.</li>
  <li><strong>Exceções</strong>: por padrão, exceções não capturadas falham o teste — comportamento desejado.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Crie um <code>MainDispatcherRule</code>/extensão JUnit reutilizável que faz set/reset do Main com um <code>StandardTestDispatcher</code>. Isso elimina boilerplate em todo teste de ViewModel.</div></div>
`}})]})}export{r as default};

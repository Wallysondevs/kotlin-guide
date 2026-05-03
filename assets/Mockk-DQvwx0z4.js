import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function s(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Testes · intermediario · 9 min"}),e.jsx("h1",{children:"MockK"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`<p><strong>MockK</strong> é a biblioteca de mocking idiomática para Kotlin. Ao contrário de Mockito, suporta nativamente <code>final</code> classes (padrão de Kotlin), <code>object</code>, funções de extensão, suspend functions e construtores.</p>

<h2>Conceito</h2>
<p>Adicione no <code>build.gradle.kts</code>:</p>
<pre><code class="language-kotlin">testImplementation("io.mockk:mockk:1.13.11")</code></pre>
<p>O fluxo padrão é: criar mock, configurar comportamento (<code>every { } returns</code>), executar SUT, verificar (<code>verify { }</code>).</p>
<pre><code class="language-kotlin">import io.mockk.*
import kotlin.test.Test
import kotlin.test.assertEquals

interface Repo { fun nome(id: Long): String }

class Service(val repo: Repo) {
    fun saudar(id: Long) = "Olá, \${repo.nome(id)}"
}

class ServiceTest {
    @Test fun saudacao() {
        val repo = mockk&lt;Repo&gt;()
        every { repo.nome(1) } returns "Ana"
        val s = Service(repo)
        assertEquals("Olá, Ana", s.saudar(1))
        verify(exactly = 1) { repo.nome(1) }
    }
}</code></pre>

<h2>Suspend functions</h2>
<pre><code class="language-kotlin">interface Api { suspend fun fetch(): String }

@Test fun coTeste() = kotlinx.coroutines.test.runTest {
    val api = mockk&lt;Api&gt;()
    coEvery { api.fetch() } returns "ok"
    assertEquals("ok", api.fetch())
    coVerify { api.fetch() }
}</code></pre>

<h2>relaxed e relaxedUnit</h2>
<p><code>mockk&lt;T&gt;(relaxed = true)</code> retorna defaults razoáveis para qualquer chamada não configurada (<code>0</code>, <code>""</code>, lista vazia, mocks aninhados). <code>relaxUnitFun = true</code> só relaxa retornos <code>Unit</code> — útil para <em>callback handlers</em>.</p>

<h2>spyk: mock parcial</h2>
<pre><code class="language-kotlin">class Calc { fun soma(a: Int, b: Int) = a + b }

@Test fun spy() {
    val c = spyk(Calc())
    every { c.soma(2, 2) } returns 99    // só esse caso é mockado
    assertEquals(99, c.soma(2, 2))
    assertEquals(7, c.soma(3, 4))        // executa real
}</code></pre>

<h2>Mock de object e top-level</h2>
<pre><code class="language-kotlin">object Tempo { fun agora(): Long = System.currentTimeMillis() }

@Test fun mockObj() {
    mockkObject(Tempo)
    every { Tempo.agora() } returns 1_700_000_000_000
    assertEquals(1_700_000_000_000, Tempo.agora())
    unmockkObject(Tempo)
}</code></pre>
<p>Para top-level functions: <code>mockkStatic("com.exemplo.UtilsKt")</code>.</p>

<h2>Casos de uso</h2>
<ul>
<li>Isolar a SUT de I/O (HTTP, banco, fs).</li>
<li>Testar caminhos de erro forçando exceções: <code>every { ... } throws SocketTimeoutException()</code>.</li>
<li>Capturar argumentos: <code>val slot = slot&lt;Pedido&gt;(); verify { repo.save(capture(slot)) }</code>.</li>
<li>Verificar ordem: <code>verifyOrder { a.x(); b.y() }</code>.</li>
<li>Comportamento sequencial: <code>every { fila.next() } returnsMany listOf(1, 2, 3)</code>.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Esquecer <code>unmockkAll()</code> em <code>@AfterEach</code>: estado vaza entre testes — sempre use junit5 lifecycle.</li>
<li><code>verify { ... }</code> aceita <em>match parcial</em>; use <code>verify(exactly = N)</code> para precisão.</li>
<li>MockK usa byte-buddy: na JDK 17+ pode pedir <code>--add-opens</code> em alguns casos.</li>
<li>Mockar funções de extensão exige <code>mockkStatic(String::class)</code> ou similar — não é gratuito.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Annotations</div><div>Use <code>@MockK</code>/<code>@RelaxedMockK</code>/<code>@InjectMockKs</code> com <code>MockKAnnotations.init(this)</code> em <code>@BeforeEach</code> para reduzir boilerplate em classes de teste com várias dependências.</div></div>

<div class="callout callout-warn"><div class="callout-title">Não mocke o que você não possui</div><div>Mockar tipos de bibliotecas externas (especialmente <code>final</code> com lógica complexa) tende a quebrar em upgrades. Prefira <em>fakes</em> ou wrappers.</div></div>`}})]})}export{s as default};

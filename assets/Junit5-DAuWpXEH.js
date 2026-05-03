import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Testes · intermediario · 9 min"}),e.jsx("h1",{children:"JUnit 5 com Kotlin"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>JUnit 5 (Jupiter) é o padrão de fato para testes na JVM e tem ergonomia excelente em Kotlin: lambdas em <code>assertThrows</code>, nomes de teste em string com <code>@DisplayName</code> ou backticks, parameterized tests concisos.</p>

<h2>Setup com Gradle (Kotlin DSL)</h2>
<pre><code class="language-groovy">// build.gradle.kts
plugins {
    kotlin("jvm") version "2.0.20"
}

dependencies {
    testImplementation(platform("org.junit:junit-bom:5.10.2"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.test {
    useJUnitPlatform()
    testLogging { events("passed", "failed", "skipped") }
}</code></pre>

<h2>Teste básico</h2>
<pre><code class="language-kotlin">import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.*

class CalculadoraTest {

    private lateinit var calc: Calculadora

    @BeforeEach
    fun setUp() {
        calc = Calculadora()
    }

    @Test
    fun \`soma dois positivos\`() {
        assertEquals(5, calc.somar(2, 3))
    }

    @Test
    fun \`divisao por zero lanca\`() {
        val ex = assertThrows&lt;ArithmeticException&gt; {
            calc.dividir(10, 0)
        }
        assertTrue(ex.message!!.contains("zero"))
    }

    @AfterEach
    fun tearDown() {
        // limpar recursos
    }
}</code></pre>

<p>Backticks em nomes de função permitem descrições em prosa, perfeitas para relatório de teste.</p>

<h2>Lifecycle e instâncias</h2>
<p>Por padrão JUnit cria uma instância nova de classe por teste. Use <code>@TestInstance(PER_CLASS)</code> para reutilizar — útil para custos altos de setup ou métodos não-estáticos em <code>@BeforeAll</code>.</p>
<pre><code class="language-kotlin">@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class IntegracaoTest {

    private val container = PostgresContainer()

    @BeforeAll
    fun startContainer() = container.start()

    @AfterAll
    fun stopContainer() = container.stop()

    @Test fun \`insere e lê\`() { /* ... */ }
}</code></pre>

<h2>Parameterized tests</h2>
<pre><code class="language-groovy">// build.gradle.kts (adicione)
testImplementation("org.junit.jupiter:junit-jupiter-params")</code></pre>
<pre><code class="language-kotlin">import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.*

class ValidacaoTest {

    @ParameterizedTest(name = "{0} deve ser válido")
    @ValueSource(strings = ["a@b.com", "user.name@example.org"])
    fun emailsValidos(email: String) {
        assertTrue(isEmail(email))
    }

    @ParameterizedTest
    @CsvSource(
        "1, 1, 2",
        "2, 3, 5",
        "10, 20, 30",
    )
    fun soma(a: Int, b: Int, esperado: Int) {
        assertEquals(esperado, a + b)
    }

    @ParameterizedTest
    @MethodSource("casos")
    fun divisao(num: Int, den: Int, esperado: Int) {
        assertEquals(esperado, num / den)
    }

    companion object {
        @JvmStatic
        fun casos() = listOf(
            Arguments.of(10, 2, 5),
            Arguments.of(9, 3, 3),
        )
    }
}</code></pre>

<h2>Assertions úteis</h2>
<ul>
  <li><code>assertEquals(esperado, atual)</code>, <code>assertNotEquals</code></li>
  <li><code>assertTrue / assertFalse / assertNull / assertNotNull</code></li>
  <li><code>assertThrows&lt;T&gt; { ... }</code> retorna a exceção para inspeção</li>
  <li><code>assertAll("grupo", { a1 }, { a2 }, ...)</code> roda todos e reporta os falhos</li>
  <li><code>assertTimeout(Duration.ofSeconds(2)) { ... }</code></li>
  <li>Para asserts mais expressivos, considere <strong>AssertJ</strong> ou <strong>Kotest assertions</strong>.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
  <li>Um <code>assert</code> por conceito; vários por cenário ok com <code>assertAll</code>.</li>
  <li>Nomes em backticks descrevendo comportamento, não implementação.</li>
  <li>Setup mínimo no <code>@BeforeEach</code>; testes independentes.</li>
  <li>Use <code>@Nested</code> para agrupar cenários relacionados.</li>
  <li>Evite <code>@Disabled</code> sem motivo escrito — vira teste-zumbi.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Mocking</div><div>Para Kotlin, prefira <a href="#">MockK</a> em vez de Mockito: suporta funções <code>suspend</code>, <code>final</code> classes (sem plugin), DSL fluente.</div></div>
`}})]})}export{r as default};

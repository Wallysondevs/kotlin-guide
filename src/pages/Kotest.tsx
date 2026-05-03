export default function Kotest() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Testes · intermediario · 10 min</div>
      <h1>Kotest</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Kotest é o framework de testes mais popular do ecossistema Kotlin. Oferece múltiplos estilos de spec, matchers expressivos, property-based testing nativo e plugins para coroutines, Spring, Ktor e Testcontainers.</p>

<h2>Setup</h2>
<pre><code class="language-groovy">plugins { kotlin("jvm") version "2.0.0" }

dependencies {
    testImplementation("io.kotest:kotest-runner-junit5:5.9.1")
    testImplementation("io.kotest:kotest-assertions-core:5.9.1")
    testImplementation("io.kotest:kotest-property:5.9.1")
}

tasks.test { useJUnitPlatform() }
</code></pre>

<h2>StringSpec</h2>
<pre><code class="language-kotlin">import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe

class CalculadoraSpec : StringSpec({
    "soma de positivos" {
        (2 + 3) shouldBe 5
    }
    "string contém substring" {
        "Kotlin" shouldContain "tlin"
    }
})
</code></pre>

<h2>FunSpec e BehaviorSpec</h2>
<pre><code class="language-kotlin">class CarrinhoFunSpec : FunSpec({
    context("quando vazio") {
        test("total é zero") { Carrinho().total shouldBe 0.0 }
        test("não permite checkout") {
            shouldThrow&lt;IllegalStateException&gt; { Carrinho().checkout() }
        }
    }
})

class LoginBehaviorSpec : BehaviorSpec({
    Given("usuário válido") {
        When("envia senha correta") {
            Then("recebe token") { /* ... */ }
        }
        When("envia senha errada") {
            Then("recebe 401") { /* ... */ }
        }
    }
})
</code></pre>

<h2>Matchers</h2>
<pre><code class="language-kotlin">import io.kotest.matchers.collections.*
import io.kotest.matchers.string.*
import io.kotest.matchers.maps.*

listOf(1,2,3) shouldContainExactly listOf(1,2,3)
listOf(1,2,3).shouldHaveSize(3)
"abc@example.com" shouldMatch ".*@.*\\\\..*".toRegex()
mapOf("a" to 1) should haveKey("a")
</code></pre>

<h2>Property testing</h2>
<pre><code class="language-kotlin">import io.kotest.property.Arb
import io.kotest.property.arbitrary.*
import io.kotest.property.checkAll

class ReverseProp : StringSpec({
    "reverter duas vezes volta ao original" {
        checkAll(Arb.string()) { s -&gt;
            s.reversed().reversed() shouldBe s
        }
    }
    "soma é comutativa" {
        checkAll(Arb.int(), Arb.int()) { a, b -&gt;
            a + b shouldBe b + a
        }
    }
})
</code></pre>

<h2>Coroutines e tempo</h2>
<pre><code class="language-kotlin">class CoroSpec : StringSpec({
    "suspende com timeout" {
        runTest {
            withTimeout(1000) { delay(500); 42 } shouldBe 42
        }
    }
})
</code></pre>

<h2>Plugins úteis</h2>
<ul>
  <li><strong>kotest-extensions-spring</strong>: integração com <code>@SpringBootTest</code>.</li>
  <li><strong>kotest-extensions-testcontainers</strong>: ciclo de vida de containers.</li>
  <li><strong>kotest-extensions-allure</strong>: relatórios HTML.</li>
  <li><strong>kotest-assertions-ktor</strong>: matchers para respostas HTTP.</li>
  <li><strong>kotest-assertions-json</strong>: comparação semântica de JSON.</li>
</ul>

<h2>Quando escolher Kotest vs JUnit5</h2>
<ul>
  <li>Use <strong>Kotest</strong> quando o time prioriza DSL fluente e property-testing.</li>
  <li>Use <strong>JUnit5 + AssertJ</strong> quando precisa de máxima compatibilidade com tooling Java.</li>
  <li>Kotest roda <em>sobre</em> JUnit Platform, então convive com módulos JUnit existentes.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Specs são instanciadas uma vez por classe; não compartilhe estado mutável entre testes sem <code>beforeTest</code>.</li>
  <li>Property tests podem demorar — ajuste <code>iterations</code> em CI lento.</li>
  <li>Matchers de coleção como <code>shouldContain</code> têm overloads diferentes; importe o pacote correto (<code>collections</code> vs <code>string</code>).</li>
  <li>Em multi-module, configure <code>useJUnitPlatform()</code> em <em>cada</em> módulo de teste.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Property &gt; example-based</div><div>Para funções puras, property tests cobrem milhares de casos com poucas linhas e descobrem invariantes que você nem sabia que estava assumindo.</div></div>
`}} />
    </article>
  );
}

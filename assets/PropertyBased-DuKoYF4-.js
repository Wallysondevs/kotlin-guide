import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function s(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Testes · avancado · 8 min"}),e.jsx("h1",{children:"Property-based testing"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
  <p>Property-based testing valida propriedades <strong>universais</strong> do seu código contra centenas de entradas geradas automaticamente. Em vez de "esperar saída X para entrada Y", você expressa "para todo input válido, vale tal invariante". Em Kotlin, o ferramental dominante é o <strong>Kotest</strong>.</p>

  <h2>Conceito</h2>
  <p>O framework gera entradas via <strong>arbitraries</strong> (<code>Arb</code>) e roda a propriedade N vezes. Quando falha, faz <strong>shrinking</strong>: reduz a entrada ao menor caso que ainda quebra, facilitando o diagnóstico.</p>
  <pre><code class="language-groovy">// build.gradle.kts
  testImplementation("io.kotest:kotest-runner-junit5:5.9.1")
  testImplementation("io.kotest:kotest-property:5.9.1")</code></pre>

  <h2>Exemplo prático</h2>
  <pre><code class="language-kotlin">import io.kotest.core.spec.style.StringSpec
  import io.kotest.matchers.shouldBe
  import io.kotest.property.Arb
  import io.kotest.property.arbitrary.*
  import io.kotest.property.forAll

  class StringPropTest : StringSpec({
      "reverse(reverse(s)) == s" {
          forAll(Arb.string()) { s -&gt;
              s.reversed().reversed() == s
          }
      }

      "concat preserva tamanho" {
          forAll(Arb.string(0..50), Arb.string(0..50)) { a, b -&gt;
              (a + b).length == a.length + b.length
          }
      }

      "soma é comutativa" {
          forAll(Arb.int(), Arb.int()) { a, b -&gt;
              a + b == b + a
          }
      }
  })</code></pre>

  <p>Edge cases automáticos incluem <code>0</code>, <code>Int.MAX_VALUE</code>, <code>""</code>, <code>"
"</code>. Você pode adicionar próprios via <code>Arb.of(...)</code> ou <code>arbitrary { ... }</code>.</p>

  <h2>Propriedades comuns</h2>
  <ul>
  <li><strong>Idempotência</strong>: <code>f(f(x)) == f(x)</code> (ex.: <code>distinct</code>, <code>trim</code>).</li>
  <li><strong>Inversão</strong>: <code>decode(encode(x)) == x</code>.</li>
  <li><strong>Comutatividade/associatividade</strong> em operações algébricas.</li>
  <li><strong>Invariantes</strong>: tamanho, soma, ordenação preservadas após operação.</li>
  <li><strong>Oracle</strong>: comparar implementação otimizada vs ingênua.</li>
  </ul>

  <h2>Boas práticas</h2>
  <ul>
  <li>Comece pequeno: 1 propriedade > 10 testes baseados em exemplo.</li>
  <li>Restrinja Arbs para excluir entradas inválidas com <code>filter</code> — mas evite filtros pesados (lentos).</li>
  <li>Documente a propriedade no nome do teste — ela vale como especificação.</li>
  <li>Quando shrink "cabar", use <code>printSeed</code> para reproduzir.</li>
  </ul>

  <div class="callout callout-tip"><div class="callout-title">Dica</div><div>Combine com testes baseados em exemplo: PBT cobre o espaço, exemplos cobrem regressões específicas. Cada vez que um bug aparecer, adicione um teste exemplificado <strong>e</strong> uma propriedade que o pegaria.</div></div>
  `}})]})}export{s as default};

import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function i(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Funcional avançado · intermediario · 6 min"}),e.jsx("h1",{children:"Infix functions"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Funções <code>infix</code> permitem chamadas no formato <code>a OP b</code> em vez de <code>a.OP(b)</code>. Pequena mudança sintática, grande ganho de legibilidade — especialmente para construir DSLs internas e operadores binários expressivos.</p>

<h2>Conceito</h2>
<p>Para uma função ser <code>infix</code>, ela precisa atender três regras:</p>
<ul>
  <li>Ser <strong>membro</strong> de uma classe ou <strong>extension function</strong>.</li>
  <li>Receber <strong>exatamente um parâmetro</strong>.</li>
  <li>O parâmetro <strong>não pode ter default</strong> nem ser <code>vararg</code>.</li>
</ul>
<pre><code class="language-kotlin">infix fun Int.vezes(outro: Int): Int = this * outro

val x = 3 vezes 4   // mesmo que 3.vezes(4)
println(x)          // 12</code></pre>

<h2>Exemplos da stdlib</h2>
<p>Você já usa <code>infix</code> sem perceber. Veja: <code>to</code>, <code>and</code>, <code>or</code>, <code>shl</code>, <code>downTo</code>, <code>until</code>, <code>step</code>.</p>
<pre><code class="language-kotlin">val par = "chave" to 42                  // Pair&lt;String, Int&gt;
val mapa = mapOf("a" to 1, "b" to 2)

val flags = 0b0011 and 0b0101            // 0b0001
val range = 10 downTo 1 step 2           // 10, 8, 6, 4, 2

if (idade in 18..65) println("adulto")</code></pre>

<h2>Exemplo prático: DSL de assertion</h2>
<pre><code class="language-kotlin">class Assertion&lt;T&gt;(private val actual: T) {
    infix fun shouldBe(expected: T) {
        if (actual != expected)
            throw AssertionError("esperado &lt;$expected&gt;, obtido &lt;$actual&gt;")
    }
    infix fun shouldNotBe(expected: T) {
        if (actual == expected)
            throw AssertionError("não deveria ser &lt;$expected&gt;")
    }
}

fun &lt;T&gt; T.should(): Assertion&lt;T&gt; = Assertion(this)

// uso em testes
fun teste() {
    val soma = 2 + 2
    soma.should() shouldBe 4

    val nome = "Ana"
    nome.should() shouldNotBe ""
}</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Operadores binários conceituais (<code>união</code>, <code>intersecao</code>, <code>add</code>).</li>
  <li>Construção de pares e mapas (<code>"k" to v</code>).</li>
  <li>DSLs de teste, builders, query (Exposed, kotest).</li>
  <li>Manipulação de bits (<code>and</code>, <code>or</code>, <code>xor</code>, <code>shl</code>, <code>shr</code>).</li>
  <li>Quando a leitura em prosa fica claramente melhor: <code>usuario tem permissao Permissao.ADMIN</code>.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><code>infix</code> tem <strong>precedência mais baixa</strong> que operadores aritméticos. <code>1 + 2 shl 3</code> = <code>(1 + 2) shl 3</code>; já <code>a vezes b + 1</code> = <code>a vezes (b + 1)</code>. Use parênteses para deixar claro.</li>
  <li>Encadear muitos infix sem parênteses fica ambíguo na leitura humana mesmo que o parser concorde.</li>
  <li>Não use infix para verbos com efeitos colaterais não óbvios — pode mascarar o que está acontecendo.</li>
  <li>Não pode ter argumento default; isso limita evolução da API depois.</li>
  <li>O ponto (<code>a.vezes(b)</code>) continua válido — sua API funciona dos dois jeitos.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Quando NÃO usar</div><div>Se a chamada não lê melhor em prosa, mantenha o ponto. <code>conexao infix executar query</code> é pior que <code>conexao.executar(query)</code>.</div></div>
`}})]})}export{i as default};

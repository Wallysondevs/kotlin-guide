import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function i(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Sintaxe e tipos · iniciante · 9 min"}),e.jsx("h1",{children:"when (smart switch)"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>O <code>when</code> é o substituto do <code>switch</code> em Kotlin, mas vai muito além: é uma expressão, suporta ranges, tipos, padrões e — combinado com <code>sealed</code> — gera verificação de exaustividade pelo compilador.</p>

<h2>Conceito</h2>
<p>Há duas formas: <em>com</em> argumento (<code>when (x)</code>) e <em>sem</em> argumento (cadeia de booleanos). Sempre avalia de cima para baixo e para no primeiro ramo verdadeiro.</p>
<pre><code class="language-kotlin">val nota = 82
val conceito = when {
    nota &gt;= 90 -&gt; "A"
    nota &gt;= 80 -&gt; "B"
    nota &gt;= 70 -&gt; "C"
    else -&gt; "F"
}</code></pre>

<h2>Exemplo prático</h2>
<p>Combinando <code>is</code>, ranges e múltiplos valores em um parser de tokens:</p>
<pre><code class="language-kotlin">sealed interface Token
data class Num(val v: Int) : Token
data class Op(val c: Char) : Token
data object EOF : Token

fun describe(t: Token): String = when (t) {
    is Num -&gt; when (t.v) {
        0 -&gt; "zero"
        in 1..9 -&gt; "dígito \${t.v}"
        in 10..99 -&gt; "número de 2 dígitos"
        else -&gt; "número grande"
    }
    is Op -&gt; if (t.c in "+-*/") "operador" else "símbolo"
    EOF -&gt; "fim"
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Mapear estados de uma <code>sealed class</code> para UI ou eventos.</li>
<li>Substituir longos <code>if/else</code> aninhados por uma cadeia legível.</li>
<li>Classificar valores por faixa (notas, faixas etárias, HTTP status).</li>
<li>Despacho de mensagens em actors/coroutines.</li>
<li>Pattern matching estrutural simples sobre tipos.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><code>when</code> como <strong>expressão</strong> exige <code>else</code> ou exaustividade total.</li>
<li>Adicionar uma nova subclasse a uma <code>sealed</code> quebra todos os <code>when</code> exaustivos — é justamente a vantagem.</li>
<li>Em Kotlin 1.7+ use <code>when</code> como statement com aviso <code>-Xnon-local-break-continue</code> para forçar exaustividade também em statements.</li>
<li>Evite efeitos colaterais nos ramos quando a função for usada como expressão; prefira retornar valores puros.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Smart cast embutido</div><div>Dentro de <code>is Num -&gt; ...</code> o compilador já trata <code>t</code> como <code>Num</code>, sem cast manual. Aproveite para acessar propriedades sem ruído.</div></div>

<div class="callout callout-info"><div class="callout-title">when com subject local (1.3+)</div><div>Use <code>when (val r = compute()) { ... }</code> para capturar o valor em um nome local visível só dentro dos ramos.</div></div>
`}})]})}export{i as default};

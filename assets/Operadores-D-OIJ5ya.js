import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function i(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Sintaxe e tipos · iniciante · 7 min"}),e.jsx("h1",{children:"Operadores"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`<p>Kotlin oferece o conjunto clássico de operadores de Java mais alguns específicos da linguagem (<code>===</code>, <code>?:</code>, <code>in</code>, <code>is</code>). Quase todos os operadores são <strong>açúcar sintático</strong> para chamadas de função: <code>a + b</code> chama <code>a.plus(b)</code>, o que permite sobrecarga via <code>operator fun</code>.</p>

<h2>Conceito</h2>
<p>Os operadores aritméticos (<code>+ - * / %</code>) seguem precedência matemática. Comparação (<code>== != &lt; &gt; &lt;= &gt;=</code>) usa <code>equals</code>/<code>compareTo</code>. Já <code>===</code> e <code>!==</code> comparam <em>identidade de referência</em> — algo que em Java é o <code>==</code>.</p>
<pre><code class="language-kotlin">val a = String(charArrayOf('o','i'))
val b = String(charArrayOf('o','i'))
println(a == b)    // true  -> equals
println(a === b)   // false -> referências diferentes</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">fun resumo(idade: Int?, nome: String): String {
    val faixa = when {
        idade == null      -> "desconhecida"
        idade in 0..12     -> "criança"
        idade in 13..17    -> "adolescente"
        idade in 18..64    -> "adulto"
        else               -> "idoso"
    }
    val saudacao = nome.takeIf { it.isNotBlank() } ?: "anônimo"
    return "$saudacao ($faixa)"
}

fun main() {
    println(resumo(30, "Ana"))   // Ana (adulto)
    println(resumo(null, ""))    // anônimo (desconhecida)
}</code></pre>

<h2>Bitwise</h2>
<p>Kotlin <strong>não</strong> usa <code>&amp;</code>, <code>|</code>, <code>^</code>, <code>&lt;&lt;</code>, <code>&gt;&gt;</code> como Java — usa funções <em>infix</em>: <code>and</code>, <code>or</code>, <code>xor</code>, <code>inv</code>, <code>shl</code>, <code>shr</code>, <code>ushr</code>.</p>
<pre><code class="language-kotlin">val mask = 0b1100
val flag = 0b1010
println(mask and flag)         // 8
println(mask or flag)          // 14
println(1 shl 4)               // 16
println(0xFF.inv() and 0xFFFF) // 0xFF00</code></pre>

<h2>Operador Elvis e checagens</h2>
<pre><code class="language-kotlin">fun len(s: String?): Int = s?.length ?: 0      // Elvis
fun first(list: List&lt;String&gt;) = list.firstOrNull() ?: error("vazia")

fun describe(x: Any) = when (x) {
    is Int     -> "inteiro $x"
    is String  -> "string de tamanho \${x.length}"   // smart cast
    !is Number -> "não-número"
    else       -> "outro número $x"
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li><code>?:</code> (Elvis) para fornecer fallback em valores nullable.</li>
<li><code>in</code> para verificar pertencimento em ranges, coleções e <code>Map.keys</code>.</li>
<li><code>is</code> em <code>when</code> habilita <em>smart cast</em> sem cast explícito.</li>
<li><code>===</code> para comparar identidade — útil em testes de cache/instância única.</li>
<li><code>shl/shr</code> em código de baixo nível (parsing binário, hashing, flags).</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><code>1 / 2</code> dá <code>0</code> (Int). Use <code>1.0 / 2</code> para Double.</li>
<li><code>==</code> em Kotlin nunca lança NPE: <code>null == "x"</code> retorna <code>false</code> com segurança.</li>
<li>Para <code>Float</code>/<code>Double</code>, <code>NaN == NaN</code> retorna <code>false</code> — use <code>isNaN()</code>.</li>
<li>Sobrecarga de operadores via <code>operator fun</code> só funciona para nomes específicos (<code>plus</code>, <code>get</code>, <code>invoke</code> etc.) — não dá para inventar <code>**</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Infix</div><div>Funções marcadas com <code>infix</code> (como <code>and</code>, <code>to</code>, <code>until</code>) leem como operadores: <code>1 to "a"</code>, <code>0 until 10</code>. Use com parcimônia em DSLs.</div></div>`}})]})}export{i as default};

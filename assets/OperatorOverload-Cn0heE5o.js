import{j as o}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return o.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[o.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Funcional avançado · intermediario · 9 min"}),o.jsx("h1",{children:"Operator overloading"}),o.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Kotlin permite sobrecarregar operadores como <code>+</code>, <code>-</code>, <code>[]</code>, <code>()</code> e <code>in</code> declarando funções com o modificador <code>operator</code> e nomes específicos. Bem usado, deixa código de domínio (vetores, datas, dinheiro) muito mais legível; mal usado, vira charada.</p>

<h2>Conceito</h2>
<p>Cada operador mapeia para um nome fixo: <code>plus</code> (<code>+</code>), <code>minus</code> (<code>-</code>), <code>times</code> (<code>*</code>), <code>div</code> (<code>/</code>), <code>rem</code> (<code>%</code>), <code>get</code>/<code>set</code> (<code>[]</code>), <code>invoke</code> (<code>()</code>), <code>contains</code> (<code>in</code>), <code>compareTo</code> (<code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>), <code>rangeTo</code> (<code>..</code>).</p>
<pre><code class="language-kotlin">data class Vetor(val x: Double, val y: Double) {
    operator fun plus(o: Vetor) = Vetor(x + o.x, y + o.y)
    operator fun times(k: Double) = Vetor(x * k, y * k)
    operator fun unaryMinus() = Vetor(-x, -y)
}

val a = Vetor(1.0, 2.0)
val b = Vetor(3.0, 4.0)
val c = a + b * 2.0   // Vetor(7.0, 10.0)
val d = -a            // Vetor(-1.0, -2.0)
</code></pre>

<h2>Exemplo prático: dinheiro</h2>
<pre><code class="language-kotlin">@JvmInline
value class Centavos(val valor: Long) : Comparable&lt;Centavos&gt; {
    operator fun plus(o: Centavos) = Centavos(valor + o.valor)
    operator fun minus(o: Centavos) = Centavos(valor - o.valor)
    operator fun times(n: Int) = Centavos(valor * n)
    override fun compareTo(other: Centavos) = valor.compareTo(other.valor)
}

val preco = Centavos(1990)
val total = preco * 3 + Centavos(500)
println(total &gt; Centavos(5000)) // true
</code></pre>

<h2>get/set e invoke</h2>
<pre><code class="language-kotlin">class Matriz(val linhas: Int, val cols: Int) {
    private val dados = DoubleArray(linhas * cols)
    operator fun get(i: Int, j: Int) = dados[i * cols + j]
    operator fun set(i: Int, j: Int, v: Double) { dados[i * cols + j] = v }
}

class Greeter(val saudacao: String) {
    operator fun invoke(nome: String) = "\\$saudacao, \\$nome"
}

val m = Matriz(2, 2); m[0, 1] = 9.0
val olá = Greeter("Olá"); println(olá("Ada"))
</code></pre>

<h2>contains e ranges</h2>
<pre><code class="language-kotlin">class Periodo(val inicio: Int, val fim: Int) {
    operator fun contains(x: Int) = x in inicio..fim
}

val ano = Periodo(2020, 2025)
println(2023 in ano) // true
</code></pre>

<h2>Casos de uso</h2>
<ul>
  <li>Tipos algébricos: vetores, matrizes, complexos.</li>
  <li>Domínio financeiro com value classes para evitar mistura de moedas.</li>
  <li>Coleções customizadas que se beneficiem de <code>[]</code>.</li>
  <li>DSLs onde <code>invoke</code> faz uma classe parecer função.</li>
  <li>Datas/durações: somar <code>LocalDate</code> + <code>Period</code>.</li>
</ul>

<h2>Limites e pegadinhas</h2>
<ul>
  <li>Não invente semântica nova para <code>+</code> — quem lê espera adição. Se não é adição, dê um nome próprio.</li>
  <li><code>compareTo</code> deve retornar negativo/zero/positivo coerentes com <code>equals</code>.</li>
  <li>Operadores não funcionam com tipos nullable: <code>a + b</code> exige não-nulos. Use <code>?.let</code>.</li>
  <li>Sobrecarregar <code>equals</code> via operator não existe — use <code>data class</code> ou implemente <code>equals</code>/<code>hashCode</code>.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Não abuse</div><div>Operator overload é poderoso e perigoso. Reserve para tipos de domínio matemático ou algébrico onde o significado é óbvio para qualquer leitor.</div></div>
`}})]})}export{r as default};

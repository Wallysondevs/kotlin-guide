export default function Loops() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Sintaxe e tipos · iniciante · 7 min</div>
      <h1>for, while, do-while</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Kotlin oferece o trio clássico — <code>for</code>, <code>while</code>, <code>do-while</code> — mas a verdade é que, na prática, você os usa menos do que em Java porque coleções funcionais (<code>map</code>, <code>filter</code>, <code>forEach</code>) cobrem a maior parte dos casos. Ainda assim, dominar loops é essencial para algoritmos, IO e situações que precisam de <code>break</code>/<code>continue</code>.</p>

<h2>Conceito</h2>
<p>O <code>for</code> de Kotlin sempre itera sobre algo que forneça um <code>Iterator</code> (qualquer <code>Iterable</code>, <code>Sequence</code>, array, range, string).</p>
<pre><code class="language-kotlin">for (i in 1..5) println(i)              // range fechado
for (i in 1 until 5) println(i)         // exclui 5
for (i in 5 downTo 1 step 2) println(i) // 5,3,1
for (c in "Kotlin") print(c)
for ((idx, valor) in listOf("a","b","c").withIndex()) {
    println("\$idx -> \$valor")
}</code></pre>
<p><code>while</code> e <code>do-while</code> seguem o padrão usual; <code>do-while</code> garante ao menos uma execução.</p>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">fun lerLinhasAteSair() {
    do {
        print("> ")
        val linha = readlnOrNull()?.trim().orEmpty()
        when {
            linha.isEmpty() -> continue
            linha == "sair" -> break
            else -> println("eco: \$linha")
        }
    } while (true)
}

// repeat: açúcar para "for (i in 0 until n)"
repeat(3) { i -&gt; println("tentativa \${i + 1}") }</code></pre>

<h2>break/continue com labels</h2>
<pre><code class="language-kotlin">outer@ for (i in 1..3) {
    for (j in 1..3) {
        if (i == 2 && j == 2) break@outer
        println("\$i,\$j")
    }
}</code></pre>

<h2>Quando usar (ou evitar)</h2>
<ul>
<li><strong>Use loops</strong> quando precisar de <code>break</code>/<code>continue</code>, IO bloqueante linha-a-linha ou performance crítica em laços apertados.</li>
<li><strong>Use coleções funcionais</strong> (<code>map</code>, <code>filter</code>, <code>fold</code>) para transformações declarativas.</li>
<li><strong>Use <code>Sequence</code></strong> quando a coleção é grande e o pipeline tem várias etapas — evita listas intermediárias.</li>
<li><strong>Use <code>repeat(n)</code></strong> em vez de <code>for (i in 0 until n)</code> quando o índice não importa.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><code>1..5</code> é fechado (inclui 5); <code>1 until 5</code> exclui. Confundir isso é fonte clássica de off-by-one.</li>
<li><code>downTo</code> exige <code>step</code> positivo (<code>5 downTo 1 step 2</code>, não <code>-2</code>).</li>
<li>Em coroutines, prefira <code>Flow</code> a <code>while (true)</code> + <code>delay</code> — cancelamento estruturado fica de graça.</li>
<li><code>break</code>/<code>continue</code> dentro de lambdas (<code>forEach</code>) só funcionam com labels não-locais — geralmente é sinal de que <code>for</code> seria mais claro.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Quando ler arquivos grandes, use <code>File("dados.txt").useLines { linhas -&gt; linhas.forEach(::println) }</code>: fecha o stream automaticamente e não carrega tudo na memória.</div></div>
`}} />
    </article>
  );
}

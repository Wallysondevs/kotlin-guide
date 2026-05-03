export default function Ranges() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Sintaxe e tipos · iniciante · 7 min</div>
      <h1>Ranges e progressões</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Ranges em Kotlin representam intervalos fechados de valores comparáveis. Combinados com progressões (passo customizável), substituem laços <code>for (int i = 0; i &lt; n; i++)</code> de forma legível, e ainda servem como predicados via <code>in</code>/<code>!in</code>.</p>

<h2>Conceito</h2>
<p>O operador <code>..</code> cria um range fechado em ambas as pontas. <code>until</code> (ou <code>..&lt;</code> no Kotlin 1.7.20+) cria meio-aberto. <code>downTo</code> inverte a ordem. <code>step</code> ajusta o incremento.</p>

<pre><code class="language-kotlin">val a = 1..10           // IntRange [1, 10]
val b = 1 until 10      // [1, 10) — não inclui 10
val c = 1..&lt;10          // mesma coisa, sintaxe nova
val d = 10 downTo 1     // 10, 9, ..., 1
val e = 1..10 step 2    // 1, 3, 5, 7, 9

for (i in 0..&lt;list.size) print(list[i])
for (i in 10 downTo 0 step 2) print(i)</code></pre>

<h2>Tipos de range</h2>
<ul>
  <li><code>IntRange</code>, <code>LongRange</code>, <code>CharRange</code> — implementam <code>ClosedRange</code> e <code>Iterable</code>.</li>
  <li><code>IntProgression</code>, <code>LongProgression</code>, <code>CharProgression</code> — gerados quando há <code>step</code> ou <code>downTo</code>.</li>
  <li>Para tipos arbitrários comparáveis (<code>BigDecimal</code>, <code>LocalDate</code>) use <code>rangeTo</code> retornando <code>ClosedRange&lt;T&gt;</code> — sem iteração nativa, mas suporta <code>in</code>.</li>
</ul>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">fun classificarIdade(idade: Int): String = when (idade) {
    in 0..12   -&gt; "criança"
    in 13..17  -&gt; "adolescente"
    in 18..64  -&gt; "adulto"
    in 65..120 -&gt; "idoso"
    else       -&gt; "valor inválido"
}

fun letrasMaiusculas() = ('A'..'Z').toList()

// Filtro com !in
val foraDoHorario = horarios.filter { it.hora !in 9..18 }

// Iteração reversa em uma lista
for (i in lista.indices.reversed()) {
    println("\${i}: \${lista[i]}")
}</code></pre>

<h2>Sequence x Range</h2>
<p>Para pipelines preguiçosos sobre ranges grandes, converta para sequence e evite alocar listas intermediárias:</p>
<pre><code class="language-kotlin">val somaPares = (1..1_000_000).asSequence()
    .filter { it % 2 == 0 }
    .map { it * it }
    .take(100)
    .sum()</code></pre>

<h2>Casos de uso</h2>
<ul>
  <li>Iterar índices ou faixas de tempo (<code>0..&lt;24</code> para horas).</li>
  <li>Validar entrada (<code>idade in 0..120</code>) em vez de dois <code>if</code>.</li>
  <li>Branches de <code>when</code> usando faixas numéricas ou alfabéticas.</li>
  <li>Geração de dados de teste (<code>(1..100).map { criarUsuario(it) }</code>).</li>
  <li>Animações/loops de jogo com <code>step</code> não-unitário.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Cuidado com .. e Long</div><div><code>0..Long.MAX_VALUE</code> compila mas iterar termina apenas no calor da morte do universo. Use <code>asSequence().take(n)</code> ou faça o cálculo direto.</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li><code>10..1</code> é um range vazio (sem erro) — para reverter use <code>10 downTo 1</code>.</li>
  <li><code>step</code> deve ser positivo, mesmo em <code>downTo</code> (a direção é determinada por <code>downTo</code>).</li>
  <li><code>(1..10).contains(5.0)</code> retorna <code>false</code> — Int e Double têm overloads distintos; cuidado com tipos mistos.</li>
  <li>Em loops hot, prefira <code>indices</code> em vez de <code>0..&lt;list.size</code>; o compilador otimiza mais.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">..&lt; é o novo padrão</div><div>Desde Kotlin 1.8, prefira <code>..&lt;</code> a <code>until</code> para meio-aberto. É mais simétrico com <code>..</code> e se lê melhor: <code>0..&lt;n</code>.</div></div>

<h2>Ranges customizados</h2>
<p>Para tipos próprios, sobrecarregue <code>rangeTo</code> ou implemente <code>ClosedRange</code> diretamente. Útil em datas, versões e qualquer tipo monotônico:</p>
<pre><code class="language-kotlin">import java.time.LocalDate

operator fun LocalDate.rangeTo(other: LocalDate) =
    object : ClosedRange&lt;LocalDate&gt;, Iterable&lt;LocalDate&gt; {
        override val start = this@rangeTo
        override val endInclusive = other
        override fun iterator() = generateSequence(start) {
            if (it &lt; endInclusive) it.plusDays(1) else null
        }.iterator()
    }

val hoje = LocalDate.now()
for (d in hoje..hoje.plusDays(7)) println(d)
println(hoje.plusDays(3) in hoje..hoje.plusDays(7))   // true</code></pre>
<p>Desde Kotlin 1.7.20 a interface <code>OpenEndRange</code> formaliza ranges meio-abertos para tipos arbitrários — implemente-a junto com <code>rangeUntil</code> para suportar <code>..&lt;</code>.</p>
`}} />
    </article>
  );
}

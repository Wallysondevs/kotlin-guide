export default function TiposBasicos() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Sintaxe e tipos · iniciante · 9 min</div>
      <h1>Tipos primitivos</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Em Kotlin, todos os tipos são objetos do ponto de vista do programador, mas o compilador mapeia <code>Int</code>, <code>Long</code>, <code>Double</code>, <code>Float</code>, <code>Boolean</code>, <code>Char</code> e <code>Short</code>/<code>Byte</code> para primitivos da JVM sempre que possível. Isso dá performance de Java sem o ruído de boxing manual.</p>

<h2>Conceito</h2>
<p>Os tipos numéricos vivem na hierarquia <code>Number</code> (exceto <code>Boolean</code> e <code>Char</code>). Não há conversão implícita: somar um <code>Int</code> com um <code>Long</code> exige <code>toLong()</code> explícito. Isso evita bugs sutis de overflow e perda de precisão.</p>
<pre><code class="language-kotlin">val idade: Int = 30
val populacao: Long = 8_000_000_000L
val pi: Double = 3.14159
val ativo: Boolean = true
val letra: Char = 'K'
val nome: String = "Kotlin"
</code></pre>

<p>Literais aceitam separador <code>_</code> para legibilidade e sufixos: <code>L</code> para <code>Long</code>, <code>f</code>/<code>F</code> para <code>Float</code>, <code>0x</code> para hex e <code>0b</code> para binário.</p>
<pre><code class="language-kotlin">val mask = 0xFF_00_FFL
val flags = 0b1010_0101
val taxa = 0.05f
</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">fun main() {
    val a: Int = 2_147_483_000
    val b: Int = 1_000_000
    // val c: Long = a + b   // erro: tipos diferentes não convertem implicitamente
    val c: Long = a.toLong() + b
    println(c) // 2148483000

    val ascii: Int = 'A'.code
    val ch: Char = 65.toChar()
    println("\\$ascii=\\$ascii ch=\\$ch")

    // Unsigned (estável desde 1.5)
    val porta: UInt = 65_535u
    val byteU: UByte = 200u
    println(porta + byteU) // promoção para UInt
}
</code></pre>

<h2>Conversões explícitas</h2>
<p>Cada tipo numérico expõe <code>toByte()</code>, <code>toShort()</code>, <code>toInt()</code>, <code>toLong()</code>, <code>toFloat()</code>, <code>toDouble()</code> e <code>toChar()</code>. Strings convertem com <code>"123".toInt()</code> (lança) ou <code>toIntOrNull()</code> (devolve null).</p>
<pre><code class="language-kotlin">val texto = "42"
val n = texto.toIntOrNull() ?: 0
val d = "3,14".replace(',', '.').toDouble()
</code></pre>

<h2>Quando usar cada um</h2>
<ul>
  <li><strong>Int</strong>: contadores, índices, IDs locais — escolha padrão.</li>
  <li><strong>Long</strong>: timestamps em ms, IDs de banco, valores &gt; 2^31.</li>
  <li><strong>Double</strong>: cálculos científicos, médias, qualquer coisa fracionária.</li>
  <li><strong>Float</strong>: gráficos, sensores, onde 32 bits bastam.</li>
  <li><strong>Char</strong>: caractere único; texto sempre vai em <code>String</code>.</li>
  <li><strong>UInt/ULong</strong>: máscaras de bits, IDs sem sinal de protocolos binários.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Não use <code>Float</code>/<code>Double</code> para dinheiro — use <code>BigDecimal</code> ou inteiros em centavos.</li>
  <li><code>==</code> em <code>Double</code> é traiçoeiro; compare com tolerância (<code>abs(a-b) &lt; eps</code>).</li>
  <li>Overflow em <code>Int</code> é silencioso; use <code>Math.addExact</code> ou <code>Long</code> quando há risco.</li>
  <li>Autoboxing acontece quando o tipo aparece como genérico: <code>List&lt;Int&gt;</code> guarda <code>Integer</code>.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Inferência</div><div>Prefira deixar o compilador inferir o tipo (<code>val n = 10</code>); anote apenas em APIs públicas e quando precisar forçar <code>Long</code>/<code>Float</code>.</div></div>

<div class="callout callout-warn"><div class="callout-title">Unsigned ainda é experimental para algumas APIs</div><div>Tipos como <code>UInt</code> são estáveis, mas várias bibliotecas Java esperam <code>Int</code>. Converta na fronteira.</div></div>
`}} />
    </article>
  );
}

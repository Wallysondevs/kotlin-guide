export default function Arrays() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Coleções · intermediario · 7 min</div>
      <h1>Arrays e IntArray</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Em Kotlin, <code>Array&lt;T&gt;</code> é uma classe que representa arrays da JVM, mas para tipos primitivos existem variantes especializadas (<code>IntArray</code>, <code>LongArray</code>, <code>DoubleArray</code>, etc.) que evitam boxing e são significativamente mais rápidas. Saber qual escolher importa principalmente em código numérico, interop com Java e APIs de baixo nível.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">// Array&lt;T&gt; — sempre boxed para primitivos
val nums: Array&lt;Int&gt; = arrayOf(1, 2, 3)        // Integer[] na JVM
val strs: Array&lt;String&gt; = arrayOf("a", "b")

// Especializadas — primitivas reais (int[], long[]...)
val ints: IntArray = intArrayOf(1, 2, 3)
val longs: LongArray = longArrayOf(10L, 20L)
val doubles: DoubleArray = DoubleArray(5) { it * 1.5 }
val chars: CharArray = charArrayOf('a', 'b')</code></pre>

<h2>Por que IntArray e não Array&lt;Int&gt;?</h2>
<ul>
  <li><strong>Memória</strong>: <code>Array&lt;Int&gt;</code> guarda referências para objetos <code>Integer</code>. <code>IntArray</code> guarda <code>int</code> contíguos — ~4x menos memória.</li>
  <li><strong>Performance</strong>: sem unboxing por acesso, melhor cache locality, vetorização do JIT.</li>
  <li><strong>Interop Java</strong>: <code>IntArray</code> ↔ <code>int[]</code>, <code>Array&lt;Int&gt;</code> ↔ <code>Integer[]</code>.</li>
</ul>

<h2>Construindo arrays</h2>
<pre><code class="language-kotlin">// Tamanho + lambda inicializador
val quadrados = IntArray(10) { i -&gt; i * i }
val pares = IntArray(5) { (it + 1) * 2 }   // 2, 4, 6, 8, 10

// A partir de coleções
val lista = listOf(1, 2, 3)
val arr1 = lista.toIntArray()        // IntArray
val arr2 = lista.toTypedArray()      // Array&lt;Int&gt; (boxed)

// O caminho inverso
val devolta: List&lt;Int&gt; = arr1.toList()</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">fun mediaMovel(valores: IntArray, janela: Int): DoubleArray {
    require(janela in 1..valores.size)
    val saida = DoubleArray(valores.size - janela + 1)
    var soma = 0L
    for (i in 0..&lt;janela) soma += valores[i]
    saida[0] = soma.toDouble() / janela
    for (i in janela..&lt;valores.size) {
        soma += valores[i] - valores[i - janela]
        saida[i - janela + 1] = soma.toDouble() / janela
    }
    return saida
}

fun main() {
    val serie = intArrayOf(2, 4, 6, 8, 10, 12)
    println(mediaMovel(serie, 3).toList())  // [4.0, 6.0, 8.0, 10.0]
}</code></pre>

<h2>Operações comuns</h2>
<pre><code class="language-kotlin">val a = intArrayOf(3, 1, 4, 1, 5, 9, 2, 6)
a.sort()                       // in-place
val ordenado = a.sortedArray() // cópia ordenada
val soma = a.sum()
val max = a.max()
val filtrado = a.filter { it &gt; 2 }    // retorna List&lt;Int&gt; (perde especialização)

// Para manter IntArray após map
val dobrados: IntArray = IntArray(a.size) { a[it] * 2 }</code></pre>

<h2>Casos de uso</h2>
<ul>
  <li>Processamento numérico intensivo (sinais, imagens, ML clássico).</li>
  <li>Buffers binários e parsing de protocolos.</li>
  <li>Interop com APIs Java/Android que retornam <code>int[]</code>, <code>byte[]</code>.</li>
  <li>Estruturas de dados especializadas (heap, fila circular) onde alocação importa.</li>
  <li>vararg de primitivos (assinaturas <code>fun foo(vararg n: Int)</code> recebem <code>IntArray</code>).</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Array é mutável</div><div>Diferente de <code>List</code>, todo array é mutável (<code>arr[i] = x</code>). Para semântica imutável, prefira <code>List&lt;T&gt;</code> ou <code>persistentListOf</code> da kotlinx.collections.immutable.</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li><code>arr1 == arr2</code> compara referência. Use <code>contentEquals</code> / <code>contentDeepEquals</code>.</li>
  <li><code>toString(arr)</code> imprime <code>[I@1a2b...</code>; use <code>joinToString()</code> ou <code>contentToString()</code>.</li>
  <li><code>filter</code>, <code>map</code> em <code>IntArray</code> retornam <code>List&lt;Int&gt;</code> boxed; reconverta com <code>toIntArray()</code> se precisar.</li>
  <li>Em vararg, passar uma <code>IntArray</code> requer spread: <code>foo(*arr)</code>.</li>
  <li>Não é possível ter <code>Array&lt;T&gt;</code> de tipo nothing/void; covariância é limitada (use <code>Array&lt;out T&gt;</code> com cuidado).</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Default: List, exceção: Array</div><div>Use <code>List</code>/<code>Map</code> em 95% do código de aplicação. Recorra a <code>IntArray</code> &amp; cia. quando profile mostrar boxing/alocação como gargalo, ou quando interop exigir.</div></div>
`}} />
    </article>
  );
}

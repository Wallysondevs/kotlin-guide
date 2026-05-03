export default function Tailrec() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Funcional avançado · intermediario · 6 min</div>
      <h1>tailrec recursion</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>O modificador <code>tailrec</code> instrui o compilador Kotlin a reescrever uma função recursiva como um loop, eliminando o consumo de stack a cada chamada e evitando <code>StackOverflowError</code> em entradas grandes. É a ponte entre estilo funcional e a realidade de uma JVM que não otimiza tail calls automaticamente.</p>

<h2>Conceito</h2>
<p>Uma função qualifica para <code>tailrec</code> quando a chamada recursiva é a <strong>última operação</strong> em todo caminho de execução. O compilador então gera bytecode com um <code>goto</code> para o início do método, reciclando o frame.</p>
<pre><code class="language-kotlin">tailrec fun fatorial(n: Long, acc: Long = 1L): Long =
    if (n &lt;= 1) acc
    else fatorial(n - 1, n * acc)

println(fatorial(100_000))   // não estoura</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">tailrec fun &lt;T&gt; encontrar(lista: List&lt;T&gt;, indice: Int = 0, pred: (T) -&gt; Boolean): Int {
    if (indice == lista.size) return -1
    if (pred(lista[indice])) return indice
    return encontrar(lista, indice + 1, pred)
}

// Newton-Raphson para raiz quadrada
tailrec fun raiz(x: Double, chute: Double = x / 2, eps: Double = 1e-9): Double {
    val novo = (chute + x / chute) / 2
    return if (kotlin.math.abs(novo - chute) &lt; eps) novo
    else raiz(x, novo, eps)
}</code></pre>

<h2>Quando usar</h2>
<ul>
  <li>Algoritmos naturalmente recursivos sobre listas/árvores degeneradas (parser, walker).</li>
  <li>Loops de convergência numérica (Newton, Heron, busca binária).</li>
  <li>Conversão pedagógica de soluções funcionais sem perder performance.</li>
  <li>Casos onde um <code>while</code> com mutação ficaria menos legível.</li>
</ul>

<h2>Requisitos e limites</h2>
<ul>
  <li>A chamada recursiva deve ser a <strong>última</strong> instrução. Operações como <code>n * fatorial(n-1)</code> <strong>não</strong> qualificam (a multiplicação é a última).</li>
  <li>Não pode estar dentro de blocos <code>try/catch/finally</code>.</li>
  <li>Funciona apenas com a própria função (sem mutual recursion).</li>
  <li>Não pode ser <code>open</code> (a substituição em subclasse quebraria a otimização).</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Sem warning, sem otimização</div><div>Se a recursão não estiver em posição de cauda, o compilador emite warning "A function is marked as tail-recursive but no tail calls are found" e a função se comporta como recursão normal — pronta para estourar a stack. Sempre teste com input grande.</div></div>

<h2>Padrão acumulador</h2>
<p>Para tornar uma função tail-recursive, geralmente adiciona-se um parâmetro acumulador:</p>
<pre><code class="language-kotlin">// Não tailrec (a soma é a última operação)
fun soma(xs: List&lt;Int&gt;): Int =
    if (xs.isEmpty()) 0 else xs.first() + soma(xs.drop(1))

// Tailrec
tailrec fun soma(xs: List&lt;Int&gt;, acc: Int = 0): Int =
    if (xs.isEmpty()) acc else soma(xs.drop(1), acc + xs.first())</code></pre>

<div class="callout callout-tip"><div class="callout-title">Quando preferir um loop comum</div><div>Para loops triviais sem semântica funcional, um <code>for</code> ou <code>fold</code> costuma ser mais legível. Use <code>tailrec</code> quando a estrutura recursiva expressa melhor o algoritmo.</div></div>
`}} />
    </article>
  );
}

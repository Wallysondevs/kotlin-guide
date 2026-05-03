export default function Mapas() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Coleções · iniciante · 9 min</div>
      <h1>Map e MutableMap</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p><code>Map</code> é a estrutura chave-valor mais usada em qualquer aplicação. Em Kotlin, há separação clara entre interfaces imutáveis (<code>Map</code>) e mutáveis (<code>MutableMap</code>), além de helpers ergonômicos como <code>to</code>, <code>getOrDefault</code> e <code>getOrPut</code>.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">val readOnly: Map&lt;String, Int&gt; = mapOf("a" to 1, "b" to 2)
val mutable: MutableMap&lt;String, Int&gt; = mutableMapOf("a" to 1)

mutable["b"] = 2          // operador set
mutable += "c" to 3       // adiciona
mutable -= "a"            // remove</code></pre>
<p>A função infix <code>to</code> cria um <code>Pair</code>. <code>mapOf</code> aceita pares variádicos.</p>

<h2>Implementações</h2>
<ul>
  <li><code>mapOf</code> / <code>mutableMapOf</code> — por padrão usam <strong>LinkedHashMap</strong> (preserva ordem de inserção).</li>
  <li><code>HashMap()</code> — sem ordem garantida, mais leve em alguns casos.</li>
  <li><code>LinkedHashMap()</code> — ordem de inserção explícita.</li>
  <li><code>sortedMapOf("b" to 2, "a" to 1)</code> — TreeMap, ordenado por chave.</li>
  <li><code>ConcurrentHashMap</code> — thread-safe (java.util.concurrent).</li>
</ul>

<h2>Acesso seguro: getOrDefault e getOrPut</h2>
<pre><code class="language-kotlin">val cores = mapOf("vermelho" to 1, "verde" to 2)

cores["azul"]                     // null (operador get)
cores.getOrDefault("azul", -1)    // -1
cores.getValue("vermelho")        // 1, lança se não existir

val contagem = mutableMapOf&lt;String, Int&gt;()
words.forEach { w -&gt;
    contagem[w] = (contagem[w] ?: 0) + 1
}

// Idiomático: getOrPut
val cache = mutableMapOf&lt;Long, Usuario&gt;()
val u = cache.getOrPut(id) { repo.findById(id) }</code></pre>

<h2>Iteração e destructuring</h2>
<pre><code class="language-kotlin">val precos = mapOf("pao" to 5.0, "leite" to 8.5)

for ((produto, preco) in precos) {
    println("\\$produto custa R\\$ \\$preco")
}

precos.forEach { (k, v) -&gt; println("\\$k=\\$v") }
precos.entries.sortedBy { it.value }
precos.filterValues { it &gt; 6.0 }
precos.mapValues { (_, v) -&gt; v * 1.1 }</code></pre>

<h2>Exemplo prático: agrupamento</h2>
<pre><code class="language-kotlin">data class Pedido(val cliente: String, val valor: Double)

val pedidos = listOf(
    Pedido("Ana", 100.0),
    Pedido("Bia", 50.0),
    Pedido("Ana", 30.0)
)

val totalPorCliente: Map&lt;String, Double&gt; =
    pedidos.groupBy { it.cliente }
           .mapValues { (_, lista) -&gt; lista.sumOf { it.valor } }

// Ainda mais conciso com groupingBy + fold
val total2 = pedidos.groupingBy { it.cliente }
    .fold(0.0) { acc, p -&gt; acc + p.valor }</code></pre>

<h2>Quando usar</h2>
<ul>
  <li><strong>LinkedHashMap (padrão)</strong>: na maioria dos casos — ordem previsível ajuda em logs/testes.</li>
  <li><strong>HashMap</strong>: quando ordem não importa e o ganho marginal compensa.</li>
  <li><strong>TreeMap/sortedMapOf</strong>: necessidade de iteração ordenada por chave.</li>
  <li><strong>ConcurrentHashMap</strong>: acesso de múltiplas threads sem coroutines.</li>
  <li>Em coroutines, prefira <code>Mutex</code> + <code>MutableMap</code> ou estruturas de <code>StateFlow</code>.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><code>Map&lt;K, V?&gt;</code> dificulta diferenciar "chave ausente" de "valor null" — use <code>containsKey</code>.</li>
  <li><code>mapOf()</code> sem argumentos retorna <code>EmptyMap</code> imutável; tentar mutar com cast lança exceção.</li>
  <li>Ordem dos parâmetros de <code>to</code> importa: <code>"a" to 1</code> ≠ <code>1 to "a"</code>.</li>
  <li>Mapas com chaves <code>Double</code>/<code>Float</code> sofrem com NaN e precisão; prefira <code>BigDecimal</code> ou ID.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Idiomático</div><div>Para contar ocorrências, use <code>collection.groupingBy { it }.eachCount()</code> — limpo, eficiente e sem variáveis intermediárias.</div></div>

<div class="callout callout-info"><div class="callout-title">Imutabilidade</div><div><code>Map</code> retornado por <code>mapOf</code> é uma <em>view</em> imutável: você não pode adicionar/remover, mas o objeto ainda pode ser uma <code>LinkedHashMap</code> por baixo. Se passar entre módulos, ofereça apenas <code>Map</code>.</div></div>
`}} />
    </article>
  );
}

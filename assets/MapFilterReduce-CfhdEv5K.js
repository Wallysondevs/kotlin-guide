import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function l(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Coleções · intermediario · 9 min"}),e.jsx("h1",{children:"map, filter, reduce"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
  <p><code>map</code>, <code>filter</code> e <code>reduce</code> são o trio fundamental para processar coleções de forma declarativa. Kotlin oferece variações otimizadas (<code>sumOf</code>, <code>fold</code>, <code>any</code>) que cobrem a maioria dos casos.</p>

  <h2>Conceito</h2>
  <ul>
  <li><code>map</code>: transforma cada elemento → nova lista do mesmo tamanho.</li>
  <li><code>filter</code>: mantém só os que passam no predicado.</li>
  <li><code>reduce</code>: combina elementos em um único valor (sem seed).</li>
  <li><code>fold</code>: como reduce, mas com valor inicial e tipo distinto.</li>
  </ul>
  <pre><code class="language-kotlin">val nums = listOf(1, 2, 3, 4, 5)
  val dobroDosPares = nums.filter { it % 2 == 0 }.map { it * 2 } // [4, 8]</code></pre>

  <h2>Exemplo prático</h2>
  <pre><code class="language-kotlin">data class Pedido(val cliente: String, val total: Double, val pago: Boolean)

  val pedidos = listOf(
      Pedido("Ana", 120.0, true),
      Pedido("Bia", 80.50, false),
      Pedido("Caio", 300.0, true),
      Pedido("Dani", 50.0, true),
  )

  fun main() {
      val totalPagos = pedidos.filter { it.pago }.sumOf { it.total } // 470.0
      val maior = pedidos.maxByOrNull { it.total }?.cliente // "Caio"
      val temGrande = pedidos.any { it.total &gt; 200 } // true
      val todosPagos = pedidos.all { it.pago } // false
      val nenhumGratis = pedidos.none { it.total == 0.0 } // true
      val media = pedidos.map { it.total }.average() // 137.625

      val resumoFold = pedidos.fold(0.0 to 0) { (soma, qtd), p -&gt;
          (soma + p.total) to (qtd + 1)
      }
      println("Totais: $resumoFold")
  }</code></pre>

  <h2>Quando usar</h2>
  <ul>
  <li><code>map</code>: converter DTOs para Domain.</li>
  <li><code>filter</code>: limpar inválidos antes de processar.</li>
  <li><code>sumOf</code>/<code>maxByOrNull</code>: agregações de uma única passada.</li>
  <li><code>any</code>/<code>all</code>/<code>none</code>: validações booleanas curtas.</li>
  <li><code>fold</code>: quando o acumulador tem tipo diferente do elemento.</li>
  </ul>

  <h2>Pegadinhas</h2>
  <ul>
  <li><code>reduce</code> em lista vazia <strong>lança</strong> exceção; use <code>reduceOrNull</code> ou <code>fold</code>.</li>
  <li>Cadeias longas alocam listas intermediárias — para coleções grandes, use <code>asSequence()</code>.</li>
  <li>Prefira <code>sumOf { it.total }</code> a <code>map { it.total }.sum()</code>: uma única passada.</li>
  <li><code>filter</code> retorna <code>List</code>; para sets use <code>filterTo(mutableSetOf())</code> ou <code>toSet()</code> depois.</li>
  </ul>

  <div class="callout callout-tip"><div class="callout-title">Dica</div><div>Use <code>groupBy</code> + <code>mapValues</code> para agregações por chave. Ex.: <code>pedidos.groupBy { it.cliente }.mapValues { (_, ps) -&gt; ps.sumOf { it.total } }</code>.</div></div>
  `}})]})}export{l as default};

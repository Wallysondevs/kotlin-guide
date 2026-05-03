export default function GroupBy() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Coleções · intermediario · 8 min</div>
      <h1>groupBy e associate</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>As funções <code>groupBy</code>, <code>groupingBy</code>, <code>associate</code>, <code>associateBy</code> e <code>associateWith</code> transformam coleções em mapas seguindo padrões diferentes. Saber qual usar economiza linhas e evita reinventar agrupamentos manuais.</p>

<h2>Conceito</h2>
<ul>
  <li><code>groupBy { chave }</code> → <code>Map&lt;K, List&lt;T&gt;&gt;</code> com todos os elementos por chave.</li>
  <li><code>associateBy { chave }</code> → <code>Map&lt;K, T&gt;</code> assumindo chaves únicas (último vence em colisão).</li>
  <li><code>associateWith { valor }</code> → <code>Map&lt;T, V&gt;</code> usando o elemento como chave.</li>
  <li><code>associate { it.k to it.v }</code> → forma genérica para construir um mapa.</li>
  <li><code>groupingBy { chave }</code> → não cria mapa imediatamente; serve de fonte para <code>eachCount</code>, <code>fold</code>, <code>reduce</code>, <code>aggregate</code>.</li>
</ul>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">data class Pedido(val cliente: String, val valor: Double, val status: String)

val pedidos = listOf(
    Pedido("Ada", 120.0, "PAGO"),
    Pedido("Linus", 50.0, "PENDENTE"),
    Pedido("Ada", 30.0, "PAGO"),
    Pedido("Grace", 80.0, "CANCELADO"),
    Pedido("Linus", 200.0, "PAGO"),
)

// 1) Pedidos por cliente
val porCliente: Map&lt;String, List&lt;Pedido&gt;&gt; = pedidos.groupBy { it.cliente }

// 2) Total por cliente, sem materializar grupos
val totalPorCliente: Map&lt;String, Double&gt; = pedidos
    .groupingBy { it.cliente }
    .fold(0.0) { acc, p -&gt; acc + p.valor }

// 3) Contagem por status
val contagem: Map&lt;String, Int&gt; = pedidos.groupingBy { it.status }.eachCount()

// 4) Index por chave única (assume ids únicos)
data class Produto(val sku: String, val nome: String)
val produtos = listOf(Produto("A1", "Café"), Produto("B2", "Chá"))
val porSku: Map&lt;String, Produto&gt; = produtos.associateBy { it.sku }

// 5) Mapeando elemento -&gt; tamanho do nome
val tamanhos: Map&lt;Produto, Int&gt; = produtos.associateWith { it.nome.length }</code></pre>

<h2>Conversões úteis</h2>
<pre><code class="language-kotlin">// Map -&gt; lista de pares
val pares: List&lt;Pair&lt;String, List&lt;Pedido&gt;&gt;&gt; = porCliente.toList()

// Inverter chave/valor
val invertido: Map&lt;Produto, String&gt; = porSku.entries.associate { (k, v) -&gt; v to k }

// Top N por agregação
val topClientes = totalPorCliente.entries
    .sortedByDescending { it.value }
    .take(3)</code></pre>

<h2>Quando usar cada um</h2>
<ul>
  <li><strong>groupBy</strong>: quando precisa manipular cada grupo posteriormente.</li>
  <li><strong>groupingBy + eachCount</strong>: histogramas e contagens (mais eficiente que <code>groupBy { it }.mapValues { it.value.size }</code>).</li>
  <li><strong>groupingBy + fold/reduce</strong>: somas, médias, máximos por chave sem criar listas intermediárias.</li>
  <li><strong>associateBy</strong>: lookup O(1) por id depois de carregar do banco.</li>
  <li><strong>associateWith</strong>: cache memoizado de cálculo por elemento.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">groupingBy é lazy</div><div>Diferente de <code>groupBy</code>, <code>groupingBy</code> não materializa os grupos — você passa direto para um terminal como <code>eachCount</code>. Em coleções grandes, isso evita listas intermediárias enormes.</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Colisão silenciosa</strong> em <code>associateBy</code>: se duas entradas têm a mesma chave, a última sobrescreve. Detecte com <code>groupBy</code> + <code>filter { it.value.size &gt; 1 }</code>.</li>
  <li><strong>Ordem</strong>: o resultado é um <code>LinkedHashMap</code> — mantém a ordem de inserção, mas não confunda com ordenação por chave.</li>
  <li><strong>Performance</strong>: para milhões de elementos, prefira <code>groupingBy</code>; <code>groupBy</code> aloca uma <code>ArrayList</code> por chave.</li>
  <li><strong>Chaves nullable</strong>: o mapa retornado é <code>Map&lt;K?, ...&gt;</code> se o seletor pode retornar null — trate com <code>filterKeys</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Para agregações complexas (soma, média, contagem juntos), use <code>groupingBy { ... }.aggregate { _, acc, e, first -&gt; ... }</code>. Em uma única passada você atualiza um acumulador rico (ex.: data class).</div></div>
`}} />
    </article>
  );
}

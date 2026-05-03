import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function a(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Banco de dados · intermediario · 10 min"}),e.jsx("h1",{children:"MongoDB driver Kotlin"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>O MongoDB lançou um driver oficial Kotlin com suporte nativo a coroutines e serialização via <code>kotlinx.serialization</code>. Ele substitui (ou complementa) o popular <code>KMongo</code>, oferecendo APIs idiomáticas, sem callbacks e sem <code>Document</code> manual.</p>

<h2>Conceito</h2>
<p>Você descreve seus documentos como classes Kotlin <code>@Serializable</code>, obtém uma <code>MongoCollection&lt;T&gt;</code> tipada e usa funções suspending para todas as operações. O driver traduz nomes de campos automaticamente.</p>

<h2>Dependências</h2>
<pre><code class="language-groovy">plugins {
    kotlin("jvm") version "2.0.20"
    kotlin("plugin.serialization") version "2.0.20"
}

dependencies {
    implementation("org.mongodb:mongodb-driver-kotlin-coroutine:5.1.4")
    implementation("org.mongodb:bson-kotlinx:5.1.4")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:1.7.3")
}</code></pre>

<h2>Conexão e modelo</h2>
<pre><code class="language-kotlin">import com.mongodb.kotlin.client.coroutine.MongoClient
import kotlinx.serialization.Serializable
import org.bson.types.ObjectId
import org.bson.codecs.pojo.annotations.BsonId

@Serializable
data class Pedido(
    @BsonId val id: String = ObjectId().toHexString(),
    val cliente: String,
    val itens: List&lt;Item&gt;,
    val total: Double,
    val criadoEm: Long = System.currentTimeMillis()
)

@Serializable
data class Item(val produto: String, val qtd: Int, val preco: Double)

val client = MongoClient.create(System.getenv("MONGODB_URI"))
val db = client.getDatabase("loja")
val pedidos = db.getCollection&lt;Pedido&gt;("pedidos")</code></pre>

<h2>CRUD com coroutines</h2>
<pre><code class="language-kotlin">import com.mongodb.client.model.Filters.*
import com.mongodb.client.model.Updates.*
import kotlinx.coroutines.flow.toList

suspend fun salvar(p: Pedido) {
    pedidos.insertOne(p)
}

suspend fun buscarPorCliente(cliente: String): List&lt;Pedido&gt; =
    pedidos.find(eq(Pedido::cliente.name, cliente)).toList()

suspend fun acimaDe(valor: Double): List&lt;Pedido&gt; =
    pedidos.find(gt(Pedido::total.name, valor)).toList()

suspend fun reajustar(id: String, novoTotal: Double) {
    pedidos.updateOne(
        eq("_id", id),
        set(Pedido::total.name, novoTotal)
    )
}

suspend fun apagar(id: String) {
    pedidos.deleteOne(eq("_id", id))
}</code></pre>

<h2>Aggregation pipeline</h2>
<pre><code class="language-kotlin">import com.mongodb.client.model.Aggregates.*
import com.mongodb.client.model.Accumulators.*
import org.bson.Document

@Serializable
data class TotalPorCliente(val _id: String, val total: Double, val pedidos: Int)

suspend fun ranking(): List&lt;TotalPorCliente&gt; =
    pedidos.aggregate&lt;TotalPorCliente&gt;(
        listOf(
            group("\\$cliente", sum("total", "\\$total"), sum("pedidos", 1)),
            sort(Document("total", -1)),
            limit(10)
        )
    ).toList()</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Aplicações event-driven onde o schema evolui rápido.</li>
<li>Documentos com estrutura aninhada profunda (carrinhos, eventos, logs).</li>
<li>Backends Ktor/Spring WebFlux que já são suspending — evita pontes bloqueantes.</li>
<li>Analytics em tempo real com <code>$group</code>, <code>$bucket</code> e <code>$facet</code>.</li>
<li>Caches semi-estruturados com TTL (<code>createIndex</code> + <code>expireAfter</code>).</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><code>find()</code> retorna um <code>Flow</code> (não <code>List</code>) — sempre <code>.toList()</code>, <code>.collect { }</code> ou <code>.firstOrNull()</code>.</li>
<li>Para <code>@BsonId</code>, decida entre <code>ObjectId</code>, <code>String</code> ou seu próprio gerador. Misturar gera caos.</li>
<li>Filtros com strings de campo (<code>"cliente"</code>) quebram em refactor; use <code>Pedido::cliente.name</code>.</li>
<li>O cliente <code>MongoClient</code> é pesado — crie uma única instância e injete.</li>
<li>Em testes, use Testcontainers (<code>MongoDBContainer</code>) em vez de mock.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">KMongo ainda?</div><div>KMongo foi descontinuado em 2024 em favor do driver oficial. Migrações são geralmente diretas — APIs são parecidas e o driver oficial é melhor mantido.</div></div>
`}})]})}export{a as default};

import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function d(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Orientação a objetos · iniciante · 10 min"}),e.jsx("h1",{children:"data class"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Em Kotlin, <code>data class</code> é a maneira idiomática de modelar dados imutáveis: o compilador gera <code>equals</code>, <code>hashCode</code>, <code>toString</code>, <code>copy</code> e funções <code>componentN</code> a partir das propriedades do construtor primário. Substitui dezenas de linhas de boilerplate Java (Lombok, records etc.) com uma única palavra-chave.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">data class Usuario(val id: Long, val nome: String, val email: String)

val u = Usuario(1, "Ada", "ada@x.com")
println(u)                       // Usuario(id=1, nome=Ada, email=ada@x.com)
val u2 = u.copy(email = "ada@y.com")
val (id, nome, _) = u            // destructuring
println(u == u2)                  // false — comparação por valor</code></pre>

<h2>Requisitos</h2>
<ul>
  <li>Construtor primário com pelo menos um parâmetro.</li>
  <li>Todos os parâmetros do construtor primário devem ser <code>val</code> ou <code>var</code>.</li>
  <li>Não pode ser <code>abstract</code>, <code>open</code>, <code>sealed</code> nem <code>inner</code>.</li>
  <li>Pode implementar interfaces e ter propriedades adicionais no corpo (essas <strong>não</strong> entram em equals/hashCode/toString).</li>
</ul>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">data class Endereco(val rua: String, val numero: Int, val cidade: String)

data class Cliente(
    val id: Long,
    val nome: String,
    val endereco: Endereco,
    val tags: Set&lt;String&gt; = emptySet(),
)

val c1 = Cliente(1, "Ada", Endereco("R. das Flores", 10, "Recife"))
val c2 = c1.copy(
    endereco = c1.endereco.copy(numero = 12),
    tags = c1.tags + "vip",
)

// Útil em testes:
fun usuarioFake(nome: String = "fake", email: String = "x@x") =
    Usuario(0, nome, email)</code></pre>

<h2>Destructuring</h2>
<p>O compilador gera <code>component1()</code>, <code>component2()</code>, etc., habilitando desestruturação posicional:</p>
<pre><code class="language-kotlin">for ((id, nome) in usuarios) {
    println("$id -&gt; $nome")
}

val (id, nome, email) = usuario</code></pre>
<p>Use <code>_</code> para ignorar componentes não usados. Atenção: a ordem segue a do construtor — renomear parâmetros é seguro, reordená-los quebra chamadores que usam destructuring.</p>

<h2>Quando usar</h2>
<ul>
  <li>DTOs de API, requests, responses, eventos.</li>
  <li>Value objects de domínio (Money, Cpf, Coordenada).</li>
  <li>Estado de UI imutável (combinado com <code>copy</code>).</li>
  <li>Chaves de cache/maps quando precisa de equals por valor.</li>
  <li>Resultado de funções que retornam múltiplos valores.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">copy é shallow</div><div><code>copy</code> não clona objetos aninhados. Se <code>Cliente</code> contém um <code>MutableList</code>, o copy continua compartilhando a mesma lista. Prefira coleções imutáveis (<code>List</code>, <code>Set</code>).</div></div>

<h2>Pegadinhas e limitações</h2>
<ul>
  <li><strong>Herança</strong>: data class não pode estender outra data class. Para hierarquias, use <code>sealed interface</code> com data classes filhas.</li>
  <li><strong>Mais de ~22 propriedades</strong>: ainda funciona, mas considere refatorar — provavelmente o objeto faz coisas demais.</li>
  <li><strong>Propriedades fora do construtor</strong> são ignoradas por equals/hashCode. Se isso surpreender, repense o desenho.</li>
  <li><strong>Mutabilidade</strong>: <code>var</code> em data class é legal, mas usar como chave de Map/Set quebra contratos quando o valor muda.</li>
  <li><strong>Java records</strong>: a partir do Kotlin 1.5+, <code>@JvmRecord data class</code> gera record nativo do Java 16+ (precisa de jvmTarget 16+).</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Boas práticas</div><div>Mantenha data classes pequenas e <strong>val</strong>-only. Lógica de domínio mora em funções de extensão ou em uma camada separada — assim você ganha imutabilidade, thread-safety e testes triviais.</div></div>
`}})]})}export{d as default};

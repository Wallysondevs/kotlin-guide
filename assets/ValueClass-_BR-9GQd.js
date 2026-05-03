import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function r(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Funcional avançado · intermediario · 8 min"}),e.jsx("h1",{children:"value class (inline class)"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Uma <code>value class</code> embrulha um valor primitivo (ou outro tipo único) sem custo de alocação na maioria dos casos: o compilador "inline" o valor no call site, mantendo a segurança de tipos. É a ferramenta certa quando você quer evitar erros como confundir <code>userId: Long</code> com <code>orderId: Long</code> sem pagar o preço de um wrapper alocado por instância.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">@JvmInline
value class UserId(val raw: Long)

@JvmInline
value class Email(val value: String) {
    init {
        require("@" in value) { "email inválido: \${value}" }
    }
}

fun buscar(id: UserId): Usuario? { /* ... */ }

buscar(UserId(42))            // OK
// buscar(42L)                // erro de compilação — type-safe</code></pre>

<p>Em runtime, <code>UserId</code> normalmente é apagado e a JVM enxerga apenas <code>long</code>. A anotação <code>@JvmInline</code> é obrigatória desde Kotlin 1.5 (substitui a antiga <code>inline class</code> experimental).</p>

<h2>Quando o boxing acontece</h2>
<p>O compilador é forçado a alocar um wrapper real quando:</p>
<ul>
  <li>O valor é usado como tipo nullable (<code>UserId?</code>).</li>
  <li>Aparece em coleções genéricas (<code>List&lt;UserId&gt;</code>).</li>
  <li>É passado para uma função que aceita <code>Any</code> ou um type parameter.</li>
  <li>Implementa uma interface e é usado por essa interface.</li>
</ul>
<p>Mesmo com boxing, ainda há o ganho de type-safety; só não há ganho de alocação.</p>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">@JvmInline
value class Cents(val amount: Long) {
    operator fun plus(other: Cents) = Cents(amount + other.amount)
    fun toReais(): String = "R$ %.2f".format(amount / 100.0)
}

@JvmInline
value class Cpf(val raw: String) {
    init {
        require(raw.length == 11 &amp;&amp; raw.all { it.isDigit() }) {
            "CPF inválido: \${raw}"
        }
    }
    fun mascarado(): String = "\${raw.take(3)}.***.***-\${raw.takeLast(2)}"
}

data class Pagamento(val pagador: Cpf, val valor: Cents)

fun cobrar(p: Pagamento) {
    println("\${p.pagador.mascarado()} pagou \${p.valor.toReais()}")
}</code></pre>

<h2>Restrições</h2>
<ul>
  <li>Exatamente uma propriedade no construtor primário, marcada como <code>val</code>.</li>
  <li>Não pode ter <code>init</code>... espera, pode (e é ótimo para validação) — o que não pode é <code>var</code> em propriedades adicionais.</li>
  <li>Não herda de classes nem é <code>open</code>/<code>abstract</code>; pode implementar interfaces.</li>
  <li>Sem <code>equals</code>/<code>hashCode</code> custom — gerados a partir do valor interno.</li>
  <li>Não pode ter <code>backing field</code> em propriedades extras (apenas computadas).</li>
</ul>

<h2>Casos de uso</h2>
<ul>
  <li>Identificadores tipados (<code>UserId</code>, <code>OrderId</code>, <code>Sku</code>).</li>
  <li>Unidades de medida (<code>Meters</code>, <code>Cents</code>, <code>Percent</code>) evitando bugs de conversão.</li>
  <li>Tokens, hashes, e-mails, CPFs com validação no <code>init</code>.</li>
  <li>Result/Either leves quando a alternativa seria criar uma classe normal por chamada.</li>
  <li>DSLs onde você precisa de overloads que diferem só por intent semântica.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">@JvmInline e interop</div><div>Em Java, métodos que recebem um value class aparecem com nome <em>mangled</em> (ex.: <code>cobrar-1A2B</code>) para evitar conflito de assinaturas. Para expor uma API limpa em Java, prefira sobrecarregar com o tipo bruto.</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li>Esquecer <code>@JvmInline</code> gera warning e desliga a otimização.</li>
  <li>Usar value class em hot path com generics anula o ganho de performance — meça antes.</li>
  <li>Serialização (<code>kotlinx.serialization</code>) precisa de configuração específica para serializar como o tipo bruto.</li>
  <li>Não reduza o uso a "padding" — uma value class só faz sentido quando agrega significado/validação.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Multi-field value classes</div><div>Desde Kotlin 2.0, há suporte experimental a value classes com múltiplos campos via <code>@JvmInline value class Point(val x: Int, val y: Int)</code> em compilers com Project Valhalla. Hoje, em produção, fique com um único campo.</div></div>
`}})]})}export{r as default};

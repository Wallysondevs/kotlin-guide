export default function TypeAlias() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Funcional avançado · intermediario · 5 min</div>
      <h1>typealias</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Um <code>typealias</code> dá um novo nome a um tipo existente. Não cria um tipo novo — apenas melhora a legibilidade, especialmente em assinaturas de lambdas longas e tipos genéricos profundos.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">typealias UserId = Long
typealias Headers = Map&lt;String, List&lt;String&gt;&gt;
typealias Validator&lt;T&gt; = (T) -&gt; Boolean
typealias OnClick = (View, Int) -&gt; Unit</code></pre>
<p>Como é só um sinônimo, <code>UserId</code> e <code>Long</code> são intercambiáveis para o compilador — sem conversão, sem custo de runtime.</p>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">typealias EmailValidator = (String) -&gt; Boolean

val basico: EmailValidator = { it.contains("@") &amp;&amp; it.length &gt;= 5 }

fun cadastrar(email: String, valida: EmailValidator) {
    require(valida(email)) { "email inválido: \\$email" }
    // ...
}

fun main() {
    cadastrar("ana@ex.com", basico)
}</code></pre>

<h2>Quando usar</h2>
<ul>
<li>Encapsular tipos de função recorrentes (callbacks, validadores, mappers).</li>
<li>Reduzir ruído em assinaturas com generics aninhados (<code>Map&lt;K, List&lt;V&gt;&gt;</code>).</li>
<li>Criar nomes de domínio sem o overhead de <code>value class</code>.</li>
<li>Renomear tipos legados durante migração gradual.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><strong>Não há type safety extra</strong>: <code>UserId</code> aceita qualquer <code>Long</code>. Para isso, use <code>@JvmInline value class UserId(val v: Long)</code>.</li>
<li>Aliases não podem ser declarados dentro de classes — só em top level ou em objetos.</li>
<li>Documentação de IDE pode mostrar o tipo real em vez do alias, confundindo leitores.</li>
<li>Não criam scopes; coleções gigantes de aliases poluem o namespace do módulo.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">typealias vs value class</div><div>Quer apenas legibilidade? <code>typealias</code>. Quer impedir misturar <code>UserId</code> com <code>OrderId</code> em tempo de compilação? <code>value class</code>.</div></div>
`}} />
    </article>
  );
}

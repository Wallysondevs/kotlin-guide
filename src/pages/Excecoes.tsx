export default function Excecoes() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Erros e Result · iniciante · 8 min</div>
      <h1>Exceções em Kotlin</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Kotlin trata exceções de forma mais leve que Java: <strong>não existem checked exceptions</strong>, então o compilador nunca obriga você a declarar <code>throws</code> nem capturar nada. Isso simplifica APIs (especialmente lambdas) mas exige disciplina para documentar e tratar erros nos pontos certos.</p>

<h2>Conceito</h2>
<p>Toda exceção em Kotlin herda de <code>Throwable</code>. A hierarquia útil é <code>Throwable</code> → <code>Exception</code> → <code>RuntimeException</code>. Exceções são lançadas com <code>throw</code>, que em Kotlin é uma <strong>expressão</strong> de tipo <code>Nothing</code> — útil em operadores Elvis e ifs.</p>
<pre><code class="language-kotlin">val nome: String = mapa["nome"] ?: throw IllegalStateException("nome ausente")

val idade = entrada.toIntOrNull() ?: throw IllegalArgumentException("idade inválida")</code></pre>

<h2>try/catch como expressão</h2>
<pre><code class="language-kotlin">val numero: Int = try {
    texto.toInt()
} catch (e: NumberFormatException) {
    -1
}</code></pre>
<p>O <code>finally</code> existe para liberar recursos, mas para <code>Closeable</code> prefira <code>use { }</code>, que fecha automaticamente.</p>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">class SaldoInsuficienteException(
    val disponivel: Double,
    val solicitado: Double
) : RuntimeException(
    "Saldo \${disponivel} insuficiente para sacar \${solicitado}"
)

class Conta(var saldo: Double) {
    fun sacar(valor: Double) {
        require(valor &gt; 0) { "valor deve ser positivo" }
        if (valor &gt; saldo) throw SaldoInsuficienteException(saldo, valor)
        saldo -= valor
    }
}

fun main() {
    val c = Conta(100.0)
    try {
        c.sacar(250.0)
    } catch (e: SaldoInsuficienteException) {
        println("Faltam \${e.solicitado - e.disponivel}")
    }
}</code></pre>

<h2>Hierarquia padrão útil</h2>
<ul>
<li><code>IllegalArgumentException</code> — argumento inválido (use <code>require</code>).</li>
<li><code>IllegalStateException</code> — estado inválido do objeto (use <code>check</code>).</li>
<li><code>NullPointerException</code> — gerada por <code>!!</code> ou interop com Java.</li>
<li><code>NoSuchElementException</code> — coleções vazias em <code>first()</code>, <code>last()</code>.</li>
<li><code>ClassCastException</code> — cast inseguro com <code>as</code>; prefira <code>as?</code>.</li>
</ul>

<h2>Casos de uso</h2>
<ul>
<li>Validação de pré-condições com <code>require</code>, <code>check</code>, <code>requireNotNull</code>.</li>
<li>Erros irrecuperáveis vindos de I/O, parse ou rede em camadas baixas.</li>
<li>Custom exceptions de domínio com dados estruturados (campos extras).</li>
<li>Interop com bibliotecas Java que ainda lançam checked exceptions.</li>
</ul>

<div class="callout callout-warn">
<div class="callout-title">Sem checked exceptions</div>
<div>Como o compilador não obriga, é fácil esquecer um <code>catch</code>. Documente no KDoc com <code>@throws</code> e, ao chamar Java, lembre que aquele <code>throws IOException</code> vira lançamento silencioso em Kotlin.</div>
</div>

<h2>Boas práticas</h2>
<ul>
<li>Não use exceção para fluxo normal — para isso existe <code>Result</code>, <code>sealed class</code> ou <code>?:</code>.</li>
<li>Crie tipos próprios em vez de lançar <code>Exception("msg")</code> genérico.</li>
<li>Capture o tipo mais específico possível; evite <code>catch (e: Exception)</code> de bibliotecas inteiras.</li>
<li>Em coroutines, <strong>nunca</strong> capture <code>CancellationException</code> sem relançar.</li>
<li>Prefira <code>runCatching { }</code> a try/catch quando for transformar em <code>Result</code>.</li>
</ul>

<div class="callout callout-tip">
<div class="callout-title">@Throws para Java</div>
<div>Se a função Kotlin lança e for chamada de Java, anote com <code>@Throws(IOException::class)</code> para que o bytecode declare a checked exception.</div>
</div>
`}} />
    </article>
  );
}

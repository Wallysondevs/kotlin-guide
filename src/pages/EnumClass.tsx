export default function EnumClass() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Orientação a objetos · iniciante · 8 min</div>
      <h1>enum class</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Enums representam um conjunto fechado de constantes nomeadas. Em Kotlin, vão além do Java: cada entry pode ter propriedades, métodos e até implementar membros abstratos diferentes.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">enum class Direcao { NORTE, SUL, LESTE, OESTE }

enum class Planeta(val massaKg: Double, val raioM: Double) {
    TERRA(5.972e24, 6.371e6),
    MARTE(6.39e23, 3.389e6);

    val gravidade: Double
        get() = 6.674e-11 * massaKg / (raioM * raioM)
}</code></pre>

<h2>Exemplo prático — abstract por entry</h2>
<pre><code class="language-kotlin">enum class Operacao {
    SOMA {
        override fun aplicar(a: Int, b: Int) = a + b
    },
    SUB {
        override fun aplicar(a: Int, b: Int) = a - b
    },
    MUL {
        override fun aplicar(a: Int, b: Int) = a * b
    };

    abstract fun aplicar(a: Int, b: Int): Int
}

fun main() {
    println(Operacao.SOMA.aplicar(2, 3))      // 5
    println(Operacao.entries.map { it.name }) // [SOMA, SUB, MUL]
    println(Operacao.valueOf("MUL").aplicar(4, 5)) // 20
}</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Estados finitos de máquinas simples (status de pedido, papel de usuário).</li>
<li>Comandos de menu/CLI com comportamento específico por entry.</li>
<li>Constantes de protocolo (HTTP method, log level).</li>
<li>Substituição segura para <code>String</code>s mágicas em APIs.</li>
<li>Tabelas de configuração imutáveis com dados associados.</li>
</ul>

<h2>Boas práticas</h2>
<ul>
<li>Prefira <code>Enum.entries</code> (Kotlin 1.9+) a <code>values()</code> — não aloca array novo a cada chamada.</li>
<li>Para variantes com dados diferentes, considere <code>sealed class</code>.</li>
<li>Trate <code>valueOf</code> com try/catch ou use <code>entries.firstOrNull { it.name == s }</code>.</li>
<li>Ao serializar com kotlinx.serialization, anote com <code>@Serializable</code> e use <code>@SerialName</code> para nomes externos estáveis.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">entries vs values()</div><div><code>entries</code> retorna um <code>EnumEntries&lt;T&gt;</code> (List imutável). <code>values()</code> retorna <code>Array&lt;T&gt;</code> e cria nova cópia a cada invocação — péssimo em loops quentes.</div></div>

<div class="callout callout-tip"><div class="callout-title">when exaustivo</div><div>Use <code>when</code> sobre o enum sem <code>else</code>: ao adicionar uma entry nova, o compilador apontará todos os locais a atualizar.</div></div>
`}} />
    </article>
  );
}

export default function StringsTemplates() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Sintaxe e tipos · iniciante · 8 min</div>
      <h1>Strings e templates</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Strings em Kotlin são imutáveis (<code>kotlin.String</code> mapeia para <code>java.lang.String</code> na JVM) e oferecem suporte nativo a <strong>templates</strong>, evitando a verbosidade de <code>StringBuilder</code> e <code>String.format</code>. Saber usar templates, raw strings e funções de manipulação é o básico para escrever código idiomático.</p>

<h2>Conceito</h2>
<p>Templates permitem interpolar variáveis e expressões diretamente:</p>
<pre><code class="language-kotlin">val nome = "Ada"
val idade = 36
println("Olá, \${nome}! Você tem \$idade anos.")
// Para um cifrão literal: use \\\$ ou raw string.
val preco = "R\\\$ 19,90"</code></pre>

<h2>Raw strings com triple quotes</h2>
<p>Com <code>"""</code> escrevem-se strings multi-linha sem escapes:</p>
<pre><code class="language-kotlin">val sql = """
    SELECT id, nome
      FROM usuarios
     WHERE ativo = true
""".trimIndent()

val regex = """\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}""".toRegex()</code></pre>
<p><code>trimIndent()</code> remove a margem comum a todas as linhas; <code>trimMargin("|")</code> usa um marcador explícito.</p>
<pre><code class="language-kotlin">val msg = """
    |Linha 1
    |Linha 2
""".trimMargin()</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">data class Usuario(val nome: String, val email: String)

fun renderizarSaudacao(u: Usuario, agora: java.time.LocalTime): String {
    val periodo = when {
        agora.hour &lt; 12 -&gt; "bom dia"
        agora.hour &lt; 18 -&gt; "boa tarde"
        else -&gt; "boa noite"
    }
    return "Olá \${u.nome}, \$periodo! Seu email cadastrado é \${u.email.lowercase()}."
}</code></pre>

<h2>Operações úteis</h2>
<ul>
  <li><code>split(",")</code> e <code>split(Regex("\\s+"))</code> para tokenizar.</li>
  <li><code>substringBefore</code>, <code>substringAfterLast</code> para extrair partes sem regex.</li>
  <li><code>padStart(4, '0')</code> formata números com zero à esquerda.</li>
  <li><code>buildString { append(...) }</code> para concatenar muitos pedaços.</li>
  <li><code>joinToString(", ", prefix = "[", postfix = "]")</code> em coleções.</li>
</ul>

<h2>Quando usar cada estilo</h2>
<ul>
  <li><strong>Template simples</strong>: 99% dos casos cotidianos.</li>
  <li><strong>Raw string</strong>: SQL, JSON inline, regex, mensagens longas.</li>
  <li><strong>buildString</strong>: loops gerando texto incremental.</li>
  <li><strong>String.format</strong>: quando precisa de width/precision numérica complexa.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Cuidado com toString implícito</div><div>Templates chamam <code>toString()</code>. Se o objeto não sobrescreveu, sai algo como <code>Cliente@1a2b3c</code>. Em <code>data class</code>, o toString é gerado; em classes comuns, defina manualmente.</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li>Em raw strings <strong>não há</strong> sequências de escape — não tente <code>\\n</code>; use uma quebra de linha real.</li>
  <li><code>trimIndent</code> usa o menor recuo comum; tabs e espaços misturados causam comportamento inesperado.</li>
  <li>Concatenação com <code>+</code> em laços cria muitos objetos; prefira <code>buildString</code> ou <code>joinToString</code>.</li>
  <li>Comparar com <code>==</code> compara conteúdo (ao contrário do Java); use <code>===</code> só para identidade de referência.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Para internacionalização, evite templates e use <code>MessageFormat</code> ou bibliotecas como ICU4J — interpolação dificulta extração de mensagens.</div></div>
`}} />
    </article>
  );
}

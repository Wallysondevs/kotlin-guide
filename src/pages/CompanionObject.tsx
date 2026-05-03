export default function CompanionObject() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Orientação a objetos · iniciante · 8 min</div>
      <h1>companion object</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Kotlin não tem a palavra-chave <code>static</code>. Para expressar membros que pertencem à classe (não à instância), usa-se um <code>companion object</code> — um singleton aninhado, criado uma única vez, acessível pelo nome da classe. Esse padrão substitui factories, constantes e utilitários estáticos do Java de forma mais expressiva.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">class Usuario private constructor(val email: String) {
    companion object {
        const val DOMINIO_PADRAO = "exemplo.com"

        fun criar(login: String): Usuario =
            Usuario("\$login@\$DOMINIO_PADRAO")
    }
}

val u = Usuario.criar("ana")
println(Usuario.DOMINIO_PADRAO)</code></pre>
<p>O construtor é privado e a única forma de instanciar é via <code>Usuario.criar(...)</code> — um <strong>factory method</strong> idiomático.</p>

<h2>Exemplo prático: factory + parsing</h2>
<pre><code class="language-kotlin">class Cpf private constructor(val digitos: String) {
    override fun toString() = digitos.chunked(3).joinToString(".") + "-XX"

    companion object {
        private val regex = Regex("\\\\d{11}")

        fun parse(input: String): Cpf? {
            val limpo = input.filter(Char::isDigit)
            return if (regex.matches(limpo)) Cpf(limpo) else null
        }

        fun parseOrThrow(input: String): Cpf =
            parse(input) ?: error("CPF inválido: \$input")
    }
}</code></pre>

<h2>Interop com Java: @JvmStatic e @JvmField</h2>
<pre><code class="language-kotlin">class Config {
    companion object {
        @JvmStatic fun load(): Config = Config()
        @JvmField val VERSAO = "1.0"
        const val NOME = "MeuApp"   // 'const' já vira static final
    }
}</code></pre>
<p>Sem <code>@JvmStatic</code>, Java enxerga <code>Config.Companion.load()</code>. Com a anotação, fica <code>Config.load()</code>, igual a um método estático tradicional.</p>

<h2>Companion nomeado</h2>
<pre><code class="language-kotlin">class Logger {
    companion object Factory {
        fun forClass(c: KClass&lt;*&gt;): Logger = Logger()
    }
}

val log = Logger.Factory.forClass(Logger::class)
val log2 = Logger.forClass(Logger::class) // também funciona</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Factory methods que validam entrada antes de instanciar.</li>
<li>Constantes associadas à classe (use <code>const val</code> sempre que possível).</li>
<li>Implementar interfaces no nível da classe (o companion pode implementar interfaces).</li>
<li>Substituir métodos estáticos do Java sem perder interop com <code>@JvmStatic</code>.</li>
<li>Singletons leves de configuração ou cache compartilhado.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>O companion é uma instância real — referenciá-lo cria a classe <code>Companion</code> no bytecode. Para utilitários puros sem estado, prefira funções top-level.</li>
<li><code>const val</code> só funciona com tipos primitivos e <code>String</code>. Para outros, use <code>@JvmField</code> ou getter normal.</li>
<li>Não use companion para "tudo que é estático" — funções top-level são mais leves e idiomáticas.</li>
<li>Em testes, mockar membros do companion exige bibliotecas como MockK (<code>mockkObject</code>).</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Regra prática</div><div>Se a função estática não precisa do nome da classe como namespace, transforme em função top-level. O companion brilha em factories, constantes e interop com Java.</div></div>
`}} />
    </article>
  );
}

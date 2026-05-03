export default function Repl() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Introdução · iniciante · 5 min</div>
      <h1>REPL Kotlin</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>O REPL (Read–Eval–Print Loop) do Kotlin é a forma mais rápida de testar uma ideia, validar uma API da stdlib ou prototipar um snippet sem criar projeto. Ele aceita declarações de classes, funções e top-level vals, mantendo o estado entre comandos.</p>

<h2>Conceito</h2>
<p>Após instalar o compilador (<code>brew install kotlin</code>, <code>sdk install kotlin</code> ou via IntelliJ), basta rodar:</p>
<pre><code class="language-bash">kotlinc -no-stdlib   # raro, sem stdlib
kotlinc              # com stdlib (uso comum)</code></pre>
<p>O prompt <code>&gt;&gt;&gt;</code> indica que o REPL está pronto. Cada linha digitada é compilada em memória e executada imediatamente. Resultados de expressões são impressos com prefixo <code>res0</code>, <code>res1</code>, etc.</p>

<pre><code class="language-kotlin">&gt;&gt;&gt; val x = 10
&gt;&gt;&gt; x * 2
res1: kotlin.Int = 20
&gt;&gt;&gt; fun saudar(nome: String) = "Olá, \${nome}!"
&gt;&gt;&gt; saudar("Ada")
res3: kotlin.String = Olá, Ada!</code></pre>

<h2>Comandos úteis</h2>
<ul>
  <li><code>:help</code> — lista todos os comandos disponíveis.</li>
  <li><code>:quit</code> ou Ctrl+D — encerra a sessão.</li>
  <li><code>:load arquivo.kts</code> — carrega e executa um script Kotlin.</li>
  <li><code>:paste</code> — entra em modo multilinha (útil para classes ou blocos longos); termina com Ctrl+D.</li>
  <li><code>:type expressao</code> — mostra o tipo inferido sem executar.</li>
  <li><code>:imports</code> — lista os imports atuais da sessão.</li>
</ul>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">&gt;&gt;&gt; :paste
// Cole várias linhas e finalize com Ctrl+D
data class Produto(val nome: String, val preco: Double)
val carrinho = listOf(Produto("Café", 12.0), Produto("Pão", 5.5))
carrinho.sumOf { it.preco }
^D
res0: kotlin.Double = 17.5

&gt;&gt;&gt; :type carrinho.map { it.nome }
kotlin.collections.List&lt;kotlin.String&gt;</code></pre>

<h2>Casos de uso</h2>
<ul>
  <li>Explorar funções da stdlib (<code>buildList</code>, <code>chunked</code>, <code>scan</code>) sem abrir IDE.</li>
  <li>Validar regex, formatação de datas, parsing rápido.</li>
  <li>Demonstrações ao vivo em workshops ou pair programming.</li>
  <li>Conferir tipos inferidos antes de extrair para uma função.</li>
  <li>Reproduzir bugs reportados em mensagens de erro de stack.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Scripts .kts</div><div>Para snippets maiores, prefira um arquivo <code>.kts</code> e execute com <code>kotlinc -script arquivo.kts</code> ou <code>kotlin arquivo.main.kts</code>. O REPL é melhor para iteração curta; scripts dão diff e versionamento.</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li>O REPL recompila a sessão inteira a cada linha — colar 500 linhas pode ficar lento; use <code>:paste</code> ou um script.</li>
  <li>Algumas APIs do JDK que requerem <code>--add-opens</code> não funcionam no REPL sem flags extras.</li>
  <li>Imports globais não persistem entre sessões; salve em um <code>.kts</code> e use <code>:load</code>.</li>
  <li>Definições redefinidas (mesmo nome) sobrescrevem silenciosamente — pode confundir ao depurar.</li>
  <li>O REPL do Kotlin 2.0 usa K2; algumas mensagens de erro mudaram em relação ao 1.9.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Alternativas</div><div>Dentro do IntelliJ IDEA, <em>Tools → Kotlin → Kotlin REPL</em> dá highlight e autocomplete. Para web, <a href="https://play.kotlinlang.org">play.kotlinlang.org</a> roda Kotlin/JVM, JS e Wasm direto no navegador.</div></div>

<h2>Workflow recomendado</h2>
<p>Um fluxo produtivo combina REPL para exploração inicial e scripts <code>.main.kts</code> para o que sobreviver à sessão:</p>
<pre><code class="language-bash"># 1. Explora no REPL
kotlinc

# 2. Quando o snippet ganhar valor, salva como script
cat &gt; util.main.kts &lt;&lt;'EOF'
#!/usr/bin/env kotlin
@file:DependsOn("io.github.config4k:config4k:0.6.0")

println("script com dependência externa")
EOF

# 3. Roda direto pelo nome (Kotlin 1.3.70+)
kotlin util.main.kts</code></pre>
<p>Scripts <code>.main.kts</code> aceitam <code>@file:DependsOn</code> para puxar artefatos Maven, <code>@file:Repository</code> para definir repositórios e <code>@file:Import</code> para incluir outros scripts — é um Bash com tipos.</p>

<div class="callout callout-warn"><div class="callout-title">Tempo de cold start</div><div>O REPL pode levar 2–5 segundos para iniciar a primeira vez (carrega kotlinc e a stdlib). Em pipelines de CI use scripts pré-compilados ou <code>kotlin -script</code> com cache.</div></div>
`}} />
    </article>
  );
}

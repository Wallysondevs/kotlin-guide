export default function KotlinCli() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Introdução · iniciante · 7 min</div>
      <h1>kotlinc e ferramentas CLI</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Antes de qualquer IDE, o Kotlin é compilado e executado por um conjunto de ferramentas de linha de comando distribuídas no pacote oficial. Conhecê-las ajuda a entender o que o Gradle faz por baixo, escrever scripts rápidos e diagnosticar problemas de classpath e versão.</p>

<h2>Conceito</h2>
<p>O <code>kotlinc</code> (atalho de <code>kotlinc-jvm</code>) compila <code>.kt</code> para <code>.class</code> ou JAR. Já o <code>kotlin</code> é o runner que executa um <code>.jar</code> ou um <code>.kts</code> diretamente. O <code>ki</code> é o REPL interativo moderno (sucessor de <code>kotlinc</code> sem argumentos).</p>
<pre><code class="language-bash">kotlinc --version
# info: kotlinc-jvm 2.0.21 (JRE 21)
kotlinc app.kt -include-runtime -d app.jar
java -jar app.jar</code></pre>

<h2>Exemplo prático</h2>
<p>Crie <code>hello.kt</code> e compile como JAR autocontido:</p>
<pre><code class="language-kotlin">fun main(args: Array&lt;String&gt;) {
    val nome = args.firstOrNull() ?: "mundo"
    println("Olá, \\$nome!")
}</code></pre>
<pre><code class="language-bash">kotlinc hello.kt -include-runtime -d hello.jar
java -jar hello.jar Ana
# Olá, Ana!</code></pre>
<p>Para um script <code>.kts</code> sem build:</p>
<pre><code class="language-bash">echo 'println("hoje: " + java.time.LocalDate.now())' &gt; hoje.kts
kotlinc -script hoje.kts</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Validar uma versão do compilador isolada do projeto.</li>
<li>Executar um experimento curto sem subir Gradle inteiro.</li>
<li>Criar utilitários de build em <code>.kts</code> reutilizáveis em CI.</li>
<li>Empacotar um JAR único para distribuir um CLI Kotlin.</li>
<li>Reproduzir bugs de compilador com o mínimo de variáveis.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Sem <code>-include-runtime</code> o JAR não roda sozinho — falta <code>kotlin-stdlib</code>.</li>
<li><code>kotlinc</code> usa o JDK apontado por <code>JAVA_HOME</code>; misturar versões gera erros estranhos.</li>
<li>O REPL antigo (<code>kotlinc</code> interativo) está marcado para remoção; prefira <code>ki</code>.</li>
<li>Scripts <code>.kts</code> têm overhead de startup; não use para produção quente.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Instalação rápida</div><div>Use <code>sdk install kotlin</code> (SDKMAN!) ou <code>brew install kotlin</code>. Em CI, baixe o zip oficial do GitHub release e cacheie a pasta <code>bin/</code>.</div></div>

<div class="callout callout-info"><div class="callout-title">ki, o novo REPL</div><div>O projeto <code>Kotlin/kotlin-interactive-shell</code> oferece autocomplete, comandos <code>:help</code>, <code>:load</code> e suporte a dependências via <code>@file:DependsOn</code>. Ideal para explorar APIs sem criar projeto.</div></div>
`}} />
    </article>
  );
}

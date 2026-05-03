export default function Funcoes() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Sintaxe e tipos · iniciante · 9 min</div>
      <h1>Funções</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>Funções em Kotlin são cidadãs de primeira classe: podem ser top-level, membros de classe, locais ou anônimas, e retornam sempre algum tipo (mesmo que seja <code>Unit</code>). Dominar a sintaxe básica de funções é o que destrava todo o resto da linguagem — de extension functions a coroutines.</p>

<h2>Conceito</h2>
<p>A forma canônica usa <code>fun</code>, parâmetros nomeados com tipo, e retorno após <code>:</code>. Quando o corpo é uma única expressão, o Kotlin permite a forma de <em>expression body</em> com <code>=</code>, e o tipo de retorno pode ser inferido.</p>
<pre><code class="language-kotlin">// Forma com bloco
fun soma(a: Int, b: Int): Int {
    return a + b
}

// Forma de expressão única
fun soma2(a: Int, b: Int) = a + b
</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">package com.exemplo

// Top-level: vive direto no pacote, sem classe envolvente
fun saudacao(nome: String, formal: Boolean = false): String =
    if (formal) "Bom dia, \${nome}." else "E aí, \${nome}!"

// Vararg + parâmetros nomeados
fun juntar(vararg partes: String, separador: String = " "): String =
    partes.joinToString(separador)

// Unit explícito (raro) e Nothing para funções que nunca retornam
fun log(msg: String): Unit = println("[LOG] \${msg}")

fun falhar(msg: String): Nothing = throw IllegalStateException(msg)

fun main() {
    println(saudacao("Ana"))                    // "E aí, Ana!"
    println(saudacao("Dr. Silva", formal = true))
    println(juntar("a", "b", "c", separador = "-"))
}
</code></pre>

<h2>Casos de uso</h2>
<ul>
<li>Funções top-level para utilitários puros (<code>Strings.kt</code>, <code>DateUtils.kt</code>).</li>
<li>Funções membro quando precisam de estado da classe.</li>
<li>Funções locais para encapsular lógica usada só dentro de outra função.</li>
<li>Expressão única para getters computados, conversões e DSLs.</li>
<li><code>Nothing</code> em funções que sempre lançam — o compilador entende isso para smart casts.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><strong>Inferência só em expression body:</strong> <code>fun x() = 1</code> infere <code>Int</code>; <code>fun x() { return 1 }</code> não — você precisa anotar.</li>
<li>APIs públicas devem declarar o tipo de retorno explicitamente, mesmo em expression body, para estabilidade binária.</li>
<li><code>Unit</code> não é o mesmo que <code>void</code>: é um objeto real, e pode ser passado como argumento genérico.</li>
<li><code>vararg</code> deve ser o último parâmetro (ou os seguintes precisam ser nomeados na chamada).</li>
<li>Default arguments evitam a explosão de overloads típica do Java.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Sempre use parâmetros nomeados em chamadas com mais de 2 booleanos ou strings consecutivos. <code>conectar(host = "x", porta = 8080, ssl = true)</code> documenta-se sozinho.</div></div>

<div class="callout callout-info"><div class="callout-title">Info</div><div><code>Nothing</code> é subtipo de tudo — por isso <code>val x: String = falhar("oops")</code> compila. O compilador sabe que a linha após nunca executa.</div></div>
`}} />
    </article>
  );
}

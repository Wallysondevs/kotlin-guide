import{j as a}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function l(){return a.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[a.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Multiplataforma e avançado · intermediario · 10 min"}),a.jsx("h1",{children:"Interop Java <-> Kotlin"}),a.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Kotlin foi projetado para conviver com Java no mesmo classpath. Você pode chamar bibliotecas Java sem ginástica e expor APIs Kotlin que parecem nativas para chamadores Java — desde que use as anotações certas.</p>

<h2>Chamando Java de Kotlin</h2>
<p>A maioria dos tipos Java vira Kotlin direto: <code>String</code>, <code>List</code>, <code>Map</code>. Mas o sistema de tipos Java não tem nullability — então você verá os chamados <strong>platform types</strong>, marcados como <code>String!</code> nos diagnósticos.</p>
<pre><code class="language-kotlin">val arquivo: java.io.File = java.io.File("pom.xml")
val linhas: List&lt;String&gt; = arquivo.readLines() // platform type, mas o uso é seguro
</code></pre>

<h2>SAM conversion</h2>
<pre><code class="language-kotlin">// Java: Runnable, Comparator, Function&lt;T, R&gt;...
val r: Runnable = Runnable { println("oi") }
val cmp = java.util.Comparator&lt;String&gt; { a, b -&gt; a.length - b.length }

val executor = java.util.concurrent.Executors.newSingleThreadExecutor()
executor.submit { println("lambda") } // SAM-converted
</code></pre>

<h2>Platform types: cuidado com null</h2>
<pre><code class="language-kotlin">val mapa: java.util.HashMap&lt;String, String&gt; = HashMap()
val v: String = mapa["chave"]   // compila, mas estoura NPE em runtime
val seguro: String? = mapa["chave"] // explicite o nullable
</code></pre>
<p>Se o Java usa <code>@Nullable</code>/<code>@NotNull</code>, o compilador Kotlin honra e elimina platform types.</p>

<h2>Chamando Kotlin de Java</h2>
<p>Por padrão, o bytecode gerado nem sempre é amigável. As anotações <code>@JvmStatic</code>, <code>@JvmName</code>, <code>@JvmOverloads</code> e <code>@JvmField</code> resolvem.</p>

<h3>@JvmStatic</h3>
<pre><code class="language-kotlin">class Mat {
    companion object {
        @JvmStatic fun dobro(x: Int) = x * 2
    }
}
// Java:
// Mat.dobro(3); // sem @JvmStatic seria Mat.Companion.dobro(3)
</code></pre>

<h3>@JvmOverloads</h3>
<pre><code class="language-kotlin">@JvmOverloads
fun saudar(nome: String, prefixo: String = "Sr.", emoji: String = "👋") =
    "\\$prefixo \\$nome \\$emoji"

// Java enxerga 3 overloads:
// saudar(String)
// saudar(String, String)
// saudar(String, String, String)
</code></pre>

<h3>@JvmName</h3>
<pre><code class="language-kotlin">@JvmName("filtrarStrings")
fun List&lt;String&gt;.filtrar(): List&lt;String&gt; = filter { it.isNotBlank() }

@JvmName("filtrarInts")
fun List&lt;Int&gt;.filtrar(): List&lt;Int&gt; = filter { it &gt; 0 }
</code></pre>
<p>Sem isso, Kotlin permite overloading por tipo genérico; Java não — daria conflito de assinatura por type erasure.</p>

<h3>@JvmField</h3>
<pre><code class="language-kotlin">class Config {
    @JvmField val versao = "2.0"
}
// Java: new Config().versao  (sem getter)
</code></pre>

<h3>@JvmRecord (JDK 16+)</h3>
<pre><code class="language-kotlin">@JvmRecord
data class Ponto(val x: Int, val y: Int)
// Compila como Java record real
</code></pre>

<h2>Exemplo prático: módulo Kotlin consumido por Java</h2>
<pre><code class="language-kotlin">@file:JvmName("StringUtils")
package com.exemplo.util

@JvmOverloads
fun normalizar(s: String, lower: Boolean = true): String =
    if (lower) s.trim().lowercase() else s.trim()
</code></pre>
<pre><code class="language-bash"># Java
String r = StringUtils.normalizar("  Olá  ");
String r2 = StringUtils.normalizar("Olá", false);
</code></pre>

<h2>Quando se preocupar com interop</h2>
<ul>
  <li>Você publica uma lib que será consumida por projetos Java.</li>
  <li>Trabalha em monorepo Java + Kotlin com módulos misturados.</li>
  <li>Migra módulo a módulo de Java para Kotlin sem quebrar callers.</li>
  <li>Expõe SDK para frameworks Java legados (anotações Spring, JAX-RS).</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li>Coleções imutáveis Kotlin (<code>List</code>) viram <code>java.util.List</code> — mas chamadores Java podem mutá-las (são views). Use <code>Collections.unmodifiableList</code> em APIs públicas se precisar segurança.</li>
  <li><code>Nothing</code> não tem equivalente Java; vira <code>Void</code>.</li>
  <li><code>internal</code> em Kotlin é <code>public</code> no bytecode com nome mangled — Java <em>consegue</em> chamar, mas não deveria.</li>
  <li>Inline functions e value classes têm assinaturas estranhas em Java; evite expor.</li>
  <li><code>data class</code> sem <code>@JvmRecord</code> não é record Java, só parece.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">@file:JvmName</div><div>Top-level functions em Kotlin viram métodos estáticos em uma classe nomeada como o arquivo + <code>Kt</code>. Use <code>@file:JvmName("MeuUtil")</code> para um nome bonito do lado Java.</div></div>

<div class="callout callout-warn"><div class="callout-title">Platform types são uma porta para NPE</div><div>Sempre que possível, anote o Java com <code>@Nullable</code>/<code>@NotNull</code> (JSpecify, JetBrains, AndroidX). O compilador Kotlin elimina platform types e proíbe usos perigosos.</div></div>
`}})]})}export{l as default};

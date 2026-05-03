import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function i(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Coleções · iniciante · 7 min"}),e.jsx("h1",{children:"Set e MutableSet"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p><code>Set</code> é a coleção que garante elementos únicos. Em Kotlin, como nas demais coleções, você escolhe entre a interface <strong>imutável</strong> (<code>Set</code>) e a <strong>mutável</strong> (<code>MutableSet</code>). Por baixo, o construtor mais usado é <code>LinkedHashSet</code>, que preserva a ordem de inserção.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">val a: Set&lt;String&gt; = setOf("x", "y", "x")          // ["x", "y"]
val b: MutableSet&lt;String&gt; = mutableSetOf("x")
b += "y"; b += "x"                                   // duplicado é ignorado

// Implementações específicas
val ordemInsercao = linkedSetOf(3, 1, 2)             // 3, 1, 2
val semOrdem      = hashSetOf(3, 1, 2)               // ordem indefinida
val ordenado      = sortedSetOf(3, 1, 2)             // 1, 2, 3 (TreeSet)
</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">data class Tag(val nome: String)

fun main() {
    val tagsArtigo = setOf(Tag("kotlin"), Tag("jvm"), Tag("backend"))
    val tagsUsuario = setOf(Tag("kotlin"), Tag("android"))

    val emComum   = tagsArtigo intersect tagsUsuario   // [kotlin]
    val unidas    = tagsArtigo union tagsUsuario       // [kotlin, jvm, backend, android]
    val somenteA  = tagsArtigo subtract tagsUsuario    // [jvm, backend]

    println("comum:   \${emComum}")
    println("união:   \${unidas}")
    println("só art.: \${somenteA}")

    // Conversão útil: lista com duplicatas → set
    val unicos = listOf(1, 2, 2, 3, 3, 3).toSet()
    println(unicos)                                     // [1, 2, 3]
}
</code></pre>

<h2>Quando usar</h2>
<ul>
<li>Lista de permissões, papéis, tags, IDs visitados — qualquer conjunto sem repetição.</li>
<li>Verificações rápidas de pertencimento (<code>in</code>) — <code>HashSet</code> é O(1) amortizado.</li>
<li>Operações algébricas: união, interseção, diferença.</li>
<li>Quando ordenação importa: <code>TreeSet</code> (via <code>sortedSetOf</code>).</li>
<li>Cache de "já processados" em loops e algoritmos de grafo.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li>Para <code>Set</code> funcionar com classes próprias, implemente <code>equals</code>/<code>hashCode</code> — ou use <code>data class</code>.</li>
<li>Mutar o estado de um elemento dentro de <code>HashSet</code> de forma a alterar seu <code>hashCode</code> quebra o set silenciosamente.</li>
<li><code>setOf()</code> retorna um <code>Set</code> imutável, mas <em>não congela</em> os elementos: se forem mutáveis, eles ainda podem mudar.</li>
<li><code>mutableSetOf()</code> devolve um <code>LinkedHashSet</code>, não um <code>HashSet</code> — a ordem é estável.</li>
<li>Para grandes volumes em hot path, <code>HashSet</code> é mais rápido que <code>LinkedHashSet</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div><code>list.toSet().toList()</code> é o idioma Kotlin para "remover duplicatas preservando ordem". Para preservar e mais rápido: <code>list.distinct()</code>.</div></div>
`}})]})}export{i as default};

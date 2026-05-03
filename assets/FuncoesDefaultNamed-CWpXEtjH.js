import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function t(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Sintaxe e tipos · iniciante · 7 min"}),e.jsx("h1",{children:"Default e named arguments"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Argumentos padrão e nomeados são duas das features mais subestimadas do Kotlin. Juntos, eles eliminam a maioria dos overloads e construtores telescópicos típicos de Java, deixando assinaturas legíveis e flexíveis sem boilerplate.</p>

<h2>Conceito</h2>
<p>Você pode atribuir um <strong>valor padrão</strong> a qualquer parâmetro. Quem chama pode omitir esse argumento ou identificar parâmetros pelo nome em qualquer ordem.</p>
<pre><code class="language-kotlin">fun greet(name: String, greeting: String = "Olá", excited: Boolean = false): String {
    val mark = if (excited) "!" else "."
    return "\\$greeting, \\$name\\$mark"
}

greet("Ana")                              // "Olá, Ana."
greet("Ana", excited = true)              // "Olá, Ana!"
greet(name = "Ana", greeting = "Hi")      // "Hi, Ana."</code></pre>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">data class HttpRequest(
    val url: String,
    val method: String = "GET",
    val timeoutMs: Long = 30_000,
    val retries: Int = 0,
    val headers: Map&lt;String, String&gt; = emptyMap()
)

val r1 = HttpRequest(url = "/users")
val r2 = HttpRequest(
    url = "/users",
    method = "POST",
    retries = 3,
    headers = mapOf("Content-Type" to "application/json")
)</code></pre>

<h2>vararg e spread</h2>
<p>Use <code>vararg</code> para aceitar um número variável de argumentos. Para repassar um array existente, use o operador spread <code>*</code>.</p>
<pre><code class="language-kotlin">fun log(level: String = "INFO", vararg parts: Any?) {
    println("[\\$level] " + parts.joinToString(" "))
}

log("INFO", "user", 42, "logged in")

val items = arrayOf("a", "b", "c")
log("DEBUG", *items, "extra")</code></pre>

<h2>Quando usar</h2>
<ul>
  <li><strong>Configurações</strong> com muitos campos opcionais (clientes HTTP, builders).</li>
  <li><strong>Construtores de data classes</strong> que crescem ao longo do tempo.</li>
  <li><strong>Factories</strong> de objetos de teste (com defaults razoáveis).</li>
  <li>Quando você sentiria a necessidade de criar 3+ overloads com mesma lógica.</li>
  <li>APIs públicas onde clareza no call site importa mais que brevidade.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Java não enxerga defaults</strong>: anote a função com <code>@JvmOverloads</code> para gerar os overloads ao chamar de Java.</li>
  <li>Defaults são avaliados <strong>a cada chamada</strong>; se for caro, considere extrair.</li>
  <li>Nomes de parâmetros viram parte da API pública — renomear quebra callers que usam named args.</li>
  <li>Em interfaces, defaults só podem aparecer na declaração, não em overrides.</li>
  <li>Evite default <code>null</code> + lógica condicional dentro — prefira sentinela explícita ou tipos selados.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica de estilo</div><div>Em chamadas com 3+ argumentos, use named arguments mesmo onde não é obrigatório. O diff e o code review ficam muito mais claros.</div></div>

<div class="callout callout-warn"><div class="callout-title">Cuidado com Java</div><div>Sem <code>@JvmOverloads</code>, código Java só consegue chamar a versão "completa" da função. Bibliotecas que precisam interop devem incluir essa anotação.</div></div>
`}})]})}export{t as default};

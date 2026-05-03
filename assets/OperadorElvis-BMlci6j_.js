import{j as o}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function t(){return o.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[o.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Null safety · iniciante · 6 min"}),o.jsx("h1",{children:"Operador Elvis ?:"}),o.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>O operador <code>?:</code> (chamado de "Elvis" pela semelhança com o topete) é a forma idiomática de fornecer um valor padrão quando uma expressão à esquerda é <code>null</code>. Combinado com <code>?.</code>, ele é a peça central do null safety em Kotlin.</p>

<h2>Conceito</h2>
<p>A expressão <code>a ?: b</code> retorna <code>a</code> se for não-nulo, caso contrário avalia e retorna <code>b</code>:</p>
<pre><code class="language-kotlin">val nome: String? = obterNome()
val exibicao = nome ?: "Anônimo"</code></pre>
<p>O lado direito só é avaliado se necessário (<em>short-circuit</em>), então pode ter custo alto sem prejudicar o caminho feliz.</p>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">data class Pedido(val descontoCupom: Int? = null, val descontoCliente: Int? = null)

fun calcularDesconto(p: Pedido): Int {
    return p.descontoCupom
        ?: p.descontoCliente
        ?: 0
}

fun buscarUsuario(id: Long): Usuario {
    return repo.findById(id)
        ?: throw NotFoundException("Usuário $id não encontrado")
}

fun primeiroNome(textoCompleto: String?): String {
    val nome = textoCompleto ?: return "sem nome"
    return nome.substringBefore(' ')
}</code></pre>

<h2>Padrões idiomáticos</h2>
<ul>
  <li><strong>Default value</strong>: <code>config.timeout ?: 30_000</code>.</li>
  <li><strong>Throw</strong>: <code>map["chave"] ?: error("ausente")</code> — <code>error</code> é <code>Nothing</code>, satisfaz qualquer tipo.</li>
  <li><strong>Return early</strong>: <code>val x = req.body ?: return badRequest()</code>.</li>
  <li><strong>Encadeamento</strong>: <code>a ?: b ?: c</code> avalia da esquerda para a direita.</li>
  <li><strong>Combinado com let</strong>: <code>obj?.let { processar(it) } ?: registrarVazio()</code>.</li>
</ul>

<h2>Comparação rápida</h2>
<pre><code class="language-kotlin">// Verboso
val x = if (valor != null) valor else padrao

// Idiomático
val x = valor ?: padrao</code></pre>

<div class="callout callout-info"><div class="callout-title">Por que "Elvis"?</div><div>Vire o operador 90° para a direita: <code>?:</code> vira um par de olhos com topete. A piada gruda e o nome ficou.</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Precedência</strong>: <code>a ?: b + c</code> equivale a <code>a ?: (b + c)</code>; use parênteses se a intenção for outra.</li>
  <li><strong>Lado direito caro</strong>: <code>cache ?: carregarDoBancoLento()</code> avalia só quando preciso, mas certifique-se de não ter side effects indesejados.</li>
  <li><strong>Nullable chains</strong>: <code>a?.b?.c ?: padrao</code> evita Elvis em cada nível.</li>
  <li><strong>Mapas</strong>: <code>map[k] ?: default</code> é melhor que <code>map.getOrDefault(k, default)</code> em Kotlin puro porque <code>?:</code> também trata <code>null</code> armazenado no mapa.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Combine com <code>requireNotNull</code> ou <code>checkNotNull</code> quando o nulo é um bug do chamador, não um caso de negócio. Mensagem clara facilita debug.</div></div>
`}})]})}export{t as default};

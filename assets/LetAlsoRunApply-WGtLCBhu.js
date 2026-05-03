import{j as o}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function d(){return o.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[o.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Null safety · intermediario · 11 min"}),o.jsx("h1",{children:"let, also, run, apply, with"}),o.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>As <em>scope functions</em> da stdlib executam um bloco no contexto de um objeto. Diferem em duas dimensões: como o objeto é passado para o bloco (<code>this</code> receiver vs <code>it</code> argumento) e o que o bloco retorna (o resultado do lambda vs o próprio objeto). Escolher a certa é uma das heurísticas mais idiomáticas de Kotlin.</p>

<h2>Conceito</h2>
<p>Resumo da matriz:</p>
<ul>
  <li><code>let</code> — argumento <code>it</code>, retorna o resultado do lambda.</li>
  <li><code>also</code> — argumento <code>it</code>, retorna o próprio objeto (efeito colateral).</li>
  <li><code>run</code> — receiver <code>this</code>, retorna o resultado do lambda.</li>
  <li><code>apply</code> — receiver <code>this</code>, retorna o próprio objeto (configuração).</li>
  <li><code>with</code> — receiver <code>this</code>, retorna o resultado; chama-se como função normal, não como extension.</li>
</ul>

<pre><code class="language-kotlin">// it / retorna lambda
val len: Int? = nome?.let { it.length }

// it / retorna objeto
val u = Usuario("ada").also { log.info("criado \${it.nome}") }

// this / retorna lambda
val saudacao = usuario.run { "Olá, \${nome} (\${idade})" }

// this / retorna objeto
val request = Request().apply {
    method = "POST"
    body = json
    headers["Content-Type"] = "application/json"
}

// this / retorna lambda, sem extension
val resumo = with(usuario) { "\${nome}, \${idade} anos" }</code></pre>

<h2>Idiomas comuns</h2>
<p><strong>let para null safety:</strong></p>
<pre><code class="language-kotlin">usuario?.email?.let { enviar(it) }   // só envia se ambos não-nulos</code></pre>

<p><strong>also para logging/side-effect mantendo a cadeia:</strong></p>
<pre><code class="language-kotlin">return repository.salvar(pedido)
    .also { metrics.increment("pedidos_salvos") }
    .also { log.info("salvo id=\${it.id}") }</code></pre>

<p><strong>apply para builders e setters:</strong></p>
<pre><code class="language-kotlin">val intent = Intent(ctx, MainActivity::class.java).apply {
    flags = Intent.FLAG_ACTIVITY_NEW_TASK
    putExtra("user_id", id)
}</code></pre>

<p><strong>run para escopo + retorno:</strong></p>
<pre><code class="language-kotlin">val resultado = conexao.run {
    open()
    val r = query("SELECT 1")
    close()
    r
}</code></pre>

<p><strong>with para agrupar acessos a um objeto temporário:</strong></p>
<pre><code class="language-kotlin">val s = with(StringBuilder()) {
    append("inicio ")
    append(corpo)
    append(" fim")
    toString()
}</code></pre>

<h2>Como escolher</h2>
<ul>
  <li>Precisa do objeto de volta? <code>also</code> ou <code>apply</code>.</li>
  <li>Precisa do resultado do bloco? <code>let</code>, <code>run</code> ou <code>with</code>.</li>
  <li>Quer chamar muitos métodos do objeto sem repetir o nome? Use <code>this</code> (<code>run</code>, <code>apply</code>, <code>with</code>).</li>
  <li>Trabalhando com nullable? <code>?.let</code> é o padrão.</li>
  <li>Loga ou mede tempo no meio de uma cadeia? <code>also</code>.</li>
</ul>

<div class="callout callout-info"><div class="callout-title">Receiver shadowing</div><div>Dentro de <code>apply</code>/<code>run</code>, <code>this</code> sombreia o <code>this</code> externo. Se precisar dos dois, qualifique com <code>this@OuterClass</code> ou prefira <code>also</code>/<code>let</code> (que dão nome explícito ao parâmetro).</div></div>

<h2>Pegadinhas</h2>
<ul>
  <li>Aninhar várias scope functions vira ilegível rápido — extraia para função nomeada.</li>
  <li><code>?.let { it }</code> sem transformação é redundante; use <code>?:</code> ou apenas a expressão.</li>
  <li><code>apply</code> em objeto imutável não faz sentido — ele só serve para mutação/configuração.</li>
  <li><code>also</code> e <code>apply</code> NÃO devem retornar valor diferente; o lambda é coercido para <code>Unit</code> e o resultado descartado.</li>
  <li>Desempenho: scope functions são <code>inline</code>, sem custo extra em runtime.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Convenção de nomes</div><div>Renomeie <code>it</code> sempre que o bloco tiver mais de 3 linhas: <code>?.let { user -&gt; ... }</code> deixa o código autoexplicativo e evita confusão em <code>let</code> aninhados.</div></div>
`}})]})}export{d as default};

export default function NotNullAssertion() {
  return (
    <article className="chapter max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-2 font-mono">Null safety · iniciante · 5 min</div>
      <h1>!! e quando evitar</h1>
      <div dangerouslySetInnerHTML={{__html: `
<p>O operador <code>!!</code> converte um <code>T?</code> em <code>T</code>, mas lança <code>NullPointerException</code> se o valor for nulo. É uma porta de fuga para o sistema de null safety — útil em poucos casos, antipadrão na maioria.</p>

<h2>Conceito</h2>
<pre><code class="language-kotlin">val nome: String? = obter()
val tamanho = nome!!.length // NPE se nome == null</code></pre>
<p>Use <code>!!</code> quando a ausência de valor é, comprovadamente, um <strong>bug de programação</strong> e não um caso esperado de runtime.</p>

<h2>Exemplo prático — alternativas mais expressivas</h2>
<pre><code class="language-kotlin">// Pior: estoura NPE genérico
val id = req.userId!!

// Melhor: mensagem clara, mesma semântica
val id = requireNotNull(req.userId) { "userId é obrigatório no payload" }

// Verificações de invariante interna
val cache = checkNotNull(state.cache) { "cache deve ter sido inicializado por warmUp()" }

// Fallback ou erro de domínio
val id2 = req.userId ?: throw BadRequest("userId ausente")
val id3 = req.userId ?: return Response.badRequest()</code></pre>

<h2>Quando usar (com parcimônia)</h2>
<ul>
<li>Em testes, ao acessar valores que sabidamente foram preparados no <code>setUp</code>.</li>
<li>Ao consumir APIs Java sem anotações de nulidade que você já validou.</li>
<li>Em DSLs internas onde a ausência indica violação contratual irreparável.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><code>x!!.y!!.z!!</code> apaga rastros: a stack trace mostra só a linha, não qual nível foi nulo. Quebre em variáveis.</li>
<li>Em código de produção, prefira <code>requireNotNull</code>/<code>checkNotNull</code> com mensagem.</li>
<li>NPEs vindos de <code>!!</code> não são <em>NullPointerException</em> da JVM tradicional — são lançados pelo Kotlin com a stack apontando para o operador.</li>
<li>Lint do Detekt tem a regra <code>UnsafeCallOnNullableType</code> — habilite e quebre o build.</li>
</ul>

<div class="callout callout-warn"><div class="callout-title">Smell de design</div><div>Encontrou três <code>!!</code> seguidos? Provavelmente o tipo deveria ser não-nulo desde a origem. Refatore o construtor/parser para impedir o nulo entrar.</div></div>

<div class="callout callout-tip"><div class="callout-title">Padrões idiomáticos</div><div>Prefira <code>?.let { }</code>, <code>?:</code>, <code>orEmpty()</code>, ou desestruturação com <code>requireNotNull</code> nomeando a variável.</div></div>
`}} />
    </article>
  );
}

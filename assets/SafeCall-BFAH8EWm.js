import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function n(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Null safety · iniciante · 6 min"}),e.jsx("h1",{children:"Safe call ?."}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
  <p>O operador <code>?.</code> é a peça central da null safety em Kotlin. Em vez de explodir com <code>NullPointerException</code>, ele <strong>curto-circuita</strong> retornando <code>null</code> quando o receiver é nulo.</p>

  <h2>Conceito</h2>
  <p>Dado <code>obj?.metodo()</code>, se <code>obj</code> for <code>null</code> a expressão inteira vale <code>null</code> e <code>metodo()</code> nem é chamado. O tipo do resultado é sempre nullable.</p>
  <pre><code class="language-kotlin">val nome: String? = usuario?.nome // String?
  val tamanho: Int? = nome?.length</code></pre>

  <h2>Exemplo prático</h2>
  <pre><code class="language-kotlin">data class Endereco(val cidade: String?, val cep: String)
  data class Usuario(val nome: String, val endereco: Endereco?)

  fun cidadeDoUsuario(u: Usuario?): String {
      // Encadeamento seguro
      return u?.endereco?.cidade?.uppercase() ?: "Desconhecida"
  }

  fun main() {
      val ana = Usuario("Ana", Endereco("Recife", "50000-000"))
      val sem = Usuario("Sem endereço", null)
      println(cidadeDoUsuario(ana)) // RECIFE
      println(cidadeDoUsuario(sem)) // Desconhecida
      println(cidadeDoUsuario(null)) // Desconhecida
  }</code></pre>

  <p>Combine com <code>let</code> para executar um bloco apenas se não-nulo:</p>
  <pre><code class="language-kotlin">usuario?.email?.let { email -&gt;
      enviarConfirmacao(email)
  }</code></pre>

  <p>Em coleções, <code>map</code> sobre nullable preserva a semântica:</p>
  <pre><code class="language-kotlin">val nomes: List&lt;String&gt;? = usuarios?.map { it.nome }</code></pre>

  <h2>Quando usar</h2>
  <ul>
  <li>Navegar grafos de objetos onde qualquer nó pode ser nulo (DTOs de API).</li>
  <li>Acessar configurações opcionais sem <code>if</code> aninhado.</li>
  <li>Combinar com Elvis (<code>?:</code>) para fornecer default.</li>
  <li>Disparar ações condicionais com <code>?.let</code> sem <code>if (x != null)</code>.</li>
  </ul>

  <h2>Pegadinhas</h2>
  <ul>
  <li><strong>Encadeamento longo</strong> esconde a lógica: <code>a?.b?.c?.d?.e</code> pode indicar modelo mal projetado.</li>
  <li>O resultado é nullable; ao usar como argumento, talvez precise de <code>?: default</code>.</li>
  <li>Não confunda com <code>!!</code>: este lança NPE se nulo — só use quando for impossível ser nulo.</li>
  <li>Em chamadas com efeito colateral, lembre que se o receiver é nulo o efeito <strong>não acontece</strong>.</li>
  </ul>

  <div class="callout callout-info"><div class="callout-title">Padrão idiomático</div><div>O combo <code>?.let { ... } ?: ...</code> substitui o velho <code>if (x != null) { ... } else { ... }</code> com mais elegância.</div></div>
  `}})]})}export{n as default};

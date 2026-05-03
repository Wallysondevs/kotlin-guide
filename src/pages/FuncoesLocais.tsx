export default function FuncoesLocais() {
    return (
      <article className="chapter max-w-3xl mx-auto px-6 py-10">
        <div className="text-xs text-muted-foreground mb-2 font-mono">Funcional avançado · intermediario · 6 min</div>
        <h1>Funções locais e closures</h1>
        <div dangerouslySetInnerHTML={{__html: `
  <p>Funções locais — <code>fun</code> dentro de outra <code>fun</code> — permitem extrair lógica reutilizável <strong>apenas</strong> dentro do escopo onde faz sentido. Aliadas a closures, evitam duplicação sem poluir o namespace público.</p>

  <h2>Conceito</h2>
  <p>Uma função local enxerga as variáveis do escopo enclosing (closure). Isso evita passar muitos parâmetros e mantém a função externa coesa.</p>
  <pre><code class="language-kotlin">fun processar(nomes: List&lt;String&gt;) {
      val prefixo = "[OK]"

      fun formatar(n: String) = "$prefixo \${n.uppercase()}"

      nomes.forEach { println(formatar(it)) }
  }</code></pre>

  <h2>Exemplo prático</h2>
  <pre><code class="language-kotlin">fun validarFormulario(dados: Map&lt;String, String&gt;): List&lt;String&gt; {
      val erros = mutableListOf&lt;String&gt;()

      fun exigir(campo: String, regra: (String) -&gt; Boolean, mensagem: String) {
          val valor = dados[campo].orEmpty()
          if (!regra(valor)) erros += "$campo: $mensagem"
      }

      exigir("email", { it.contains("@") }, "formato inválido")
      exigir("idade", { it.toIntOrNull()?.let { n -&gt; n &gt;= 18 } == true }, "deve ser maior de idade")
      exigir("senha", { it.length &gt;= 8 }, "mínimo 8 caracteres")

      return erros
  }

  fun main() {
      val r = validarFormulario(mapOf("email" to "joao", "idade" to "15", "senha" to "123"))
      r.forEach(::println)
  }</code></pre>

  <h2>Quando usar</h2>
  <ul>
  <li>Helper usado várias vezes <strong>só</strong> dentro de uma função.</li>
  <li>Reduzir duplicação sem expor função privada de classe.</li>
  <li>Capturar variáveis acumuladoras (listas de erro, contadores).</li>
  <li>Compor pequenas pipelines internas em scripts.</li>
  </ul>

  <h2>Boas práticas</h2>
  <ul>
  <li>Se a função local cresce muito, promova para função <code>private</code> de top-level ou da classe.</li>
  <li>Cuidado com captura de <code>var</code>: closures capturam por referência (via <code>Ref</code> wrapper), gera alocação extra.</li>
  <li>Prefira lambdas para uma única chamada; funções locais brilham quando há recursão ou múltiplas chamadas.</li>
  <li>Funções locais podem ser recursivas — útil para travessias de árvores curtas.</li>
  </ul>

  <div class="callout callout-tip"><div class="callout-title">Performance</div><div>Para hot paths, marque a externa como <code>inline</code> — assim a função local pode ser inlined também, evitando alocação de closure.</div></div>
  `}} />
      </article>
    );
  }
  
export default function SealedClass() {
    return (
      <article className="chapter max-w-3xl mx-auto px-6 py-10">
        <div className="text-xs text-muted-foreground mb-2 font-mono">Orientação a objetos · intermediario · 10 min</div>
        <h1>sealed class e interface</h1>
        <div dangerouslySetInnerHTML={{__html: `
  <p><code>sealed</code> permite modelar hierarquias <strong>fechadas</strong>: o compilador conhece todas as subclasses possíveis em tempo de compilação. Combinada com <code>when</code>, vira a base para tipos algébricos como <code>Result</code> e <code>UiState</code>.</p>

  <h2>Conceito</h2>
  <p>Subclasses de uma <code>sealed class</code>/<code>sealed interface</code> só podem ser declaradas no mesmo módulo (na prática, mesmo arquivo até Kotlin 1.4 ou mesmo pacote a partir de 1.5). Isso permite que <code>when</code> seja <strong>exaustivo</strong> sem ramo <code>else</code>.</p>
  <pre><code class="language-kotlin">sealed interface Resultado&lt;out T&gt; {
      data class Sucesso&lt;T&gt;(val valor: T) : Resultado&lt;T&gt;
      data class Falha(val erro: Throwable) : Resultado&lt;Nothing&gt;
      data object Carregando : Resultado&lt;Nothing&gt;
  }</code></pre>

  <h2>Exemplo prático</h2>
  <pre><code class="language-kotlin">sealed interface UiState {
      data object Loading : UiState
      data class Content(val items: List&lt;String&gt;) : UiState
      data class Error(val message: String) : UiState
  }

  fun render(state: UiState): String = when (state) {
      UiState.Loading -&gt; "..."
      is UiState.Content -&gt; state.items.joinToString()
      is UiState.Error -&gt; "Erro: \${state.message}"
  }

  fun main() {
      println(render(UiState.Loading))
      println(render(UiState.Content(listOf("a", "b", "c"))))
      println(render(UiState.Error("Sem rede")))
  }</code></pre>

  <p>Adicionar uma nova variante (ex.: <code>Empty</code>) faz o compilador reclamar em <strong>todos</strong> os <code>when</code> não exaustivos — refactor seguro.</p>

  <h2>Quando usar</h2>
  <ul>
  <li>Modelar estado de tela em MVVM (Loading/Content/Error/Empty).</li>
  <li>Resultados de operação assíncrona (Sucesso/Falha).</li>
  <li>Comandos/eventos em arquiteturas event-driven.</li>
  <li>Tokens de parser ou nós de AST.</li>
  <li>Substituir hierarquias <code>open</code> quando o conjunto é fixo.</li>
  </ul>

  <h2>Boas práticas</h2>
  <ul>
  <li>Prefira <strong><code>sealed interface</code></strong> (1.5+): permite múltipla herança e mistura com outras interfaces.</li>
  <li>Use <code>data object</code> para singletons sem estado (ex.: <code>Loading</code>).</li>
  <li>Marque o tipo genérico como <code>out</code> para covariância segura.</li>
  <li>Não adicione ramos <code>else</code> "por garantia" — você perde a checagem de exaustividade.</li>
  </ul>

  <div class="callout callout-info"><div class="callout-title">Sealed vs Enum</div><div><code>enum</code> é para constantes simples; <code>sealed</code> permite que cada variante carregue dados próprios. Use enum para níveis (<code>DEBUG/INFO/ERROR</code>) e sealed para variantes ricas.</div></div>
  `}} />
      </article>
    );
  }
  
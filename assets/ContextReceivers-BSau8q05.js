import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function a(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Anotações e DSLs · avancado · 8 min"}),e.jsx("h1",{children:"Context receivers (preview)"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`
  <p>Context receivers (<code>context(...)</code>) são uma feature <strong>experimental</strong> do Kotlin que permite declarar funções que dependem de múltiplos receivers implícitos. É a evolução natural das extension functions para casos com mais de um "this".</p>

  <h2>Conceito</h2>
  <p>Uma extension function tem <strong>um</strong> receiver. Com context receivers, você declara que uma função só pode ser chamada onde certos contextos estão disponíveis no escopo.</p>
  <pre><code class="language-kotlin">// build.gradle.kts:
  // kotlin { compilerOptions { freeCompilerArgs.add("-Xcontext-receivers") } }

  interface Logger { fun log(msg: String) }
  interface Transaction { fun commit() }

  context(Logger, Transaction)
  fun salvar(nome: String) {
      log("Salvando $nome")
      commit()
  }</code></pre>

  <h2>Exemplo prático</h2>
  <pre><code class="language-kotlin">interface JsonScope {
      fun encode(value: Any): String
  }

  interface DbScope {
      fun execute(sql: String)
  }

  context(JsonScope, DbScope)
  fun persistir(usuario: Map&lt;String, Any&gt;) {
      val json = encode(usuario)
      execute("INSERT INTO eventos(payload) VALUES('$json')")
  }

  fun main() {
      val json = object : JsonScope { override fun encode(v: Any) = v.toString() }
      val db = object : DbScope { override fun execute(s: String) = println("SQL: $s") }

      with(json) {
          with(db) {
              persistir(mapOf("nome" to "Ana"))
          }
      }
  }</code></pre>

  <h2>Comparação com extension</h2>
  <ul>
  <li><strong>Extension</strong>: <code>fun Logger.salvar()</code> — exige um único receiver.</li>
  <li><strong>Context receiver</strong>: depende de múltiplos contextos sem que nenhum seja "principal".</li>
  <li>Permite escrever DSLs onde os blocos compõem capacidades (ex.: transação + logger + métrica).</li>
  </ul>

  <h2>Casos de uso</h2>
  <ul>
  <li>DSLs estilo "effect system" pobre (cada interface = uma capacidade).</li>
  <li>Funções utilitárias que precisam de configuração + estado simultaneamente.</li>
  <li>APIs estilo Arrow para tratamento funcional de erros.</li>
  <li>Reduzir parâmetros repetidos em assinaturas longas.</li>
  </ul>

  <h2>Pegadinhas</h2>
  <ul>
  <li>É <strong>experimental</strong>: a sintaxe pode mudar (KEEP-259 substitui por <code>context(_)</code>).</li>
  <li>Precisa de flag de compilação <code>-Xcontext-receivers</code>.</li>
  <li>Não combina bem com Java — chamadas externas ficam estranhas.</li>
  <li>Excesso de context receivers vira "código mágico" difícil de seguir.</li>
  </ul>

  <div class="callout callout-warn"><div class="callout-title">Atenção</div><div>Como feature preview, evite em código de produção até a estabilização. Para uso atual, prefira interfaces e extensions, ou bibliotecas como <strong>Arrow</strong> que oferecem alternativas estáveis.</div></div>
  `}})]})}export{a as default};

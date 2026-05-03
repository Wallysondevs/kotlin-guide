import{j as o}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function s(){return o.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[o.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Sintaxe e tipos · iniciante · 6 min"}),o.jsx("h1",{children:"if/else como expressão"}),o.jsx("div",{dangerouslySetInnerHTML:{__html:`
  <p>Em Kotlin, <code>if/else</code> não é apenas uma instrução — é uma <strong>expressão</strong> que retorna valor. Isso elimina o ternário (<code>?:</code> de Java) e abre caminho para um estilo mais funcional.</p>

  <h2>Conceito</h2>
  <p>Como expressão, o <code>if</code> avalia para o último valor de cada bloco. Quando usado para atribuir, o <code>else</code> é <strong>obrigatório</strong> — caso contrário o resultado poderia ser indefinido.</p>
  <pre><code class="language-kotlin">val max = if (a &gt; b) a else b
  val saldo = if (deposito &gt; 0) saldo + deposito else saldo</code></pre>

  <h2>Exemplo prático</h2>
  <pre><code class="language-kotlin">fun classificar(nota: Double): String {
      val faixa = if (nota &gt;= 9.0) {
          "excelente"
      } else if (nota &gt;= 7.0) {
          "bom"
      } else if (nota &gt;= 5.0) {
          "regular"
      } else {
          "insuficiente"
      }
      return "Aluno \${nota} → $faixa"
  }

  fun main() {
      println(classificar(8.5)) // Aluno 8.5 → bom
  }</code></pre>

  <p>Blocos podem ter várias linhas; o <strong>último valor</strong> do bloco é o resultado:</p>
  <pre><code class="language-kotlin">val mensagem = if (usuario != null) {
      val nome = usuario.nome.uppercase()
      "Olá, $nome!"
  } else {
      "Visitante anônimo"
  }</code></pre>

  <h2>Quando usar</h2>
  <ul>
  <li>Substituir o ternário <code>cond ? a : b</code> de Java/JS.</li>
  <li>Atribuir valores condicionais a <code>val</code> imutáveis.</li>
  <li>Inicializar campos no construtor com lógica curta.</li>
  <li>Combinar com <code>when</code> para fluxos mais complexos.</li>
  </ul>

  <h2>Pegadinhas</h2>
  <ul>
  <li><strong>Sem else, sem expressão</strong>: <code>val x = if (c) 1</code> não compila.</li>
  <li>Não confunda com <code>if</code> statement (sem retorno) — em Kotlin é o mesmo construto, o que muda é o uso.</li>
  <li>Para mais de dois ramos, prefira <code>when</code>: fica mais legível e o compilador checa exaustividade em <code>sealed</code>/<code>enum</code>.</li>
  <li>Evite efeitos colaterais dentro de <code>if</code>-expressão; isso compromete a clareza.</li>
  </ul>

  <div class="callout callout-tip"><div class="callout-title">Estilo idiomático</div><div>Quando o bloco é curto, mantenha em uma linha: <code>val sinal = if (n &gt;= 0) "+" else "-"</code>. Para blocos longos, use <code>when</code>.</div></div>
  `}})]})}export{s as default};

import{j as e}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function c(){return e.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[e.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Null safety · iniciante · 9 min"}),e.jsx("h1",{children:"Null safety"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:`<p><em>Null safety</em> é o recurso mais celebrado de Kotlin: a distinção entre tipos que <strong>podem</strong> e <strong>não podem</strong> ser <code>null</code> é codificada no próprio sistema de tipos e verificada em tempo de compilação. O compilador recusa <code>NullPointerException</code> antes do código rodar.</p>

<h2>Conceito</h2>
<p>Por padrão, todo tipo é <em>não-nullable</em>: <code>String</code> nunca é null. Para permitir null, adicione <code>?</code>: <code>String?</code>. As operações precisam ser explícitas:</p>
<pre><code class="language-kotlin">val nome: String  = "Ana"
val apelido: String? = null

// nome.length        // OK
// apelido.length     // erro de compilação
val tam = apelido?.length          // Int? -> null
val tamSeguro = apelido?.length ?: 0
val forcado = apelido!!.length     // NPE em runtime se for null</code></pre>

<h2>Smart cast</h2>
<p>Após verificar <code>!= null</code>, o compilador faz <em>smart cast</em> automaticamente para o tipo não-nullable, sem precisar repetir o teste:</p>
<pre><code class="language-kotlin">fun imprimir(s: String?) {
    if (s != null) {
        println("tamanho \${s.length}")  // s é String aqui
    }
}

fun primeiraLetra(s: String?): Char? {
    s ?: return null
    return s[0]   // smart cast após early return
}</code></pre>

<div class="callout callout-warn"><div class="callout-title">Smart cast e mutabilidade</div><div>Smart cast só funciona em <code>val</code> ou variáveis locais imutáveis. Se a propriedade for <code>var</code> mutável (especialmente em classe), o compilador exige cópia local — o valor poderia mudar entre o check e o uso.</div></div>

<h2>Exemplo prático</h2>
<pre><code class="language-kotlin">data class Endereco(val rua: String, val cep: String?)
data class Cliente(val nome: String, val endereco: Endereco?)

fun cepFormatado(c: Cliente): String {
    val cep = c.endereco?.cep ?: return "sem cep"
    return cep.replace(Regex("[^0-9]"), "")
        .let { "\${it.substring(0,5)}-\${it.substring(5)}" }
}

fun main() {
    val a = Cliente("Ana", Endereco("R. X", "01310-100"))
    val b = Cliente("Bia", null)
    println(cepFormatado(a))  // 01310-100
    println(cepFormatado(b))  // sem cep
}</code></pre>

<h2>Operadores de null safety</h2>
<ul>
<li><code>?.</code> chamada segura: <code>s?.length</code> devolve null se <code>s</code> for null.</li>
<li><code>?:</code> Elvis: fornece fallback ou faz <code>throw</code>/<code>return</code> à direita.</li>
<li><code>!!</code> não-null assertion: lança NPE se for null. <strong>Use raramente.</strong></li>
<li><code>let</code>: <code>x?.let { ... }</code> executa apenas se não-null.</li>
<li><code>requireNotNull(x)</code> / <code>checkNotNull(x)</code>: lançam <code>IllegalArgumentException</code>/<code>IllegalStateException</code> com mensagem.</li>
</ul>

<h2>Casos de uso</h2>
<ul>
<li>Modelar campos opcionais de banco/JSON sem usar <code>Optional</code>.</li>
<li>APIs que retornam ausência de resultado (<code>findByIdOrNull</code>).</li>
<li>Encadear navegações seguras: <code>user?.address?.city?.zip</code>.</li>
<li>Migração gradual de Java: tipos vindos de Java são <em>platform types</em> (<code>String!</code>) — escolha o lado consciente.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
<li><strong>Platform types</strong>: APIs Java sem anotação chegam como <code>String!</code>. Trate como nullable quando há dúvida.</li>
<li><code>!!</code> é cheiro de código — quase sempre dá para usar <code>?:</code> ou <code>requireNotNull</code> com mensagem útil.</li>
<li><code>lateinit var</code> evita inicialização imediata, mas lança <code>UninitializedPropertyAccessException</code> se acessado antes — use <code>::prop.isInitialized</code>.</li>
<li>Lambdas que capturam <code>var</code> nullable não habilitam smart cast — copie para val local.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Boa prática</div><div>Anote APIs Java consumidas com <code>@Nullable</code>/<code>@NonNull</code> (JSR-305 / JetBrains / AndroidX) — o Kotlin respeita e gera tipos corretos.</div></div>`}})]})}export{c as default};

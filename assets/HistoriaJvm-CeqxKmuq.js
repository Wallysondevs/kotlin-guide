import{j as o}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function s(){return o.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[o.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Introdução · iniciante · 7 min"}),o.jsx("h1",{children:"Kotlin e a JVM"}),o.jsx("div",{dangerouslySetInnerHTML:{__html:`
<p>Kotlin nasceu na JetBrains em 2011 com um objetivo pragmático: ser uma linguagem moderna que rodasse no mesmo bytecode da JVM e interoperasse 100% com Java. Em 2017 virou linguagem oficial do Android e, desde então, conquistou backend (Spring Boot, Ktor), build scripts (Gradle Kotlin DSL) e até multiplataforma (Native, JS, Wasm).</p>

<h2>Conceito</h2>
<p>O compilador <code>kotlinc</code> traduz arquivos <code>.kt</code> para <code>.class</code> com o mesmo formato do bytecode Java. Isso significa que qualquer JVM &gt;= 1.8 executa Kotlin sem mágica em runtime, e cada classe Kotlin pode ser chamada de Java (e vice-versa).</p>
<pre><code class="language-bash">kotlinc Main.kt -include-runtime -d main.jar
java -jar main.jar</code></pre>
<p>O <code>kotlin-stdlib</code> é só um JAR adicional no classpath; não há "Kotlin Virtual Machine".</p>

<h2>Exemplo prático</h2>
<p>Um arquivo Kotlin compila para uma classe com método <code>main</code> equivalente ao Java:</p>
<pre><code class="language-kotlin">// Main.kt
fun main() {
    val saudacao = "Olá, JVM!"
    println(saudacao.uppercase())
}</code></pre>
<p>Inspecionado com <code>javap -c MainKt</code>, vê-se <code>invokestatic</code>, <code>invokevirtual</code> e o pool de constantes idênticos a um Java equivalente. A performance é praticamente a mesma — o JIT C2/Graal otimiza o bytecode sem distinguir a origem.</p>

<h2>Comparação com outras linguagens da JVM</h2>
<ul>
  <li><strong>Java</strong>: Kotlin é mais conciso, com null safety e funções de extensão; interop transparente.</li>
  <li><strong>Scala</strong>: ambas têm features funcionais, mas Kotlin foca em curva de aprendizado e tempo de compilação curtos; Scala vai mais fundo em type system (HKT, implicits).</li>
  <li><strong>Groovy</strong>: dinâmica por padrão; Kotlin é estática e mais rápida em runtime.</li>
  <li><strong>Clojure</strong>: Lisp funcional dinâmico; filosofia oposta à de Kotlin (estático, OO+FP).</li>
</ul>

<h2>GraalVM e nativo</h2>
<p>Kotlin/JVM roda em GraalVM normalmente. Para gerar binário nativo via <code>native-image</code>, valem as mesmas regras do Java: configurar reflection, recursos e proxies. Frameworks como Spring Boot 3 e Micronaut já têm hints prontos para Kotlin.</p>
<pre><code class="language-bash">./gradlew nativeCompile
./build/native/nativeCompile/app</code></pre>

<div class="callout callout-info"><div class="callout-title">Bytecode target</div><div>Use <code>kotlinOptions { jvmTarget = "17" }</code> para gerar bytecode compatível com Java 17. Misturar targets diferentes em módulos do mesmo projeto causa <code>UnsupportedClassVersionError</code>.</div></div>

<h2>Quando escolher Kotlin/JVM</h2>
<ul>
  <li>Backend que já usa Java/Spring e quer reduzir boilerplate sem reescrever tudo.</li>
  <li>Microsserviços com Ktor ou Spring Boot, aproveitando coroutines para I/O.</li>
  <li>Bibliotecas que precisam ser consumidas tanto por código Java quanto Kotlin.</li>
  <li>Scripts Gradle (<code>build.gradle.kts</code>) com autocomplete e refactor.</li>
  <li>Projetos Android, onde Kotlin é a linguagem oficial.</li>
</ul>

<h2>Pegadinhas</h2>
<ul>
  <li><strong>Reflection em GraalVM nativo</strong>: configure <code>reflect-config.json</code> ou use as anotações de hints; sem isso, <code>ClassNotFoundException</code> em runtime.</li>
  <li><strong>Versão do stdlib</strong>: cuidado com <code>kotlin-stdlib-jdk7/8</code> em projetos antigos — desde 1.8 tudo está em <code>kotlin-stdlib</code>.</li>
  <li><strong>Inline classes e Java</strong>: aparecem como tipo embrulhado (mangled name) quando vistas do Java.</li>
  <li><strong>Default arguments</strong>: para chamar de Java, use <code>@JvmOverloads</code>.</li>
</ul>

<div class="callout callout-tip"><div class="callout-title">Dica</div><div>Rode <code>kotlinc -Xshow-version</code> e confira que a versão do compilador bate com a do plugin Gradle. Mismatch silencioso é fonte clássica de bugs estranhos em coroutines.</div></div>
`}})]})}export{s as default};

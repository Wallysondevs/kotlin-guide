import{j as o}from"./index-bIcy9aVT.js";import"./router-C1uOM3Rc.js";import"./vendor-t4EjNNdb.js";import"./icons-lmONFHUi.js";function t(){return o.jsxs("article",{className:"chapter max-w-3xl mx-auto px-6 py-10",children:[o.jsx("div",{className:"text-xs text-muted-foreground mb-2 font-mono",children:"Multiplataforma e avançado · intermediario · 10 min"}),o.jsx("h1",{children:"kotlinx.serialization"}),o.jsx("div",{dangerouslySetInnerHTML:{__html:`
  <p><code>kotlinx.serialization</code> é a biblioteca oficial para (de)serializar objetos em JSON, ProtoBuf, CBOR e mais. É baseada em compilador (sem reflection runtime), funciona em Multiplataforma e brilha pela integração natural com <code>data class</code>.</p>

  <h2>Conceito</h2>
  <p>O plugin do compilador gera serializadores para classes anotadas com <code>@Serializable</code>. Você só precisa do <strong>format</strong> certo (<code>Json</code>, <code>ProtoBuf</code>, <code>Cbor</code>) para converter.</p>
  <pre><code class="language-groovy">plugins {
      kotlin("jvm") version "2.0.20"
      kotlin("plugin.serialization") version "2.0.20"
  }
  dependencies {
      implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.1")
      implementation("org.jetbrains.kotlinx:kotlinx-serialization-protobuf:1.7.1")
  }</code></pre>

  <h2>Exemplo prático</h2>
  <pre><code class="language-kotlin">import kotlinx.serialization.*
  import kotlinx.serialization.json.Json
  import kotlinx.serialization.protobuf.ProtoBuf

  @Serializable
  data class Usuario(val id: Int, val nome: String, val email: String? = null)

  fun main() {
      val u = Usuario(1, "Ana", "ana@x.com")

      val json = Json { prettyPrint = true; encodeDefaults = false }
      val s = json.encodeToString(u)
      println(s)

      val u2 = json.decodeFromString&lt;Usuario&gt;(s)
      require(u == u2)

      // Lista
      val lista = listOf(u, Usuario(2, "Bia"))
      println(json.encodeToString(lista))

      // ProtoBuf binário
      val bytes = ProtoBuf.encodeToByteArray(u)
      val u3 = ProtoBuf.decodeFromByteArray&lt;Usuario&gt;(bytes)
      require(u == u3)
  }</code></pre>

  <h2>Polimorfismo</h2>
  <pre><code class="language-kotlin">@Serializable
  sealed interface Evento {
      @Serializable @SerialName("login")
      data class Login(val usuario: String) : Evento

      @Serializable @SerialName("logout")
      data class Logout(val usuario: String) : Evento
  }

  val json = Json { classDiscriminator = "tipo" }
  println(json.encodeToString&lt;Evento&gt;(Evento.Login("ana")))
  // {"tipo":"login","usuario":"ana"}</code></pre>

  <h2>Quando usar</h2>
  <ul>
  <li>APIs REST/JSON com Ktor ou Spring (via converter).</li>
  <li>Persistência local em apps Multiplataforma.</li>
  <li>Comunicação binária eficiente (ProtoBuf, CBOR) entre serviços.</li>
  <li>Configuração sem reflection (importante para <strong>Kotlin/Native</strong> e GraalVM).</li>
  </ul>

  <h2>Pegadinhas</h2>
  <ul>
  <li>Para campos opcionais, use default + <code>encodeDefaults = false</code> para sair limpo.</li>
  <li><code>@Serializable</code> exige construtor primário com properties — não funciona com classes Java mutáveis.</li>
  <li>Mapas com chave não-string em JSON precisam de <code>allowStructuredMapKeys = true</code>.</li>
  <li>Datas: use <code>kotlinx-datetime</code> ou crie <code>KSerializer</code> custom — não há suporte built-in para <code>LocalDateTime</code>.</li>
  </ul>

  <div class="callout callout-info"><div class="callout-title">JSON tolerante</div><div>Para APIs externas instáveis, configure <code>Json { ignoreUnknownKeys = true; coerceInputValues = true; isLenient = true }</code> — evita quebrar quando o servidor muda o contrato.</div></div>
  `}})]})}export{t as default};
